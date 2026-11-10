# Protótipo da jornada 3D

Abra **[iniciar.html](iniciar.html)** no Microsoft Edge ou Google Chrome. O arquivo contém a biblioteca gráfica, o modelo do carro, a marca, a interface e a animação. Pode ser copiado sozinho para outro computador. Não requer instalação de ferramentas, servidor, acesso à internet ou vídeo.

## Operação

- **Espaço, seta direita ou Page Down:** próximo slide, seguindo o percurso.
- **Seta esquerda ou Page Up:** voltar pelo percurso.
- **F:** entrar ou sair da tela cheia. Escape também sai da tela cheia.
- **Primeiro slide:** arraste o coletor para girar; a roda do mouse e **− / +** controlam o zoom. **Focar marcações** aproxima e orienta o modelo para os três campos sem gravação. Use **Vista em corte / Vista completa** para alternar e **Reenquadrar** para voltar à vista inicial de 110%. O limite de aproximação de 125% mantém a margem de segurança em qualquer ângulo; é possível afastar até 60%.
- **Números no canto inferior esquerdo:** selecionar diretamente um slide com fade de saída e entrada. Um salto interrompe um percurso em andamento.
- **Setas pequenas da lista, rolagem horizontal ou roda do mouse sobre a lista:** navegar pelos números. São cinco números completos visíveis por vez.

Quando um botão numérico tem foco, Enter ou espaço selecionam o slide e as setas percorrem os botões. O botão Avançar continua disponível para percorrer a estrada.

## Comportamento atual

São dez paradas para as severidades de 1 a 10, mais a conclusão, identificada como **Fim** na barra. O carro percorre uma estrada 3D única, com curvas, diagonais e desníveis. O trajeto foi ampliado em 1,8 vez no plano horizontal, mantendo o tamanho do carro, da estrada e das árvores. Cada intervalo tem cerca de 48,6 unidades da cena, aproximadamente 80% mais que antes. Cada transição normal dura 2,5 segundos, incluindo os movimentos de câmera para entrar e sair da conclusão.

Nas paradas, o slide fica centralizado, com 80% da largura e 80% da altura da janela e margens de 10%. O fundo branco tem 85% de opacidade; texto, modelo e logo permanecem opacos. A marca fica dentro do canto superior direito do slide. A severidade é apresentada em azul, negrito e fonte maior; texto e legendas têm contraste reforçado. O cenário aparece através do painel. Durante a viagem, o conteúdo some e a estrada pode atravessar o centro.

A posição, altura e azimute da câmera seguem o mesmo método de composição aprovado anteriormente, agora aplicado ao trajeto maior, independente do painel central. A referência lateral usada para escolher esses POVs está em `composicaoMapa`; as dimensões efetivas do slide estão em `painel`. O empacotador gera o CSS do painel a partir dessa configuração.

A câmera e o carro começam a se mover juntos, no primeiro quadro da transição. Um único relógio controla percurso, órbita, altura e composição, com partida e chegada suaves nas paradas normais. A exceção é a décima cena: o carro mantém o embalo para entrar diretamente na derrapagem. O carro permanece dentro da tela. Não há direção manual.

Depois da décima parada, Avançar abre a conclusão: o carro permanece na última posição e a câmera se afasta para apresentar o mapa inteiro. Voltar retorna ao enquadramento da décima parada. A visão geral não tem botão separado.

Na décima parada, o carro executa uma sequência adicional de três segundos: perde o controle, deixa marcas de derrapagem, sai da estrada e bate de frente em uma árvore. Há um único impacto, seguido pelo amassamento da dianteira e, após um pequeno intervalo, fogo e fumaça em 3D. A cabine e a marca continuam reconhecíveis. O carro fica imóvel após o impacto; o fogo permanece animado. Essa ação acontece depois da viagem normal de 2,5 segundos entre as paradas. A velocidade de entrada na derrapagem acompanha a nova velocidade da viagem, sem pausa ou desaceleração prévia.

Para testar diretamente, selecione **10** na barra. Selecionar **10 novamente** repete a sequência com fade de reinício. Retornar da conclusão à décima parada conserva o estado amassado sem repetir a batida. Voltar da décima para a nona usa fade e restaura o carro intacto; selecionar outro slide também cancela a sequência e seus efeitos.

O [modelo amassado separado](../modelos/carro-amassado.glb) tem geometria deformada já aplicada, sem depender da animação ou de vídeo. A [prévia](../modelos/previa-carro-amassado.png) permite conferir o resultado. A deformação é ilustrativa e não corresponde a uma simulação física ou a um veículo real.

O primeiro slide trata da função de marcar data de injeção, número do componente e cavidade. O texto separa o efeito funcional no sistema, de severidade 1, da ressalva comercial: sem rastreabilidade confiável, um problema no cliente pode exigir ação sobre um conjunto maior de peças e ampliar o custo para a MAHLE. Não atribui outra nota numérica a esse custo. O modelo fica ao lado do texto, sem sobreposição; três superfícies vazias destacam as marcações ausentes. Os demais retângulos continuam reservados para desenvolver o conteúdo slide a slide.

O cenário contém cerca de 13,1 mil árvores distribuídas em grupos e clareiras, com 20 variantes: 12 coníferas, seis árvores de copa larga e duas árvores secas. Os modelos próximos têm entre 856 e 1.496 triângulos, com troncos curvos, galhos e copas assimétricas, sem as raízes externas da versão anterior. A floresta foi estendida para preencher também o canto superior esquerdo da vista geral do trajeto ampliado. Há grama agrupada, pedras, variação de cor no terreno, luz solar quente, preenchimento frio, sombras de 4096 × 4096 e movimento leve das copas.

A árvore do impacto é da mesma família das árvores de copa larga da floresta, com tronco livre na altura do carro. Os marcadores têm clareiras próprias, sem árvores ou grama sobre os discos. As malhas são compartilhadas por instâncias; o nível de detalhe acompanha a proximidade do carro e a visão aérea.

A estrada tem uma continuação externa curva, fechada, que preserva o trajeto original e elimina pontas visíveis. O terreno acompanha toda a estrada. As faixas centrais e laterais são desenhadas no próprio material do asfalto, com suavização de bordas, para evitar camadas sobrepostas e cintilação na vista distante. A logo vetorial MAHLE no capô continua orientada para leitura pela frente.

Na vista geral, a continuação entra pelo lado esquerdo e segue para a direita, em vez de aparecer vindo da borda inferior.

## Coletor do primeiro slide

É uma reconstrução didática própria, inspirada no CAD K24 indicado pelo usuário, com plenum, quatro dutos ocos, flange com furos, entrada lateral e espessuras visíveis. As peças foram separadas para servir de base aos efeitos nos próximos slides. O primeiro enquadramento mostra o corte, como na referência. A vista completa é acessível pelo botão.

Os [modelos GLB e as referências](../modelos/coletor-k24/REFERENCIAS.md) ficam em `modelos/coletor-k24/`. O visor só desenha o coletor quando necessário, sem rotação automática ou atualização contínua durante as viagens do carro.

O enquadramento usa os vértices reais de todas as peças visíveis, incluindo flange e entrada lateral. As nuvens de vértices das versões em corte e completa são preparadas uma vez e reutilizadas. Ao girar, ampliar ou redimensionar a janela, os planos da câmera são recalculados antes do desenho para conter todo o modelo, com margem. O plano que recebe as sombras também fica abaixo da peça na orientação atual. As três legendas têm fonte maior e escura, em caixas claras próprias.

## Desempenho

O campo de visão filtra as instâncias de árvores enviadas à GPU, com margem para os movimentos da câmera e sombras. As árvores próximas continuam detalhadas; as distantes usam versões simplificadas. As sombras estáveis da floresta são reutilizadas e atualizadas ao mudar a região visível; o contato do carro com o solo é desenhado separadamente. Quando o mapa está parado, o desenho do ambiente é limitado a oito atualizações por segundo, mantendo o vento leve sem renderizar a floresta inteira continuamente.

O terreno ampliado é dividido em 20 blocos com bordas idênticas, permitindo desenhar só os blocos enquadrados nas viagens. O solo recebe as sombras e não gera um passe de sombra próprio. A vista aérea usa um volume de sombra centrado no mapa maior; a vegetação de grama prioriza a região do percurso.

Em comparação local da versão anterior, ainda com cinco paradas, no Edge sem interface, em 1600 × 900, os mesmos três deslocamentos passaram de aproximadamente 74,2 ms por quadro para 33,3 ms: cerca de 13,5 para 30 FPS médios. Isso mede esta máquina e aquele percurso, não garante uma taxa específica em todo computador. Método e resultados históricos estão em `desempenho.json`.

Na aproximação da décima parada, o movimento continua diretamente para a derrapagem. A velocidade é controlada pela distância efetivamente percorrida na curva, mantendo o embalo até o impacto, quando ocorre a parada brusca e a deformação. As marcas são geradas quadro a quadro a partir dos pneus traseiros. A seleção direta de 10 reinicia a sequência com fade e uma aceleração inicial curta.

Veja a [galeria de variantes](../modelos/arvores/galeria.png) e os modelos GLB de [conífera](../modelos/arvores/conifera.glb), [copa larga](../modelos/arvores/frondosa.glb) e [árvore seca](../modelos/arvores/seca.glb).

## Fontes e reprodução

- `movimento.js`: mapa, carro, enquadramentos, animação e navegação.
- `dano.js`: geração da variante amassada e deformação progressiva do impacto.
- `coletor.js`: geometria editável do coletor K24 didático e suas versões completa/em corte.
- `visor-coletor.js`: visor com giro, zoom, foco nas marcações, enquadramento automático sem cortes e desenho sob demanda.
- `configuracao.json`: dez paradas, escala do trajeto, duração das transições, medidas do painel e textos do primeiro slide.
- `exportar-coletor.mjs`: modelos GLB e prévias do coletor.
- `medir-desempenho.mjs`: comparação repetível dos três primeiros deslocamentos.
- `vegetacao.js`: modelos das 20 variantes, materiais e oscilação das copas.
- `exportar-arvores.mjs`: geração de modelos GLB editáveis das três famílias.
- `visualizar-modelos.mjs`: renderização das prévias e da galeria de árvores.
- `verificar-prototipo.mjs`: testes offline de geometria, navegação, enquadramentos, derrapagem e cancelamento.
- `exportar-amassado.mjs`: exportação do modelo GLB e da prévia, usando Playwright apenas na máquina de produção.
- `interface.html`: interface e espaços de conteúdo.
- `gerar.mjs`: incorpora Three.js 0.170.0, o GLB original e o SVG em um HTML autossuficiente.
- Biblioteca e licença: `../fontes/vendor/three.module.js` e `../fontes/vendor/LICENCA-THREE.txt`.
- Modelo: `../modelos/carro.glb`. Marca: `../midias/mahle-azul.svg`.

Somente para editar e reconstruir, em uma máquina de produção com Node.js: `node prototipo-mapa/gerar.mjs`, a partir da raiz do repositório. Isso não é necessário para apresentar.

Para reconstruir também o modelo amassado, execute `node prototipo-mapa/exportar-amassado.mjs` em um ambiente de produção com Playwright instalado. O navegador pode ser indicado pela variável `PRESENTATION_BROWSER`. O exportador usa o `GLTFExporter.js` já incluído no repositório e rejeita uma exportação sem malhas.

O arquivo bloqueia conexões de rede e mídias por sua política de conteúdo. Usa WebGL e depende de suporte gráfico no navegador. Os enquadramentos foram verificados em 16:9 e 4:3. Uma projeção real e o passador físico ainda devem ser conferidos no equipamento da apresentação.

Para repetir os testes em um ambiente de produção com Playwright instalado: `node prototipo-mapa/verificar-prototipo.mjs`. Os relatórios e capturas ficam em `.producao/qa-slide-central/`; o diretório pode ser alterado pela variável `QA_OUTPUT`. Incluem giro completo e inclinações nos dois modelos, em três resoluções, no zoom máximo, além da navegação e animações do mapa.
