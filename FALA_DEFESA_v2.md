# Fala da defesa — versão 2 (no estilo do autor)

Esta versão parte do `texto_modificado.txt` e aplica o mesmo jeito de falar ao texto todo. Os slides 2 a 5 são os do autor, só com pequenos acertos de digitação. **[avançar]** marca onde passar para o próximo quadro dentro do mesmo slide.

---

## 1 · Capa

Bom dia a todos. Meu nome é Cauã Ferrari e hoje eu vou apresentar o meu trabalho de conclusão de curso, que é a parametrização e otimização aerodinâmica de uma turbina eólica de eixo horizontal por dinâmica dos fluidos computacional. O trabalho foi orientado pela professora Angie e coorientado pelo professor Celso.

## 2 · Motivação

O ponto de partida do trabalho é de certa forma muito simples: numa turbina, a geometria da pá é o principal fator que influencia o coeficiente de potência. Então, torção, corda, perfil e número de pás vão definir as forças nas seções, e isso por consequência define o coeficiente de potência.

Então, para extrair mais energia, a gente precisa encontrar a melhor geometria. O problema é que geralmente estudar melhorias em pás eólicas envolve um espaço amostral muito grande: por exemplo, só com sete variáveis em três níveis já são mais de duas mil combinações. E cada pá avaliada por CFD leva horas, e isso considerando montar a geometria, gerar a malha, resolver e verificar essas soluções.

Então, o objetivo do trabalho foi construir um otimizador completamente parametrizado, com um processo que gera e avalia pás sem intervenção manual, com o objetivo de otimizar pás eólicas.

## 3 · Parametrização de simulações

A parametrização é basicamente transformar todo o processo numa função. Vão entrar aqui um conjunto de parâmetros, as variáveis geométricas, e vão sair aqui as respostas, que no caso seria o coeficiente de potência.

No meio do processo, as pás todas vão sempre seguir a mesma receita de bolo, isso é a parametrização. No meu caso, a geometria foi parametrizada para ser construída no SpaceClaim ou no Discovery, a malha no Fluent Meshing e a solução no Fluent, tudo no Ansys 2026 R1, controlado por scripts em Python, utilizando o PyFluent.

## 4 · Protocolo do estudo

Este é o caminho que o meu trabalho seguiu. Iniciando pela análise de um rotor de referência, foi feita uma análise de malha própria, e os resultados foram comparados com os publicados pra garantir a validação física. Depois eu desenvolvi a parametrização completa em Python no Ansys.

Com isso, eu rodei a análise de sensibilidade, que mostra quais variáveis realmente importam, pra finalmente realizar uma campanha de otimização, que por sua vez alimenta os modelos de resposta. O candidato a melhor pá apontado pelo modelo foi confirmado por mais uma análise CFD. E daí esse cara foi avaliado em toda a curva de operação e comparado com geometrias vizinhas, pra verificar se existia um platô ótimo.

## 5 · Revisão bibliográfica

Bom, aqui estão os trabalhos principais que sustentam as etapas do meu estudo.

Na parametrização, Fritsch e Carlson apresentam um estudo sobre a interpolação sem oscilações que eu uso na torção, e Jasa discutiu como equilibrar custo e fidelidade e descrever a pá por pontos de controle.

Com relação à malha, o Gustafsson traz algumas expressões que eu usei no meu estudo, como a da altura da primeira célula. O Madsen reforça de que forma a malha precisa ser verificada antes de comparar geometrias, assim como o Balduzzi, que propôs o indicador GRV com o mesmo propósito, e que eu uso para avaliar a resolução.

Já no solver, o modelo de turbulência é o SST, descrito pelo Menter em 1994.

No planejamento e na estatística, Jones e Nachtsheim propuseram o planejamento de triagem DSD que eu usei na sensibilidade, o Walsh apresenta os conceitos do critério I-ótimo, e os outros dois trabalhos dão as ferramentas de incerteza e de reamostragem.

No modelo de resposta, a base é o livro de Rasmussen e Williams sobre processos gaussianos. E o Barlas mostra a importância de confirmar por simulação o candidato que o modelo aponta.

E por fim, a referência principal é o estudo do Sales Junior e dos outros participantes aqui do time de pesquisa, que é de onde vêm a geometria, os dados pra comparação e a aplicação do GRV em turbinas de eixo horizontal.

## 6 · Geometria de referência

Bom, a turbina de referência é aquela estudada pelo meu coorientador. Ela tem meio metro de diâmetro, três pás, perfil NACA 4412 e cordas de 68 milímetros na raiz e 50 na ponta. O vão aerodinâmico tem 143 milímetros, indo de 107 até 250 milímetros do eixo. E a pá é presa no cubo por esse conector cilíndrico aqui, de 15 milímetros, que os comprimentos eu estimei a partir das figuras do próprio artigo.

## 7 · Corda, perfil e número de pás

A partir dessa referência, a pá é gerada com poucas entradas. A corda varia linearmente entre a raiz e a ponta. O perfil entra como um código NACA de quatro dígitos, que o próprio script traduz em curvatura, posição da curvatura e espessura. E o número de pás vai definir o setor que é simulado: 180, 120 ou 90 graus.

Na sensibilidade eu variei as cordas e o número de pás. O perfil ficou no NACA 4412 da referência, mas o código aceita qualquer perfil de quatro dígitos.

## 8 · Distribuição de torção

A torção é o controle mais importante aqui. Começando com a pá sem torção. **[avançar]** Eu fixo o ângulo na raiz e na ponta. **[avançar]** E entre eles eu coloco um ponto de controle: o η diz onde ele fica ao longo da pá, e o s diz quanto da variação total do ângulo já aconteceu até ali. Daí dois trechos de Hermite ligam esses três pontos sem criar quinas. **[avançar]** Então, com só quatro números, eu consigo gerar famílias inteiras de distribuições de torção.

**[avançar]** E aqui estão as equações: o ângulo do controle a partir do s, as inclinações de cada trecho, a derivada no controle pela média harmônica, que é o que evita as oscilações, e as quatro funções de Hermite.

## 9 · Geometria parametrizada e referência

Pra conferir essa reconstrução, eu coloquei a pá do artigo do lado da pá gerada pelo meu código com os mesmos parâmetros. Diâmetro, vão, cordas, perfil e conector coincidem. As diferenças são basicamente duas, e foram decisões conscientes: a ponta foi simplificada como plana, e o comprimento do conector foi estimado a partir da figura.

## 10 · Domínio computacional

Como as três pás são iguais, eu simulo só um terço do rotor, que é esse setor de 120 graus com faces periódicas, e depois multiplico as cargas para o rotor completo. O domínio vai cinco diâmetros antes do rotor e doze depois, com um raio de quatro diâmetros.

Perto da pá existe essa zona aqui, que gira junto com ela, com raio de 1,25 vez o raio do rotor e meio diâmetro de comprimento. Isso permite resolver o problema como permanente, o que é muito mais barato do que simular o giro no tempo. E atrás do rotor já aparecem os volumes de refinamento da esteira, que eu vou detalhar agora.

## 11 · Refinamento da esteira

Então, atrás do rotor, quatro volumes em forma de tronco de cone acompanham a esteira. Perto da pá as células têm no máximo 3% do diâmetro e, conforme vão se afastando, crescem até 12%, porque ali os gradientes são menores. E todas essas medidas são dadas em função do diâmetro, então elas escalam junto com o rotor.

## 12 · Tamanhos locais parametrizados

A malha também é uma receita, e não um arquivo fixo. Cada tamanho de célula da malha de referência é multiplicado por um fator que depende da geometria de cada indivíduo. As regiões externas acompanham o diâmetro, e as regiões ligadas à pá acompanham as cordas, o vão e o conector.

Quando uma região depende de mais de uma dimensão, eu uso a menor razão entre elas. Então, se uma corda diminui, por exemplo, a superfície recebe células proporcionalmente menores, e a malha nunca fica mais grossa do que o detalhe mais fino da geometria.

## 13 · Malha D5

E esse é o resultado. No corte longitudinal, o núcleo de células hexaédricas acompanha a esteira. **[avançar]** Aproximando da pá, o tamanho das células vai acompanhando a corda. **[avançar]** E junto à parede ficam as camadas prismáticas, que são as que resolvem a camada limite.

## 14 · Dimensionamento das camadas prismáticas

Essas camadas também são calculadas antes de cada simulação. A altura da primeira célula vem de uma relação pra que o y⁺ fique perto de um, usando a velocidade relativa e o Reynolds de cada seção, e eu adoto o menor valor ao longo da pá. A espessura total vem da correlação de camada limite turbulenta em placa plana, calculada na raiz.

Depois disso, o script testa de uma até 45 camadas e, pra cada quantidade, calcula o crescimento que fecha essa espessura, escolhendo o mais próximo de 1,1. Na malha de referência isso dá uma primeira célula de mais ou menos um centésimo de milímetro, 32 camadas e quase 2 milímetros de espessura total.

## 15 · Configuração da solução

As condições de entrada seguem o rotor de referência: vento de 5,27 metros por segundo e, na condição de projeto, com TSR de 3,5, uma rotação de 73,78 radianos por segundo. A turbulência é modelada pelo SST k-ômega.

A solução começa com 150 iterações em que a rotação vai subindo em patamares, pra que o escoamento se forme sem divergir. E depois disso ela segue com o algoritmo SIMPLE em segunda ordem.

## 16 · Critérios de convergência

Uma solução só entra na análise se ela mostrar que convergiu. Eu descarto a fase inicial e olho duas janelas seguidas de 200 iterações. Na classe estrita, torque e força podem variar no máximo 0,15%, e os resíduos ficam abaixo de dez à menos cinco.

Existem também duas classes alternativas. Uma olha separadamente as parcelas de pressão e viscosa do Cp, pra soluções com oscilações pequenas. E a outra é pra soluções que ficam oscilando de forma estável: nesse caso eu divido as últimas 1.600 iterações em oito blocos e exijo que a incerteza da média fique abaixo de 1%. E em todos os casos o limite é de 3.000 iterações ou cinco horas.

## 17 · Resolução de parede e interrupções

Além da convergência, eu verifico a resolução junto à parede: o y⁺ médio precisa ficar abaixo de 0,8. E existem proteções que interrompem os casos que divergem ou que apresentam cargas sem sentido físico.

Tudo isso roda sozinho: o caso aceito entra na base de dados, o rejeitado é classificado, e a campanha segue pro próximo. Na sensibilidade, 30 das 33 simulações foram aceitas.

## 18 · Independência de malha

Antes de comparar geometrias, eu precisava saber se o resultado dependia da malha. Então eu rodei sete níveis de refinamento, de meio milhão a quatro milhões e meio de células, e a partir da terceira malha o coeficiente de potência já fica praticamente constante.

Eu escolhi a D5, com 2,13 milhões de células. Ela fica a menos de 0,3% da malha mais fina, com metade das células. E os tamanhos dela viraram a receita usada em todas as outras pás.

## 19 · Validação com o rotor publicado

Com essa malha, eu comparei a curva de potência com o CFD publicado pro mesmo rotor. Na condição de projeto eu obtive 0,201 contra 0,225, uma diferença de 10,7%, e o meu pico aparece em TSR 3 em vez de 3,5.

Essas diferenças têm causas conhecidas: o conector foi estimado, a ponta foi simplificada, e a malha e o algoritmo são diferentes dos do artigo. O ponto importante aqui é que todas as pás seguintes foram avaliadas exatamente com o mesmo modelo, então as comparações entre elas são consistentes.

## 20 · Planejamento da sensibilidade

Com a parametrização pronta, eu passei pra sensibilidade. Testar sete fatores em três níveis, em todas as combinações, daria 2.187 simulações. **[avançar]** Em vez disso, eu usei um planejamento de triagem definitiva, o DSD, com 17 pontos, que separa os efeitos principais das curvaturas. Depois eu ampliei com mais 16 pontos escolhidos pelo critério D, que posiciona esses pontos pra estimar com mais precisão as curvaturas e as interações. Das 33 simulações, 30 foram aceitas.

## 21 · Regressões e ranking dos fatores

Com essas 30 respostas, eu ajustei doze modelos de regressão, desde o mais simples, só com termos lineares, até um com todas as curvaturas e interações candidatas.

Pra escolher o melhor, eu não usei o R² do próprio ajuste, porque ele sempre melhora quando a gente acrescenta termos. Eu usei a validação cruzada: tiro uma geometria, ajusto o modelo com as outras e vejo quanto ele erra naquela que ficou de fora. O modelo J foi o que teve o menor erro. E pra montar o ranking, eu junto pra cada fator o efeito linear, a curvatura e as interações, e testo a estabilidade dessa ordem com 12 mil reamostragens.

**[avançar]** Aqui estão os doze modelos, escritos a partir de uma base comum, que é a constante mais os sete termos lineares; cada um acrescenta curvaturas ou interações diferentes.

## 22 · Intensidade dos efeitos

No modelo J, três fatores dominam: o número de pás, a torção de raiz e a fração angular. A torção de raiz é a mais consistente de todas: ela aparece entre os três primeiros em 99% das reamostragens e é a única significativa a 5%. Por isso, a decisão foi otimizar a torção, mantendo perfil e cordas, pra que o ganho venha só dela.

## 23 · Escolha do número de pás

Como o número de pás teve o maior efeito, a escolha de fixá-lo precisa ser justificada. Seis dos doze modelos têm curvatura no número de pás, e todos eles apontam o máximo em três pás, com duas e quatro ficando abaixo. Nas reamostragens desses modelos, três pás vence em 97 a 100% dos casos. Além disso, três pás é a configuração do rotor de referência, o que permite atribuir o ganho somente à torção.

Só que existe uma ressalva: no modelo J, o intervalo de confiança da diferença entre três e quatro pás inclui o zero. Então a vantagem sobre quatro pás é provável, mas ela não está comprovada.

## 24 · Planejamento da otimização

Na otimização, os quatro controles de torção variam dentro de uma região em que a raiz é sempre mais torcida que a ponta. Foram 40 geometrias: 32 pra treinar os modelos e 8 guardadas só pra testar eles no final.

## 25 · Formação da DOE I-ótima

E essas 40 pás não foram sorteadas. Primeiro eu montei um conjunto de candidatos no espaço dos quatro parâmetros, com uma grade, pontos de Sobol, pontos nas faces e três pás de torção constante. Depois de aplicar a restrição e tirar as curvas repetidas, sobraram mais ou menos quatro mil candidatos.

Desses, um algoritmo de troca escolheu os 32 de treino que minimizam o critério I, que é o erro médio de previsão esperado do modelo em toda a região. E os 8 de teste foram escolhidos antes de qualquer simulação, ficando o mais longe possível dos outros: quatro no interior e quatro nas bordas.

## 26 · Modelos de resposta

O primeiro modelo, quadrático nos quatro parâmetros, errava bastante. E o motivo é que combinações diferentes de parâmetros podem gerar pás quase iguais, e o modelo não enxerga isso.

**[avançar]** A solução foi descrever cada pá pela própria curva de torção, amostrada em 41 pontos, e usar um processo gaussiano, que prevê a resposta de uma pá nova pela semelhança com as pás que já foram simuladas.

**[avançar]** Com isso, o erro caiu de 0,069 pra 0,0033 na validação, e nas oito pás reservadas foi de 0,0013, com um R² de 0,998.

## 27 · Busca do máximo e confirmação

Com o modelo pronto, buscar o máximo fica barato. Eu avaliei mais de oito mil propostas e rodei buscas locais a partir das melhores, chegando no candidato. **[avançar]** Só que esse cara nunca tinha sido simulado, então eu rodei o CFD: o modelo previa 0,296 e a simulação deu 0,2956, uma diferença de 0,12%.

## 28 · Coerência entre as malhas (GRV)

Antes de ir pros resultados, tem um ponto importante: o estudo de independência de malha foi feito só pra referência. As 40 pás da otimização usaram a mesma receita, mas cada uma com a sua geometria. Então, pra mostrar que esses resultados são comparáveis entre si, eu usei o GRV, que relaciona a vorticidade do escoamento com o tamanho da célula.

**[avançar]** Na região ao redor da pá, as 40 malhas ficaram na mesma faixa da malha verificada, a maioria até abaixo dela, e o candidato também. Os valores mais altos aparecem nos vórtices e na esteira, longe das superfícies que geram o torque.

## 29 · Candidato otimizado

E esse aqui é o resultado principal. A pá otimizada tem o mesmo perfil, as mesmas cordas e o mesmo número de pás da original; só a torção mudou, que ficou mais forte perto da raiz. O coeficiente de potência passou de 0,1998 pra 0,2956, um ganho de quase 48%, e ficou acima até da melhor das 40 pás simuladas.

## 30 · Entorno do candidato

Pra saber se o candidato era um ponto isolado ou uma região boa, eu simulei três pás vizinhas, com curvas de torção bem próximas. As três tiveram praticamente o mesmo Cp, dentro da incerteza das médias. O que muda entre elas é o empuxo, e o candidato é o que tem o menor. Isso abre espaço pra uma otimização futura que leve em conta também a carga na estrutura.

## 31 · Curva de operação

Como a otimização foi feita num único ponto, a pergunta natural é: e fora dele? Então eu simulei a curva inteira, com sete velocidades de ponta, pras duas pás. O candidato supera a original em todos os pontos. Em TSR 3,5 o ganho é de 48,6%, e em TSR 5 a pá original chega a frear o rotor, enquanto a otimizada continua gerando potência.

## 32 · Distribuição radial das cargas

Pra entender de onde vem esse ganho, eu dividi a pá em faixas e somei as forças em cada uma. Na potência, o candidato fica acima da original em quase todo o comprimento da pá, e a diferença aumenta fora da condição de projeto. Já no empuxo acontece o contrário: o candidato carrega menos a estrutura.

## 33 · Ângulo de ataque e eficiência das seções

E a origem disso está no ângulo de ataque. O candidato trabalha com um ângulo menor em toda a pá e nas três condições. Na condição de projeto, no meio da pá, ele cai de 10,7 pra 5,7 graus. Com isso, a relação entre sustentação e arrasto melhora bastante, passando de mais ou menos 17 pra 24.

## 34 · Forças nas seções

Olhando uma seção perto da raiz, a força resultante do candidato ficou até um pouco menor, mas inclinada no sentido do giro. **[avançar]** E como só a componente no sentido do giro gera torque, a força tangencial aumenta entre 32 e 42% nas três estações, e a força axial, que é o empuxo, cai entre 19 e 29%. Ou seja, mais potência com menos esforço na estrutura.

## 35 · Escoamento nas seções

Nos cortes, o escoamento fica colado nas duas pás. A diferença é que, no candidato, a sucção sobre o bordo de ataque é bem menos intensa: perto da raiz, o pico cai pela metade. E um pico menor significa que a camada limite enfrenta menos gradiente adverso até chegar no bordo de fuga.

## 36 · Atrito na superfície de sucção

E isso aparece também na superfície da pá. As cores mostram o atrito junto à parede, e dentro dessa linha preta o escoamento está voltando. Na pá original existe essa faixa de escoamento reverso aqui, ao longo do bordo de fuga. Já no candidato ela encolhe: a área com escoamento reverso cai de 16,6% pra 6,6% da superfície de sucção.

## 37 · Conclusões

Bom, pra fechar, as conclusões formam uma sequência, em que cada etapa sustenta a próxima.

A parametrização funcionou: as pás foram geradas, malhadas e simuladas sem intervenção, com malha verificada e critérios claros de convergência.

A sensibilidade mostrou que a torção de raiz é o fator mais consistente e que três pás é a melhor opção, o que justificou otimizar só a torção.

A otimização, com o modelo baseado nas curvas de torção, previu o candidato com erro de 0,12% e levou a um ganho de quase 48% no coeficiente de potência, que se mantém em toda a curva de operação.

E o mecanismo é físico e coerente: o ângulo de ataque diminui, a força se inclina pro giro e o escoamento reverso diminui.

Como próximos passos, eu vejo uma otimização que considere potência e empuxo ao mesmo tempo, a inclusão de mais variáveis, como cordas e perfil, e a fabricação e o ensaio do rotor otimizado.

## 38 · Encerramento

Muito obrigado pela atenção, e fico à disposição pras perguntas.
