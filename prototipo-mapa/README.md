# Protótipo da jornada 3D

Abra **[iniciar.html](iniciar.html)** no Microsoft Edge ou Google Chrome. O arquivo contém a biblioteca gráfica, o modelo do carro, a marca, a interface e a animação. Pode ser copiado sozinho para outro computador. Não requer instalação de ferramentas, servidor, acesso à internet ou vídeo.

## Operação

- **Espaço, seta direita ou Page Down:** próximo slide, seguindo o percurso.
- **Seta esquerda ou Page Up:** voltar pelo percurso.
- **F:** entrar ou sair da tela cheia. Escape também sai da tela cheia.
- **Números no canto inferior esquerdo:** selecionar diretamente um slide com fade de saída e entrada. Um salto interrompe um percurso em andamento.
- **Setas pequenas da lista, rolagem horizontal ou roda do mouse sobre a lista:** navegar pelos números. São cinco números completos visíveis por vez.

Quando um botão numérico tem foco, Enter ou espaço selecionam o slide e as setas percorrem os botões. O botão Avançar continua disponível para percorrer a estrada.

## Comportamento atual

São cinco paradas e um sexto slide de conclusão. O carro percorre uma estrada 3D única, com curvas, diagonais e desníveis. A distância entre as paradas é a mesma do primeiro protótipo. Cada transição normal dura três segundos, incluindo os movimentos de câmera para entrar e sair da conclusão.

Nas paradas, a câmera reserva um retângulo de 43% da largura e 52% da altura da janela para a apresentação, alternando os lados. A posição, altura e azimute são escolhidos por projeção da estrada completa, evitando a área reservada. Um fundo branco no retângulo mantém elementos decorativos afastados da leitura. Durante a viagem, o conteúdo some e a estrada pode atravessar o centro.

A câmera e o carro começam a se mover juntos, no primeiro quadro da transição. Um único relógio com curva de aceleração suave controla percurso, órbita, altura e composição: a velocidade e a aceleração são nulas nas extremidades, com movimento mais rápido no meio. O carro permanece dentro da tela e o enquadramento final fica pronto exatamente na chegada à parada, sem uma correção de câmera após o veículo parar. O carro permanece parado até o próximo comando. Não há direção manual.

Depois da quinta parada, Avançar abre a conclusão: o carro permanece na última posição e a câmera se afasta para apresentar o mapa inteiro. Voltar retorna ao enquadramento da quinta parada. A visão geral não tem botão separado.

Na quinta parada, o carro executa uma sequência adicional de três segundos: perde o controle, deixa marcas de derrapagem, sai da estrada e bate de frente em uma árvore. Há um único impacto, seguido pelo amassamento da dianteira e, após um pequeno intervalo, fogo e fumaça em 3D. A cabine e a marca continuam reconhecíveis. O carro fica imóvel após o impacto; o fogo permanece animado. Essa ação acontece depois da viagem normal de três segundos entre as paradas.

Para testar diretamente, selecione **05** na barra. Selecionar **05 novamente** repete a sequência com fade de reinício. Retornar da conclusão à quinta parada conserva o estado amassado sem repetir a batida. Voltar da quinta para a quarta usa fade e restaura o carro intacto; selecionar outro slide também cancela a sequência e seus efeitos.

O [modelo amassado separado](../modelos/carro-amassado.glb) tem geometria deformada já aplicada, sem depender da animação ou de vídeo. A [prévia](../modelos/previa-carro-amassado.png) permite conferir o resultado. A deformação é ilustrativa e não corresponde a uma simulação física ou a um veículo real.

O conteúdo mostrado nos retângulos é apenas uma indicação de espaço. O coletor e o conteúdo técnico ainda não foram reinseridos.

## Fontes e reprodução

- `movimento.js`: mapa, carro, enquadramentos, animação e navegação.
- `dano.js`: geração da variante amassada e deformação progressiva do impacto.
- `exportar-amassado.mjs`: exportação do modelo GLB e da prévia, usando Playwright apenas na máquina de produção.
- `interface.html`: interface e espaços de conteúdo.
- `gerar.mjs`: incorpora Three.js 0.170.0, o GLB original e o SVG em um HTML autossuficiente.
- Biblioteca e licença: `../fontes/vendor/three.module.js` e `../fontes/vendor/LICENCA-THREE.txt`.
- Modelo: `../modelos/carro.glb`. Marca: `../midias/mahle-azul.svg`.

Somente para editar e reconstruir, em uma máquina de produção com Node.js: `node prototipo-mapa/gerar.mjs`, a partir da raiz do repositório. Isso não é necessário para apresentar.

Para reconstruir também o modelo amassado, execute `node prototipo-mapa/exportar-amassado.mjs` em um ambiente de produção com Playwright instalado. O navegador pode ser indicado pela variável `PRESENTATION_BROWSER`. O exportador usa o `GLTFExporter.js` já incluído no repositório e rejeita uma exportação sem malhas.

O arquivo bloqueia conexões de rede e mídias por sua política de conteúdo. Usa WebGL e depende de suporte gráfico no navegador. Os enquadramentos foram verificados em 16:9 e 4:3. Uma projeção real e o passador físico ainda devem ser conferidos no equipamento da apresentação.
