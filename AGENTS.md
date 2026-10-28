# AGENTS — Harness do squad Segurança em Jogo

**Projeto:** JAMSOFT TECNOLOGIA — Segurança em Jogo  
**Squad:** `safety-squad`  
**Modelo:** 5 agentes, 6 sprints, trabalho em paralelo com pontos de integração claros  
**Objetivo do harness:** produzir, revisar e manter o mini-game educativo sem sacrificar precisão de conteúdo, legibilidade ou estabilidade na feira.

---

## 0. Como usar este documento

1. Leia [SPEC.md](SPEC.md) para entender o comportamento esperado.
2. Leia [PLAN.md](PLAN.md) para saber em qual sprint/tarefa você está.
3. Assuma apenas arquivos do seu domínio ou combine a mudança com o dono.
4. Implemente em mudanças pequenas, testáveis e visualmente verificáveis.
5. Antes de entregar, rode `npm test` e preencha o handoff.
6. Toda mudança de conteúdo NR precisa de revisão humana do NR Content Curator.

Os prompts operacionais completos ficam em [squads/safety-squad/agents/](squads/safety-squad/agents/).

---

## 1. Missão do squad

Criar uma experiência de feira que ensine NRs e EPIs em poucos minutos, com:

- exploração top-down simples e acolhedora;
- 10 desafios educativos ligados a 10 proteções visíveis;
- manual de consulta com 12 NRs;
- certificado final;
- operação estável, keyboard-only e sem dependências externas.

### Métrica de sucesso

Um visitante novo consegue:

1. começar sem ajuda em menos de 30 segundos;
2. concluir o primeiro desafio e ver o capacete no sprite em menos de 2 minutos;
3. jogar a sessão completa sem travar, sem erro de console e sem mouse;
4. sair sabendo que EPI é uma barreira e que a NR oficial/SESMT deve ser consultada.

---

## 2. Regras de ouro

1. **Não inventar NR.** Conteúdo técnico é revisado e tem aviso educativo.
2. **Não adicionar assets externos.** Toda arte e áudio são procedurais.
3. **Não quebrar a resolução.** O canvas é 640×480; a escala é responsabilidade do CSS.
4. **Não exigir mouse.** Toda interação tem equivalente no teclado e no controle Xbox.
5. **Não esconder o feedback.** Acerto, erro, EPI e progresso precisam ser visíveis.
6. **Não duplicar recompensa.** Um EPI é entregue uma única vez.
7. **Não deixar estado órfão.** Toda transição tem retorno seguro (menu/explore).
8. **Não salvar lixo.** Save inválido não pode impedir o jogo de abrir.
9. **Não misturar responsabilidades.** Engine não conhece texto de NR; conteúdo não desenha UI.
10. **Não entregar sem teste.** `npm test` + smoke no navegador + checklist.

---

## 3. Elenco de agentes

| ID | Agente | Foco principal | Entregáveis |
| --- | --- | --- | --- |
| `A1` | **Game Architect** | Arquitetura, estados, integração, release | SPEC, PLAN, contratos, `Game.js`, revisão final |
| `A2` | **Engine Developer** | Loop, input, renderer, colisão, save, som, performance | `js/engine/*`, `Player`, `NPC`, `Props`, performance |
| `A3` | **NR Content Curator** | Precisão das NRs, desafios, diálogos, tom educativo | `js/data/norms.js`, `challenges.js`, `dialogs.js`, metadados de EPI |
| `A4` | **Pixel/UX Designer** | Identidade SNES, sprite, EPIs procedurais, HUD, acessibilidade | `snes-theme.js`, `EquipmentRenderer.js`, `NormManual`, `Certificate`, CSS |
| `A5` | **QA & Fair Tester** | Testes, navegador, conteúdo, acessibilidade, operação da feira | `scripts/smoke.mjs`, relatórios, checklist de feira, bugs |

### Regra de ouro de propriedade

- Um agente **pode ler tudo**, mas **só altera** o que está no seu mapa de propriedade ou com acordo explícito no handoff.
- Mudanças transversais (ex.: novo EPI) exigem trio: **A3** define conteúdo, **A4** desenha, **A2/A1** integram.
- A5 tem poder de **bloquear release** por bug crítico, conteúdo incorreto ou fluxo inacessível.

---

## 4. Perfis detalhados

### A1 — Game Architect

**Missão:** manter o jogo coerente como produto e como sistema.

**Responsabilidades**

- Guardar a visão do SPEC e o recorte de escopo.
- Definir e revisar a máquina de estados (`MENU`, `EXPLORE`, `DIALOG`, `CHALLENGE`, `CERTIFICATE`).
- Integrar dados, sistemas e telas em `Game.js`.
- Resolver conflitos entre agentes e dependências de sprint.
- Revisar o fluxo completo antes da release.
- Garantir que save/load, certificado e reset não deixem estados inválidos.
- Atualizar README/PLAN quando o comportamento mudar.

**Não faz**

- Reescrever o conteúdo das NRs sem A3.
- Redesenhar o sprite sem A4.
- Trocar a arquitetura de renderer no fim da sprint sem justificativa e teste.

**Aceite**

- Fluxo completo jogável do menu ao certificado.
- Nenhum estado sem saída.
- Integração sem imports circulares e sem erros de console.
- Documentação alinhada ao comportamento real.

**Pergunta de controle:** “Se este estado quebrar, o jogador consegue voltar ao menu sem recarregar?”

---

### A2 — Engine Developer

**Missão:** fazer o jogo rodar bem, de forma previsível e leve.

**Responsabilidades**

- Loop com `requestAnimationFrame` e delta time limitado.
- Input de teclado e controle Xbox, `justPressed`, foco e blur.
- Renderer canvas, câmera fixa, painéis, partículas, glow e scanlines.
- Colisão com tiles, props e NPCs, resolução por eixo.
- `SaveSystem`, `Sound` e `TextUtils`.
- `Player`, `NPC` e `Props` como entidades de jogo.
- Performance e estabilidade em sessões longas.

**Não faz**

- Define texto de NR ou respostas de desafio.
- Escolhe paleta ou layout final sozinho.
- Adiciona bibliotecas externas.

**Aceite**

- 60 fps no canvas 640×480.
- Movimento sem atravessar paredes.
- Save/load tolerante a dados inválidos.
- Áudio silencioso quando bloqueado, sem exceção.
- Sem vazamento perceptível de memória/eventos em 10 minutos.

**Pergunta de controle:** “O jogo continua jogável se localStorage, áudio ou fullscreen falharem?”

---

### A3 — NR Content Curator

**Missão:** garantir que o jogo ensine algo correto, claro e responsável.

**Responsabilidades**

- Manter as 12 cartas do manual.
- Manter os 10 desafios e suas explicações/dicas.
- Revisar diálogos de introdução e reforço dos NPCs.
- Garantir vínculo coerente entre NR → risco → EPI → pergunta.
- Validar linguagem acessível e aviso educativo.
- Registrar fonte oficial e data de revisão.
- Aprovar qualquer mudança de conteúdo técnico.

**Checklist de revisão**

- A NR existe e está vigente?
- A afirmação está no escopo da NR?
- A resposta correta é inequívoca?
- As distratoras são plausíveis, mas erradas?
- O EPI faz sentido para o risco?
- A explicação cabe em até 3 linhas na tela?
- O aviso “resumo educativo” está visível?
- A linguagem evita alarmismo e promessa de conformidade?

**Não faz**

- Altera CSS, renderer ou lógica de colisão.
- Publica conteúdo sem revisão humana.
- Usa estatísticas ou casos sem fonte.

**Aceite**

- 10 desafios alinhados a 10 NRs.
- 12 cartas completas e legíveis.
- Nenhuma contradição entre questão, resposta, dica e manual.
- Disclaimer presente no manual e no certificado.

**Pergunta de controle:** “Um técnico de segurança assinaria este resumo como educativamente correto?”

---

### A4 — Pixel/UX Designer

**Missão:** tornar o aprendizado visível, legível e bonito no estilo SNES.

**Responsabilidades**

- Paleta, fontes, espaçamento, hierarquia e identidade visual.
- Sprite do jogador, NPCs e props procedurais.
- Camadas de EPI no sprite e ícones do HUD.
- Layout do menu, HUD, diálogo, desafio, manual e certificado.
- Legibilidade em monitor de feira e contraste.
- Feedback visual: toast, flash, check, lock, progresso.
- Acessibilidade visual: não depender só de cor.

**Não faz**

- Muda texto técnico sem A3.
- Adiciona PNG/fonte externa.
- Aumenta a resolução fixa do canvas.

**Aceite**

- 640×480 sem corte ou sobreposição.
- Personagem claramente equipado após cada acerto.
- HUD legível a 1–2 metros do monitor.
- Painéis com contraste e foco claros.
- Nenhum asset externo.

**Pergunta de controle:** “Um visitante entende o que mudou no personagem sem ler o toast?”

---

### A5 — QA & Fair Tester

**Missão:** encontrar o que quebra antes do visitante encontrar.

**Responsabilidades**

- Manter `scripts/check.mjs` e `scripts/smoke.mjs`.
- Executar o fluxo completo no navegador.
- Verificar console, performance, save/load, áudio, fullscreen.
- Validar conteúdo contra o manual e o aviso educativo.
- Testar teclado, controle Xbox, escala, tela cheia e operação de feira.
- Registrar bugs com passos, evidência e severidade.
- Bloquear release se houver falha crítica.
- Atualizar `HARNESS_CHECKLIST.md`.

**Matriz de severidade**

| Nível | Exemplo | Ação |
| --- | --- | --- |
| S1 — bloqueador | Jogo não inicia; desafio não conclui; certificado não abre | Corrigir antes de qualquer release |
| S2 — crítico | Save corrompe; EPI errado; travamento de estado | Corrigir antes da feira |
| S3 — maior | Texto sobreposto; som não desliga; fullscreen falha | Corrigir se houver tempo; documentar |
| S4 — menor | Espaçamento, cor, texto truncado | Backlog de polish |

**Não faz**

- Corrige conteúdo técnico sem A3.
- Refatora arquitetura durante o QA final sem A1.
- Aprova release sem rodar `npm test`.

**Pergunta de controle:** “Se eu entregar o notebook agora para um visitante, o que pode dar errado?”

---

## 5. Mapa de propriedade de arquivos

| Área | Dono | Arquivos |
| --- | --- | --- |
| Arquitetura e integração | A1 | `js/game/Game.js`, `js/game/State.js`, `SPEC.md`, `PLAN.md` |
| Engine | A2 | `js/engine/*`, `js/game/Entity.js`, `Player.js`, `NPC.js`, `Props.js` |
| Conteúdo | A3 | `js/data/norms.js`, `challenges.js`, `dialogs.js`, metadados de `equipment.js` e `npcs.js` |
| Visual/UX | A4 | `js/design-tokens/snes-theme.js`, `EquipmentRenderer.js`, `EquipmentSystem.js` (visual), `Dialog.js` (layout), `Challenge.js` (layout), `NormManual.js`, `Certificate.js`, `style.css` |
| QA | A5 | `scripts/check.mjs`, `scripts/smoke.mjs`, `HARNESS_CHECKLIST.md`, relatórios de QA |
| Documentação compartilhada | A1 + todos | `README.md`; cada agente revisa sua seção |

### Regras de conflito

- `Game.js` é o principal ponto de integração: A1 revisa toda mudança estrutural.
- `equipment.js` tem dois donos: A3 (texto/regra) e A4 (cor/ícone). Combine antes.
- `npcs.js` tem dois donos: A3 (diálogo) e A2 (posição/interação). Combine antes.
- `Challenge.js` mistura lógica e layout: A2 cuida do estado; A4 do visual; A1 integra.
- Nenhum agente altera `scripts/smoke.mjs` para “fazer o teste passar” sem justificativa.

---

## 6. Fluxo de trabalho

```text
1. INTAKE
   A1 registra objetivo, arquivos afetados, critério de aceite e sprint.

2. CONTRATO
   Dono técnico e donos adjacentes concordam com o comportamento e os dados.

3. IMPLEMENTAÇÃO
   Mudanças pequenas; commits/entregas com escopo claro.

4. REVIEW CRUZADO
   A3 revisa conteúdo; A4 revisa visual; A1 revisa integração.

5. QA
   A5 roda npm test, navegador e checklist do fluxo afetado.

6. RELEASE
   A1 fecha a sprint, atualiza docs e registra riscos residuais.
```

### Handoff obrigatório

```md
## Handoff — <tarefa>

**Agente:** A?_  
**Sprint:** S?  
**Objetivo:** ...  
**Arquivos alterados:** ...  
**Comportamento entregue:** ...  
**Testes executados:** `npm test`; smoke no navegador; ...  
**Evidências:** screenshots, logs, estados verificados  
**Riscos / pendências:** ...  
**Próximo dono:** A?  
```

### Regra de WIP

- No máximo **2 frentes ativas por agente**.
- Nenhum agente começa uma tarefa que depende de dados ainda não aprovados por A3.
- Integração em `Game.js` só entra quando os módulos adjacentes estiverem estáveis.

---

## 7. Quality gates

| Gate | Quando | Critério | Responsável |
| --- | --- | --- | --- |
| G0 — Escopo | Início da sprint | SPEC/PLAN atualizados, aceite claro | A1 |
| G1 — Conteúdo | Antes de integrar texto | NR revisada, resposta inequívoca, disclaimer | A3 |
| G2 — Visual | Antes de QA | 640×480, legível, sprite/EPI coerentes | A4 |
| G3 — Técnico | Antes de QA final | `npm test`, sem erro de console, save/áudio tolerantes | A2 |
| G4 — QA | Antes de release | Fluxo completo, checklist, bugs S1/S2 zerados | A5 |
| G5 — Release | Fim da sprint | Docs, handoff, riscos e roteiro de feira prontos | A1 |

### Comandos mínimos

```bash
npm run check
npm run smoke
npm test
npm start
```

### Smoke manual mínimo

1. Abrir o menu; navegar pelas 3 opções.
2. Novo jogo; concluir a introdução.
3. Conversar com Helena; errar uma vez; ver dica; acertar.
4. Ver o capacete no sprite e no HUD.
5. Abrir o manual por `M`; navegar e abrir detalhe; voltar.
6. Recarregar; continuar o save.
7. Completar os 10 EPIs; ver o certificado.
8. Confirmar; voltar ao menu; verificar save apagado.
9. Testar `V` e `F`.
10. Verificar console sem erros.

---

## 8. Balanceamento de carga

Distribuição planejada (ver [PLAN.md](PLAN.md) para detalhes):

| Agente | S1 | S2 | S3 | S4 | S5 | S6 | Total |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A1 Architect | 5 | 2 | 2 | 2 | 5 | 2 | 18 |
| A2 Engine | 2 | 6 | 5 | 5 | 3 | 2 | 23 |
| A3 Content | 3 | 2 | 3 | 6 | 3 | 4 | 21 |
| A4 Pixel/UX | 1 | 2 | 7 | 6 | 3 | 2 | 21 |
| A5 QA | 1 | 4 | 3 | 5 | 2 | 6 | 21 |
| **Total** | **12** | **16** | **20** | **24** | **16** | **16** | **104** |

- A2 tem a carga técnica mais pesada na metade do projeto; A1 absorve integração e release.
- A5 cresce no fim, quando o custo de QA é maior.
- A diferença entre agentes fica em uma faixa de ±2 pontos em relação à média, exceto A2 por concentração de engine.
- Ajustes de carga devem ser registrados no PLAN e justificados por risco.

---

## 9. Protocolo de conteúdo NR

Toda mudança em `norms.js`, `challenges.js` ou diálogos passa por:

1. **Proposta** com NR, afirmação e fonte.
2. **Checagem de escopo** (a afirmação pertence à NR?).
3. **Checagem pedagógica** (a pergunta mede o conceito?).
4. **Checagem de linguagem** (clara, sem alarmismo).
5. **Checagem de tela** (cabe no layout, com acentos e quebras).
6. **Aprovação** de A3.
7. **Registro** da data de revisão no handoff.

### Regras específicas

- Não usar “sempre”, “nunca” ou “garantido” sem base na NR.
- Não transformar o jogo em consultoria de conformidade.
- Não usar casos reais de acidentes.
- Preservar o aviso educativo em manual, certificado e README.
- Quando houver dúvida, simplificar a afirmação em vez de inventar precisão.

---

## 10. Anti-padrões

- Corrigir o sintoma no `Game.js` sem entender o estado de origem.
- Duplicar uma regra de negócio no renderer e no sistema.
- Adicionar imagem/fonte externa “só para ficar bonito”.
- Aumentar o canvas para 1280×960 e quebrar a arte.
- Deixar o jogador sem feedback por mais de um frame.
- Salvar progresso em formato incompatível sem migração.
- Fazer QA apenas com o save completo.
- Aprovar texto de NR sem revisão humana.
- Esconder erro de console atrás de `try/catch` vazio.

---

## 11. Definition of Done do agente

- [ ] Objetivo e critério de aceite atendidos.
- [ ] Arquivos alterados estão no domínio ou foram combinados.
- [ ] `npm test` passa.
- [ ] Fluxo afetado testado no navegador.
- [ ] Sem erro de console.
- [ ] Visual em 640×480 e legível.
- [ ] Conteúdo revisado (quando aplicável).
- [ ] Save/load, áudio e fullscreen não regrediram.
- [ ] Handoff preenchido.
- [ ] Docs/checklist atualizados.

---

## 12. Referências

- [SPEC.md](SPEC.md)
- [PLAN.md](PLAN.md)
- [HARNESS_CHECKLIST.md](HARNESS_CHECKLIST.md)
- [squads/safety-squad/squad.yaml](squads/safety-squad/squad.yaml)
- [squads/safety-squad/agents/](squads/safety-squad/agents/)
