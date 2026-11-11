# Validação do protótipo

## Apresentação completa — 11/11/2026

- Roteiro das 15 funções da planilha integrado, com 58 etapas controladas pelo apresentador e uma conclusão. São 16 telas em dez paradas; S6, S7 e S9 reutilizam a parada entre suas funções.
- Painel de 90% da largura e da altura, em 5% na horizontal e 2% na vertical. Faixa inferior exclusiva para seleção de slide e avanço/retorno. Tipografia e área do modelo ajustadas.
- Coletor completo na entrada, etapas internas com transparência quando necessário e restauração da vista completa e opaca na inspeção final. Giro, zoom, corte e transparência disponíveis.
- Três legendas interativas por função, com números ancorados no modelo, foco e indicação de região oculta. Os 135 focos das três resoluções localizaram alvos visíveis.
- Aparência ampliada com manchas, marcas de fluxo, variação de tom e iluminação rasante. Rugosidade cobre toda a lateral frontal do plenum, separada em metades compatíveis com o corte.
- Transporte, rastreabilidade, serviço, produção, resistência química, limpeza, distribuição de ar, água, retorno de chama, estanqueidade e servofreio representados por cenas 3D e diagramas vetoriais. Animações limitadas à etapa atual, sem avanço automático do roteiro.
- S10 mostra circuito de vácuo, perda de assistência, esforço no pedal e comparação qualitativa de distância de parada, sem colisão. A vista inicial lateral mantém a conexão visível; seus 15 estados/resoluções foram verificados separadamente.
- Suíte completa aprovada em 1600×900, 1280×720 e 1280×960: 174 estados de demonstração, 45 inspeções finais, 135 focos de legenda e navegação sequencial por todas as funções. Foram conferidos retorno, cancelamento e redesenho da inspeção final após transição.
- Sete cenas adicionais capturadas e inspecionadas: identidade, proteção, produção, partícula congelada, água, fragmentos contidos e frenagem. Estrada fechada e dez enquadramentos do mapa sem obstruções nos alvos auditados.
- Zero erros JavaScript/WebGL reportados e zero solicitações HTTP/HTTPS, em Edge headless e contexto offline. Capturas e relatórios locais em `.producao/qa-completa/`. Resumo reproduzível e hashes em `validacao-completa.json`.
- As animações são representações qualitativas. Não constituem simulações de escoamento, análises estruturais, previsões de vida ou ensaios de frenagem. Projeção e passador físico continuam sujeitos à conferência no equipamento final.

As seções abaixo registram versões anteriores. A batida descrita nas validações históricas não é acionada pela navegação atual.

## Slides sensoriais e visibilidade do mapa — 10/11/2026

- Slides 2, 3 e 4 desenvolvidos com função, exemplos e efeito percebido ligeiramente, moderadamente e muito desagradável. O texto ressalta nos três casos que aparência, tato e ruído podem ocupar S2, S3 ou S4, conforme a intensidade do incômodo.
- Manchas e marcas de fluxo presas à superfície; relevo irregular e textura tátil com arestas destacadas; ondas animadas para o ruído gerado, amplificado ou não atenuado. Mãos em SVG originais, com orientação fixa em relação à tela, verificadas antes e depois do giro do coletor.
- Quatro primeiros slides conferidos em 1600 × 900, 1280 × 720 e 1280 × 960, sem sobreposição de texto, modelo, legendas e ferramentas. Giro completo e inclinação nos três novos efeitos, nas versões completa e em corte, com zoom máximo: 72 gestos de giro, sem cortes da geometria.
- Todas as 20 variantes têm folhas, tanto nos modelos próximos quanto nos simplificados. As duas variantes secas foram substituídas por copas largas. Modelos GLB e galeria atualizados.
- Volumes por faixas de altura das árvores comparados às regiões projetadas do carro e dos números. Corredores desobstruídos nos dez enquadramentos, nas três resoluções. Árvores retiradas desses corredores também têm suas sombras de contato removidas.
- Enquadramento do acidente mais baixo e pelo lado do carro, com zero interferências das copas na região do veículo. A aproximação final já prepara esse POV; o contato com o tronco e o fogo continuam visíveis.
- Regressão de avanço, retorno, conclusão, repetição e cancelamento aprovada em 16:9 e 4:3: 1.943 e 2.279 quadros monitorados, sem cortes do carro. Viagens de 2,5 segundos e distâncias ampliadas preservadas. O marcador 10 permanece enquadrado junto ao carro após a batida.
- Sem erros JavaScript ou de shader e sem conexões HTTP/HTTPS. Mãos e ondas animam sem redesenho contínuo do coletor. Execução local por `file://`, em contexto offline.

Resumo em `validacao-sensoriais.json`. Relatórios e capturas em `.producao/qa-sensoriais/` e `.producao/qa-sensoriais-base/`. Prévias: [slide 2](previa-slide2.png), [slide 3](previa-slide3.png) e [slide 4](previa-slide4.png). Os registros abaixo documentam versões anteriores.

## Slide central, coletor sem cortes e percurso ampliado — 10/11/2026

- Painel centralizado, com 80% da largura e da altura e margens de 10%, conferido em 1600 × 900, 1280 × 960 e 1280 × 720. Fundo com 85% de opacidade preservado.
- Severidade em fonte de 20 a 30 px, peso 800 e azul; corpo, títulos, controles e legendas ampliados. As três legendas têm texto escuro e base clara própria. Função e explicações preservadas.
- Cabeçalho, texto, modelo, legendas, botões e navegação sem sobreposição nas três resoluções. Logo permanece dentro do canto superior direito do slide.
- Modelo ampliado e reenquadramento automático baseado nos vértices reais das peças visíveis. Planos da câmera resolvidos em perspectiva, considerando flange, entrada lateral e as duas versões do modelo. Nuvens de vértices preparadas uma vez e reutilizadas.
- 96 orientações verificadas por gestos reais de arraste: voltas completas e inclinações nas versões em corte e completa, nas três resoluções, com aproximação máxima. Todos os vértices permaneceram dentro do visor e de sua margem de segurança.
- Zoom mínimo de 60%, máximo de 125%, foco nas marcações, corte/completo, reenquadramento inicial de 110% e redimensionamento testados. O plano de sombra acompanha a menor altura do modelo e não oculta partes da peça ao inclinar.
- Desenho sob demanda preservado: sem atualização contínua do visor quando não há interação. Sem erros JavaScript ou de shader e sem requisições HTTP/HTTPS, em contexto offline por `file://`.
- Distâncias entre paradas ampliadas em aproximadamente 80%, para 48,6 unidades da cena. Transições configuradas em 2,5 segundos e verificadas pelos quadros de início e chegada, mantendo partida e chegada suaves.
- Percurso completo das dez paradas, conclusão, retorno, repetição e cancelamento aprovados em 16:9 e 4:3; 1.667 e 2.034 quadros monitorados, sem cortes do carro. A entrada na derrapagem mantém a velocidade da nova viagem, sem pausa.
- Continuação externa da estrada ampliada na mesma proporção; terreno de 1400 × 1100 dividido em 20 blocos e floresta com 13.120 árvores, sem borda vazia na vista geral. Modelos de carro e árvores e largura da estrada preservados.
- Separação mínima entre asfalto e terreno de 0,1542 unidade nas amostras, nenhuma interseção e fechamento da estrada com distância zero entre pontas. Faixas integradas ao asfalto preservadas, sem camadas sobrepostas na vista distante.

Resumo em `validacao-slide-central.json`; capturas e relatório completo em `.producao/qa-slide-central/`. A [prévia do primeiro slide](previa-slide1.png) mostra o layout atual. Os registros abaixo correspondem às versões anteriores.

## Primeiro slide de severidade e dez paradas — 10/11/2026

- Dez paradas para severidades 1 a 10 e conclusão separada, com seleção por uma janela de cinco itens. Salto distante com fade medido em 738 ms.
- Painel com 51,6% da largura e 62,4% da altura, aumento de 20% em cada dimensão, fundo branco com 85% de opacidade e logo azul dentro do canto superior direito.
- Primeiro slide inspecionado em 1600 × 900, 1280 × 960 e 1280 × 720: texto, coletor, legenda e controles sem sobreposição. Função conferida com a redação solicitada.
- Explicação separa severidade 1 no sistema da ressalva sobre rastreabilidade e custo potencial à MAHLE, sem atribuir nota numérica ao efeito econômico.
- Três superfícies vazias no modelo representam data de injeção, número do componente e cavidade ausentes. Contornos e aviso são recursos didáticos; os GLB exportados conservam os campos vazios e removem os contornos.
- Giro, corte/conjunto completo, zoom por botões e roda do mouse, foco nas marcações e reenquadramento de 140% testados. Visor sem renderização contínua quando não há interação.
- Avanço por todas as paradas, conclusão, retorno, repetição e cancelamento da batida aprovados em 16:9 e 4:3. Foram monitorados 1.911 e 2.378 quadros em movimento, sem cortes do carro.
- Corrigido o afastamento para a conclusão: a posição projetada do carro acompanha suavemente a transição entre enquadramentos, evitando que ele saia pela borda inferior ao ganhar altura.
- Relação entre velocidades final/inicial da derrapagem de 1,0050 e 1,0055. Marcas progressivas, um único impacto e fogo posterior preservados. Batida agora na parada 10.
- Nenhum erro JavaScript ou de shader registrado; nenhuma requisição HTTP/HTTPS. Abertura local por `file://` com contexto de navegador offline.
- Floresta com 5.613 árvores após criar as clareiras das dez paradas. Estrada sem interseções com o terreno nas amostras e fechamento da malha com distância zero entre pontas.

Resumo desta versão em `validacao-slide1.json`; capturas e relatório completo são recriados em `.producao/qa-slide1/`. Os resultados abaixo documentam versões anteriores.

## Coletor no slide 1 e desempenho — 10/11/2026

- Removidas as raízes externas das 20 variantes, tanto no protótipo quanto nos modelos GLB e prévias.
- Floresta ampliada para 5.638 árvores, cobrindo o canto superior esquerdo da vista geral; continuação da estrada revista para entrar pela esquerda e seguir para a direita, mantendo as cinco paradas.
- Comparação no mesmo Edge headless, offline e em 1600 × 900, nos mesmos três deslocamentos: tempo médio de quadro de 74,2 ms para 33,3 ms; aproximadamente 13,5 para 30 FPS. Mediana de 66,7 ms para 33,3 ms. Resultado local, não uma promessa de FPS para todos os equipamentos ou cenas.
- Sombras estáveis reutilizadas, instâncias fora do campo de visão filtradas e contato do carro desenhado separadamente. Atualizações do mapa parado limitadas a oito por segundo. O visor do coletor desenha somente ao mudar enquadramento ou interação.
- Novo coletor didático reconstruído a partir da referência visual K24 indicada, com quatro dutos, plenum, entrada lateral, flange com furos e paredes com espessura. Não foi importado o CAD original.
- Vista em corte e vista completa, rotação por arraste, reenquadramento, enquadramento central e isolamento do modelo ao slide 1 conferidos em 16:9 e 4:3.
- Modelos GLB completo/em corte exportados e prévias inspecionadas visualmente. Fonte e referências em `modelos/coletor-k24/REFERENCIAS.md`.
- Testes completos de avanço, retorno, derrapagem, impacto único, repetição e cancelamento aprovados: 827 quadros monitorados em 16:9 e 1.093 em 4:3, sem cortes do carro e sem requisições HTTP/HTTPS.
- Sem interseções entre terreno e asfalto nas amostras geométricas; relação entre velocidades final/inicial da derrapagem de 1,0045 e 1,0060.

Resultados estruturados: `desempenho.json` e `validacao-floresta.json`.

## Floresta detalhada e estrada sem pontas — 10/11/2026

Testes executados antes do commit, com `verificar-prototipo.mjs`, em contexto de navegador offline. O resumo estruturado está em `validacao-floresta.json`.

- 4.010 árvores e 20 variantes, com 956 a 1.596 triângulos nos modelos próximos. Modelos de conífera, copa larga e árvore seca renderizados de perto, reunidos em galeria e exportados em GLB.
- Conferência visual das seis cenas em 1600 × 900 e 1280 × 960, incluindo a vista aérea. Árvores e grama afastadas dos marcadores; POV considera copas próximas ao escolher o enquadramento.
- Uso de modelos simplificados à distância, preservando os detalhados próximos ao carro. Copas e suas sombras usam a mesma oscilação leve.
- Circuito externo fechado, preservando as cinco paradas. Distância entre as extremidades da malha fechada: zero; não há pontas abertas.
- Conferência da superfície triangular efetivamente renderizada do terreno: nenhuma interseção com o asfalto nas amostras centrais e laterais de todo o circuito; separação mínima de 0,1477 unidade da cena.
- Sinalização integrada ao material do asfalto, eliminando as camadas de geometria sobrepostas. Plano próximo da câmera ajustado para melhorar a precisão de profundidade na vista geral.
- 419 quadros monitorados em 16:9 e 459 em 4:3, sem cortes do carro nos limites da tela. Navegação, retorno da conclusão, repetição e cancelamento conferidos.
- Relação entre velocidade final e inicial da derrapagem: 1,0015 em 16:9 e 1,0070 em 4:3. Não houve desaceleração artificial antes do contato com o tronco. A parada brusca e a deformação ocorrem no impacto.
- Um impacto por execução, fogo posterior, marcas progressivas dos pneus e restauração do carro ao cancelar.
- Nenhum erro JavaScript/compilação de shader registrado e nenhuma requisição HTTP/HTTPS.

As capturas e o relatório completo são recriados em `.producao/qa-floresta/`. A galeria e as prévias dos modelos ficam em `modelos/arvores/`.

## Cenário colorido e derrapagem contínua — 10/11/2026

- Terreno com altura derivada da estrada e transição para relevo natural; vegetação e pedras posicionadas pela mesma função de altura.
- Paleta verde, asfalto escuro, faixas amarelas e iluminação quente. Nenhuma imagem de referência foi incorporada ao cenário.
- Logo do capô conferida em vista aproximada pela frente, sem espelhamento.
- Marcas criadas pelas posições dos pneus traseiros e reveladas por segmentos. Teste confirmou crescimento de 2 para 58 amostras ao longo da derrapagem, sem revelar segmentos futuros.
- Velocidade não nula na passagem da viagem à derrapagem, sem a parada intermediária anterior.
- Impacto frontal único, fogo posterior, navegação e cancelamento verificados offline, incluindo 16:9 e 4:3.
- Modelo amassado reexportado com a orientação corrigida da marca.

Atualização de 10 de novembro de 2026: cenário preenchido por floresta extensa com malhas instanciadas e variações determinísticas; corredor da estrada e local do impacto preservados. Marca vetorial adicionada sobre o capô. Modelo amassado e prévia reexportados com essa marca. Execução offline, batida, navegação e enquadramentos novamente conferidos. A versão atual do repositório contém apenas os recursos do protótipo; a apresentação anterior permanece no histórico.

Verificações realizadas em 9 de novembro de 2026, no Microsoft Edge, por execução automatizada da página local em contexto com rede bloqueada.

- Abertura direta por `file://`, sem servidor.
- Nenhuma requisição HTTP/HTTPS e nenhum erro de JavaScript durante o percurso.
- Avanço pelas cinco paradas e chegada ao sexto slide, de conclusão.
- Retorno da conclusão à quinta parada mantendo o carro na mesma posição.
- Troca distante pela lista com fade de saída e entrada, sem viagem intermediária.
- Seleção direta de um slide durante um percurso, interrompendo o movimento e chegando ao destino escolhido.
- Lista com seis slides, janela de cinco números completos e rolagem para os demais.
- Ausência de pontos amostrados da superfície da estrada dentro do retângulo de conteúdo em todas as seis composições, em 1600 × 900 e 1280 × 960.
- Verificação da posição dos oito cantos da caixa que envolve o carro em todos os quadros monitorados, sem cortes do veículo na tela.
- Conferência visual dos enquadramentos, da área branca para conteúdo e da visão geral com o mapa completo.

A verificação geométrica usa amostragem da largura inteira da estrada, com margem adicional na escolha do POV. Não substitui conferir o conteúdo real quando ele for inserido. O retângulo tem 43% da largura e 52% da altura da janela. Textos e imagens reais ainda são uma etapa posterior.

## Movimento sincronizado de três segundos

- Vinte e duas transições verificadas, incluindo avanço, retorno e a entrada/saída da conclusão, em 16:9 e 4:3.
- Duração medida média de 2,98 segundos entre o primeiro quadro em movimento e a chegada; duração programada de 3,00 segundos.
- Câmera em movimento desde o início do percurso do carro.
- Velocidade média da câmera no início e no fim inferior à velocidade média no trecho central, em todas as transições verificadas.
- Carro e câmera imóveis após a chegada, sem movimento residual ou ajuste tardio de enquadramento.
- Verificação dos limites do carro inteiro durante os movimentos, incluindo as órbitas e o afastamento para a conclusão.
- Seleção por fade e interrupção de uma viagem pela barra de slides preservadas.

O percurso, a órbita e a composição usam uma única curva de tempo com velocidade e aceleração nulas na partida e na chegada. Não há mais espera pela borda da tela nem correção posterior à parada. A suavidade visual também depende da taxa de quadros que o equipamento consegue renderizar.

## Batida na quinta parada

- Percurso normal até a quinta parada seguido pela sequência adicional de três segundos.
- Perda de controle e saída da estrada antes do contato com a árvore.
- Um único impacto por execução, com deformação progressiva da dianteira.
- Alinhamento frontal com o tronco verificado pela direção do carro e a posição da árvore.
- Fogo iniciado somente após o impacto, seguido de fumaça; efeitos gerados em tempo real, sem mídia externa.
- Carro imóvel após a batida e sem repetição automática do impacto.
- Retorno da conclusão mantendo o carro amassado, sem novo impacto.
- Repetição explícita pelo botão 05 e cancelamento pela seleção de outro slide.
- Carro inteiro dentro da tela durante a sequência em 16:9 e 4:3, mantendo a estrada fora do retângulo de conteúdo no enquadramento final.
- Exportação de `carro-amassado.glb` com malhas, hierarquia e materiais, sem fogo ou cenário incorporados. Deformação aplicada às posições dos vértices, com normais recalculadas.
- Prévia do modelo conferida para preservar vidros laterais e marca, com a dianteira encurtada e o capô amassado.

O cenário é uma representação visual hipotética. A geometria amassada e as chamas não constituem previsão de dano estrutural ou de ocorrência de incêndio.

Ainda dependem de teste no local: passador físico, projeção, desempenho da máquina de apresentação e eventuais políticas do navegador corporativo. Não foi necessário alterar a segurança do navegador para os testes locais.
