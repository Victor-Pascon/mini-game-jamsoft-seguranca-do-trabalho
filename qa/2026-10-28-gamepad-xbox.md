# QA — Compatibilidade com controle Xbox Series

**Data:** 28/10/2026  
**Agente:** A5 (QA & Fair Tester) com integração A1/A2/A4  
**Objetivo:** validar o suporte a controle Xbox Series (Standard Gamepad), incluindo menu de pausa, A para interagir, Start para o menu e movimentação por analógico e D-pad no jogo e nos menus.

---

## O que mudou

- Novo módulo `js/engine/Gamepad.js` com mapeamento puro do **Standard Gamepad**:
  - `A` → confirmação/interação;
  - `B` → voltar/fechar;
  - `Start` → menu de pausa;
  - `X` → Manual de NRs;
  - `Y` → Inventário;
  - `D-pad` e analógico esquerdo → direções/movimento.
- `Input` passou a fazer polling do controle uma vez por frame, com zona morta, bordas de pressão e fallback silencioso quando a Gamepad API não está disponível.
- O analógico esquerdo fornece um vetor contínuo para a caminhada; o D-pad continua digital.
- Em menus, o analógico usa o **eixo dominante** para evitar diagonais acidentais.
- Novo `js/game/PauseMenu.js`, aberto por `Start` ou `Esc` na exploração:
  - Continuar;
  - Inventário;
  - Manual de NRs;
  - Como jogar;
  - Menu principal (salva antes de sair).
- Textos de ajuda, HUD, desafio, manual, inventário, diálogo e certificado agora exibem o botão `A` e instruções de controle.
- O tempo jogado não avança enquanto o menu de pausa está aberto.

---

## Testes automatizados

```text
npm test
```

Resultado: **verde**.

- `npm run check`: **34 arquivos JavaScript** verificados.
- `npm run smoke`: dados, fases, saves, inventário e novos testes de controle/pausa.
- Novas verificações:
  - controle neutro não confirma nem move;
  - A/B/X/Y/Start são mapeados;
  - D-pad funciona nas quatro direções;
  - analógico move o personagem e navega em menus;
  - zona morta ignora drift;
  - analógico escolhe o eixo dominante em menus;
  - menu de pausa tem cinco opções, navega com setas e confirma com A;
  - Start/B fecham o menu de pausa.

---

## Smoke no navegador (Chromium/Edge)

O controle foi simulado pela Gamepad API (`navigator.getGamepads`) e validado com `window.__JAMSOFT_GAME__` e screenshots.

1. Controle reconhecido como conectado pelo `Input`.
2. D-pad navegou no menu principal e alterou a seleção.
3. `A` iniciou **NOVO JOGO** e abriu a introdução.
4. Analógico esquerdo moveu o personagem para a direita (~180 px em 1,2 s).
5. D-pad esquerdo moveu o personagem de volta (~180 px em 1,2 s).
6. `Start` abriu o menu de pausa com **Continuar** selecionado; `Start`/B fecham. O menu também abre durante a introdução, sem perder o diálogo ao continuar.
7. D-pad navegou até **Inventário**; `A` abriu o inventário.
8. `B` fechou o inventário; `X` abriu o Manual de NRs; `B` fechou o manual.
9. `Start` → **Como jogar** abriu o painel de ajuda; `B` volta.
10. `Start` → **Menu principal** salvou a sessão (save v3.1), voltou ao menu e deixou **Continuar** selecionado.
11. Painéis de pausa, inventário e ajuda foram conferidos em 640×480 lógico, sem corte ou sobreposição.
12. Console sem erros ou warnings observados.

---

## Evidências de estado

- `gamepadConnected: true` com o controle simulado.
- `state: MENU` → `EXPLORE` usando `A`.
- `player.x` alterado por `axes: [1, 0]` e pelo botão `D-pad left`.
- `pauseOpen: true` após `Start`; `selected: "resume"` inicialmente.
- `selected: "inventory"` após D-pad; `inventoryOpen: true` após `A`.
- `manualOpen: true` após `X`; `false` após `B`.
- `helpOpen: true` após selecionar **Como jogar** no menu de pausa.
- `state: MENU`, `hasSave: true` e `menuSelection: 1` após escolher **Menu principal**.
- Canvas lógico mantido em 640×480.

---

## Riscos residuais

- **Controle físico:** a validação usou um controle simulado via Gamepad API. Testar o Xbox Series real por cabo/USB no notebook da feira e confirmar o mapeamento.
- **Navegadores:** repetir o smoke no Firefox/Safari do estande; a Gamepad API pode variar.
- **Tela cheia:** continua exigindo gesto real do usuário; validar no hardware final.
- **Sessão completa:** repetir uma partida de 10 fases usando apenas o controle no equipamento definitivo.
- **Revisão humana das NRs** continua obrigatória antes da feira.

---

## Arquivos principais

- `js/engine/Gamepad.js`
- `js/engine/Input.js`
- `js/game/PauseMenu.js`
- `js/game/Game.js`
- `js/game/Inventory.js`
- `js/game/NormManual.js`
- `js/game/Challenge.js`
- `js/game/Dialog.js`
- `js/game/Certificate.js`
- `js/data/dialogs.js`
- `scripts/smoke.mjs`
- `index.html`
- `README.md`
- `SPEC.md`
- `HARNESS_CHECKLIST.md`
