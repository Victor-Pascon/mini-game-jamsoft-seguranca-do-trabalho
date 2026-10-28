# Command — Run Quality Gate

**Dono:** A5 — QA & Fair Tester  
**Aprovação de release:** A1 — Game Architect  
**Quando usar:** fim de cada sprint, antes de release e antes de abrir o estande.

---

## Objetivo

Executar o gate técnico, funcional, editorial e visual do jogo, registrando evidências e bloqueando release se houver falha S1/S2.

## Pré-condições

- Repositório atualizado.
- Node.js 18+.
- Nenhuma mudança não commitada que não faça parte do escopo.
- Acesso ao navegador definitivo da feira (ou Chromium/Edge como proxy).

## Passo 1 — Gate técnico

```bash
npm test
```

**Esperado:**

- `check` analisa todos os JS sem erro.
- `smoke` termina com “Smoke test concluído com sucesso.”
- Exit code 0.

Se falhar: registrar arquivo/linha, severidade e dono. Não prosseguir para release.

## Passo 2 — Abrir o jogo

```bash
npm start
```

Abrir `http://localhost:8000` em janela anônima.

**Esperado:** menu renderiza, sem 404/erro no console.

## Passo 3 — Fluxo de menu

- Novo Jogo inicia.
- Continuar desabilitado sem save.
- Como Jogar abre e fecha.
- Navegação por setas/WASD funciona.

## Passo 4 — Exploração

- Concluir a introdução.
- Mover com WASD e setas.
- Testar colisão em paredes, props e limites.
- Ver HUD superior/inferior.
- Aproximar de Helena e ver prompt.

## Passo 5 — Desafio

- Conversar com Helena.
- Responder errado.
- Ver resposta correta, dica e prompt.
- Voltar e acertar.
- Ver capacete no sprite, toast e HUD.
- Conferir save criado.

## Passo 6 — Manual

- Abrir com `M`.
- Navegar por 12 cartas e 2 páginas.
- Abrir detalhe de NR-1 e NR-35.
- Ver EPI/status e disclaimer.
- Fechar com `M`.
- Abrir pelo mural e fechar.

## Passo 7 — Save/load

- Recarregar com save parcial.
- CONTINUAR.
- Conferir posição, EPIs e desafios.
- Testar save inválido (opcional, em ambiente de QA):
  ```js
  localStorage.setItem('jamsoft_seguranca_save', '{invalid');
  ```
  Recarregar: o jogo deve abrir sem travar; limpar depois.

## Passo 8 — Fluxo completo

- Completar os 10 desafios.
- Conferir 10 EPIs no HUD.
- Conferir certificado.
- Confirmar e voltar ao menu.
- Conferir save apagado.
- Recarregar e conferir menu limpo.

## Passo 9 — Áudio e tela cheia

- `V`: mudo/ligado; persistir após reload.
- `F`: tela cheia; sair; sem erro.
- Se a API falhar, o jogo continua jogável.

## Passo 10 — Console, performance e acessibilidade

- Console sem erros.
- Movimento fluido.
- Manual abre/fecha repetidamente sem degradar.
- Nenhum texto essencial cortado.
- Jogo operável sem mouse.
- Contraste e status não dependem só de cor.

## Registro de resultado

```md
## QA — <data> — <sprint/versão>

**Ambiente:** navegador, versão, resolução, hardware
**npm test:** PASS/FAIL
**Smoke manual:** PASS/FAIL
**Bugs abertos:** S? — descrição — passos — dono
**Evidências:** screenshots/logs
**Riscos residuais:** ...
**Release:** APROVADO/BLOQUEADO
```

## Critérios de bloqueio

- S1/S2 aberto.
- `npm test` falhando.
- Conteúdo NR incorreto sem revisão.
- Fluxo completo impossível sem mouse.
- Save corrompendo ou travando estado.
- Console com erro que interrompe o jogo.

## Handoff

Enviar o registro para A1 e para o dono de cada bug. A5 mantém o checklist atualizado.
