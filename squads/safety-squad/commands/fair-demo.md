# Command — Fair Demo

**Dono:** A5 — QA & Fair Tester  
**Apoio:** A1 (operação) e A4 (visual)  
**Quando usar:** ensaio e operação do estande.

---

## Objetivo

Apresentar o jogo em 5 minutos, com uma narrativa simples, um momento “uau” visual e um fechamento educativo — mantendo o equipamento pronto para o próximo visitante.

## Preparação (antes de abrir)

- [ ] Notebook conectado à energia.
- [ ] Monitor configurado e limpo.
- [ ] Teclado testado: setas, WASD, Espaço, Enter, M, F, V, Esc, 1–4.
- [ ] Som no volume adequado.
- [ ] `npm start` rodando.
- [ ] Navegador em `http://localhost:8000`.
- [ ] Tela cheia (`F`).
- [ ] Save limpo.
- [ ] Roteiro e plano de incidente à mão.

Comando:

```bash
npm start
```

## Roteiro de 5 minutos

### 0:00–0:30 — Gancho

> “Você é o novo guardião da segurança da JAMSOFT. Sua missão é equipar o personagem e aprender, na prática, como as NRs protegem quem trabalha.”

Mostrar o menu e o guardião.

### 0:30–1:00 — Começar

- Escolher **NOVO JOGO**.
- Ler a introdução em voz alta, sem pressa.
- Mostrar o mapa e o HUD.

### 1:00–2:00 — Primeiro desafio

- Levar o personagem até Helena (Almoxarifado de EPI).
- Conversar.
- Responder **errado de propósito** para mostrar o feedback educativo.
- Abrir a dica.
- Voltar e acertar.
- Destacar o **capacete aparecendo no sprite**.

### 2:00–2:30 — Recompensa visível

- Mostrar o capacete no personagem.
- Mostrar o HUD 1/10 e “PRÓXIMO: Óculos de Proteção”.
- Explicar: “Cada NR vira uma proteção concreta.”

### 2:30–3:30 — Manual

- Abrir `M`.
- Mostrar as 12 cartas.
- Abrir NR-1 (PGR) e NR-35 (altura).
- Mostrar o aviso educativo.

### 3:30–4:30 — Mais um desafio

- Escolher outro especialista (ex.: Lúcia/PGR ou Rafael/NR-10).
- Conduzir a pergunta com o visitante.
- Mostrar o novo item no sprite.

### 4:30–5:00 — Fechamento

- Se houver save preparado, mostrar o certificado.
- Se não, convidar o visitante a continuar.
- Reforçar: “EPI é a última barreira; a NR oficial e o SESMT sempre devem ser consultados.”

## Perguntas para engajar

- “O que você acha que acontece se o EPI for usado de forma errada?”
- “Qual dessas proteções você já viu em um trabalho?”
- “Por que o capacete não substitui a proteção coletiva?”

## Plano de incidente

| Situação | Ação |
| --- | --- |
| Jogo travou | Recarregar; se persistir, reiniciar `npm start` |
| Save sujo | Console: `localStorage.removeItem('jamsoft_seguranca_save')`; recarregar |
| Sem áudio | Verificar volume; `V`; seguir sem som |
| Fullscreen falhou | Jogar na janela; ajustar zoom se necessário |
| Teclado falhou | Trocar teclado/porta; usar setas + Espaço |
| Servidor caiu | Reiniciar `npm start`; reabrir |
| Internet caiu | Não afeta; o jogo é local |

## Encerramento de cada sessão

- [ ] Se o visitante concluiu, confirmar o certificado (apaga o save).
- [ ] Se não concluiu, decidir: manter para retorno ou limpar.
- [ ] Voltar ao menu.
- [ ] Conferir som e tela cheia.
- [ ] Deixar o teclado limpo e o jogo pronto.

## Registro rápido

```md
## Sessão — <hora>
**Visitante:** anônimo
**Tempo:** ...
**Chegou até:** ...
**Reação/feedback:** ...
**Problema técnico:** ...
**Save limpo?** sim/não
```
