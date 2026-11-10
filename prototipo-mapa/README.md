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

São cinco paradas e um sexto slide de conclusão. O carro percorre uma estrada 3D única, com curvas, diagonais e desníveis. A distância entre as paradas é a mesma do primeiro protótipo. A duração-base do percurso foi reduzida em 20%, preservando aceleração e desaceleração suaves.

Nas paradas, a câmera reserva um retângulo de 43% da largura e 52% da altura da janela para a apresentação, alternando os lados. A posição, altura e azimute são escolhidos por projeção da estrada completa, evitando a área reservada. Um fundo branco no retângulo mantém elementos decorativos afastados da leitura. Durante a viagem, o conteúdo some e a estrada pode atravessar o centro.

A câmera começa a acompanhar o carro quando ele se afasta do enquadramento inicial ou se aproxima da borda. Ela orbita e ajusta altura durante o percurso, chegando à composição lateral da próxima parada. O carro permanece parado até o próximo comando. Não há direção manual.

Depois da quinta parada, Avançar abre a conclusão: o carro permanece na última posição e a câmera se afasta para apresentar o mapa inteiro. Voltar retorna ao enquadramento da quinta parada. A visão geral não tem botão separado.

O conteúdo mostrado nos retângulos é apenas uma indicação de espaço. O coletor e o conteúdo técnico ainda não foram reinseridos.

## Fontes e reprodução

- `movimento.js`: mapa, carro, enquadramentos, animação e navegação.
- `interface.html`: interface e espaços de conteúdo.
- `gerar.mjs`: incorpora Three.js 0.170.0, o GLB original e o SVG em um HTML autossuficiente.
- Biblioteca e licença: `../fontes/vendor/three.module.js` e `../fontes/vendor/LICENCA-THREE.txt`.
- Modelo: `../modelos/carro.glb`. Marca: `../midias/mahle-azul.svg`.

Somente para editar e reconstruir, em uma máquina de produção com Node.js: `node prototipo-mapa/gerar.mjs`, a partir da raiz do repositório. Isso não é necessário para apresentar.

O arquivo bloqueia conexões de rede e mídias por sua política de conteúdo. Usa WebGL e depende de suporte gráfico no navegador. Os enquadramentos foram verificados em 16:9 e 4:3. Uma projeção real e o passador físico ainda devem ser conferidos no equipamento da apresentação.
