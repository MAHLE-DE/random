# Operação da apresentação

## Arquivos

- `entrega/qualidade-mahle.pptx`: versão principal, 28 cenas, mídias incorporadas e cadeias editáveis por clique.
- `entrega/qualidade-mahle-estatica.pptx`: mesmas 28 cenas com conteúdo completo visível e imagens estáticas.
- `entrega/qualidade-mahle-contingencia.pptx`: 14 cenas essenciais, estáticas, para interrupção ou tempo reduzido. Pelos tempos do roteiro de origem, cerca de 31 minutos, ajustáveis pelo apresentador. Inclui o efeito potencial de severidade 10 e o encerramento positivo.

Todos os arquivos são 16:9. Não há macros, chamadas de rede nem mídia vinculada. Não é preciso instalar Blender, Three.js ou FFmpeg no equipamento que apresenta.

## Início e comandos

Copiar o PPTX escolhido para uma pasta local e abrir no PowerPoint. Pressionar F5 para iniciar ou Shift+F5 para iniciar na cena selecionada. As transições ambientais não avançam slides. Clique, espaço, seta direita ou passador acionam a próxima etapa ou cena. A seta esquerda volta uma etapa de animação ou uma cena. Para ir diretamente a uma cena, digitar o número e Enter.

As cadeias causais da versão principal aparecem por etapas. Nas cenas 3, 4, 12, 13, 14, 15, 16, 20, 21 e 22, um clique adicional aciona o mecanismo técnico. A cena do acidente aparece uma única vez por acionamento e não se repete automaticamente. Para repetir deliberadamente uma cena, retornar à anterior e avançar novamente. Não repetir o impacto durante a exposição normal.

Para ir diretamente à dinâmica: digitar `27` e Enter durante a apresentação principal. Para encerrar: Esc. Para reiniciar: F5. Para retomar: selecionar a cena na edição e Shift+F5. Se houver falha de mídia, abrir a versão de segurança e continuar pelo mesmo número de cena. Não existe estado persistente de macro a recuperar.

Na versão reduzida, a dinâmica é a cena 13 e o fechamento é a cena 14. O roteiro de origem mantém a numeração da apresentação principal; a correspondência está abaixo.

## Mapa da versão reduzida

| Cena reduzida | Cena principal |
|---:|---:|
|1|1|
|2|3|
|3|4|
|4|5|
|5|6|
|6|9|
|7|13|
|8|16|
|9|18|
|10|21|
|11|22|
|12|24|
|13|27|
|14|28|

## Edição e casos reais

Títulos, mensagens, critérios, cadeias causais, legendas, barreiras e notas são objetos editáveis. Os enquadramentos 3D e deslocamentos são imagens/vídeos pré-renderizados. Os GLB de carro, coletor, motor e estrada e o código-fonte da cena permitem reutilização em ferramenta 3D compatível. Os GLB possuem componentes nomeados separadamente. Os paths da marca estão em SVG independente e nos dois lados do carro.

As cenas técnicas têm uma moldura denominada `Espaco_para_imagem_real_aprovada`. É possível inserir ali foto, mapa dimensional, corte ou resultado de ensaio aprovados. A moldura e a legenda podem ser removidas ao inserir o caso real. Não sobrepor uma foto à ilustração se isso prejudicar a compreensão. Os vídeos correspondentes também devem ser ajustados se a evidência substituir o mecanismo mostrado.

Não existem valores dimensionais, pressões de ruptura, limites de estanqueidade, taxas de falha ou resultados de simulação inventados. O fluxo é uma representação qualitativa. Inserir apenas limites e dados aprovados.

## Fontes

A tipografia escolhida é Arial, disponível no Windows verificado. Arial é a substituta segura para o texto. A marca não depende de fonte, pois é vetor. Se houver substituição de fonte ao abrir em outro equipamento, usar Arial e conferir quebra de linha antes da apresentação. Não redistribuir arquivos de fonte proprietária separadamente.

## Recuperação e validação no local

Antes do workshop, testar a abertura da versão principal na compilação 20430.20180 indicada no prompt. Testar F5, avance e retorno, vídeo das cenas 20/22, modo sem rede e passador físico. Esta validação específica não pode ser substituída por uma checagem estrutural do arquivo.

As cenas 3, 4, 20 e 22 concentram maior atenção gráfica. Se a reprodução ficar irregular, usar a versão de segurança em vez de alterar configurações corporativas. Não é necessário habilitar macro, instalar complemento ou conceder acesso administrativo.
