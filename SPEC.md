# SPEC — JAMSOFT TECNOLOGIA: Segurança em Jogo

**Versão:** 1.2
**Status:** implementado e validado para demonstração em feira  
**Produto:** mini-game educativo de Segurança do Trabalho  
**Plataforma:** navegador desktop, teclado, controle Xbox Series, HTML5 Canvas
**Título interno:** A Jornada da Proteção

---

## 1. Objetivo

Criar uma experiência curta, divertida e educativa que apresente **Normas Regulamentadoras (NRs)** e **Equipamentos de Proteção Individual (EPIs)** ao público de uma feira de Segurança do Trabalho da JAMSOFT TECNOLOGIA.

O jogador explora uma sede em pixel art, conversa com especialistas, responde desafios de múltipla escolha e vê o personagem ganhar **equipamentos visíveis** a cada acerto. Ao conquistar os 10 itens, recebe o certificado de **Guardião da Segurança do Trabalho**.

### Resultados esperados

- Ensinar, em 5 a 10 minutos, o vínculo entre 10 NRs e 10 medidas de proteção.
- Tornar o aprendizado visível: cada resposta correta muda o sprite e o ambiente.
- Ser simples o suficiente para um visitante jogar sem tutorial longo.
- Ser robusto o suficiente para rodar durante horas em um notebook de feira.

---

## 2. Público e cenário de uso

| Item | Definição |
| --- | --- |
| Público principal | Visitantes da feira, estudantes e trabalhadores, sem conhecimento prévio das NRs |
| Faixa etária | A partir de 10 anos |
| Sessão média | 5 a 10 minutos |
| Contexto | Notebook/desktop em um estande, com teclado, controle Xbox e som |
| Operação | Um visitante por vez; progresso pode ser resetado ao final |
| Idioma | Português do Brasil |

### Princípios de experiência

1. **Aprender jogando:** texto curto, pergunta clara, feedback imediato.
2. **Errar sem punição:** resposta errada mostra a correta e uma dica; o jogador tenta de novo.
3. **Recompensa visível:** o EPI aparece no personagem, no HUD e no cenário.
4. **Leitura confortável:** resolução lógica 640×480 com renderização 2x, painéis de alto contraste e tipografia nítida.
5. **Teclado ou controle:** nenhum mouse necessário; teclado e controle Xbox Series cobrem todo o fluxo.
6. **Conteúdo responsável:** resumos educativos com aviso para consultar a NR oficial e o SESMT.

---

## 3. Escopo funcional

### F1 — Menu principal

- Exibe título, subtítulo, sprite do guardião e três opções:
  - **NOVO JOGO:** inicia uma sessão limpa.
  - **CONTINUAR:** habilitado apenas quando há save; carrega progresso.
  - **COMO JOGAR:** abre um painel com missão, controles e dica.
- Navegação por setas/WASD, analógico esquerdo ou D-pad; confirmação por Espaço/Enter/Z ou A.
- Exibe indicador de save disponível e atalhos de tela cheia e som.
- Controle Xbox: A confirma, B volta, Start abre o menu de pausa, X abre o manual e Y abre o inventário.
- Identidade JAMSOFT em vermelho, preto e branco, com títulos em fonte de alta legibilidade.
- Continua funcionando sem áudio ou `localStorage`.

### F2 — Exploração

- Mapa top-down fixo de **640×480**, em uma grade de **20×15 tiles de 32 px**.
- **10 fases lineares**, cada uma com uma sala temática completa dedicada a uma NR:
  - EPI (NR-6), Produção/Máquinas (NR-12), Ruído (NR-15), Brigada (NR-23), Elétrica (NR-10), Sinalização (NR-26), Altura (NR-35), Logística (NR-11), PGR (NR-1) e Ergonomia (NR-17).
  - Cada sala tem piso próprio, props do risco, pôster com regras resumidas da NR e um especialista.
  - Cada sala tem **dois funcionários de cenário** com tarefa visual e EPIs representativos da NR, posicionados fora das áreas reservadas (pôster, porta, especialista e início do jogador).
  - A decoração inclui faixa de parede, cantos de piso, marca d'água da NR e postos de trabalho sob os funcionários.
  - A saída fica na parede direita; começa bloqueada e abre após o acerto do desafio.
- Jogador de **24×24 px**, velocidade de aproximadamente **150 px/s**.
- Movimento em 4 direções, colisão com paredes, props e limites do mapa.
- Sprite do jogador com camadas de equipamento e etiqueta “VOCÊ”.
- Atravessar a porta liberada carrega a próxima fase; na 10ª, leva ao certificado.
- HUD superior com:
  - contador de proteção `n/10` e barra de progresso;
  - nome da sala atual, NR e indicador `FASE n/10`;
  - lembretes de atalhos (`M`, `I`, `Start`, movimento).
- HUD inferior com:
  - contador de EPIs;
  - 10 slots na ordem da cabeça aos pés;
  - texto “PRÓXIMO: ...” com o primeiro item ainda bloqueado.
- O HUD inferior é ocultado durante a introdução e os diálogos.

### F3 — Personagens e diálogos

- **10 especialistas**, um por fase, cada um vinculado a uma NR e um EPI.
- Aproximação exibe prompt contextual:
  - “Conversar com ...”, se o desafio ainda não foi concluído;
  - conversa de reforço, se o EPI já foi conquistado.
- Diálogo em painel inferior com:
  - retrato procedural e placa com nome/cargo;
  - efeito de máquina de escrever;
  - avanço por confirmação;
  - indicador de página.
- Ao final do primeiro diálogo, inicia o desafio daquele especialista.

### F4 — Desafios

- Um desafio por especialista, com:
  - enunciado contextualizado;
  - quatro alternativas;
  - uma única resposta correta;
  - dica educativa;
  - explicação curta após o acerto.
- Interações:
  - `↑`/`↓`, analógico esquerdo, D-pad ou `1`–`4` selecionam;
  - Espaço/Enter/Z ou A confirmam;
  - resposta errada não encerra: mostra a correta, permite abrir a dica e voltar;
  - resposta correta exibe o EPI conquistado e a explicação;
  - confirmação final entrega o item, libera a porta e volta à exploração.
- O jogador pode errar várias vezes; as tentativas são registradas apenas para feedback visual.

### F5 — Equipamentos e progressão

- Catálogo de **10 itens**:

| Ordem | ID | Item | NR |
| --- | --- | --- | --- |
| 1 | `capacete` | Capacete de Proteção | NR-6 |
| 2 | `oculos` | Óculos de Proteção | NR-12 |
| 3 | `protetor` | Protetor Auricular | NR-15 |
| 4 | `mascara` | Máscara de Fuga | NR-23 |
| 5 | `luvas` | Luvas Isolantes | NR-10 |
| 6 | `colete` | Colete Refletivo | NR-26 |
| 7 | `cinto` | Cinto de Segurança | NR-35 |
| 8 | `botas` | Calçado de Segurança | NR-11 |
| 9 | `prancheta` | Prancheta do PGR | NR-1 |
| 10 | `cadeira` | Cadeira Ergonômica | NR-17 |

- Cada acerto:
  - desbloqueia o item no `EquipmentSystem`;
  - adiciona a camada correspondente ao sprite;
  - atualiza o HUD e o estado do NPC;
  - libera a porta de saída da fase;
  - mostra um toast;
  - salva o progresso.
- O capacete, os óculos, o protetor, a máscara, as luvas, o colete, o cinto, o calçado e a prancheta são desenhados sobre o jogador.
- A cadeira ergonômica é representada no cenário do escritório e no HUD/certificado.
- A ordem dos slots do HUD é fixa e funciona como checklist visual.

### F6 — Manual de NRs

- Aberto por `M` ou `X` durante a exploração de qualquer fase.
- **12 cartas**: as 10 NRs dos desafios + NR-5 (CIPA) e NR-7 (PCMSO) como consulta.
- Modo lista: duas páginas, 6 cartas por página, navegação por setas, analógico, D-pad e `PageUp`/`PageDown`.
- Modo detalhe: título, resumo, principais regras, vínculo com o EPI e status (`DESAFIO`, `EPI ✓`, `CONSULTA`).
- Rodapé com fonte oficial e aviso educativo.
- `Esc` ou B volta; `M` ou X fecha.

### F6.1 — Inventário e decoração

- Aberto por `I` ou `Y` durante a exploração e fechado por `I`, `Y`, `Esc` ou `Backspace`.
- Exibe quatro indicadores: tempo jogado, fase atual, fases concluídas e EPIs adquiridos.
- Lista os 10 EPIs com ícone, nome e estado; itens ainda não conquistados aparecem bloqueados.
- Oferece três itens cosméticos opcionais, sem efeito sobre a proteção ou o conteúdo educativo:
  - **Pin JAMSOFT**, disponível desde o início;
  - **Adesivo de Capacete**, liberado com o capacete;
  - **Faixa de Guardião**, liberada após cinco fases.
- `↑`/`↓` ou D-pad/analógico navegam, `Enter`/A equipa/remove a decoração selecionada e a última opção abre o Manual de NRs (`M`, `X` também abrem).
- A prévia do personagem mostra EPIs e decoração equipados.
- A decoração e o tempo jogado são persistidos no save.
- Toda a leitura usa textos, não apenas cor, para indicar estado.

### F6.2 — Menu de pausa

- Aberto por `Start` ou `Esc` durante a exploração e fechado por `Start`, `Esc` ou B.
- Reúne as opções **Continuar**, **Inventário**, **Manual de NRs**, **Como jogar** e **Menu principal**.
- Navegação por setas/WASD, analógico esquerdo ou D-pad; confirmação por A/Espaço/Enter.
- A opção **Menu principal** salva a sessão antes de voltar ao menu.
- O tempo jogado não avança enquanto o menu de pausa está aberto.
- O menu reutiliza a identidade JAMSOFT, com foco explícito e dicas de controle.

### F7 — Certificado

- Acionado ao atravessar a porta liberada da 10ª fase, após conquistar o 10º item.
- Exibe:
  - título “Certificado de Segurança do Trabalho”;
  - nome “Guardião da Segurança do Trabalho”;
  - os 10 ícones conquistados;
  - lista das NRs;
  - data e cidade;
  - assinaturas institucionais e selo SESMT;
  - confete procedural e prompt de retorno.
- Confirmação retorna ao menu e **apaga o save**, preparando o jogo para o próximo visitante.

### F8 — Save e carregamento

- Persistência em `localStorage`, chave `jamsoft_seguranca_save`.
- Conteúdo: versão, timestamp, posição do jogador, decoração equipada, EPIs, desafios concluídos, **fase atual**, tempo jogado e data legível.
- Save é criado/atualizado a cada EPI conquistado, ao atravessar uma porta e ao equipar/remover decoração.
- “CONTINUAR” restaura fase, posição, equipamentos, decoração, desafios e tempo jogado.
- Saves antigos sem fase são migrados para a primeira NR ainda pendente.
- Save com os 10 itens abre diretamente no certificado.
- Save inválido/indisponível não impede o jogo de iniciar.
- Ao concluir o certificado, o save é removido.

### F9 — Áudio

- Efeitos procedurais via WebAudio, sem arquivos externos.
- Sons para navegação, confirmação, acerto, erro, desbloqueio e conclusão.
- `V` alterna mudo; preferência persistida em `jamsoft_seguranca_mute`.
- Se o navegador bloquear áudio, o jogo continua normalmente.

### F10 — Tela cheia e apresentação

- `F` alterna tela cheia quando a API é suportada.
- A moldura CSS mantém proporção 4:3 e escala o canvas sem distorcer.
- A resolução lógica continua 640×480; o backing store do canvas usa 2x (1280×960) para textos e sprites nítidos.
- Estilo visual: pixel art SNES, moldura JAMSOFT em vermelho/preto/branco, paleta de segurança no jogo e vinheta suave. Não há scanlines sobre a HUD ou os painéis de leitura.
- Nenhum asset externo de imagem ou áudio.

### F11 — Feedback e estados de interface

- Toasts para EPI conquistado, save carregado e mudo.
- Prompt de interação contextual.
- Estados de NPC: pendente, concluído e conversa de reforço.
- Transições entre menu, exploração, diálogo, desafio e certificado.

### F12 — Controles de emergência na feira

- Recarregar a página reinicia a interface sem quebrar o save.
- Concluir o certificado apaga o save.
- O save também pode ser removido manualmente pelo console:
  ```js
  localStorage.removeItem('jamsoft_seguranca_save');
  ```

---

## 4. Conteúdo educativo

### 4.1 Cobertura

- **10 desafios** com as NRs: NR-1, NR-6, NR-10, NR-11, NR-12, NR-15, NR-17, NR-23, NR-26 e NR-35.
- **12 cartas** no manual, incluindo NR-5 e NR-7.
- Cada desafio explica o conceito e conecta a NR a uma proteção concreta.
- O conteúdo usa linguagem acessível, sem substituir o texto oficial.

### 4.2 Regras editoriais

1. Cada questão tem uma resposta correta inequívoca.
2. As alternativas erradas são plausíveis, mas não ambíguas.
3. A dica ensina o critério, não apenas elimina opções.
4. A explicação tem no máximo três linhas na tela.
5. Não usar dados de empresas reais, casos sensacionalistas ou promessas de conformidade.
6. Toda carta e tela final reforça o aviso educativo.
7. Revisão humana obrigatória antes de publicar mudanças de conteúdo.

### 4.3 Fonte e aviso

Fonte de referência exibida no manual: portal de Normas Regulamentadoras do Ministério do Trabalho e Emprego.

> Resumo educativo. Consulte a NR oficial vigente e o SESMT da empresa antes de aplicar as regras.

---

## 5. Fluxo e máquina de estados

```text
MENU
 ├── NOVO JOGO ───────────────► EXPLORE (com introdução)
 ├── CONTINUAR (save parcial) ─► EXPLORE
 ├── CONTINUAR (save completo) ► CERTIFICATE
 └── COMO JOGAR ──────────────► MENU (overlay)

EXPLORE
 ├── aproximar de NPC + confirmar ─► DIALOG
 ├── M ─────────────────────────────► EXPLORE + MANUAL
 ├── porta bloqueada ───────────────► EXPLORE (sem passagem)
 ├── porta liberada + atravessar ───► EXPLORE (próxima fase)
 └── porta da 10ª fase + atravessar ► CERTIFICATE

DIALOG
 ├── avançar ───────────────────────► DIALOG
 └── fim + desafio pendente ────────► CHALLENGE
     fim + EPI já conquistado ───────► EXPLORE

CHALLENGE
 ├── alternativa + confirmar ────────► feedback correto/errado
 ├── erro + dica ────────────────────► CHALLENGE
 └── acerto + confirmar ─────────────► EXPLORE + EPI + porta liberada

CERTIFICATE
 └── confirmar ──────────────────────► MENU (save apagado)
```

### Regras de transição

- O jogo pausa a exploração enquanto diálogo, desafio, manual ou certificado estão ativos.
- O manual pode ser aberto na exploração; não pode ser aberto durante desafio/diálogo.
- Um NPC nunca entrega o mesmo EPI duas vezes.
- A porta só permite passagem quando o EPI da fase foi conquistado.
- A porta da 10ª fase só leva ao certificado quando `equipment.isComplete()` é verdadeiro.
- O save completo sempre tem prioridade e retoma no certificado.

---

## 6. Modelo de dados

### 6.1 Equipamento

```js
{
  id: 'capacete',
  name: 'Capacete de Proteção',
  short: 'CAP',
  norm: 'NR-6',
  normTitle: 'Equipamento de Proteção Individual',
  color: '#ffc107',
  accent: '#ffe082',
  icon: 'helmet',
  description: '...',
  rule: '...'
}
```

### 6.2 Norma

```js
{
  nr: 'NR-1',
  title: 'Disposições Gerais e Gerenciamento de Riscos Ocupacionais',
  short: 'Gerenciamento de riscos',
  color: '#1565c0',
  equipmentId: 'prancheta',
  summary: '...',
  rules: ['...', '...', '...', '...']
}
```

### 6.3 NPC

```js
{
  id: 'npc_epi',
  name: 'Helena Proteção',
  role: 'Técnica de Segurança do Trabalho',
  color: '#ff6f00',
  avatar: 'HP',
  roomId: 'epi',
  norm: 'NR-6',
  equipmentId: 'capacete',
  x: 67,
  y: 51,
  interactRadius: 54,
  dialogIntro: ['...'],
  dialogRepeat: ['...']
}
```

### 6.4 Desafio

```js
{
  id: 'challenge_nr6',
  npcId: 'npc_epi',
  equipmentId: 'capacete',
  norm: 'NR-6',
  normTitle: 'Equipamento de Proteção Individual',
  roomName: 'Almoxarifado de EPI',
  question: '...',
  options: ['...', '...', '...', '...'],
  correct: 1,
  hint: '...',
  explanation: '...'
}
```

### 6.5 Fase e props

```js
{
  id: 'phase_epi',
  phase: true,
  phaseIndex: 0,
  width: 20,
  height: 15,
  tileSize: 32,
  collisionTiles: [TILE_TYPES.WALL],
  tiles: Array(300),
  roomDefs: [{
    id: 'epi',
    x: 1, y: 2, w: 18, h: 11,
    tile: TILE_TYPES.EPI_ROOM,
    name: 'Almoxarifado de EPI',
    norm: 'NR-6',
    npcId: 'npc_epi',
    color: '#ff6f00',
    label: 'NR-6 · ALMOXARIFADO'
  }],
  props: [/* pôster gerado + props temáticos */],
  workers: [{
    id: 'epi_worker_a',
    x: 120, y: 240,
    look: 'warehouse',
    equipment: ['capacete', 'luvas', 'colete'],
    tool: 'scanner',
    effect: 'scan',
    task: 'SEPARA EPI'
  }],
  playerStart: { x: 308, y: 356 },
  npcSpawn: { x: 307, y: 196 },
  exit: { x: 576, y: 192, w: 32, h: 64 }
}
```

### 6.6 Save

```js
{
  version: '3.1',
  timestamp: 0,
  saveDate: '27/10/2026, 10:00:00',
  phase: 1,
  playTime: 182.4,
  player: { x: 308, y: 356, direction: 'down', decoration: 'pin_jamsoft' },
  equipment: ['capacete'],
  completedChallenges: ['challenge_nr6']
}
```

### 6.7 Invariantes

- `equipment` contém apenas IDs válidos.
- `completedChallenges` contém apenas IDs de desafios existentes.
- Todo NPC de desafio tem exatamente um item e um desafio correspondente.
- Todo item de desafio tem uma NR no manual.
- A ordem do HUD é a ordem de `equipmentList`.
- `decoration` é `null` ou um ID válido de `decorations.js`.
- Nenhum item é entregue duas vezes.
- Salvar/carregar não pode deixar o jogador preso em parede ou estado inválido.

---

## 7. Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF1 | Rodar em navegadores desktop modernos (Chrome/Edge, Firefox e Safari) sem build. |
| RNF2 | Usar apenas HTML, CSS e JavaScript vanilla; nenhuma dependência de runtime. |
| RNF3 | Não carregar imagens, fontes ou áudios externos; toda arte é procedural. |
| RNF4 | Manter 60 fps com resolução lógica 640×480 e backing store 1280×960 em hardware de feira; quedas devem ser investigadas. |
| RNF5 | Ser totalmente jogável por teclado e por controle Xbox Series (Standard Gamepad), sem mouse. |
| RNF6 | Escalar para telas de 1280×720 ou maiores sem cortar conteúdo. |
| RNF7 | Exibir contraste legível e não depender apenas de cor para status. |
| RNF8 | Tratar falhas de `localStorage`, áudio, fullscreen e Gamepad API sem quebrar o jogo. |
| RNF9 | Persistir progresso e preferência de som entre recarregamentos. |
| RNF10 | Passar `npm test` sem erros antes de cada entrega. |
| RNF11 | Não exibir erros no console durante o fluxo completo. |
| RNF12 | Manter o conteúdo educativo alinhado às NRs e ao aviso de responsabilidade. |

---

## 8. Critérios de aceitação

| ID | Critério |
| --- | --- |
| AC1 | O menu abre com as três opções e “CONTINUAR” desabilitado sem save. |
| AC2 | “NOVO JOGO” inicia a introdução e permite explorar depois dela. |
| AC3 | O jogador se move nas quatro direções e não atravessa paredes/props. |
| AC4 | Cada uma das 10 fases carrega sua sala temática, NPC, pôster de NR, props e dois funcionários com o EPI da fase. |
| AC5 | Cada diálogo termina em um desafio com quatro alternativas. |
| AC6 | Resposta errada mostra a correta, permite dica e não entrega o EPI. |
| AC7 | Resposta correta entrega o EPI correto, atualiza o sprite, o HUD e o save. |
| AC8 | Os 10 desafios entregam exatamente os 10 EPIs previstos. |
| AC9 | O manual abre por `M`, mostra 12 cartas e detalha todas. |
| AC10 | A porta só abre após o EPI da fase; atravessá-la carrega a próxima fase, e a 10ª leva ao certificado com os 10 itens e NRs. |
| AC11 | Confirmar o certificado volta ao menu e apaga o save. |
| AC12 | Recarregar com save parcial restaura fase, progresso e posição. |
| AC13 | Recarregar com save completo abre diretamente o certificado. |
| AC14 | `V` alterna o som e persiste a preferência. |
| AC15 | `F` entra/sai de tela cheia quando suportado, sem erro fatal. |
| AC16 | O jogo não exibe erros no console no fluxo completo. |
| AC17 | `npm test` passa com todos os arquivos JS e o smoke test. |
| AC18 | O conteúdo do manual e dos desafios mantém o aviso educativo. |
| AC19 | `I` abre o inventário com tempo, progresso, EPIs, decoração e acesso ao manual; equipar/remover decoração atualiza sprite e save. |
| AC20 | O controle Xbox navega em todos os menus, diálogos, desafios e certificado com A/B, Start, D-pad e analógico esquerdo, sem mouse. |
| AC21 | `Start` abre o menu de pausa com Continuar, Inventário, Manual, Como jogar e Menu principal; B/Start fecha e a sessão é salva ao voltar ao menu principal. |

---

## 9. Fora de escopo

- Multijogador, ranking online ou backend.
- Mobile/touch como experiência principal.
- Editor de fases ou de conteúdo em tempo real.
- Voz, música licenciada ou assets externos.
- Certificação legal de conformidade com NRs.
- Login, banco de dados ou analytics.
- Acessibilidade completa para leitores de tela em todos os detalhes visuais; o canvas tem descrição e o jogo é operável por teclado.

---

## 10. Riscos e mitigação

| Risco | Impacto | Mitigação |
| --- | --- | --- |
| Visitante não entende os controles | Sessão travada | “COMO JOGAR”, introdução e prompts contextuais |
| Teclado do estande sem teclas ou layout diferente | Impossível jogar | Usar setas + WASD + Espaço; testar teclado no dia |
| Controle não detectado ou mapeamento diferente | Impossível jogar no controle | Usar cabo/USB, pressionar um botão antes de jogar, manter teclado como fallback e validar o modelo no hardware da feira |
| Navegador bloqueia áudio | Menos imersão | WebAudio com fallback silencioso; `V` visível |
| Fullscreen bloqueado | Jogo menor | Escala CSS responsiva; `F` é opcional |
| Texto pequeno no monitor | Leitura difícil | Canvas 640×480 com renderização 2x; fontes de alta legibilidade nos painéis |
| Conteúdo desatualizado | Risco educativo | Revisão humana, fonte oficial e disclaimer |
| Save de visitante anterior | Confusão | Certificado apaga save; reset documentado |
| Loop/colisão travando | Sessão perdida | Recarregar página; save persiste |
| Performance em notebook fraco | Queda de FPS | Arte simples, sem assets pesados; QA em hardware de feira |
| Mudanças de última hora quebrarem o fluxo | Demonstração falha | `npm test` + checklist de fumaça antes de abrir |

---

## 11. Definition of Done

Uma entrega só é considerada pronta quando:

1. O comportamento está descrito em SPEC/PLAN e implementado.
2. `npm test` passa.
3. O fluxo afetado foi testado no navegador, sem erros no console.
4. O visual mantém a resolução lógica 640×480, a paleta SNES/JAMSOFT e a legibilidade.
5. Nenhum asset externo foi adicionado.
6. O conteúdo educativo foi revisado e mantém o disclaimer.
7. O save/load e o reset continuam funcionando.
8. A documentação e o checklist foram atualizados.
9. O handoff registra arquivos alterados, testes e riscos.

---

## 12. Referências internas

- [README.md](README.md) — visão do produto, execução e roteiro de feira.
- [AGENTS.md](AGENTS.md) — papéis, propriedade e quality gates.
- [PLAN.md](PLAN.md) — sprints e distribuição de trabalho.
- [HARNESS_CHECKLIST.md](HARNESS_CHECKLIST.md) — checklist operacional.
- [squads/safety-squad/squad.yaml](squads/safety-squad/squad.yaml) — configuração do squad.
