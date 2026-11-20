# Validação reproduzível

Requisitos: Node.js 22 ou superior e npm. As dependências são usadas somente no desenvolvimento.

```sh
npm ci
npx playwright install --with-deps chromium
npm test
npm run test:e2e
```

11 testes de lógica e segurança e 8 testes de navegador verificam cadastro, validação, duplicidade, exclusão, apuração, filtros, CSV, impressão, celular, teclado e isolamento. A busca estática de segredos verifica padrões conhecidos; não garante detecção universal.

Para capturas reais, execute `node tests/server.cjs` e, em outro terminal, `npm run screenshots`. São gerados dois PNGs e um PDF de verificação em `test-results/` (ignorado pelo Git). Os exemplos acompanham a data de São Paulo.

Para repetir os testes na publicação, defina `DEMO_URL` com a URL do Pages e execute `npm run test:e2e`. O teste de isolamento cria um contexto novo do Chromium, sem sessão autenticada, e verifica as requisições, os cookies e o armazenamento.

A impressão é validada pelo acionamento, pelas regras de mídia e pela geração de PDF em Chromium. A caixa de diálogo nativa depende do sistema do visitante. O CSV mantém zeros no arquivo textual; em uma planilha, importe a coluna CIA como Texto para evitar conversão automática em número.

## Publicação

Settings → Pages → Source: GitHub Actions. O provisionamento inicial foi realizado pela API oficial com `build_type=workflow`. O workflow publica somente após os testes, com uma lista explícita de arquivos estáticos, sem testes ou dependências. O token de execução precisa apenas de leitura do código, escrita em Pages e emissão de identidade para deploy.
