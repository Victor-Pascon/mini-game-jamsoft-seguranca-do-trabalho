# HARNESS_CHECKLIST — Segurança em Jogo

**Uso:** marcar antes de cada release, antes de abrir o estande e ao final do dia de feira.  
**Responsável final:** A5 — QA & Fair Tester  
**Aprovação de release:** A1 — Game Architect

---

## 0. Status desta versão

- **Versão:** 1.2
- **Data de referência:** 28/10/2026
- **Ambiente de validação:** navegador Chromium/Edge em desktop, servidor local `npm start`.
- **Registro detalhado:** [qa/2026-10-28-ui-inventory.md](qa/2026-10-28-ui-inventory.md), [qa/2026-10-28-linear-phases.md](qa/2026-10-28-linear-phases.md) e [qa/2026-10-27-v1.0-smoke.md](qa/2026-10-27-v1.0-smoke.md) (histórico).

| Verificação | Status | Observação |
| --- | --- | --- |
| `npm test` | ✅ Passou | Sintaxe dos 32 JS + smoke test de dados, 10 fases, inventário e decoração |
| Menu e legibilidade | ✅ Validado | Identidade JAMSOFT em vermelho/preto/branco e textos nítidos com backing store 2x |
| Fluxo de desafio e EPI | ✅ Validado | Helena/NR-6, incluindo erro, dica, acerto e capacete |
| Fluxo completo das 10 fases | ✅ Validado | Playthrough automatizado: desafio → porta → próxima sala → certificado |
| Porta de fase | ✅ Validado | Bloqueada sem EPI; libera após o acerto e carrega a próxima NR |
| Manual de NRs | ✅ Validado | Lista, página, detalhe e fechamento |
| Inventário e decoração | ✅ Validado | `I`, estatísticas, prévia, equipar/remover pin, adesivo e faixa |
| Save parcial | ✅ Validado | Reload + CONTINUAR restaura fase, decoração e tempo jogado |
| Save completo | ✅ Validado | Abre direto no certificado |
| Certificado e reset | ✅ Validado | Confirmação volta ao menu e apaga save |
| Áudio/mute | ✅ Validado | Alternância e persistência |
| Tela cheia | ⚠️ Manual | API exige gesto real do usuário; validar no notebook |
| Console sem erros | ✅ Validado | Sem mensagens no fluxo testado |
| Firefox/Safari | ⚠️ Manual | Repetir o smoke no navegador da feira |

> Itens com ⚠️ não são falhas: exigem validação humana no hardware/navegador definitivo.

---

## 1. Pré-flight do repositório

- [ ] `package.json` existe e tem `start`, `check`, `smoke` e `test`.
- [ ] `index.html`, `style.css`, `js/` e `scripts/` presentes.
- [ ] `README.md`, `SPEC.md`, `AGENTS.md`, `PLAN.md` e este checklist presentes.
- [ ] `squads/safety-squad/squad.yaml` e agentes presentes.
- [ ] Nenhuma dependência de runtime instalada ou necessária.
- [ ] Nenhuma imagem, fonte ou áudio externo referenciado.
- [ ] `.gitignore` cobre `node_modules/`, logs e artefatos locais.
- [ ] O repositório está limpo ou as mudanças pendentes estão intencionais.
- [ ] O servidor usa `PORT` configurável (padrão 8000) e `Cache-Control: no-store`.

### Comandos

```bash
npm test
npm start
```

**Esperado:** `npm test` termina com “Smoke test concluído com sucesso.” e o servidor exibe `http://localhost:8000`.

---

## 2. Contrato de produto

- [ ] Escopo de 10 desafios e 10 EPIs está fechado.
- [ ] Cada EPI tem exatamente uma NR e um especialista.
- [ ] Cada desafio tem 4 alternativas e 1 correta inequívoca.
- [ ] Manual tem 12 cartas (10 desafios + NR-5 + NR-7).
- [ ] Existem 10 fases lineares, uma por NR, na ordem do HUD.
- [ ] Inventário tem 3 itens cosméticos, sem efeito sobre a proteção.
- [ ] Resolução lógica 640×480 com backing store 1280×960 e mapa 20×15 de 32 px.
- [ ] Controles são apenas por teclado.
- [ ] Disclaimer educativo está em README, manual e certificado.
- [ ] A experiência cabe em 5–10 minutos.

---

## 3. Engine e estabilidade

### 3.1 Loop e input

- [ ] O jogo inicia sem erro no console.
- [ ] `requestAnimationFrame` mantém o loop ativo.
- [ ] Delta time é limitado e não causa saltos.
- [ ] WASD e setas movem o personagem.
- [ ] Espaço/Enter/Z confirmam.
- [ ] `1`–`4` selecionam alternativas.
- [ ] `M`, `I`, `F`, `V` e `Esc` funcionam.
- [ ] `I` abre/fecha o inventário somente na exploração.
- [ ] Ao perder foco, teclas não ficam “presas”.

### 3.2 Renderer e colisão

- [ ] A resolução lógica permanece 640×480, sem distorção, com backing store 1280×960.
- [ ] Textos e sprites permanecem nítidos na escala da feira.
- [ ] Scanlines/vinheta não cobrem as áreas de leitura.
- [ ] Paredes, props e limites do mapa bloqueiam o jogador.
- [ ] O jogador não atravessa NPCs nem sai do mapa.
- [ ] A porta bloqueada impede a passagem e a porta liberada carrega a próxima fase.
- [ ] Não há flicker, tearing visível ou texto cortado.
- [ ] Partículas e confete não travam a tela.
- [ ] A vinheta/scanline não prejudica a leitura.
- [ ] HUD superior e inferior não se sobrepõem.

### 3.3 Save, áudio e fullscreen

- [ ] Save é criado ao conquistar o primeiro EPI.
- [ ] Save é atualizado nos EPIs seguintes, ao atravessar uma porta e ao trocar a decoração.
- [ ] `CONTINUAR` restaura fase, posição, EPIs, desafios, decoração e tempo jogado.
- [ ] Save antigo sem fase é migrado para a primeira NR pendente; sem decoração, usa o pin padrão.
- [ ] Save com 10 EPIs abre direto no certificado.
- [ ] Save inválido não impede o jogo de abrir.
- [ ] Concluir certificado apaga o save.
- [ ] `V` alterna mudo e persiste.
- [ ] Áudio bloqueado não gera exceção.
- [ ] `F` entra/sai de tela cheia quando suportado.
- [ ] Se `F` falhar, a escala CSS continua jogável.

---

## 4. Conteúdo e progressão

### 4.1 Diálogos e desafios

- [ ] Introdução inicial explica missão e controles.
- [ ] Os 10 NPCs aparecem em suas fases lineares corretas.
- [ ] Cada fase exibe pôster da NR e props temáticos.
- [ ] O prompt aparece na distância correta.
- [ ] Cada diálogo termina em desafio ou em conversa de reforço.
- [ ] Resposta errada mostra a correta e a dica.
- [ ] Resposta errada não entrega EPI.
- [ ] Resposta correta entrega o EPI correspondente.
- [ ] A explicação cabe no painel, com acentos.
- [ ] Não é possível responder depois de concluído.

### 4.2 Equipamentos

- [ ] O capacete aparece no sprite ao conquistar NR-6.
- [ ] Os óculos aparecem no sprite ao conquistar NR-12.
- [ ] O protetor aparece no sprite ao conquistar NR-15.
- [ ] A máscara aparece no sprite ao conquistar NR-23.
- [ ] As luvas aparecem no sprite ao conquistar NR-10.
- [ ] O colete aparece no sprite ao conquistar NR-26.
- [ ] O cinto aparece no sprite ao conquistar NR-35.
- [ ] O calçado aparece no sprite ao conquistar NR-11.
- [ ] A prancheta aparece no sprite ao conquistar NR-1.
- [ ] A cadeira aparece no cenário/HUD/certificado ao conquistar NR-17.
- [ ] O HUD mostra 10 slots na ordem correta.
- [ ] “PRÓXIMO” mostra o primeiro item faltante.
- [ ] “JORNADA COMPLETA!” aparece com 10/10.

### 4.3 Manual

- [ ] `M` abre e fecha durante qualquer fase.
- [ ] Lista tem 12 cartas em 2 páginas.
- [ ] Setas trocam seleção/página.
- [ ] `Enter` abre o detalhe.
- [ ] `Esc` volta à lista.
- [ ] O detalhe mostra resumo, regras, EPI e status.
- [ ] O aviso educativo e a fonte aparecem.

### 4.4 Inventário e decoração

- [ ] `I` abre e fecha o inventário durante a exploração.
- [ ] O tempo jogado avança e é restaurado pelo save.
- [ ] Fase atual, fases concluídas e EPIs adquiridos conferem com o HUD.
- [ ] Os 10 EPIs aparecem com estado bloqueado/adquirido e seus nomes.
- [ ] A prévia mostra o personagem com EPIs e decoração.
- [ ] Pin JAMSOFT pode ser equipado/removido e persiste no save.
- [ ] Adesivo de Capacete só libera com o capacete.
- [ ] Faixa de Guardião só libera após 5 fases.
- [ ] A opção de material de estudo abre o Manual de NRs.
- [ ] Equipar/remover decoração não altera a proteção nem a progressão.

### 4.5 Certificado

- [ ] A porta da 10ª fase aciona o certificado.
- [ ] O certificado mostra os 10 ícones.
- [ ] Mostra as 10 NRs e a data.
- [ ] Mostra o selo/assinaturas.
- [ ] Confirmação volta ao menu.
- [ ] O save é apagado após a confirmação.
- [ ] A animação/confete não impede a leitura.

---

## 5. Conteúdo NR — revisão editorial

- [ ] As 10 NRs dos desafios estão corretas.
- [ ] NR-5 e NR-7 estão corretas e identificadas como consulta.
- [ ] Cada pergunta tem resposta correta inequívoca.
- [ ] Distratoras são plausíveis e claramente erradas.
- [ ] Dicas ensinam o critério.
- [ ] Explicações têm no máximo 3 linhas na tela.
- [ ] Não há contradição entre desafio, dica, explicação e manual.
- [ ] Não há promessa de conformidade legal.
- [ ] Não há casos reais de acidentes ou dados sensíveis.
- [ ] Fonte oficial está visível.
- [ ] Disclaimer está visível no manual e no certificado.
- [ ] Revisão humana registrada no handoff.

### Checklist específico das NRs

- [ ] **NR-1:** PGR/GRO, identificação de perigos, avaliação de riscos e hierarquia de controles.
- [ ] **NR-6:** fornecimento gratuito, adequação ao risco, CA, treinamento e conservação.
- [ ] **NR-10:** desenergização, bloqueio/etiquetagem e medidas de controle.
- [ ] **NR-11:** operador treinado/habilitado e segurança na movimentação.
- [ ] **NR-12:** proteções fixas/móveis e dispositivos de segurança.
- [ ] **NR-15:** limite de 85 dB(A) para 8 horas e medidas de controle.
- [ ] **NR-17:** mobiliário ajustável, postura e pausas.
- [ ] **NR-23:** saídas de emergência desobstruídas e sinalizadas.
- [ ] **NR-26:** amarelo para advertência e demais cores de segurança.
- [ ] **NR-35:** trabalho acima de 2 m, análise de risco e proteção contra quedas.

---

## 6. Acessibilidade e legibilidade

- [ ] O jogo é operável sem mouse.
- [ ] O canvas tem `aria-label` descritivo.
- [ ] Há texto alternativo/descrição do jogo no HTML.
- [ ] Contraste de texto e painéis é suficiente.
- [ ] Status não depende apenas de cor (nome, ícone, contador).
- [ ] Fontes permanecem legíveis e nítidas no monitor da feira.
- [ ] Nenhum texto essencial fica cortado em 640×480 lógico.
- [ ] O nome do estado (bloqueado, equipado, concluído) acompanha a cor.
- [ ] A escala CSS mantém proporção 4:3.
- [ ] Fullscreen não é obrigatório para jogar.
- [ ] Mensagens de erro/sucesso são visíveis e duradouras o suficiente.

---

## 7. QA no navegador — smoke de 11 passos

Executar em uma janela anônima, com `localStorage` limpo.

- [ ] 1. Abrir `http://localhost:8000`; menu renderiza com a identidade JAMSOFT e texto nítido.
- [ ] 2. Navegar por NOVO JOGO, CONTINUAR e COMO JOGAR.
- [ ] 3. Iniciar NOVO JOGO; concluir a introdução com Espaço.
- [ ] 4. Mover com WASD/setas; verificar colisão.
- [ ] 5. Conversar com Helena; errar; ver dica; voltar; acertar.
- [ ] 6. Ver o capacete no sprite e no HUD; conferir a porta verde e atravessar para a Fase 2.
- [ ] 7. Abrir o manual (`M`); navegar, abrir detalhe e voltar.
- [ ] 8. Abrir o inventário (`I`); conferir estatísticas, equipar/remover decoração e abrir o manual pela opção de estudo; voltar.
- [ ] 9. Recarregar; usar CONTINUAR; conferir fase, progresso, posição, decoração e tempo.
- [ ] 10. Completar as 10 fases; atravessar a última porta e conferir o certificado.
- [ ] 11. Confirmar; voltar ao menu; conferir save apagado.

### Console

- [ ] Nenhum erro vermelho.
- [ ] Nenhum aviso recorrente de promise/áudio.
- [ ] Nenhum 404 de arquivo local.
- [ ] Nenhum erro de módulo ES.

### Performance

- [ ] A exploração mantém movimento fluido.
- [ ] Abrir/fechar manual repetidamente não degrada.
- [ ] Diálogo/desafio não acumulam listeners.
- [ ] Após 10 minutos, o jogo continua responsivo.
- [ ] Partículas do certificado terminam sem travar.

---

## 8. Operação no dia da feira

### 8.1 Hardware

- [ ] Notebook carregado e conectado à energia.
- [ ] Monitor/configuração de vídeo definidos.
- [ ] Teclado testado (setas, WASD, Espaço, Enter, M, I, F, V, Esc, 1–4).
- [ ] Som testado no volume adequado.
- [ ] Mouse não é necessário; se presente, não atrapalha.
- [ ] Tela limpa, sem notificações ou janelas pessoais.
- [ ] Economia de energia/descanso de tela desativados.

### 8.2 Software

- [ ] Node.js disponível.
- [ ] `npm start` rodando.
- [ ] Navegador aberto em `http://localhost:8000`.
- [ ] Tela cheia (`F`) ativada.
- [ ] Som ligado (`V`).
- [ ] Save limpo antes de abrir ao público.
- [ ] Aba de fallback/recarregamento pronta.
- [ ] Uma cópia do projeto disponível offline (sem dependências de CDN).

### 8.3 Roteiro de demonstração (5 minutos)

1. **0:00–0:30** — Apresentar a missão: “Você é o novo guardião da segurança.”
2. **0:30–1:00** — Novo jogo; ler a introdução.
3. **1:00–2:00** — Conversar com Helena (NR-6), errar de propósito, mostrar dica, acertar.
4. **2:00–2:30** — Mostrar o capacete no sprite e o HUD.
5. **2:30–3:00** — Abrir o inventário (`I`) e mostrar tempo, progresso e decoração.
6. **3:00–3:40** — Abrir o manual (`M`), mostrar NR-1 e NR-35.
7. **3:40–4:30** — Conduzir mais 1–2 desafios e explicar o vínculo NR → risco → EPI.
8. **4:30–5:00** — Mostrar o certificado (se houver save preparado) ou convidar o visitante a continuar.

### 8.4 Plano de incidente

| Situação | Ação |
| --- | --- |
| Jogo travou | Recarregar a página; se persistir, reiniciar `npm start` |
| Save sujo | Console: `localStorage.removeItem('jamsoft_seguranca_save')`; recarregar |
| Sem áudio | Verificar volume; tentar `V`; seguir sem som |
| Fullscreen falhou | Jogar na janela; usar zoom do navegador se necessário |
| Teclado falhou | Trocar teclado/porta; manter setas + Espaço como fallback |
| Servidor caiu | Reiniciar `npm start`; abrir novamente |
| Internet caiu | Não afeta: o jogo é local; não usar CDN |

---

## 9. Reset e privacidade

- [ ] O save contém apenas posição, EPIs, desafios, fase, decoração, tempo jogado e data.
- [ ] Nenhum dado pessoal é coletado.
- [ ] Nenhum analytics/rede é usado.
- [ ] O certificado apaga o save ao final.
- [ ] Reset manual documentado.
- [ ] Visitantes são informados de que o progresso é local e temporário.

---

## 10. Aprovação de release

| Papel | Nome | Verificação | Status |
| --- | --- | --- | --- |
| A1 — Game Architect |  | Escopo, integração, docs | [ ] |
| A2 — Engine Developer |  | Loop, save, performance | [ ] |
| A3 — NR Content Curator |  | Conteúdo e disclaimer | [ ] |
| A4 — Pixel/UX Designer |  | Visual, legibilidade, EPIs | [ ] |
| A5 — QA & Fair Tester |  | `npm test`, navegador, feira | [ ] |

**Release aprovado?** `[ ] Sim` / `[ ] Não`  
**Data:** ____ / ____ / ______  
**Observações:** ______________________________________________________

---

## 11. Pós-feira

- [ ] Registrar bugs e feedback dos visitantes.
- [ ] Verificar se o save foi limpo.
- [ ] Atualizar este checklist com lições aprendidas.
- [ ] Abrir issues/tarefas para melhorias.
- [ ] Atualizar README/SPEC/PLAN se o comportamento mudou.
- [ ] Fazer backup do estado final do projeto.
- [ ] Marcar a versão demonstrável no git, se aplicável.
