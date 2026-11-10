# Validação do protótipo

Verificações realizadas em 9 de novembro de 2026, no Microsoft Edge, por execução automatizada da página local em contexto com rede bloqueada.

- Abertura direta por `file://`, sem servidor.
- Nenhuma requisição HTTP/HTTPS e nenhum erro de JavaScript durante o percurso.
- Avanço pelas cinco paradas e chegada ao sexto slide, de conclusão.
- Retorno da conclusão à quinta parada mantendo o carro na mesma posição.
- Troca distante pela lista com fade de saída e entrada, sem viagem intermediária.
- Seleção direta de um slide durante um percurso, interrompendo o movimento e chegando ao destino escolhido.
- Lista com seis slides, janela de cinco números completos e rolagem para os demais.
- Ausência de pontos amostrados da superfície da estrada dentro do retângulo de conteúdo em todas as seis composições, em 1600 × 900 e 1280 × 960.
- Monitoramento de 1.861 quadros durante movimentos, sem exceder a margem de segurança definida para a posição do carro na tela.
- Conferência visual dos enquadramentos, da área branca para conteúdo e da visão geral com o mapa completo.

A verificação geométrica usa amostragem da largura inteira da estrada, com margem adicional na escolha do POV. Não substitui conferir o conteúdo real quando ele for inserido. O retângulo tem 43% da largura e 52% da altura da janela. Textos e imagens reais ainda são uma etapa posterior.

Ainda dependem de teste no local: passador físico, projeção, desempenho da máquina de apresentação e eventuais políticas do navegador corporativo. Não foi necessário alterar a segurança do navegador para os testes locais.
