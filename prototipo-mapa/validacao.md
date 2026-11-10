# Validação do protótipo

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
