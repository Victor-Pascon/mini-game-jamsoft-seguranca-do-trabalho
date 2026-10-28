# PLAN — 6 sprints, 5 agentes, carga equilibrada

**Projeto:** JAMSOFT TECNOLOGIA — Segurança em Jogo  
**Squad:** `safety-squad`  
**Total planejado:** 104 pontos em 6 sprints  
**Objetivo:** entregar o mini-game educativo completo, com conteúdo revisado, visual consistente e operação de feira validada.

> Este plano serve tanto para execução quanto para retrospectiva. O jogo já está implementado; os pontos abaixo documentam como o trabalho foi dividido e como repetir o processo em uma nova rodada.

---

## 1. Cadência e regras de planejamento

- Cada sprint é um **bloco de 60 a 120 minutos** de trabalho focado.
- Cada agente tem no máximo **2 frentes ativas** por sprint.
- Toda tarefa tem um **dono** e, quando necessário, **apoio**.
- A integração em `Game.js` é sempre revisada por A1.
- Conteúdo de NR é sempre aprovado por A3 antes de entrar em tela.
- QA roda em paralelo, mas o gate final é sempre A5.
- Mudanças de escopo entram no sprint seguinte, salvo bloqueador S1/S2.

### Definição de pontos

| Pontos | Tamanho | Exemplo |
| --- | --- | --- |
| 1 | Pequeno | Ajuste de texto, cor, espaçamento, um teste |
| 2 | Médio | Um componente simples, um fluxo de teste |
| 3 | Médio-grande | Uma tela completa ou um sistema com integração |
| 5 | Grande | Um conjunto de telas/sistemas com revisão |
| 6 | Muito grande | Engine core, conteúdo completo de 10 desafios |

---

## 2. Visão geral dos sprints

| Sprint | Tema | Foco | Pontos |
| --- | --- | --- | --- |
| S1 | Harness & Discovery | Escopo, contratos, scaffold, mapa de conteúdo | 12 |
| S2 | Engine Core | Loop, input, renderer, colisão, save, som, testes | 16 |
| S3 | World & Characters | Mapa, salas, props, player, NPCs, HUD | 20 |
| S4 | Challenges & Equipment | Diálogos, desafios, EPIs, manual | 24 |
| S5 | Progression & Certificate | Save/load, certificado, menu, áudio, fullscreen | 16 |
| S6 | QA & Fair Polish | QA completo, acessibilidade, conteúdo, feira | 16 |
| **Total** | | | **104** |

### Carga por agente

| Agente | S1 | S2 | S3 | S4 | S5 | S6 | Total |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A1 — Game Architect | 5 | 2 | 2 | 2 | 5 | 2 | **18** |
| A2 — Engine Developer | 2 | 6 | 5 | 5 | 3 | 2 | **23** |
| A3 — NR Content Curator | 3 | 2 | 3 | 6 | 3 | 4 | **21** |
| A4 — Pixel/UX Designer | 1 | 2 | 7 | 6 | 3 | 2 | **21** |
| A5 — QA & Fair Tester | 1 | 4 | 3 | 5 | 2 | 6 | **21** |
| **Total** | **12** | **16** | **20** | **24** | **16** | **16** | **104** |

**Leitura do balanceamento:** A2 concentra engine no meio do projeto; A4 concentra visual entre S3 e S4; A3 concentra conteúdo em S4 e revisão em S6; A5 cresce no fim. A diferença entre os agentes fica em uma faixa estreita, com exceção justificada da especialização técnica de A2.

---

## 3. Sprint 1 — Harness & Discovery (12 pts)

**Objetivo:** alinhar o produto, o conteúdo e o harness antes de escrever o jogo.

### Tarefas

| ID | Tarefa | Dono | Apoio | Pontos |
| --- | --- | --- | --- | --- |
| S1-T1 | Definir escopo, fluxo de estados e mapa NR → EPI → sala | A1 | A3 | 5 (A1 3, A3 2) |
| S1-T2 | Scaffold do projeto, scripts `check`/`smoke`/`serve` e contratos de dados | A1 | A2 | 4 (A1 2, A2 2) |
| S1-T3 | Referência visual SNES, paleta, fontes e resolução | A4 | — | 1 |
| S1-T4 | Plano de testes e estrutura inicial de verificação de conteúdo | A5 | A3 | 2 (A3 1, A5 1) |

**Total:** 12 pontos.

### Entregáveis

- `SPEC.md` com escopo, fluxo e critérios de aceitação.
- `PLAN.md`, `AGENTS.md` e `HARNESS_CHECKLIST.md` iniciais.
- `package.json` com scripts de execução e teste.
- Lista fechada de 10 NRs, 10 EPIs e 12 cartas do manual.
- Contrato de resolução 640×480 e grade 20×15.
- Estrutura de pastas e smoke test esqueleto.

### Aceite

- [ ] 10 desafios mapeados para 10 EPIs e 10 NRs.
- [ ] Nenhuma NR duplicada ou sem EPI na jornada.
- [ ] `npm run check` executa.
- [ ] Documentos revisados por A1 e A3.

### Riscos

- Escopo crescer para além de uma sessão de feira.
- Mapeamento NR → EPI forçar associações artificiais.
- Referência visual não caber em 640×480.

### Mitigação

- Congelar 10 itens e 12 cartas.
- Revisar cada associação com A3.
- Prototipar uma sala antes de desenhar as 12.

---

## 4. Sprint 2 — Engine Core (16 pts)

**Objetivo:** ter um esqueleto jogável e confiável: loop, input, renderer, colisão, save, som e testes.

### Tarefas

| ID | Tarefa | Dono | Apoio | Pontos |
| --- | --- | --- | --- | --- |
| S2-T1 | Loop, delta time, input de teclado e renderer base | A2 | A1 | 3 |
| S2-T2 | Entidades, movimento do player e colisão por eixo | A2 | A1 | 2 |
| S2-T3 | SaveSystem, Sound e TextUtils com fallback | A2 | — | 1 |
| S2-T4 | Contratos de integração e spike de estados | A1 | A2 | 2 |
| S2-T5 | Tokens visuais, fontes e HUD esqueleto | A4 | — | 2 |
| S2-T6 | Smoke de save, input, colisão e casos-limite | A5 | A2 | 4 |
| S2-T7 | Revisão do schema de conteúdo e campos obrigatórios | A3 | A1 | 2 |

**Total:** 16 pontos.

### Entregáveis

- `Input`, `Renderer`, `Collision`, `SaveSystem`, `Sound`, `TextUtils`.
- `Entity` e `Player` com movimento e limites.
- Testes de fumaça para save/load e colisão.
- Tokens de paleta/fontes e HUD mínimo.
- Schema documentado de equipamento, NR, NPC e desafio.

### Aceite

- [ ] O player se move em 4 direções e não sai do canvas.
- [ ] A colisão não permite atravessar paredes.
- [ ] `localStorage` indisponível não quebra o jogo.
- [ ] Áudio bloqueado não gera exceção.
- [ ] `npm test` passa.

### Riscos

- Delta time instável causar movimento irregular.
- Colisão “grudar” nos cantos.
- Save inicial incompatível com a evolução dos dados.

### Mitigação

- Limitar delta a um teto (ex.: 50 ms).
- Resolver X e Y separadamente.
- Versionar o save e tolerar campos ausentes.

---

## 5. Sprint 3 — World & Characters (20 pts)

**Objetivo:** transformar o esqueleto na sede da JAMSOFT, com 12 salas, props, jogador, NPCs e HUD legível.

### Tarefas

| ID | Tarefa | Dono | Apoio | Pontos |
| --- | --- | --- | --- | --- |
| S3-T1 | Mapa 20×15, 12 salas, corredores, portas e props | A2 | A4 | 5 (A2 2, A4 3) |
| S3-T2 | Sprites procedurais do player e dos 10 NPCs, animação e labels | A2 | A4 | 5 (A2 2, A4 3) |
| S3-T3 | HUD superior/inferior, nome da sala, NR e prompt de interação | A4 | A1 | 2 (A4 1, A1 1) |
| S3-T4 | Posições, nomes, cargos, avatares e diálogos-base dos NPCs | A3 | A2 | 4 (A3 3, A2 1) |
| S3-T5 | QA de navegação, colisão, salas e legibilidade | A5 | — | 3 |
| S3-T6 | Integração do mundo e da HUD no loop principal | A1 | — | 1 |

**Total:** 20 pontos.

### Entregáveis

- `maps.js` com 12 salas e props.
- `Props.js` com desenho procedural e estados.
- `NPC.js` com interação, status e labels.
- Player e NPCs com sprites distintos.
- HUD com contador, barra, sala e equipamentos.
- Prompt contextual de conversa.

### Aceite

- [ ] Todas as 12 salas são alcançáveis.
- [ ] Os 10 NPCs estão nas salas corretas.
- [ ] O prompt aparece apenas quando há interação.
- [ ] HUD não cobre conteúdo essencial durante a exploração.
- [ ] Nenhum label de sala/NPC se sobrepõe de forma ilegível.

### Riscos

- Mapa visualmente poluído.
- Labels da linha superior colidirem com nomes de NPCs.
- Jogador ficar preso em props.

### Mitigação

- Props com área de colisão menor que o desenho.
- Labels curtos e offsets fixos por linha.
- Teste manual de caminho em todas as salas.

---

## 6. Sprint 4 — Challenges & Equipment (24 pts)

**Objetivo:** entregar o coração educativo: diálogos, 10 desafios, 10 EPIs visíveis e o manual de 12 NRs.

### Tarefas

| ID | Tarefa | Dono | Apoio | Pontos |
| --- | --- | --- | --- | --- |
| S4-T1 | Fluxo de diálogo, páginas, retrato e transição para desafio | A2 | A1 | 2 (A2 1, A1 1) |
| S4-T2 | Tela de desafio: opções, seleção, acerto, erro e dica | A2 | A4 | 4 (A2 2, A4 2) |
| S4-T3 | Conteúdo dos 10 desafios, 12 cartas, dicas e explicações | A3 | — | 6 |
| S4-T4 | EquipmentSystem, 10 camadas no sprite e 10 ícones | A2 | A4 | 5 (A2 2, A4 3) |
| S4-T5 | Manual: lista de 12 cartas, detalhe e integração | A1 | A4 | 2 (A1 1, A4 1) |
| S4-T6 | Smoke de desafios, equipamentos, manual e erros | A5 | — | 5 |

**Total:** 24 pontos.

### Entregáveis

- `Dialog.js` e `Challenge.js` completos.
- `challenges.js` com 10 desafios revisados.
- `norms.js` com 12 cartas e disclaimer.
- `EquipmentSystem.js` e `EquipmentRenderer.js`.
- `NormManual.js` com lista e detalhe.
- Camadas visuais de capacete, óculos, protetor, máscara, luvas, colete, cinto, calçado e prancheta.
- Testes de conteúdo e progressão.

### Aceite

- [ ] Cada diálogo leva a um desafio.
- [ ] Resposta errada não entrega EPI e permite nova tentativa.
- [ ] Resposta correta entrega o EPI correto.
- [ ] Os 10 EPIs aparecem no sprite/HUD conforme o esperado.
- [ ] O manual mostra 12 cartas e abre detalhes.
- [ ] Nenhum texto essencial é cortado em 640×480.

### Riscos

- Perguntas ambíguas ou incorretas.
- Explicações longas demais para o painel.
- Camadas de EPI se sobreporem de forma confusa.
- Manual com cartas apertadas.

### Mitigação

- Revisão A3 linha a linha.
- Limite de 3 linhas para explicação.
- Ordem de desenho testada com o conjunto completo.
- Layout 2×3 com cards de 288×104.

---

## 7. Sprint 5 — Progression & Certificate (16 pts)

**Objetivo:** fechar a jornada: save/load real, certificado, menu final, áudio, fullscreen e reset para a feira.

### Tarefas

| ID | Tarefa | Dono | Apoio | Pontos |
| --- | --- | --- | --- | --- |
| S5-T1 | Save/load integrado; save completo abre certificado | A2 | A1 | 3 (A2 2, A1 1) |
| S5-T2 | Certificado: layout, ícones, selo, confete e retorno | A4 | A1 | 3 (A4 2, A1 1) |
| S5-T3 | Menu final, toasts, estados e reset pós-certificado | A1 | A2 | 3 (A1 2, A2 1) |
| S5-T4 | Áudio, mute, fullscreen e ajustes de acessibilidade | A1 | A4 | 2 (A1 1, A4 1) |
| S5-T5 | Revisão de conteúdo pós-integração e consistência com o manual | A3 | — | 3 |
| S5-T6 | Regressão de save, menu, certificado e fluxo completo | A5 | — | 2 |

**Total:** 16 pontos.

### Entregáveis

- Save parcial e save completo funcionando.
- Certificado com os 10 EPIs e NRs.
- Menu com CONTINUAR condicionado ao save.
- Toast de EPI, save e mute.
- `V` e `F` documentados e funcionais.
- Reset automático ao concluir o certificado.

### Aceite

- [ ] Recarregar com save parcial retoma exploração.
- [ ] Recarregar com save completo abre certificado.
- [ ] Concluir certificado volta ao menu e apaga o save.
- [ ] Mute persiste após reload.
- [ ] Nenhum estado fica preso ao final.

### Riscos

- Save completo abrir na exploração sem recompensa.
- Certificado apagar o save antes da hora.
- Fullscreen falhar em um navegador de feira.

### Mitigação

- Testar explicitamente os dois caminhos de load.
- Apagar o save apenas na confirmação final.
- Tratar fullscreen como opcional, com escala CSS sempre funcional.

---

## 8. Sprint 6 — QA & Fair Polish (16 pts)

**Objetivo:** garantir que a demonstração funcione no dia, com conteúdo revisado, acessibilidade e roteiro de operação.

### Tarefas

| ID | Tarefa | Dono | Apoio | Pontos |
| --- | --- | --- | --- | --- |
| S6-T1 | QA completo no navegador, console e performance | A5 | — | 2 |
| S6-T2 | Revisão visual, contraste, legibilidade e acessibilidade | A4 | A5 | 3 (A4 2, A5 1) |
| S6-T3 | Revisão final das 12 NRs, texts e disclaimer | A3 | — | 4 |
| S6-T4 | Correções de integração e release candidate | A1 | A2 | 4 (A1 2, A2 2) |
| S6-T5 | Checklist de feira, reset e ensaio de demonstração | A5 | — | 2 |
| S6-T6 | Docs finais e atualização de README/SPEC/PLAN/AGENTS | A5 | — | 1 |

**Total:** 16 pontos.

### Entregáveis

- `npm test` verde.
- Fluxo completo validado no navegador.
- Nenhum bug S1/S2 aberto.
- Checklist de feira preenchido.
- Roteiro de demonstração de 5 minutos.
- Documentação final e riscos residuais.

### Aceite

- [ ] 10 desafios concluídos no navegador.
- [ ] 10 EPIs visíveis no sprite/HUD.
- [ ] Manual com 12 cartas e detalhe.
- [ ] Certificado e retorno ao menu.
- [ ] Save/load, mute e fullscreen testados.
- [ ] Console sem erros.
- [ ] Ensaio de feira concluído.

### Riscos

- Correções de última hora quebrarem o fluxo.
- Notebook da feira ter performance inferior.
- Texto de NR desatualizado.
- Visitante deixar save sujo.

### Mitigação

- Congelar funcionalidades após o release candidate.
- Testar no hardware real.
- Revisão humana A3.
- Certificado apaga save; reset manual documentado.

---

## 9. Caminho crítico

```text
S1 Contratos + conteúdo base
        │
        ▼
S2 Engine ──────────────┐
        │               │
        ▼               ▼
S3 Mundo/NPCs      S4 Desafios/EPIs/Manual
        │               │
        └───────┬───────┘
                ▼
        S5 Progressão/Certificado
                │
                ▼
        S6 QA/Ferira
```

### Dependências

- S2 depende dos contratos de S1.
- S3 depende do movimento/colisão de S2.
- S4 depende do mapa/NPCs de S3 e dos dados aprovados em S1/S3.
- S5 depende de S3 + S4.
- S6 depende de todo o fluxo integrado.

### Paralelização segura

- A3 pode escrever conteúdo desde S1, mas só integra depois do schema de S2.
- A4 pode desenhar tokens e sprites desde S1, mas só fecha layout com o mapa de S3.
- A5 pode preparar testes desde S1 e rodar regressões por sprint.
- A1 integra continuamente, mas evita refatorações estruturais em S5/S6.

---

## 10. Matriz de risco por sprint

| Sprint | Risco principal | Probabilidade | Impacto | Resposta |
| --- | --- | --- | --- | --- |
| S1 | Escopo aberto | Média | Alto | Congelar 10 EPIs/12 NRs |
| S2 | Engine instável | Média | Alto | Testes de colisão/save cedo |
| S3 | Mapa poluído | Alta | Médio | Uma sala piloto + revisão visual |
| S4 | Conteúdo ambíguo | Média | Alto | Revisão A3 + limite de texto |
| S5 | Save/estado inconsistente | Média | Alto | Testar os dois caminhos de load |
| S6 | Regressão de última hora | Alta | Alto | Release candidate + freeze |

---

## 11. Definition of Done por sprint

Uma sprint só fecha quando:

1. As tarefas planejadas foram concluídas ou explicitamente movidas.
2. Os entregáveis existem e estão integrados.
3. Os critérios de aceite da sprint foram verificados.
4. `npm test` passa.
5. A5 registrou o resultado do QA.
6. A1 atualizou docs/handoff.
7. Riscos residuais estão registrados.

---

## 12. Roteiro de release para a feira

1. Rodar `npm test`.
2. Abrir `npm start` e fazer o smoke manual de 10 passos.
3. Testar no notebook da feira, com o teclado e o monitor reais.
4. Deixar o jogo no menu, em tela cheia, com som ligado.
5. Fazer o reset de save antes de abrir para o público.
6. Demonstrar o primeiro desafio (capacete) e o manual.
7. Ao final de cada sessão, concluir o certificado ou limpar o save.
8. Manter um terminal com `npm start` e outro com o checklist aberto.
