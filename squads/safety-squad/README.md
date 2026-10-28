# Squad Segurança em Jogo

Harness de desenvolvimento e operação do mini-game **JAMSOFT TECNOLOGIA — Segurança em Jogo**.

## Arquivos

| Arquivo | Uso |
| --- | --- |
| `squad.yaml` | Definição do squad, agentes, sprints, gates, comandos e skills |
| `agents/game-architect.md` | Prompt e contrato de A1 |
| `agents/engine-developer.md` | Prompt e contrato de A2 |
| `agents/nr-content-curator.md` | Prompt e contrato de A3 |
| `agents/pixel-ux-designer.md` | Prompt e contrato de A4 |
| `agents/qa-fair-tester.md` | Prompt e contrato de A5 |
| `commands/run-quality-gate.md` | Roteiro de QA completo |
| `commands/fair-demo.md` | Roteiro de demonstração de 5 minutos |
| `skills/nr-content-review.md` | Skill de revisão editorial/técnica de NR |

## Elenco

- **A1 — Game Architect:** arquitetura, estados, integração e release.
- **A2 — Engine Developer:** loop, input, renderer, colisão, save, som e performance.
- **A3 — NR Content Curator:** precisão das NRs, desafios, diálogos e tom educativo.
- **A4 — Pixel/UX Designer:** identidade SNES, sprite, EPIs, HUD e acessibilidade.
- **A5 — QA & Fair Tester:** testes, navegador, conteúdo, acessibilidade e feira.

## Como rodar uma rodada

1. **Intake (A1):** objetivo, arquivos afetados, critério de aceite e sprint.
2. **Conteúdo (A3):** revisar NR/desafio antes de integrar.
3. **Implementação:** dono do arquivo + apoio; mudanças pequenas.
4. **Revisão cruzada:** A1 integra, A3 valida texto, A4 valida visual.
5. **QA (A5):** `npm test`, navegador e checklist.
6. **Release (A1):** docs, handoff, riscos e roteiro de feira.

## Regras de ouro

- Não inventar NR.
- Não usar assets externos.
- Não quebrar 640×480.
- Não exigir mouse.
- Não duplicar recompensa.
- Não deixar estado sem saída.
- Não salvar lixo.
- Não entregar sem teste.

## Comandos

```bash
npm start        # servidor local em http://localhost:8000
npm run check    # sintaxe
npm run smoke    # dados e lógica
npm test         # check + smoke
```

## Handoff

```md
## Handoff — <tarefa>
**Agente:** A?
**Sprint:** S?
**Objetivo:** ...
**Arquivos alterados:** ...
**Comportamento entregue:** ...
**Testes executados:** ...
**Evidências:** ...
**Riscos / pendências:** ...
**Próximo dono:** A?
```

## Observação

O `squad.yaml` é um harness documental. Se o runner de agentes usar outro schema, preserve os campos de papel, propriedade, sprint, gate e handoff e adapte apenas o envelope de configuração.
