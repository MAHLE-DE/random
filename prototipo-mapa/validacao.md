# Validação do protótipo

## Distribuição de ar em S7.2 — 11/11/2026

- Limpeza interna foi removida do roteiro, das cenas e da navegação. A distribuição de ar passou a S7.2, imediatamente após resistência química. A apresentação tem 13 funções, 14 telas e 30 etapas em dez paradas; as linhas 10 e 12 da planilha de referência não são apresentadas.
- Duas etapas: coletor transparente com alimentação semelhante entre runners; depois, desbalanceamento do runner 4, mais distante da entrada. O avanço depende de clique ou seta; a animação não troca a etapa automaticamente.
- O fluxo usa 24 curvas tridimensionais com trechos curtos animados. Na segunda etapa, R1–R3 mantêm seis trajetórias, enquanto R4 mantém duas, com menor velocidade e intensidade. A mudança ocorre gradualmente durante 1,8 segundo.
- Uma seção transversal perpendicular à tangente do quarto runner pulsa em vermelho. Ela representa falta de ar, não uma barreira física. O percurso dos trechos e a pulsação usam limites fixos e não provocam aproximação/afastamento no loop.
- Dois gráficos simples ficam dentro do visor 3D: barras dos quatro runners e curva de desempenho abaixo da referência. Não são exibidos valores de vazão, potência ou torque. Identificadores R1–R4 relacionam os dutos às barras.
- Em janelas largas os gráficos ficam à direita; em janelas altas ficam abaixo. O enquadramento considera os trajetos e a geometria visível e mantém espaço para os gráficos, sem sobrepor modelo, legendas ou navegação. Capturas inspecionadas em 1600×900, 1280×720 e 1280×960.
- O botão de transparência aparece apenas na distribuição de ar, iniciado ativo. Os demais roteiros preservam seus efeitos internos de transparência sem esse controle. Botão, corte, giro, foco, retorno ao equilíbrio e remoção dos gráficos na saída foram testados.
- Regressão geral aprovada nas três resoluções: 90 estados, 117 focos de legenda, navegação das 13 funções e cinco transições na mesma parada. O teste específico de corrosão também passou novamente, incluindo a passagem direta para a nova S7.2.
- Sem erros JavaScript/WebGL ou solicitações HTTP/HTTPS reportados. Relatórios e capturas em `.producao/qa-distribuicao/`, `.producao/qa-corrosao/` e `.producao/qa-completa/`. Nenhuma dependência externa nova; hash LF e resumos em `validacao-completa.json`.

As seções abaixo registram versões anteriores.

## Corrosão metálica e remoção de S6.3 — 11/11/2026

- S6.3 foi removido do roteiro, da navegação e das cenas. A conclusão e a documentação foram atualizadas para 14 funções, 15 telas e 34 etapas, mantendo dez paradas. S6.2 segue diretamente para S7.1; a linha 10 da planilha de referência não é apresentada.
- S7.1 tem duas etapas e oito componentes metálicos montados nos furos reais da flange: dois insertos roscados e seis limitadores. A primeira usa metal claro, reflexivo e sem corrosão, com corpos ocos, roscas e detalhes das bordas.
- Ao avançar, a vista aproxima um inserto e um limitador em 2,9 segundos. Pontos de ferrugem crescem, o brilho diminui e a microtextura aumenta ao longo de 4,4 segundos. O material da carcaça permanece original.
- Um indicador acima do visor acompanha a passagem de tempo até “Após exposição em serviço”, sem atribuir escala de horas ou anos. A progressão é monotônica e não avança o slide automaticamente.
- As legendas permitem aproximações individuais. Reenquadrar retorna ao coletor inteiro mantendo a corrosão; voltar à primeira etapa restaura o metal novo. Giro ou zoom manual interrompem a vista automática, enquanto a evolução do metal continua até o fim.
- Teste específico de corrosão aprovado em 1600×900, 1280×720 e 1280×960: navegação sem S6.3, câmera inicial sem salto, zoom, tempo, retorno, foco, corte, rotação e interrupção manual. Capturas inspecionadas no estado novo e corroído.
- Regressão geral aprovada: 102 estados nas três resoluções, 126 focos de legenda, navegação das 14 funções e seis transições na mesma parada. As suítes de embalagem/rastreio e manutenção também passaram novamente.
- Sem erros JavaScript/WebGL ou conexões HTTP/HTTPS reportados. Relatórios e capturas em `.producao/qa-corrosao/`, `.producao/qa-completa/`, `.producao/qa-embalagem-rastreio/` e `.producao/qa-servico/`. Nenhuma dependência nova; texturas e reflexos são gerados localmente. Hash LF e resumos em `validacao-completa.json`.

As seções abaixo registram versões anteriores.

## Acesso de manutenção em duas etapas — 11/11/2026

- Primeira etapa com parafuso parcialmente solto na flange, rosca exposta, folga e destaque pulsante. As legendas distinguem o fixador, a flange e os parafusos apertados.
- Na segunda, seis grupos aparecem com fade em sequência: bloco/cabeçote, acessórios, travessa obstrutora, delimitações translúcidas do compartimento, chave e indicações de bloqueio. A vista parte da orientação deixada pelo apresentador e muda suavemente por 2,65 segundos.
- O coletor está montado na face de admissão do cabeçote, junto à flange original. A chave em L tem soquete sextavado aberto e eixo paralelo ao fixador. A travessa acima do coletor impede a inserção.
- O movimento repete descida, contato e recuo em ciclos de 2,4 segundos. Foram observados contatos sem penetração da travessa, curso de 0,94 unidade e variação nula na distância de câmera durante o loop. X vermelho, trajetória e aviso de falta de passagem reforçam o impedimento.
- Testes específicos aprovados em 1600×900, 1280×720 e 1280×960. Verificadas as opacidades intermediárias dos seis fades, rotação durante o loop, foco das legendas, retorno e reentrada, sem avanço automático nem deslocamento do carro.
- Regressão completa aprovada: 38 etapas, 114 estados nas três resoluções, 135 focos de legenda, navegação das 15 funções e sete transições na mesma parada. Embalagem e rastreabilidade também passaram novamente na suíte específica.
- Capturas inspecionadas em três resoluções e no instante de contato. Relatórios em `.producao/qa-servico/`, `.producao/qa-completa/` e `.producao/qa-embalagem-rastreio/`. Zero erros JavaScript/WebGL e zero requisições HTTP/HTTPS reportados.
- As dimensões e a montagem são ilustrativas; não foram acrescentadas dependências externas. O hash LF do HTML e os resumos estão em `validacao-completa.json`.

As seções abaixo registram versões anteriores.

## Frases sensoriais, embalagem e rastreabilidade — 11/11/2026

- S2–S4 usam as frases completas “Sensação percebida ligeiramente/moderadamente/muito desagradável”. A fonte é dimensionada pela largura disponível, sem corte ou reticências; as três frases foram verificadas em uma linha nos três tamanhos de tela.
- S5 foi reconstruída em duas etapas: caixa de papelão opaca e fechada; abertura por duas abas articuladas e vista superior inclinada. A animação dura 2,4 segundos e começa na orientação deixada pelo apresentador, sem salto inicial. O movimento automático da vista pode ser interrompido por interação manual.
- Quatro juntas são posicionadas nos bocais dos runners; uma fica parcialmente deslocada. Seis limitadores de compressão metálicos atravessam furos existentes e dois ficam soltos no fundo. A seleção das legendas prioriza os detalhes internos no enquadramento.
- S6.1 mantém três etapas. A primeira tem etiqueta com QR, part number, lote, série e cavidade; a segunda mostra campos ausentes e interrogações no 3D; a terceira amplia o problema para seis réplicas do coletor. Marcas de canto demarcam a região de identificação.
- O QR codifica somente texto demonstrativo local, coerente com os identificadores impressos. A matriz de 33 módulos está incluída no repositório e no HTML, sem dependência de rede ou de biblioteca de QR na apresentação.
- Área 3D ampliada em S5 e S6.1, com legendas por etapa e alvos ancorados nos elementos correspondentes. As réplicas compartilham geometria, e a saída/reentrada do lote foi testada para evitar invalidação do modelo original.
- Testes específicos aprovados em 1600×900, 1280×720 e 1280×960. Regressão geral: 117 estados, 135 focos de legenda, sete transições na mesma parada e navegação pelas 15 funções. S4 mantém sua distância de câmera constante durante a vibração.
- Sem erros JavaScript/WebGL reportados e sem conexões HTTP/HTTPS. Capturas em `.producao/qa-embalagem-rastreio/` e `.producao/qa-completa/`. Hash LF e resumos em `validacao-completa.json`.

As seções abaixo são registros históricos de versões anteriores.

## Refino S3/S4 — 11/11/2026

- S3 e S4 têm uma única etapa, com efeitos ativos desde a entrada; o roteiro completo passa a 40 etapas. S1/S2 e as funções seguintes mantêm seus dados e etapas anteriores.
- S3 inicia com rugosidade e duas mãos, sem representação de fluxo de ar. A linha de partição foi construída como ressalto sobre o topo do plenum, fora da lateral rugosa. O balão 2 coincide com esse relevo.
- O balão 3 passa a identificar o canto superior direito da flange, com um contorno em L nas duas faces. Não há mais uma legenda de contato apontando para uma área sem elemento correspondente.
- Os três alvos da S3 estão visíveis na entrada. Selecionar a linha em corte restaura a tampa; selecionar os detalhes permite vê-los sem ativar transparência.
- S4 já inicia com a coloração azul, as ondas, o anel 3D, o espectro de 30 barras e a representação de ar preservados. A expansão do anel usa um volume máximo fixo para enquadramento; a animação não reposiciona a câmera.
- Vibração angular limitada a ±0,0015 rad (cerca de ±0,086°). Nas três resoluções, a amostragem temporal confirmou variação zero na distância da câmera, com posição, zoom e escala constantes. O giro e o zoom manuais continuam disponíveis.
- Testes específicos de S3/S4 e regressão geral aprovados em 1600×900, 1280×720 e 1280×960: 120 estados de demonstração, 135 focos de legenda e sete cenários de fade na mesma parada.
- Sem erros JavaScript/WebGL reportados e sem conexões HTTP/HTTPS. Capturas específicas em `.producao/qa-s34/` e regressão em `.producao/qa-completa/`. Hash normalizado LF e resumos em `validacao-completa.json`.

As seções abaixo são registros históricos de versões anteriores.

## Refino S1/S2 e transições — 11/11/2026

- Fade entre funções da mesma parada limitado a `#slide-content`: painel branco, carro, câmera e mapa permanecem visíveis. O conteúdo é substituído na opacidade zero; o novo modelo já está desenhado antes de reaparecer.
- Fase extra de inspeção removida de todas as funções. O roteiro passa de 58 para 42 etapas reais; S2 tem uma única etapa. Rotação, zoom, corte e reenquadramento continuam disponíveis durante as etapas.
- Mapeador de demonstração guiada e botão de inspeção removidos. A coluna esquerda fica reservada ao texto explicativo.
- S1 e S2 sem animação de ar e sem função de transparência, inclusive na seleção das legendas.
- S2 já inicia com manchas orgânicas localizadas na lateral esquerda, quatro marcas curvas de fluxo do polímero no topo central e uma faixa ampla de tonalidade no topo direito. A faixa de tom é lisa e contínua, sem o aspecto de mancha ou adesivo retangular. Vista inicial e alvos das legendas ajustados para as três regiões.
- Textos e etapas de S3 a S10 comparados ao commit anterior: preservados, exceto pela remoção da inspeção final solicitada. O último cenário de cada função mantém seus efeitos.
- Regressão aprovada em 1600×900, 1280×720 e 1280×960: 126 estados, 135 focos de legenda, giro, zoom máximo, corte e navegação por todas as 15 funções. S1/S2 verificados sem redesenho contínuo quando não há interação.
- Sete transições na mesma parada verificadas quadro a quadro, incluindo avanço, retorno e seleção direta: conteúdo chega a zero e volta a um, painel permanece em opacidade um, véu global fica em zero e carro/câmera não mudam.
- Sem erros JavaScript/WebGL reportados e sem conexões HTTP/HTTPS. Relatório e capturas em `.producao/qa-completa/`. O hash de `validacao-completa.json` considera o HTML normalizado para LF, como no Git.

As seções abaixo são registros históricos de versões anteriores.

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
