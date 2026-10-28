# JAMSOFT TECNOLOGIA — Segurança em Jogo

**A Jornada da Proteção** é um mini-game educativo de **Segurança do Trabalho** criado para a feira da JAMSOFT TECNOLOGIA. Em **10 salas temáticas em pixel art estilo SNES**, você conversa com especialistas, responde desafios sobre as **Normas Regulamentadoras (NRs)** e equipa o personagem com **10 itens de proteção** até receber o certificado de **Guardião da Segurança**.

O jogo é rápido de aprender, jogável só com teclado e pensado para uma demonstração de feira: uma partida completa leva cerca de **5 a 10 minutos**.

---

## Jogue agora

Pré-requisitos: **Node.js 18+** (apenas para o servidor local). O jogo não tem dependências externas.

```bash
npm start
```

Abra **http://localhost:8000**.

> O jogo usa módulos ES (`<script type="module">`), por isso precisa ser servido por HTTP. Abrir `index.html` diretamente com `file://` não funciona na maioria dos navegadores.

Para validar o projeto:

```bash
npm test        # sintaxe de todos os JS + smoke test de dados e lógica
npm run smoke   # apenas o smoke test
```

---

## Controles

| Tecla | Ação |
| --- | --- |
| `WASD` ou setas | Mover o personagem |
| `Espaço`, `Enter` ou `Z` | Interagir, avançar diálogo e confirmar |
| `1` a `4` | Selecionar uma alternativa no desafio |
| `M` | Abrir/fechar o Manual de NRs |
| `I` | Abrir/fechar o Inventário (tempo, fases, EPIs e decoração) |
| `F` | Alternar tela cheia |
| `V` | Ligar/desligar o som |
| `Esc` | Voltar/fechar painéis |
| `↑` `↓` | Navegar no menu, no inventário e nas opções |

No manual: `←` `→` troca de NR, `Enter` abre o detalhe e `Esc` volta. No inventário: `↑` `↓` escolhe, `Enter` equipa/remove a decoração ou abre o manual.

---

## A jornada

1. **Escolha “NOVO JOGO”** no menu.
2. **Explore a sala da fase atual**, inteiramente decorada com objetos e um pôster das regras da NR.
3. **Aproxime-se do especialista** e pressione `Espaço`.
4. Leia o diálogo, **responda ao desafio** de múltipla escolha e confira a explicação.
5. Cada acerto **equipa um novo item no sprite** e **libera a porta de saída** na parede direita.
6. **Atravesse a porta** para carregar a próxima sala e a próxima NR.
7. Abra o **Inventário** (`I`) para ver tempo jogado, fases concluídas, EPIs e equipar uma decoração.
8. Consulte o **Manual de NRs** (`M`) sempre que quiser.
9. Atravesse a porta da **10ª fase** para receber o **Certificado de Segurança do Trabalho**.

Ao errar, o jogo mostra a resposta correta e uma **dica educativa**. Não há punição: o objetivo é aprender e tentar de novo.

---

## Os 10 EPIs e as NRs

| # | Item | NR | Especialista | Setor |
| --- | --- | --- | --- | --- |
| 1 | Capacete de Proteção | NR-6 | Helena Proteção | Almoxarifado de EPI |
| 2 | Óculos de Proteção | NR-12 | Caio Produção | Produção / Máquinas |
| 3 | Protetor Auricular | NR-15 | Sofia Ruído | Área de Ruído |
| 4 | Máscara de Fuga | NR-23 | Ana Fogo | Brigada de Incêndio |
| 5 | Luvas Isolantes | NR-10 | Rafael Volts | Oficina Elétrica |
| 6 | Colete Refletivo | NR-26 | Igor Visibilidade | Sinalização de Segurança |
| 7 | Cinto de Segurança | NR-35 | Marcos Altura | Trabalho em Altura |
| 8 | Calçado de Segurança | NR-11 | Bruna Logística | Logística |
| 9 | Prancheta do PGR | NR-1 | Lúcia Riscos | Sala do PGR |
| 10 | Cadeira Ergonômica | NR-17 | Davi Postura | Escritório Ergonômico |

O HUD segue a ordem “da cabeça aos pés”: capacete, óculos, protetor, máscara, luvas, colete, cinto, calçado, prancheta e cadeira.

### Manual de NRs

O manual (`M`) reúne **12 cartas**: as 10 NRs dos desafios e duas cartas extras de consulta (**NR-5** e **NR-7**). Cada carta tem resumo, principais regras, vínculo com o EPI da jornada e um aviso de que o conteúdo é educativo.

### Inventário e decoração

O inventário (`I`) funciona como uma pausa de consulta durante a exploração. Ele mostra **tempo jogado**, **fase atual**, **fases concluídas**, **EPIs adquiridos**, a lista completa dos 10 itens e uma prévia do personagem.

Também há três itens cosméticos, que não alteram a proteção nem o conteúdo educativo:

- **Pin JAMSOFT:** disponível desde o início;
- **Adesivo de Capacete:** liberado junto com o capacete da NR-6;
- **Faixa de Guardião:** liberada após cinco fases concluídas.

Use `↑`/`↓` para escolher, `Enter` para equipar/remover e a última opção para abrir o Manual de NRs. A decoração escolhida e o tempo jogado ficam no save.

---

## Destaques técnicos

- **Vanilla JavaScript + HTML5 Canvas**, sem frameworks e sem dependências.
- Resolução lógica fixa de **640×480**, com **backing store 2x (1280×960)**, escala CSS responsiva e tela cheia. O resultado são textos e sprites mais nítidos sem perder a composição 4:3.
- **Identidade JAMSOFT** no menu e na moldura: vermelho, preto e branco; painéis de leitura com alto contraste e fontes de alta legibilidade.
- **10 fases lineares**, cada uma com uma sala temática de **20×15 tiles** (640×480), especialista, pôster de regras da NR e props próprios do risco.
- **Porta de saída por fase**: bloqueada até o acerto, abre com sinalização verde e leva à próxima NR ao ser atravessada.
- **Cenários temáticos**: almoxarifado de EPI, produção/máquinas, ruído, brigada, elétrica, sinalização, altura, logística, PGR e ergonomia.
- **Arte 100% procedural**: sprites, EPIs, ícones, cenário e partículas são desenhados com retângulos/círculos no canvas. Não há PNGs externos.
- **Sprites detalhados** de jogador e especialistas em `CharacterRenderer.js`, com silhueta mais alta, sombreamento, cabelos, óculos, crachás e animação de caminhada/idle.
- **Retratos animados** em `PortraitRenderer.js`: rostos únicos por especialista, piscada periódica e boca em movimento durante a digitação do diálogo.
- **Cenário em camadas** em `EnvironmentRenderer.js`: rodapés, soleiras, luzes de teto, porta de fase, poeira ambiente e props extras por setor.
- **Camadas de equipamento** desenhadas sobre o personagem: capacete, óculos, protetor, máscara, luvas, colete, cinto, botas e prancheta; a cadeira aparece no cenário do escritório.
- **Inventário (`I`)** com tempo, progresso, EPIs, prévia do personagem, três decorações cosméticas e atalho para o manual.
- **Cache do cenário estático**: piso, paredes, luzes e rótulos são renderizados uma vez em um canvas auxiliar, mantendo a exploração fluida em 640×480.
- Loop com `requestAnimationFrame`, colisão por eixos, diálogos com efeito de máquina de escrever e transições de estado.
- **WebAudio** para efeitos sonoros procedurais, com mute persistente.
- **`localStorage`** para progresso (`jamsoft_seguranca_save`, versão **3.1**) e som (`jamsoft_seguranca_mute`). O save guarda fase, posição, EPIs, desafios, decoração e tempo jogado.
- Testes sem navegador para dados, 10 fases, save, desafios, diálogo, manual, inventário e decoração (`scripts/smoke.mjs`).

---

## Estrutura do projeto

```text
.
├── index.html                 # entrada do jogo
├── style.css                  # moldura JAMSOFT, escala e tela cheia
├── package.json
├── js/
│   ├── main.js                # bootstrap
│   ├── design-tokens/
│   │   └── snes-theme.js      # paleta, fontes e utilitários visuais
│   ├── engine/
│   │   ├── Input.js           # teclado, WASD/setas, confirmação
│   │   ├── Renderer.js        # canvas, painéis, mapa, partículas, glow
│   │   ├── Collision.js       # colisão com tiles e entidades
│   │   ├── SaveSystem.js      # save/load local
│   │   ├── Sound.js           # efeitos WebAudio
│   │   └── TextUtils.js       # quebra de texto
│   ├── data/
│   │   ├── equipment.js       # 10 EPIs e metadados
│   │   ├── norms.js           # 12 cartas de NRs
│   │   ├── npcs.js            # 10 especialistas e diálogos
│   │   ├── challenges.js      # 10 desafios
│   │   ├── decorations.js     # itens cosméticos e regras de liberação
│   │   ├── maps.js            # tipos de tile, portas e mapa de referência
│   │   ├── phaseMaps.js       # 10 fases lineares e decoração temática
│   │   └── dialogs.js         # intro, ajuda e textos gerais
│   └── game/
│       ├── Game.js            # loop, estados, HUD e integração
│       ├── State.js
│       ├── Entity.js
│       ├── CharacterRenderer.js # sprites detalhados do jogador e NPCs
│       ├── PortraitRenderer.js  # retratos animados do diálogo
│       ├── EnvironmentRenderer.js # ambientação do cenário
│       ├── Player.js
│       ├── NPC.js
│       ├── Dialog.js
│       ├── Challenge.js
│       ├── NormManual.js
│       ├── Inventory.js         # inventário, estatísticas e decoração
│       ├── EquipmentSystem.js
│       ├── EquipmentRenderer.js
│       ├── Certificate.js
│       └── Props.js
├── scripts/
│   ├── serve.mjs              # servidor local sem dependências
│   ├── check.mjs              # verificação de sintaxe
│   └── smoke.mjs              # testes de dados e lógica
├── squads/safety-squad/       # definição do squad e dos agentes
├── qa/                        # registros de QA e evidências
├── README.md
├── SPEC.md
├── AGENTS.md
├── PLAN.md
└── HARNESS_CHECKLIST.md
```

---

## Status de validação

- `npm test` verde: **32 arquivos JavaScript** + smoke test de dados, fases, lógica, inventário e decoração.
- Fluxo principal validado em **Chromium/Edge**: menu, fases lineares, diálogo, desafio, porta liberada, próxima fase, manual, save/load e certificado.
- Upgrade visual e de leitura validado em **Chromium/Edge**: menu JAMSOFT, textos nítidos em 2x, inventário, diálogo, desafio, HUD, manual e certificado; console sem erros.
- Exploração medida em **60 fps** com resolução lógica 640×480 e backing store 1280×960.
- Progressão das 10 fases, porta de saída e certificado validadas por automação de estado.
- Save **v3.1** registra fase, decoração e tempo jogado; saves antigos sem fase são migrados pela primeira NR pendente e saves sem decoração usam o pin padrão.
- **Pendente de validação manual:** tela cheia (`F`), Firefox/Safari, hardware definitivo da feira e revisão humana final das NRs.

Detalhes e limitações: [qa/2026-10-27-v1.0-smoke.md](qa/2026-10-27-v1.0-smoke.md), [qa/2026-10-28-visual-upgrade.md](qa/2026-10-28-visual-upgrade.md), [qa/2026-10-28-linear-phases.md](qa/2026-10-28-linear-phases.md) e [qa/2026-10-28-ui-inventory.md](qa/2026-10-28-ui-inventory.md).

## Harness, agentes e sprints

O projeto inclui um harness de trabalho em equipe para produzir e manter o jogo:

- **[SPEC.md](SPEC.md)** — escopo funcional, modelo de dados, requisitos não funcionais, critérios de aceitação e riscos.
- **[AGENTS.md](AGENTS.md)** — papéis, propriedade de arquivos, regras de ouro, handoffs e quality gates.
- **[PLAN.md](PLAN.md)** — 6 sprints com entregáveis, dependências e carga equilibrada entre 5 agentes.
- **[HARNESS_CHECKLIST.md](HARNESS_CHECKLIST.md)** — checklist de pré-flight, QA, conteúdo, acessibilidade e dia da feira.
- **[squads/safety-squad/squad.yaml](squads/safety-squad/squad.yaml)** — definição do squad, comandos e skills.
- **[squads/safety-squad/agents/](squads/safety-squad/agents/)** — prompts operacionais de cada agente.
- **[qa/](qa/)** — registros de validação e limitações conhecidas.

Agentes:

1. **Game Architect** — arquitetura, máquina de estados, integração e releases.
2. **Engine Developer** — loop, input, renderer, colisão, save, som e performance.
3. **NR Content Curator** — precisão das NRs, desafios, diálogos e linguagem educativa.
4. **Pixel/UX Designer** — identidade SNES, sprite, EPIs procedurais, HUD e acessibilidade.
5. **QA & Fair Tester** — testes, navegador, conteúdo, acessibilidade e operação da feira.

---

## Roteiro rápido para a feira

1. Abra o jogo em tela cheia (`F`).
2. Deixe o som ligado (`V` mostra o estado).
3. Comece um **NOVO JOGO** e leia a introdução.
4. Faça o primeiro desafio com a Helena (NR-6), mostre o capacete entrando no sprite e **atravesse a porta verde** para a fase da NR-12.
5. Abra o inventário (`I`) e mostre tempo, progresso, EPIs e a decoração equipada.
6. Abra o manual (`M`) para mostrar as cartas de NRs.
7. Se quiser demonstrar o final, jogue até a 10ª porta ou use um save preparado.
8. Ao terminar o certificado, o save é apagado automaticamente para o próximo visitante.

Para **resetar** manualmente no navegador:

```js
localStorage.removeItem('jamsoft_seguranca_save');
localStorage.removeItem('jamsoft_seguranca_mute');
```

---

## Aviso educativo

Este jogo é um **material educativo** produzido para a feira da JAMSOFT TECNOLOGIA. Os textos resumem as Normas Regulamentadoras do Ministério do Trabalho e Emprego (MTE) para fins de conscientização. Eles **não substituem** a leitura das NRs oficiais, o PGR da empresa, os procedimentos do SESMT nem a orientação de profissionais habilitados.

Em caso de dúvida sobre uma NR, consulte sempre o texto oficial vigente e a equipe de Segurança e Saúde no Trabalho.

---

## Créditos

**JAMSOFT TECNOLOGIA** — Feira de Segurança do Trabalho, Itabaiana/SE.

Arte, código, conteúdo educativo e trilha de efeitos sonoros procedurais feitos para o projeto. Nenhum asset externo de imagem ou áudio é utilizado.

**Título interno:** “A Jornada da Proteção”  
**Título de apresentação:** “Segurança em Jogo”
