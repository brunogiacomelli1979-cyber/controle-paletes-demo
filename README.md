# Controle de Paletes Aeronáuticos — Demonstração

**Projeto de melhoria de processo operacional | Aplicação web | Logística aeroportuária**

A coleta da permanência de paletes era registrada manualmente e posteriormente redigitada em um sistema Microsoft Access para apuração dos períodos. Este projeto digitaliza a coleta: o operador registra uma única vez e a área administrativa passa a consultar e emitir relatórios.

## Antes e depois

| Processo anterior | Processo proposto |
| --- | --- |
| Anotação manual na operação | Lançamento diretamente em uma interface web |
| Redigitação em Microsoft Access | Registro único, sem redigitação |
| Apuração após digitar os dados | Apuração automatizada |
| Preparação manual das informações | Consulta, exportação e relatórios |

## Experimente a demonstração

Este repositório contém uma **demonstração estática independente**, com interface responsiva, lançamentos, exclusões, relatórios e exportação CSV para teste.

**Todos os paletes e códigos de companhias usados nos exemplos são fictícios.**

- Os dados ficam **somente na memória da página** e são descartados ao recarregar.
- A demonstração **não consulta nem grava** o banco de produção.
- Não são utilizados credenciais, cookies de produção, API remota ou segredos.
- A marca corporativa da implantação real não é reproduzida na demonstração pública.
- A lógica ilustrativa da demo não substitui a homologação da apuração e das regras reais.

Para usar sem hospedagem: abra `index.html` em um navegador moderno. Os arquivos `app.js` e `styles.css` devem permanecer na mesma pasta.

### Publicação do portfólio

O código de demonstração já está neste repositório público independente.

O site será disponibilizado pelo GitHub Pages após sua ativação em **Settings → Pages → Build and deployment → Source: GitHub Actions**. O workflow `Publicar demonstracao publica isolada` foi configurado para publicar somente os três arquivos da demonstração.

[Consultar publicação no GitHub Actions](https://github.com/brunogiacomelli1979-cyber/controle-paletes-demo/actions)

## O que a solução real entrega

Registro a cada 12 horas, identificação de palete e companhia aérea, bloqueio de duplicatas por turno, conferência diária, apuração da permanência, relatórios mensais por companhia, exportação e cópias de segurança. O ambiente real usa um banco de dados e acesso restrito.

**Este repositório de demonstração não exige nem fornece acesso ao ambiente real.**

## Tecnologia

HTML, CSS e JavaScript puro, sem bibliotecas externas. O modelo público não depende de hospedagem paga.

## Medição de resultados

A solução foi concebida para eliminar uma etapa de redigitação e reduzir retrabalho. **Ainda não há medição auditada** do tempo economizado, número de erros evitados ou percentual de produtividade.

---

*Projeto de portfólio — demonstração fictícia, sem exposição de operações reais.*
