# Validação do protótipo

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
