# QA — 28/10/2026 — upgrade visual

> **Histórico:** o `npm run check` indicava 29 arquivos na época. Após a criação de `js/data/phaseMaps.js`, a suíte passou a validar 30 arquivos. Ver [2026-10-28-linear-phases.md](2026-10-28-linear-phases.md).

**Ambiente:** Windows, Chromium/Edge integrado ao ambiente de desenvolvimento, canvas 640×480  
**Versão:** 1.0.0 + upgrade visual  
**Servidor:** `http://localhost:8000`  
**npm test:** PASS  
**Smoke manual:** PASS parcial (telas principais + automação de estado)

---

## Gate técnico

| Comando | Resultado |
| --- | --- |
| `npm run check` | ✅ 29 arquivos JavaScript verificados |
| `npm run smoke` | ✅ Smoke test concluído com sucesso |
| `npm test` | ✅ Check + smoke verdes |

## Fluxos validados

- [x] Menu principal com sprite detalhado do guardião e equipamentos completos.
- [x] Introdução com retrato SESMT, placa de nome/cargo, badge e texto reflowado.
- [x] Exploração com piso, paredes, luzes, soleiras, corredor e props por setor.
- [x] NPCs com sprites próprios, marcador de status e placa de nome ao se aproximar.
- [x] Diálogo de especialista com retrato único, piscada, boca animada e barras de voz.
- [x] Desafio NR-10 abre após o diálogo sem quebrar o layout.
- [x] Todos os 10 equipamentos desenhados no sprite do jogador.
- [x] Manual de NRs e certificado preservados com os novos painéis.
- [x] Console sem erros nos fluxos testados.
- [x] Cenário estático cacheado em canvas auxiliar; exploração medida em ~76 fps.

## Evidências

- Screenshots de menu, exploração, diálogo, desafio, manual e certificado.
- Inspeção ampliada do sprite do jogador com os 10 EPIs e de NPCs em 3–4×.
- Medição de `requestAnimationFrame` em 1,5 s: 114 frames / ~76 fps após o cache.
- `npm test` final verde.

## Bugs

Nenhum bug S1/S2 identificado nesta rodada.

## Limitações

- [ ] Tela cheia (`F`) continua pendente de validação com gesto real do usuário.
- [ ] Firefox e Safari não foram testados nesta rodada.
- [ ] Performance no hardware definitivo da feira ainda precisa de ensaio local.
- [ ] Revisão humana final das NRs deve ser registrada por um profissional de SST.
- [ ] O smoke manual completo (10 desafios em sequência) não foi repetido após o upgrade visual; a lógica não foi alterada, mas a validação final deve ocorrer no ensaio da feira.

## Decisão

**APROVADO COM RESSALVAS** para demonstração local em Chromium/Edge, condicionado aos itens de validação manual acima.
