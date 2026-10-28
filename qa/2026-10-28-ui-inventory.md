# QA — Legibilidade, menu JAMSOFT e inventário

**Data:** 28/10/2026
**Agente:** A5 (QA & Fair Tester) com integração A1/A2/A4
**Objetivo:** validar a melhoria de legibilidade, a identidade visual do menu e o novo inventário com progresso, EPIs, decoração e material de estudo.

---

## O que mudou

- O canvas mantém **640×480 lógicos**, mas passou a usar **backing store 2x (1280×960)** para textos e sprites nítidos.
- O menu e a moldura usam a identidade **JAMSOFT**: vermelho, preto e branco.
- Fontes de interface foram padronizadas em **Consolas/Lucida Console**, com títulos display sem serifa.
- Scanlines sobre a área de leitura foram removidas; a vinheta permanece suave e fica atrás da HUD/painéis.
- `I` abre o **inventário** durante a exploração, com:
  - tempo jogado;
  - fase atual e fases concluídas;
  - EPIs adquiridos e lista completa;
  - prévia do personagem;
  - três decorações cosméticas;
  - atalho para o Manual de NRs.
- O save passou para **v3.1**, registrando decoração e tempo jogado.
- **Correção durante o QA:** uma tecla `I` pressionada durante a introdução ficava enfileirada e abria o inventário assim que a introdução terminava. A tecla agora é consumida e ignorada enquanto a introdução está ativa.

---

## Testes automatizados

```text
npm test
```

Resultado: **verde**.

- `npm run check`: **32 arquivos JavaScript** verificados.
- `npm run smoke`: dados, desafios, manual, fases, saves e novo bloco de inventário.
- Novas verificações:
  - existem 3 itens decorativos com IDs únicos;
  - o pin pode ser removido/equipado e sinaliza necessidade de save;
  - item bloqueado não equipa;
  - adesivo libera com o capacete;
  - faixa libera após 5 equipamentos/fases;
  - `M` e `I` fecham/abrem o inventário corretamente;
  - o save persiste tempo jogado e decoração removida.

---

## Smoke no navegador (Chromium/Edge)

Validado com `window.__JAMSOFT_GAME__`, eventos de teclado e screenshots:

1. Menu renderiza com título, sprite, três opções e identidade JAMSOFT.
2. Canvas inspecionado em **1280×960** de backing store, mantendo **640×480** lógicos.
3. “COMO JOGAR” mostra 6 passos, 8 controles (incluindo `I`) e dica, sem corte.
4. Introdução abre e o texto é exibido com nitidez; `I` durante a introdução é ignorado após a correção.
5. Exploração e HUD permanecem legíveis; pôster, NPC e jogador sem sobreposição.
6. `I` abre o inventário com tempo, fase, fases concluídas, EPIs e prévia.
7. `Enter` no pin remove a decoração; novo `Enter` equipa novamente.
8. Adesivo de Capacete aparece bloqueado antes do EPI e liberado após o capacete.
9. A opção “MATERIAL DE ESTUDO” abre o Manual de NRs; fechar o manual retorna à exploração.
10. Decoração equipada é gravada no save (`player.decoration`).
11. Reload + CONTINUAR restaura decoração e tempo jogado.
12. Desafio NR-6 concluído; capacete aparece no sprite/HUD e a porta libera.
13. Travessia da porta carrega a Fase 2 (NR-12); inventário continua consistente.
14. Certificado renderizado com os 10 ícones, NRs, data e selo sem corte de texto; confirmação retornou ao menu e apagou o save.
15. Performance medida em **60,4 fps** por 1,5 s na exploração com backing store 1280×960.
16. Console sem erros ou warnings observados.

---

## Evidências de estado

- `state: MENU` → `EXPLORE` → `DIALOG` → `CHALLENGE` → `EXPLORE`.
- `inventory: true` após `I`; `false` após `I`/`Esc`.
- `player.decoration` alternando entre `pin_jamsoft`, `adesivo_capacete` e `null`.
- Save de QA contendo `version: "3.1"`, `playTime` e `player.decoration`.
- `phaseIndex` avançando de `0` para `1` após atravessar a porta liberada.
- Canvas de jogo `1280×960`; coordenadas e layouts em `640×480`.

---

## Riscos residuais

- **Tela cheia (`F`)** continua exigindo gesto real do usuário; validar no notebook da feira.
- **Firefox/Safari** não foram revalidados nesta rodada.
- **Jogabilidade manual contínua das 10 fases** deve ser repetida no hardware final; a lógica de progressão permanece coberta pelo smoke e pela automação anterior.
- **Revisão humana das NRs** continua obrigatória antes da feira.
- A taxa de 60 fps foi medida em desktop de desenvolvimento; confirmar no equipamento definitivo.

---

## Arquivos principais

- `js/engine/Renderer.js`
- `js/design-tokens/snes-theme.js`
- `js/game/Game.js`
- `js/game/Inventory.js`
- `js/data/decorations.js`
- `js/game/Player.js`
- `js/game/CharacterRenderer.js`
- `js/engine/SaveSystem.js`
- `js/engine/Input.js`
- `style.css`
- `index.html`
- `scripts/smoke.mjs`
- `README.md`
- `SPEC.md`
- `HARNESS_CHECKLIST.md`
