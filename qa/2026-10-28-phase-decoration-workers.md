# QA — 2026-10-28 — Decoração temática e funcionários por fase

**Ambiente:** Chromium/Edge desktop, servidor local `npm start` (`http://localhost:8000`), canvas lógico 640×480 com backing store 2x.  
**Versão:** 1.4  
**npm test:** PASS — 35 arquivos JavaScript verificados; smoke test completo sem falhas.  
**Smoke manual:** PASS nas 10 fases, com inspeção visual das salas 1 a 10.

## Escopo entregue

- Cada uma das 10 fases recebeu dois funcionários de cenário com:
  - tarefa visível (ex.: `SEPARA EPI`, `MEDE RUÍDO`, `ANCORA`, `PGR`);
  - uniforme e aparência próprios;
  - EPIs representativos da NR da sala;
  - ferramenta/efeito sutil de atividade (scanner, faísca, ondas de ruído, calor, eletricidade, sinal, papel, tela).
- A decoração das salas ganhou:
  - faixa de identificação na parede;
  - cantos pintados no piso;
  - marca d'água da NR no piso;
  - posto de trabalho com brilho e cantos de segurança sob cada funcionário;
  - cadeira ergonômica visível na sala de NR-17.
- Funcionários, especialista e jogador passaram a ser ordenados por profundidade (`y`) para evitar sobreposição visual.
- Nenhum asset externo foi adicionado; tudo continua procedural.

## Arquivos alterados

- `js/data/phaseMaps.js`: equipes, posições, EPIs, ferramentas, tarefas e cadeira ergonômica.
- `js/game/CharacterRenderer.js`: variações de aparência e sprite de funcionário.
- `js/game/WorkerRenderer.js`: desenho de funcionário, EPIs, ferramenta, efeito e rótulo.
- `js/game/EnvironmentRenderer.js`: faixa de parede, cantos, marca d'água da NR e postos de trabalho.
- `js/game/Game.js`: integração dos funcionários e ordenação por profundidade.
- `js/game/Props.js`: suporte a cadeira explicitamente ergonômica em cenário.
- `scripts/smoke.mjs`: validação de equipe, EPIs, tarefas, limites e áreas reservadas.
- Documentação: `README.md`, `SPEC.md`, `HARNESS_CHECKLIST.md`, `PLAN.md`.

## Fluxos e verificações

- `npm test`: 35/35 arquivos JavaScript e todos os testes de smoke passaram.
- Cada fase tem pelo menos 2 funcionários, IDs únicos e EPIs conhecidos.
- Pelo menos um funcionário de cada fase usa o EPI entregue pela fase.
- Funcionários ficam dentro do canvas e fora do pôster, porta, especialista e início do jogador.
- Navegação de estado por todas as 10 fases com `_loadPhase(index)` e inspeção visual em Chromium/Edge.
- Console do navegador sem mensagens de erro após carregar e alternar as fases.
- Rótulos e postos de trabalho revisados para não cobrir barreiras, pôster, porta ou NPCs.

## Evidências

- [Fase 1 — NR-6 / Almoxarifado](2026-10-28-phase-decoration-workers/phase-01-epi.png)
- [Fase 5 — NR-10 / Elétrica](2026-10-28-phase-decoration-workers/phase-05-eletrica.png)
- [Fase 10 — NR-17 / Ergonomia](2026-10-28-phase-decoration-workers/phase-10-ergonomia.png)

## Interpretação de conteúdo

A decoração segue a NR de **cada fase** (NR-6, NR-12, NR-15, NR-23, NR-10, NR-26, NR-35, NR-11, NR-1 e NR-17). A NR-1/PGR permanece representada na fase 9 e no Manual; não foi aplicada como tema único a todas as salas para não apagar a progressão das 10 NRs.

## Bugs

| Severidade | Descrição | Status |
| --- | --- | --- |
| — | Nenhum bug S1/S2/S3 encontrado nesta rodada. | Fechado |

## Limitações e riscos residuais

- Validação visual feita em Chromium/Edge; repetir em Firefox/Safari e no notebook da feira.
- Controle Xbox físico, fullscreen e revisão humana final das NRs continuam pendentes no checklist maior.
- Rótulos de tarefa foram dimensionados para 7 px lógicos; conferir legibilidade a 1–2 metros no monitor definitivo.

## Decisão

**APROVADO COM RESSALVAS** — pronto para a próxima rodada de QA de hardware/navegador, sem bloqueadores de conteúdo ou de fluxo.
