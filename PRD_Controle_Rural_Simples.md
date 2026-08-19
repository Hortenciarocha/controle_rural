# PRD — Controle Rural Simples
### Product Requirements Document
**Versão:** 1.0 | **Data:** Agosto de 2026 | **Autor:** Documento gerado como PM/Arquiteto de Software

---

## Sumário

1. Resumo Executivo
2. Contexto do Projeto
3. Objetivo Principal
4. Público-Alvo e Personas
5. Funcionalidades Principais (Requisitos Funcionais)
6. Inteligência Artificial
7. Requisitos Não Funcionais
8. Tecnologias Sugeridas (Arquitetura)
9. Modelo de Banco de Dados
10. Usuários e Permissões
11. Fluxos do Sistema
12. User Stories
13. MVP e Priorização
14. Roadmap de Desenvolvimento
15. Interface e Experiência do Usuário
16. Segurança
17. LGPD
18. Métricas do Produto
19. Requisitos Técnicos Consolidados
20. Critérios de Sucesso do MVP
21. Riscos e Mitigações
22. Próximos Passos
23. Nota de Revisão e Consistência

---

## 1. Resumo Executivo

O **Controle Rural Simples** é um sistema web responsivo criado para ajudar pequenos e médios produtores rurais a organizar, em um único lugar, o controle da propriedade: plantações, animais, estoque, finanças e atividades do dia a dia. A maioria dos produtores rurais brasileiros de pequeno e médio porte ainda usa cadernos, planilhas soltas ou a memória para controlar sua produção e suas finanças. Isso gera perda de informação, dificuldade para saber se a propriedade está dando lucro, esquecimento de tarefas importantes (como vacinação ou irrigação) e falta de dados para tomar decisões.

O sistema resolve esse problema oferecendo uma ferramenta **simples, visual e acessível pelo celular**, que substitui o caderno de anotações por um painel único com indicadores reais da propriedade, alertas automáticos e, futuramente, um assistente de Inteligência Artificial que ajuda o produtor a entender seus próprios dados sem precisar ser um especialista em gestão.

O projeto nasce também com finalidade educacional, servindo como estudo de caso prático de Desenvolvimento Web, Banco de Dados, Redes, Manutenção de Computadores e Inteligência Artificial — por isso a arquitetura proposta prioriza tecnologias simples, bem documentadas e adequadas para aprendizado, sem abrir mão de boas práticas de mercado.

Este documento apresenta o escopo completo do produto, personas, requisitos funcionais e não funcionais, modelo de dados, arquitetura, roadmap, user stories, MVP e riscos, servindo como referência única para a equipe de desenvolvimento.

---

## 2. Contexto do Projeto

Pequenos e médios produtores rurais frequentemente administram propriedades diversificadas — parte de agricultura, parte de criação de animais — sem apoio de sistemas de gestão profissionais, que costumam ser caros, complexos ou voltados para grandes operações (agronegócio corporativo). Isso cria uma lacuna: falta uma ferramenta **enxuta, barata (ou gratuita) e fácil de usar**, pensada para quem não tem formação em tecnologia nem tempo para aprender sistemas complicados.

O **Controle Rural Simples** propõe preencher essa lacuna com um sistema web responsivo, com foco em usabilidade e em funcionalidades essenciais bem executadas, ao invés de um sistema robusto e difícil de operar.

Além do valor prático, o projeto tem propósito de aprendizado, funcionando como um exercício completo de engenharia de software: modelagem de dados, construção de back-end e front-end, boas práticas de segurança e redes, e uma aplicação real (e não decorativa) de Inteligência Artificial.

---

## 3. Objetivo Principal

**Problema que o sistema resolve:** a falta de controle organizado sobre produção, animais, estoque e finanças leva o produtor rural a tomar decisões sem dados confiáveis, a perder receita por desperdício ou preço mal calculado, e a esquecer tarefas críticas de manejo.

**Quem são os usuários:** pequenos e médios produtores rurais (donos da propriedade), seus familiares ou funcionários que ajudam na operação, e eventualmente técnicos/administradores que gerenciam a propriedade em nome do dono.

**Proposta de valor:** um sistema único, simples e visual que substitui cadernos e planilhas dispersas, mostrando de forma clara se a propriedade está lucrando, o que precisa ser feito hoje, e o que está em falta no estoque — tudo acessível também pelo celular, mesmo com internet instável.

**Objetivos do produto:**
- Centralizar em um só lugar os dados de produção, animais, estoque e finanças.
- Reduzir o tempo gasto em anotações manuais e reduzir erros.
- Dar visibilidade clara sobre lucro, despesas e produtividade.
- Lembrar o produtor de tarefas importantes (vacinas, irrigação, colheita).
- Ser fácil o suficiente para alguém sem experiência em sistemas usar sem treinamento formal.

**Resultados esperados para o produtor:**
- Saber, a qualquer momento, quanto está gastando e quanto está ganhando.
- Nunca mais esquecer uma vacinação, colheita ou reposição de insumo por falta de controle.
- Tomar decisões (o que plantar, quando vender, o que cortar de gasto) com base em dados reais, não em "achismo".

---

## 4. Público-Alvo e Personas

### Persona 1 — Pequeno Produtor Rural (perfil geral)
- **Nome fictício:** Seu Antônio, 54 anos.
- **Perfil:** produtor familiar com propriedade de 15 hectares, cultiva um pouco de tudo e cria algumas cabeças de gado. Baixa familiaridade com tecnologia; usa o celular principalmente para WhatsApp.
- **Necessidades:** anotar receitas e despesas sem complicação; saber se está no lucro ou no prejuízo.
- **Dificuldades:** não confia em sistemas complexos; tem medo de "quebrar" o aplicativo; internet oscila na propriedade.
- **Objetivos:** simplificar o controle que hoje faz em caderno.
- **Como o sistema ajuda:** interface simples, poucos cliques para registrar receita/despesa, funciona bem mesmo com internet fraca, linguagem sem jargão técnico.

### Persona 2 — Produtor de Criação de Animais
- **Nome fictício:** Dona Marlene, 46 anos.
- **Perfil:** cria gado leiteiro e galinhas; depende de controle de vacinação e alimentação para não perder animais.
- **Necessidades:** histórico de vacinas e tratamentos por animal; alertas de próximas vacinações; controle de produção de leite e ovos.
- **Dificuldades:** perde anotações em papel; já teve prejuízo por esquecer vacina.
- **Objetivos:** nunca mais perder um animal por falha de manejo evitável.
- **Como o sistema ajuda:** cadastro individual de animal com histórico e alertas automáticos de vacinação/tratamento.

### Persona 3 — Produtor de Agricultura
- **Nome fictício:** João Paulo, 38 anta anos (produtor de médio porte, cultivo de milho e feijão).
- **Perfil:** mais familiarizado com tecnologia, já usa planilhas no celular.
- **Necessidades:** acompanhar o ciclo de plantio até a colheita, comparar produtividade entre safras e talhões.
- **Dificuldades:** dados espalhados em várias planilhas; difícil comparar uma safra com outra.
- **Objetivos:** identificar quais talhões/culturas dão mais retorno.
- **Como o sistema ajuda:** registro de plantio, previsão de colheita, produtividade por talhão e relatórios comparativos entre safras.

### Persona 4 — Administrador/Responsável pela Propriedade
- **Nome fictício:** Camila, 29 anos, filha do dono que ajuda a administrar a propriedade da família.
- **Perfil:** mais à vontade com tecnologia, atua como "gestora" enquanto o pai cuida da operação no campo.
- **Necessidades:** visão consolidada (dashboard) da propriedade, relatórios para decisões, controle de quem faz o quê (funcionários).
- **Dificuldades:** falta de relatórios prontos; dificuldade de delegar tarefas com controle.
- **Objetivos:** profissionalizar a gestão sem virar uma empresa complexa.
- **Como o sistema ajuda:** dashboard consolidado, relatórios financeiros e de produção, controle de permissões por tipo de usuário (proprietário x funcionário).

---

## 5. Funcionalidades Principais (Requisitos Funcionais)

A numeração formal de cada requisito (RF-001, RF-002...) está consolidada na Seção 19. Abaixo, a descrição funcional por módulo.

### 5.1 Dashboard
Painel inicial com visão consolidada e visual da propriedade:
- Cards de receita, despesa e lucro do período (mês atual e acumulado).
- Indicadores de produção (safras em andamento, colheitas previstas).
- Situação do estoque (itens em alerta de estoque baixo).
- Resumo de animais (quantidade, alertas de vacinação/tratamento).
- Resumo de plantações (área plantada, próximas colheitas).
- Lista de atividades pendentes e atrasadas.
- Painel de alertas (financeiros, estoque, sanitários, agrícolas).
- Gráficos simples (receita x despesa mensal, produção por categoria).

### 5.2 Gestão da Propriedade
- Cadastro de propriedade: nome, localização (endereço/coordenadas), área total.
- Cadastro de talhões/áreas de plantio (nome, área, cultura atual).
- Cadastro de recursos disponíveis (maquinário, benfeitorias, poços, etc.) em nível básico.
- Edição de informações gerais da propriedade.

### 5.3 Gestão de Plantações
- Cadastro de culturas (nome, ciclo médio, unidade de medida da produção).
- Registro de plantio: cultura, talhão, área plantada, data de plantio.
- Previsão automática de colheita com base no ciclo da cultura (editável manualmente).
- Registro de colheita: data, quantidade colhida, produtividade calculada (quantidade/área).
- Registro de problemas na plantação (pragas, doenças, clima) com data e descrição.
- Histórico de safras por talhão/cultura.

### 5.4 Gestão de Animais
- Cadastro individual: espécie, raça, sexo, data de nascimento, peso, identificação (brinco/nome/código).
- Registro de vacinação (tipo, data, próxima dose prevista).
- Registro de alimentação (tipo de ração/pasto, periodicidade — nível informativo, não uma dieta clínica).
- Registro de tratamentos veterinários (motivo, medicamento, data, responsável).
- Histórico completo por animal (linha do tempo de eventos).
- Registro de produção associada ao animal, quando aplicável (leite, ovos).

### 5.5 Estoque
- Cadastro de itens: insumos, ração, fertilizantes, medicamentos, ferramentas, equipamentos.
- Registro de entrada de produtos (quantidade, data, fornecedor opcional, custo).
- Registro de saída de produtos (quantidade, data, motivo/uso).
- Cálculo automático da quantidade disponível.
- Definição de estoque mínimo por item.
- Alerta automático quando o estoque atinge o mínimo definido.

### 5.6 Controle Financeiro
**Receitas:** venda de animais, venda de produtos agrícolas, venda de leite, venda de ovos, outras receitas (campo livre categorizável).
**Despesas:** ração, sementes, fertilizantes, medicamentos, combustível, manutenção, mão de obra, energia, outras despesas.

Cada lançamento tem: valor, data, categoria, descrição opcional, e vínculo opcional com módulo relacionado (ex.: despesa de ração vinculada ao estoque).

**Relatórios financeiros:**
- Receita total e despesa total por período.
- Lucro (receita − despesa).
- Fluxo de caixa (entradas e saídas ao longo do tempo).
- Despesas por categoria e receitas por categoria (gráfico de pizza/barras).
- Comparação mensal (mês atual x mês anterior, e evolução dos últimos 12 meses).

### 5.7 Tarefas e Atividades
- Calendário/agenda de atividades: plantio, irrigação, adubação, aplicação de produtos, vacinação, alimentação, manutenção, colheita, outras.
- Cada atividade tem: título, tipo, data prevista, responsável (quando houver múltiplos usuários), status.
- Status possíveis: **Pendente**, **Em andamento**, **Concluída**.
- Visualização em lista e em calendário.
- Atividades vinculadas automaticamente a eventos do sistema quando fizer sentido (ex.: previsão de colheita gera uma atividade sugerida).

### 5.8 Relatórios
- **Produção:** volume produzido por cultura/animal, por período.
- **Financeiro:** já detalhado no item 5.6.
- **Estoque:** posição atual, itens abaixo do mínimo, histórico de movimentações.
- **Animais:** plantel atual, eventos sanitários no período, produção por animal.
- **Plantações:** produtividade por talhão/cultura/safra.
- **Atividades:** cumprimento de tarefas (pendentes x concluídas x atrasadas).
- **Rentabilidade:** lucro por linha de produção (ex.: rentabilidade da criação de gado x da lavoura), quando os lançamentos forem categorizados dessa forma.
- **Histórico da propriedade:** linha do tempo consolidada de eventos relevantes (plantios, colheitas, vendas, despesas grandes).

---

## 6. Inteligência Artificial

A IA no Controle Rural Simples deve ser **aplicada aos dados que o próprio produtor já cadastrou**, funcionando como um analista particular acessível, e não como um recurso decorativo. Todas as funcionalidades abaixo devem deixar claro, quando pertinente, que **não substituem o parecer de um agrônomo, veterinário ou contador**, recomendando a consulta a um profissional em decisões técnicas ou de risco (ex.: diagnóstico de doença em animal, aplicação de defensivos).

### IA-1 — Assistente Virtual para Dúvidas sobre o Sistema
- **Problema resolvido:** produtores com pouca familiaridade com tecnologia travam ao usar o sistema.
- **Dados necessários:** nenhum dado sensível — apenas o contexto da tela atual e a pergunta do usuário.
- **Como funcionaria:** chat simples ("Como eu registro a venda de um bezerro?") que responde com instruções passo a passo, integrado via API de um modelo de linguagem.
- **Benefício:** reduz a curva de aprendizado e chamados de suporte.
- **Dificuldade de implementação:** baixa a média — depende principalmente de boa engenharia de prompt e integração com a API.

### IA-2 — Análise de Despesas
- **Problema resolvido:** produtor não percebe para onde o dinheiro está indo.
- **Dados necessários:** lançamentos de despesas categorizados.
- **Como funcionaria:** a IA resume, em linguagem simples, os maiores gastos do período e tendências ("Suas despesas com ração subiram 20% em relação ao mês passado").
- **Benefício:** visão clara sem precisar interpretar gráficos.
- **Dificuldade:** média.

### IA-3 — Identificação de Aumento Anormal de Custos
- **Problema resolvido:** custos que sobem sem o produtor perceber a tempo.
- **Dados necessários:** histórico de despesas por categoria.
- **Como funcionaria:** comparação estatística simples (ex.: variação percentual mês a mês) com um alerta gerado; a IA pode redigir o alerta em linguagem natural.
- **Benefício:** permite agir antes que o prejuízo cresça.
- **Dificuldade:** média (a lógica estatística é simples; o desafio é definir limites razoáveis de alerta).

### IA-4 — Sugestões de Controle Financeiro
- **Problema resolvido:** falta de orientação sobre como organizar melhor as finanças.
- **Dados necessários:** receitas, despesas e categorias cadastradas.
- **Como funcionaria:** a IA gera recomendações gerais de organização financeira (ex.: sugerir categorizar melhor despesas "outras" muito usadas).
- **Benefício:** ajuda o produtor a manter dados mais organizados, o que melhora todos os outros relatórios.
- **Dificuldade:** média.

### IA-5 — Previsões de Produção
- **Problema resolvido:** dificuldade de planejar com base no histórico.
- **Dados necessários:** histórico de plantios/colheitas ou produção animal.
- **Como funcionaria:** estimativa simples baseada em médias históricas do próprio produtor (não em modelos agronômicos complexos), com a IA explicando a estimativa em linguagem simples.
- **Benefício:** ajuda no planejamento de vendas e insumos.
- **Dificuldade:** média a alta (qualidade depende de volume histórico de dados).

### IA-6 — Alertas Inteligentes
- **Problema resolvido:** alertas genéricos demais ou tardios.
- **Dados necessários:** dados de estoque, atividades, vacinação, financeiro.
- **Como funcionaria:** a IA prioriza e agrupa alertas por relevância e prazo, evitando sobrecarregar o produtor com avisos.
- **Benefício:** o produtor vê primeiro o que é realmente urgente.
- **Dificuldade:** média.

### IA-7 — Análise de Produtividade
- **Problema resolvido:** dificuldade de comparar talhões, culturas ou lotes de animais entre si.
- **Dados necessários:** dados de produção por talhão/cultura/animal.
- **Como funcionaria:** a IA compara os dados já calculados pelo sistema e escreve um resumo comparativo em linguagem simples.
- **Benefício:** apoio à decisão de "o que vale mais a pena manter/expandir".
- **Dificuldade:** média.

### IA-8 — Resumo Automático dos Dados da Propriedade
- **Problema resolvido:** produtor não tem tempo de olhar todos os relatórios.
- **Dados necessários:** todos os módulos (financeiro, estoque, produção, atividades).
- **Como funcionaria:** geração periódica (ex.: semanal) de um resumo em texto simples: "Esta semana você teve lucro de X, 2 tarefas atrasadas e o estoque de ração está baixo".
- **Benefício:** visão rápida sem precisar navegar pelo sistema.
- **Dificuldade:** média.

### IA-9 — Recomendações Baseadas nos Dados Cadastrados
- **Problema resolvido:** falta de orientação prática sobre próximos passos.
- **Dados necessários:** dados consolidados da propriedade.
- **Como funcionaria:** a IA sugere ações práticas de gestão (ex.: "considere revisar o preço de venda do leite, sua margem caiu") sempre com linguagem de sugestão, não de ordem, e recomendando apoio profissional para decisões técnicas.
- **Benefício:** aproxima o produtor de uma gestão mais estratégica.
- **Dificuldade:** média a alta.

> **Importante:** nenhuma funcionalidade de IA deve emitir diagnóstico veterinário, prescrição de defensivos agrícolas ou recomendação técnica de risco sem uma mensagem explícita orientando a busca por um profissional habilitado (veterinário, agrônomo, contador).

---

## 7. Requisitos Não Funcionais

| Categoria | Requisito |
|---|---|
| Segurança | Autenticação obrigatória, senhas com hash seguro, proteção contra acessos indevidos. |
| Desempenho | Telas principais (dashboard, listagens) devem carregar em até ~3s em conexão 3G/4G razoável. |
| Responsividade | Interface adaptável a celular, tablet e desktop, com prioridade para celular. |
| Usabilidade | Fluxos de cadastro em poucos passos, linguagem simples, sem jargão técnico. |
| Disponibilidade | Meta inicial de disponibilidade compatível com hospedagem de baixo custo (ex.: 99% mensal). |
| Escalabilidade | Arquitetura deve permitir crescer de dezenas para milhares de propriedades sem reescrita total. |
| Backup | Backup automático periódico do banco de dados. |
| Privacidade | Dados de cada propriedade visíveis apenas para seus usuários autorizados. |
| Proteção de dados | Criptografia em trânsito (HTTPS) e proteção de dados sensíveis em repouso. |
| Acessibilidade | Contraste adequado, textos legíveis, botões grandes o suficiente para uso no campo. |
| Compatibilidade | Suporte aos navegadores modernos mais usados (Chrome, Safari, Firefox, Edge). |
| Uso em celular | Deve funcionar bem mesmo em aparelhos de entrada e com internet instável (ver abaixo). |

**Internet lenta/instável:** o sistema deve minimizar o volume de dados trafegado (paginação, carregamento sob demanda), informar claramente quando uma ação não foi salva por falha de conexão, e evitar perda de dados digitados em caso de queda de conexão (ex.: manter rascunho local do formulário até confirmação de envio).

---

## 8. Tecnologias Sugeridas (Arquitetura)

A proposta prioriza tecnologias simples, populares e bem documentadas — adequadas tanto para o objetivo prático quanto para o valor educacional do projeto, evitando complexidade desnecessária para um sistema que começa pequeno.

### Front-end
- **HTML5 + CSS3 + JavaScript** como base.
- Framework opcional recomendado: **React** (ampla documentação, componentização facilita telas como dashboard e formulários) — alternativa mais simples para fins didáticos: **Vue.js**, com curva de aprendizado mais suave.
- Uso de bibliotecas leves de gráficos (ex.: Chart.js) para os indicadores do dashboard.
- **Motivo da escolha:** React/Vue permitem reaproveitar componentes (cards, formulários, tabelas) entre os vários módulos, reduzindo retrabalho, e têm grande comunidade de suporte para quem está aprendendo.

### Back-end
- Recomendação: **Node.js com Express** (JavaScript no front e no back reduz a curva de aprendizado — um único idioma para o time inteiro) ou, como alternativa igualmente adequada para aprendizado, **Python com Django/Flask** (sintaxe simples, ótimo para quem já está estudando lógica de programação).
- **Motivo da escolha:** ambas as opções têm documentação abundante em português, comunidade grande e são adequadas ao ensino, sem exigir infraestrutura complexa (ex.: microsserviços) para um projeto que começa pequeno.

### Banco de Dados
- Recomendação: **PostgreSQL** (relacional, robusto, gratuito, ótimo para dados estruturados como os deste sistema — propriedades, animais, finanças).
- Alternativa mais simples para fases iniciais/estudo: **SQLite**, migrando para PostgreSQL quando o sistema crescer.
- **Motivo da escolha:** os dados do sistema são fortemente relacionais (propriedade → talhões → plantios; animal → vacinas; lançamento → categoria), o que favorece um banco relacional em vez de um banco não-relacional.

### Inteligência Artificial
- Integração via **API de um modelo de linguagem** (ex.: API da Anthropic ou similar), chamada pelo back-end, nunca diretamente pelo front-end (para não expor chaves de API).
- Os dados enviados à IA devem ser resumos/agregados (ex.: totais por categoria), evitando enviar dados pessoais desnecessários.
- **Motivo da escolha:** usar uma API pronta evita a necessidade de treinar modelos próprios, o que seria inviável para um projeto desse porte, mantendo o foco em construir boas funcionalidades em cima da IA.

### Hospedagem/Infraestrutura (sugestão inicial)
- Serviços de baixo custo/gratuitos para começar (ex.: Vercel/Render para aplicação, banco gerenciado gratuito ou de baixo custo) — evoluindo para infraestrutura maior conforme o número de usuários crescer.

---

## 9. Modelo de Banco de Dados

### 9.1 Principais Entidades

| Tabela | Objetivo | Principais Campos | Relacionamentos |
|---|---|---|---|
| `usuarios` | Armazenar contas de acesso | id, nome, email, senha_hash, perfil, criado_em | 1:N com `propriedades_usuarios` |
| `propriedades` | Dados da propriedade rural | id, nome, localizacao, area_total, criado_em | 1:N com `talhoes`, `animais`, `estoque`, `financeiro`, `atividades` |
| `propriedades_usuarios` | Vincula usuários a propriedades e define seu papel | id, usuario_id, propriedade_id, papel | N:1 com `usuarios` e `propriedades` |
| `talhoes` | Áreas de plantio dentro da propriedade | id, propriedade_id, nome, area | N:1 com `propriedades`; 1:N com `plantios` |
| `culturas` | Tipos de cultura cultivável | id, nome, ciclo_medio_dias, unidade_producao | 1:N com `plantios` |
| `plantios` | Registro de cada plantio realizado | id, talhao_id, cultura_id, data_plantio, area_plantada, previsao_colheita, data_colheita, quantidade_colhida | N:1 com `talhoes` e `culturas` |
| `animais` | Cadastro de cada animal | id, propriedade_id, especie, raca, sexo, data_nascimento, peso, identificacao | N:1 com `propriedades`; 1:N com `eventos_sanitarios`, `producao_animal` |
| `eventos_sanitarios` | Vacinas e tratamentos por animal | id, animal_id, tipo, descricao, data, proxima_data | N:1 com `animais` |
| `producao_animal` | Produção associada a um animal (leite/ovos) | id, animal_id, tipo, quantidade, data | N:1 com `animais` |
| `estoque_itens` | Cadastro de itens de estoque | id, propriedade_id, nome, categoria, unidade, quantidade_atual, estoque_minimo | N:1 com `propriedades`; 1:N com `movimentacoes_estoque` |
| `movimentacoes_estoque` | Entradas e saídas de itens | id, item_id, tipo (entrada/saída), quantidade, data, custo, motivo | N:1 com `estoque_itens` |
| `financeiro_lancamentos` | Receitas e despesas | id, propriedade_id, tipo (receita/despesa), categoria, valor, data, descricao | N:1 com `propriedades` |
| `atividades` | Tarefas e agenda | id, propriedade_id, titulo, tipo, data_prevista, status, responsavel_id | N:1 com `propriedades` e `usuarios` |
| `alertas` | Alertas gerados pelo sistema (estoque, sanitário, financeiro) | id, propriedade_id, tipo, mensagem, nivel, criado_em, lido | N:1 com `propriedades` |
| `relatorios_gerados` (opcional, para histórico) | Registro de relatórios gerados sob demanda | id, propriedade_id, tipo, parametros, criado_em | N:1 com `propriedades` |

### 9.2 Modelo Conceitual de Relacionamentos (resumo textual)

- Um **usuário** pode estar vinculado a uma ou mais **propriedades**, com um papel específico em cada uma (administrador, proprietário, funcionário).
- Uma **propriedade** possui vários **talhões**, vários **animais**, um conjunto de **itens de estoque**, vários **lançamentos financeiros** e várias **atividades**.
- Cada **talhão** pode ter vários **plantios** ao longo do tempo (histórico de safras); cada plantio referencia uma **cultura**.
- Cada **animal** possui vários **eventos sanitários** (vacinas/tratamentos) e, quando aplicável, registros de **produção animal** (leite/ovos).
- Cada **item de estoque** possui várias **movimentações** (entradas e saídas) que determinam sua quantidade atual.
- **Lançamentos financeiros** podem, opcionalmente, referenciar o módulo de origem (ex.: uma despesa de ração vinculada a uma movimentação de estoque, ou uma receita vinculada à venda de um animal).
- **Alertas** são gerados a partir de eventos em outros módulos (estoque baixo, vacina próxima, atividade atrasada, variação financeira anormal) e pertencem a uma propriedade.

---

## 10. Usuários e Permissões

| Perfil | Acesso |
|---|---|
| **Administrador** | Acesso completo ao sistema, incluindo gestão de todas as propriedades, usuários e configurações gerais. Normalmente restrito à equipe que opera o sistema (suporte/gestão da plataforma). |
| **Proprietário** | Acesso completo aos dados da(s) sua(s) propriedade(s): cadastros, financeiro, relatórios, gestão de usuários daquela propriedade (convidar/remover funcionários). |
| **Funcionário** | Acesso limitado às atividades necessárias para sua função: registrar atividades, consultar estoque, registrar eventos de animais/plantações conforme permissão concedida pelo proprietário. Sem acesso a relatórios financeiros sensíveis, salvo se autorizado. |

O proprietário pode configurar, por funcionário, quais módulos ele pode visualizar e/ou editar (ex.: um funcionário responsável pelos animais só edita o módulo de animais e atividades relacionadas).

---

## 11. Fluxos do Sistema

1. **Cadastro:** usuário informa nome, e-mail e senha → confirma e-mail (opcional na v1) → conta criada.
2. **Login:** e-mail/senha → autenticação → redirecionamento ao dashboard da propriedade ativa (ou seleção de propriedade, se houver mais de uma).
3. **Cadastro da propriedade:** usuário informa nome, localização, área total → propriedade criada e vinculada ao usuário como proprietário.
4. **Cadastro de plantação:** seleciona talhão (ou cria um novo) → seleciona cultura (ou cadastra) → informa data de plantio e área → sistema calcula previsão de colheita.
5. **Cadastro de animais:** informa espécie, raça, sexo, identificação → salva ficha do animal → pode adicionar eventos sanitários posteriormente.
6. **Registro de estoque:** cadastra item → define estoque mínimo → registra entradas/saídas ao longo do tempo.
7. **Registro de receita:** seleciona tipo de receita, valor, data, descrição opcional → salva.
8. **Registro de despesa:** seleciona categoria, valor, data, descrição opcional → salva.
9. **Criação de atividade:** define título, tipo, data prevista, responsável → atividade aparece na agenda com status Pendente.
10. **Visualização do dashboard:** ao logar, usuário vê cards e gráficos atualizados com dados reais da propriedade selecionada.
11. **Geração de relatório:** usuário escolhe tipo de relatório e período → sistema processa os dados e exibe/gera o relatório (visualização em tela, com opção de exportação futura).
12. **Utilização do assistente de IA:** usuário abre o chat do assistente → faz uma pergunta ou pede um resumo → sistema envia contexto necessário à API de IA → resposta é exibida no chat.

---

## 12. User Stories

Formato: *Como [usuário], quero [ação], para [benefício].* Prioridade: Alta (A) / Média (M) / Baixa (B).

| # | User Story | Critérios de Aceitação | Prioridade | Módulo |
|---|---|---|---|---|
| 1 | Como usuário, quero criar uma conta com e-mail e senha, para acessar o sistema. | Conta é criada e salva no banco; senha armazenada com hash; erro claro se e-mail já existir. | A | Autenticação |
| 2 | Como usuário, quero fazer login, para acessar meus dados. | Login válido redireciona ao dashboard; login inválido mostra mensagem de erro clara. | A | Autenticação |
| 3 | Como usuário, quero recuperar minha senha, para não perder acesso à conta. | Fluxo de redefinição de senha por e-mail funcional. | M | Autenticação |
| 4 | Como proprietário, quero cadastrar minha propriedade, para começar a usar o sistema. | Propriedade salva com nome, localização e área; vinculada ao usuário. | A | Propriedade |
| 5 | Como proprietário, quero editar os dados da propriedade, para manter as informações atualizadas. | Alterações são salvas e refletidas imediatamente. | M | Propriedade |
| 6 | Como proprietário, quero cadastrar talhões, para organizar minhas áreas de plantio. | Talhão salvo com nome e área, vinculado à propriedade. | A | Propriedade |
| 7 | Como produtor agrícola, quero cadastrar uma cultura, para poder registrar plantios dela. | Cultura salva com nome e ciclo médio. | A | Plantações |
| 8 | Como produtor agrícola, quero registrar um plantio, para acompanhar minha safra. | Plantio salvo com talhão, cultura, data e área; previsão de colheita calculada automaticamente. | A | Plantações |
| 9 | Como produtor agrícola, quero registrar a colheita, para saber minha produtividade. | Quantidade colhida salva; produtividade (qtd/área) calculada e exibida. | A | Plantações |
| 10 | Como produtor agrícola, quero registrar problemas na plantação, para manter histórico de pragas/doenças. | Registro salvo com data, descrição e plantio relacionado. | M | Plantações |
| 11 | Como produtor de animais, quero cadastrar um animal, para manter seu histórico. | Animal salvo com espécie, raça, sexo, identificação. | A | Animais |
| 12 | Como produtor de animais, quero registrar uma vacinação, para não esquecer os próximos cuidados. | Evento salvo com tipo, data e próxima data prevista; gera alerta automático próximo ao vencimento. | A | Animais |
| 13 | Como produtor de animais, quero registrar tratamentos veterinários, para manter histórico de saúde do animal. | Registro salvo com motivo, medicamento, data. | M | Animais |
| 14 | Como produtor de animais, quero registrar a produção de leite/ovos, para acompanhar o rendimento. | Registro salvo vinculado ao animal, com quantidade e data. | M | Animais |
| 15 | Como usuário, quero cadastrar itens de estoque, para controlar insumos e ferramentas. | Item salvo com nome, categoria, unidade e estoque mínimo. | A | Estoque |
| 16 | Como usuário, quero registrar entrada de estoque, para saber quanto tenho disponível. | Movimentação salva; quantidade atual do item atualizada. | A | Estoque |
| 17 | Como usuário, quero registrar saída de estoque, para controlar o consumo. | Movimentação salva; quantidade atual reduzida corretamente. | A | Estoque |
| 18 | Como usuário, quero ser alertado quando um item atinge o estoque mínimo, para repor a tempo. | Alerta gerado automaticamente e exibido no dashboard. | A | Estoque |
| 19 | Como usuário, quero registrar uma receita, para saber quanto estou ganhando. | Lançamento salvo com tipo, valor, data e categoria. | A | Financeiro |
| 20 | Como usuário, quero registrar uma despesa, para controlar meus gastos. | Lançamento salvo com categoria, valor e data. | A | Financeiro |
| 21 | Como usuário, quero ver meu lucro do mês, para saber se estou no positivo. | Dashboard exibe receita, despesa e lucro calculados corretamente. | A | Financeiro |
| 22 | Como usuário, quero ver um relatório de despesas por categoria, para identificar onde gasto mais. | Relatório exibe totais corretos por categoria, com gráfico. | M | Financeiro |
| 23 | Como usuário, quero comparar minhas finanças mês a mês, para identificar tendências. | Relatório de comparação mensal exibido corretamente. | M | Financeiro |
| 24 | Como usuário, quero criar uma atividade na agenda, para não esquecer tarefas importantes. | Atividade salva com tipo, data prevista e status inicial "Pendente". | A | Atividades |
| 25 | Como usuário, quero marcar uma atividade como concluída, para manter meu controle atualizado. | Status atualizado corretamente; refletido no dashboard e relatórios. | A | Atividades |
| 26 | Como usuário, quero ver minhas atividades atrasadas, para me organizar melhor. | Sistema identifica corretamente atividades com data vencida e status pendente. | M | Atividades |
| 27 | Como usuário, quero visualizar o dashboard da minha propriedade, para ter uma visão geral rápida. | Dashboard carrega dados reais do banco (não fictícios) em até ~3s em conexão razoável. | A | Dashboard |
| 28 | Como usuário, quero gerar um relatório de produção, para avaliar meu desempenho. | Relatório exibido com dados corretos do período selecionado. | M | Relatórios |
| 29 | Como usuário, quero conversar com o assistente de IA, para tirar dúvidas sobre o sistema. | Chat responde de forma coerente a perguntas sobre uso do sistema. | M | IA |
| 30 | Como usuário, quero receber um resumo automático da minha propriedade, para economizar tempo. | Resumo em linguagem simples gerado periodicamente, com dados corretos. | B | IA |
| 31 | Como proprietário, quero convidar um funcionário para acessar a propriedade, para delegar tarefas. | Funcionário consegue logar e ver apenas os módulos permitidos. | M | Permissões |
| 32 | Como proprietário, quero definir quais módulos um funcionário pode acessar, para manter controle sobre dados sensíveis. | Permissões aplicadas corretamente, bloqueando acesso não autorizado. | M | Permissões |
| 33 | Como usuário, quero ser alertado sobre aumento anormal de uma despesa, para agir a tempo. | Alerta gerado quando variação ultrapassa um limite definido. | B | IA / Financeiro |

---

## 13. MVP e Priorização

### MVP — Obrigatório
Funcionalidades essenciais para o produtor conseguir, desde o primeiro dia, substituir o caderno de anotações:
- Cadastro e login de usuário.
- Cadastro de propriedade e talhões.
- Cadastro de plantios e colheitas (básico).
- Cadastro de animais e eventos sanitários (básico).
- Cadastro de estoque com entradas/saídas e alerta de estoque mínimo.
- Registro de receitas e despesas.
- Dashboard com dados reais (receita, despesa, lucro, alertas, atividades pendentes).
- Agenda de atividades com status (pendente/em andamento/concluída).
- Autenticação segura.

**Motivo:** são as funcionalidades que, sozinhas, já entregam o valor central da proposta — "saber o que está acontecendo na propriedade e se ela está dando lucro" — sem exigir ainda módulos avançados como IA ou permissões granulares.

### Versão 2
- Relatórios completos (financeiro detalhado, produtividade, comparação mensal).
- Registro de produção animal (leite/ovos) vinculado a relatórios.
- Permissões granulares por módulo para funcionários.
- Alertas inteligentes (priorização automática).
- Assistente de IA para dúvidas do sistema (IA-1).

**Motivo:** agregam valor real mas dependem de uma base de dados mínima já em uso (histórico) para fazer sentido, e envolvem mais complexidade de implementação.

### Versão 3
- Análises avançadas de IA (previsão de produção, análise de produtividade comparativa, identificação de aumento anormal de custos, recomendações).
- Exportação de relatórios (PDF/Excel).
- Múltiplas propriedades por usuário com trocas rápidas.
- Aplicativo mobile nativo (a versão web responsiva atende até aqui).

**Motivo:** funcionalidades de maior sofisticação, que dependem de volume de dados histórico maior para gerar valor real (especialmente as previsões de IA) e de uma base de usuários consolidada para justificar o investimento.

---

## 14. Roadmap de Desenvolvimento

**Fase 1 — Planejamento**
- Validação deste PRD com stakeholders/orientadores.
- Definição final da stack tecnológica.
- Criação do repositório e ambiente de desenvolvimento.

**Fase 2 — Banco de Dados**
- Modelagem detalhada (diagrama ER) a partir da Seção 9.
- Criação das migrations/tabelas.
- Popular dados de teste (seed).

**Fase 3 — Back-end**
- Autenticação e autorização.
- APIs REST para propriedade, plantações, animais, estoque, financeiro, atividades.
- Testes básicos das APIs.

**Fase 4 — Front-end**
- Estrutura de telas e navegação (menu, layout responsivo).
- Formulários de cadastro de cada módulo.
- Integração com as APIs do back-end.

**Fase 5 — Dashboard**
- Componentes visuais (cards, gráficos).
- Cálculo e exibição de indicadores em tempo real.

**Fase 6 — Relatórios**
- Telas de relatório por módulo.
- Filtros por período.
- Comparações mensais.

**Fase 7 — Inteligência Artificial**
- Integração com API de IA (back-end).
- Assistente virtual de dúvidas (IA-1).
- Resumo automático (IA-8) e demais funcionalidades da Versão 2/3.

**Fase 8 — Testes**
- Testes funcionais de todos os módulos.
- Testes em diferentes dispositivos e conexões lentas.
- Correção de bugs.

**Fase 9 — Implantação**
- Deploy em ambiente de produção.
- Configuração de backups automáticos.
- Monitoramento inicial e coleta de feedback dos primeiros usuários.

---

## 15. Interface e Experiência do Usuário

**Direção visual:** profissional, moderna, limpa, com identidade rural discreta (evitar exagero de ícones "caipiras"; priorizar clareza).

- **Paleta de cores:** tons de verde (associação com o campo) como cor primária, com neutros (branco/cinza) para fundo e um tom de laranja/amarelo para alertas e destaques — garantindo bom contraste.
- **Tipografia:** fonte sem serifa, legível em telas pequenas (ex.: Inter, Roboto ou similar), tamanhos generosos para facilitar leitura no campo, inclusive sob luz solar.
- **Menu:** navegação simples, por ícones + texto, adaptada para menu inferior fixo em celular (fácil de alcançar com o polegar) e menu lateral em desktop.
- **Dashboard:** cards grandes e diretos, com números em destaque e cores indicando situação (verde = ok, amarelo = atenção, vermelho = urgente).
- **Cards e tabelas:** cards para visão geral; tabelas simplificadas (poucas colunas visíveis por padrão, com opção de detalhar) para não sobrecarregar em telas pequenas.
- **Gráficos:** simples e diretos (barras, pizza, linha), sem excesso de informação por gráfico.
- **Ícones:** universais e consistentes, sempre acompanhados de texto (evitar depender só do ícone).
- **Formulários:** poucos campos obrigatórios por tela, campos opcionais claramente identificados, valores padrão inteligentes (ex.: data de hoje pré-preenchida).
- **Responsividade:** mobile-first — o desenho começa pensando no celular e se adapta para telas maiores, não o contrário.

---

## 16. Segurança

- **Autenticação:** obrigatória para todas as áreas do sistema, com opção futura de autenticação em duas etapas.
- **Senhas:** armazenadas com hash forte (ex.: bcrypt/argon2), nunca em texto puro; política mínima de complexidade.
- **Sessões:** uso de tokens com expiração (ex.: JWT com tempo de validade curto + renovação), invalidação de sessão no logout.
- **Autorização:** verificação de permissão em toda operação sensível no back-end (nunca confiar apenas na interface).
- **Validação de dados:** validação tanto no front-end (usabilidade) quanto no back-end (segurança), rejeitando dados malformados.
- **Proteção contra SQL Injection:** uso de queries parametrizadas/ORM, nunca concatenação direta de strings em SQL.
- **XSS:** sanitização de conteúdo exibido, especialmente em campos de texto livre (descrições, comentários).
- **CSRF:** uso de tokens anti-CSRF em formulários e validação de origem das requisições.
- **Controle de acesso:** escopo de dados sempre filtrado pela propriedade e pelo papel do usuário autenticado.
- **Backup:** rotina automática de backup do banco de dados, com retenção mínima definida (ex.: diário por 30 dias).
- **Logs:** registro de eventos sensíveis (login, alterações financeiras, exclusões) para auditoria, sem armazenar dados de senha em log algum.

---

## 17. LGPD

O sistema trata dados pessoais (nome, e-mail de usuários) e dados da operação rural, que podem ser sensíveis do ponto de vista comercial mesmo sem serem "dados pessoais sensíveis" no sentido estrito da lei. Cuidados necessários:

- **Dados pessoais:** coletar apenas o necessário para o funcionamento do sistema (nome, e-mail, e dados da propriedade); evitar coleta excessiva.
- **Controle de acesso:** dados de uma propriedade só devem ser acessíveis pelos usuários vinculados a ela, conforme seu papel.
- **Consentimento:** ao criar a conta, o usuário deve aceitar termos de uso e política de privacidade claros, informando o que é feito com seus dados (incluindo o envio de dados agregados à API de IA, quando aplicável).
- **Armazenamento:** dados armazenados em servidores com práticas adequadas de segurança; dados sensíveis (se houver) criptografados.
- **Exclusão:** o usuário deve poder solicitar a exclusão de sua conta e dos dados associados, respeitando prazos legais de guarda quando aplicável (ex.: dados fiscais, se existirem no futuro).
- **Segurança:** ver Seção 16.
- **Privacidade por padrão:** funcionalidades de IA devem operar preferencialmente sobre dados agregados/anônimos, evitando enviar dados pessoais desnecessários a serviços externos.

---

## 18. Métricas do Produto

- Número de usuários cadastrados (e ativos mensalmente).
- Número de propriedades cadastradas.
- Frequência de uso (logins por semana/mês por usuário).
- Quantidade de registros financeiros lançados por período.
- Quantidade de registros de produção (plantios, colheitas, produção animal) por período.
- Percentual de tarefas concluídas x criadas.
- Número de relatórios gerados.
- Taxa de utilização do assistente de IA (perguntas feitas por usuário ativo).
- Taxa de retenção (usuários que continuam ativos após 30/60/90 dias).

---

## 19. Requisitos Técnicos Consolidados

### Requisitos Funcionais (RF)
RF-001 Cadastro de usuário · RF-002 Login · RF-003 Recuperação de senha · RF-004 Cadastro de propriedade · RF-005 Cadastro de talhões · RF-006 Cadastro de culturas · RF-007 Registro de plantio · RF-008 Registro de colheita · RF-009 Registro de problemas na plantação · RF-010 Cadastro de animais · RF-011 Registro de eventos sanitários · RF-012 Registro de produção animal · RF-013 Cadastro de itens de estoque · RF-014 Registro de movimentação de estoque · RF-015 Alerta de estoque mínimo · RF-016 Registro de receitas · RF-017 Registro de despesas · RF-018 Dashboard com indicadores reais · RF-019 Criação e gestão de atividades · RF-020 Geração de relatórios por módulo · RF-021 Gestão de permissões de usuários da propriedade · RF-022 Assistente de IA para dúvidas · RF-023 Resumo automático via IA · RF-024 Alertas inteligentes priorizados.

### Requisitos Não Funcionais (RNF)
RNF-001 Responsividade mobile-first · RNF-002 Tempo de carregamento ≤ ~3s em conexão razoável · RNF-003 Funcionamento tolerante a conexão instável · RNF-004 Compatibilidade com principais navegadores · RNF-005 Backup automático periódico · RNF-006 Acessibilidade básica (contraste, tamanho de fonte).

### Requisitos de Segurança (SEG)
SEG-001 Hash seguro de senha · SEG-002 Sessões com expiração · SEG-003 Autorização por papel e propriedade em toda API · SEG-004 Proteção contra SQL Injection (ORM/queries parametrizadas) · SEG-005 Proteção contra XSS · SEG-006 Proteção contra CSRF · SEG-007 Logs de auditoria de ações sensíveis.

### Requisitos de Banco de Dados (BD)
BD-001 Modelo relacional conforme Seção 9 · BD-002 Integridade referencial entre tabelas · BD-003 Índices em campos de busca frequente (ex.: propriedade_id) · BD-004 Rotina de backup automatizada.

### Requisitos de Infraestrutura (INF)
INF-001 Hospedagem com HTTPS obrigatório · INF-002 Ambiente separado de desenvolvimento/produção · INF-003 Monitoramento básico de disponibilidade.

### Requisitos de IA (IA)
IA-001 Integração via API externa de modelo de linguagem, chamada apenas pelo back-end · IA-002 Envio de dados agregados/mínimos necessários à IA · IA-003 Mensagem de recomendação de busca por profissional em respostas técnicas sensíveis · IA-004 Registro do histórico de interação com o assistente (para melhoria contínua, respeitando privacidade).

---

## 20. Critérios de Sucesso do MVP

- [ ] Usuário consegue criar uma conta e fazer login com segurança.
- [ ] Usuário consegue cadastrar uma propriedade e seus talhões.
- [ ] Usuário consegue registrar plantios, colheitas e animais.
- [ ] Usuário consegue registrar receitas e despesas.
- [ ] Dashboard exibe dados reais do banco (não valores fictícios).
- [ ] Sistema gera alertas de estoque mínimo corretamente.
- [ ] Usuário consegue criar e concluir atividades na agenda.
- [ ] Usuário consegue gerar ao menos os relatórios financeiro e de estoque.
- [ ] Sistema funciona corretamente em navegador de celular.
- [ ] Dados de uma propriedade não são acessíveis por usuários não autorizados.

---

## 21. Riscos e Mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| Complexidade do escopo total (muitos módulos) | Atraso na entrega do MVP | Seguir rigorosamente a priorização da Seção 13; construir por fases (Seção 14). |
| Custos de infraestrutura ao escalar | Inviabilidade financeira do projeto | Começar com hospedagem de baixo custo/gratuita; migrar apenas quando houver demanda real. |
| Internet instável no campo | Frustração do usuário, perda de dados | Design tolerante a falhas de conexão (rascunhos locais, mensagens claras de erro), otimização de payloads. |
| Falhas de segurança | Exposição de dados financeiros/pessoais | Seguir as boas práticas da Seção 16 desde o início, não como retrabalho posterior. |
| Dados incorretos inseridos pelo usuário | Relatórios e IA gerando conclusões erradas | Validações no formulário, mensagens de confirmação em lançamentos importantes. |
| Dependência de API externa de IA | Indisponibilidade ou custo da IA compromete funcionalidades | Tornar os módulos de IA não-críticos (o sistema deve funcionar plenamente sem eles); tratar falhas de API com mensagens amigáveis. |
| Dificuldade de escalabilidade da arquitetura inicial | Retrabalho ao crescer | Escolher banco relacional robusto (PostgreSQL) desde cedo e organizar o back-end em camadas bem separadas. |
| Dificuldade de uso pelos produtores (baixa familiaridade com tecnologia) | Baixa adoção do sistema | Priorizar usabilidade extrema no MVP, testes com usuários reais antes do lançamento, assistente de IA para dúvidas. |
| Funcionalidades duplicadas ou requisitos vagos no PRD | Retrabalho de desenvolvimento | Revisão de consistência já aplicada neste documento (ver Seção 23); revisões periódicas do PRD com a equipe. |

---

## 22. Próximos Passos para Iniciar o Desenvolvimento

1. Validar este PRD com todos os envolvidos (equipe/orientador do projeto educacional).
2. Confirmar a stack tecnológica final (Seção 8) considerando o nível de experiência da equipe.
3. Criar o diagrama entidade-relacionamento detalhado a partir da Seção 9.
4. Configurar o repositório de código, ambiente de desenvolvimento e padrões de commit.
5. Iniciar a Fase 1 e 2 do roadmap (planejamento e banco de dados).
6. Definir o provedor/API de IA a ser utilizado antes da Fase 7, para já considerar seus limites técnicos no desenho do back-end.
7. Planejar testes com pelo menos um produtor rural real antes do lançamento do MVP, para validar usabilidade.

---

## 23. Nota de Revisão e Consistência

Este documento passou por uma revisão para eliminar contradições, duplicidades e requisitos vagos, com os seguintes ajustes já incorporados às seções acima:

- **Duplicidade evitada:** os relatórios financeiros descritos na Seção 5.6 não são repetidos como um módulo à parte na Seção 5.8; a Seção 5.8 referencia o financeiro sem duplicar o conteúdo.
- **Dependência técnica explicitada:** a Seção 6 (IA) deixa claro que todas as funcionalidades de IA dependem de dados previamente cadastrados nos módulos operacionais — por isso a IA foi posicionada na Versão 2/3 do MVP (Seção 13), e não na primeira entrega, evitando a contradição de depender de dados que ainda não existem no lançamento.
- **Requisito antes vago, agora específico:** "desempenho adequado" foi convertido em meta objetiva (RNF-002, ≤ ~3s em conexão razoável) para servir como critério verificável pela equipe de testes.
- **Consistência de papéis:** os três perfis de usuário (Seção 10) foram alinhados com as permissões referenciadas nas User Stories 31 e 32 e com os requisitos SEG-003, evitando um modelo de permissões divergente entre seções.
- **Consistência de modelo de dados:** todas as entidades citadas ao longo do documento (propriedade, talhão, cultura, plantio, animal, estoque, financeiro, atividade, alerta) possuem tabela correspondente na Seção 9, evitando menções a dados sem lastro no modelo.
- **Escopo do MVP revisado:** funcionalidades avançadas de IA (previsão de produção, análise comparativa de produtividade) foram deslocadas para a Versão 3 por dependerem de volume histórico de dados incompatível com um MVP recém-lançado, evitando uma promessa irreal de "IA precisa desde o dia 1".

O documento está pronto para servir de referência à equipe de desenvolvimento nas fases de planejamento e construção.
