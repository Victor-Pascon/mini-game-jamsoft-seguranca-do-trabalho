# QA — Fases lineares por NR

**Data:** 28/10/2026  
**Agente:** A5 (QA & Fair Tester) com integração A1/A2  
**Objetivo:** validar a mudança de exploração aberta para **10 fases lineares**, cada uma com uma sala temática, porta de saída e NR própria.

---

## O que mudou

- O mapa aberto de 12 salas foi substituído por **10 fases**, uma por NR, na ordem do HUD:
  1. NR-6 — Almoxarifado de EPI
  2. NR-12 — Produção / Máquinas
  3. NR-15 — Área de Ruído
  4. NR-23 — Brigada de Incêndio
  5. NR-10 — Oficina Elétrica
  6. NR-26 — Sinalização de Segurança
  7. NR-35 — Trabalho em Altura
  8. NR-11 — Logística
  9. NR-1 — Sala do PGR
  10. NR-17 — Escritório Ergonômico
- Cada fase ocupa os **20×15 tiles / 640×480** e tem:
  - piso e paleta próprios;
  - pôster central gerado a partir das regras resumidas em `norms.js`;
  - props específicos do risco (EPI, máquinas, ruído, incêndio, elétrica, sinalização, altura, logística, PGR e ergonomia);
  - especialista, jogador e HUD da fase;
  - porta de saída bloqueada na parede direita.
- Ao acertar o desafio, o EPI é entregue e a porta fica verde. Ao atravessá-la, a próxima fase é carregada.
- A porta da 10ª fase leva ao certificado.
- O save v3 registra a fase atual; saves antigos são migrados pela primeira NR pendente.

---

## Testes automatizados

```text
npm test
```

Resultado: **verde**.

- `npm run check`: 30 arquivos JavaScript verificados.
- `npm run smoke`: dados, desafios, manual, saves de lógica, 10 fases e layout.
- Novas verificações de fase:
  - exatamente 10 fases e IDs únicos;
  - cada fase tem NR, EPI, desafio e especialista válidos;
  - mapa 20×15 com sala única, piso livre no início e na posição do NPC;
  - porta de saída presente como `TILE_TYPES.DOOR`;
  - pôster de regras presente;
  - props dentro do canvas;
  - props não invadem pôster, moldura da porta, especialista ou início do jogador.

---

## Smoke no navegador (Chromium/Edge)

Validado com `window.__JAMSOFT_GAME__` e screenshots:

1. Menu com as três opções.
2. `NOVO JOGO` → introdução → Fase 1 (NR-6, Almoxarifado de EPI).
3. Diálogo com Helena, retrato animado e nome/cargo.
4. Desafio NR-6 com quatro alternativas.
5. Acerto → capacete no sprite/HUD, porta verde e prompt “PORTA LIBERADA → PRÓXIMA NR”.
6. Travessia da porta → Fase 2 (NR-12, Produção / Máquinas) carregada com novo piso, props, NPC e pôster.
7. Save/load: save com `phase: 1`, equipamento `capacete` e recarga restaurando a Fase 2.
8. Última fase: equipamento completo + porta liberada → certificado.
9. Montagem visual das 10 salas conferida: pisos, pôsteres, props e portas coerentes.
10. **Playthrough automatizado das 10 fases**: diálogo → desafio → acerto → porta → próxima fase, com os 10 EPIs na ordem do HUD e certificado ao final.
11. Porta bloqueada testada: jogador é contido antes da porta até o desafio ser concluído.
12. Performance medida em **~75,5 fps** por 1,2 s na Fase 2 (Chromium/Edge, canvas 640×480).
13. Console sem erros ou warnings observados durante o fluxo.

---

## Correções feitas durante o QA

- Rótulos de sala e status de NPC não se sobrepõem quando o jogador está próximo.
- Porta e pôster têm zonas reservadas; props foram reposicionados para não cobrir a porta, o especialista ou o ponto inicial.
- O save agora preserva a fase, permitindo continuar na sala correta.
- O certificado deixou de abrir automaticamente no 10º acerto: ele é alcançado atravessando a última porta, como pedido.

---

## Riscos residuais

- **Jogabilidade completa manual das 10 fases** ainda precisa ser feita em uma sessão contínua de feira.
- **Tela cheia (`F`)** precisa de gesto real do usuário em cada navegador.
- **Firefox/Safari** não foram revalidados nesta rodada.
- **Revisão humana das NRs** continua obrigatória antes da feira.
- A performance foi preservada pelo cache do cenário, mas deve ser medida no notebook definitivo.

---

## Arquivos principais

- `js/data/phaseMaps.js`
- `js/game/Game.js`
- `js/game/EnvironmentRenderer.js`
- `js/game/Props.js`
- `js/engine/SaveSystem.js`
- `scripts/smoke.mjs`
- `README.md`
- `SPEC.md`
