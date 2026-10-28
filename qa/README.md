# QA — Registros de validação

Esta pasta guarda os registros de QA do projeto. O checklist operacional fica em [../HARNESS_CHECKLIST.md](../HARNESS_CHECKLIST.md).

## Convenção de nome

```text
YYYY-MM-DD-escopo.md
```

Exemplos:

- `2026-10-27-v1.0-smoke.md`
- `2026-10-28-visual-upgrade.md`
- `2026-10-28-linear-phases.md`
- `2026-10-28-ui-inventory.md`
- `2026-10-28-gamepad-xbox.md`
- `2026-10-28-fair-rehearsal.md`

## O que registrar

- Ambiente: navegador, versão, sistema, resolução e hardware.
- Comando executado e resultado de `npm test`.
- Fluxos testados (menu, exploração, desafio, manual, save, certificado).
- Bugs encontrados, com severidade, passos e dono.
- Evidências (screenshots, logs, estados).
- Riscos residuais e decisão de release.

## Modelo

```md
# QA — <data> — <escopo>

**Ambiente:** ...
**Versão:** ...
**npm test:** PASS/FAIL
**Smoke manual:** PASS/FAIL

## Fluxos validados
- ...

## Bugs
| Severidade | Descrição | Passos | Dono | Status |
| --- | --- | --- | --- | --- |
| ... | ... | ... | ... | ... |

## Limitações
- ...

## Decisão
APROVADO / APROVADO COM RESSALVAS / BLOQUEADO
```
