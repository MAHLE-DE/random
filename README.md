# Jornada MAHLE — protótipo 3D offline

Abra **[prototipo-mapa/iniciar.html](prototipo-mapa/iniciar.html)** no Edge ou Chrome. O arquivo pode ser copiado sozinho para outro computador: contém código, biblioteca, modelo e marca. Não precisa de internet, instalação, servidor ou vídeo.

São dez paradas, uma para cada severidade de 1 a 10, conectadas por uma estrada contínua, mais a conclusão com visão geral. As distâncias entre as paradas aumentaram em aproximadamente 80%; carro e câmera se movimentam juntos em transições de 2,5 segundos. A marca MAHLE fica no canto superior direito de cada slide e no capô.

A floresta tem 20 variantes com folhas, cerca de 13 mil árvores, sem raízes externas, com galhos, copas irregulares e vento leve. Corredores visuais mantêm carro e números livres de árvores nas paradas; o acidente termina com câmera baixa, mostrando o carro diante do tronco. A estrada continua da esquerda para a direita na vista geral, sem pontas visíveis. Veja a [galeria de árvores](modelos/arvores/galeria.png).

O primeiro slide apresenta **marcação dos componentes — severidade 1**: ausência de efeito nas funções primárias e secundárias, com ressalva separada para rastreabilidade e possível custo à MAHLE. O painel está centralizado e ocupa 80% da largura e da altura da tela, com fundo branco e 15% de transparência. Fontes maiores, contraste reforçado e severidade em azul e negrito facilitam a leitura. O coletor 3D exibe três áreas sem gravação: data de injeção, número do componente e cavidade.

Os slides **2, 3 e 4** apresentam aparência, percepção tátil e ruído como exemplos de incômodo ligeiro, moderado e intenso. Os três tipos de exemplo podem ocupar qualquer uma dessas três severidades: a nota acompanha a intensidade do efeito percebido. O coletor mostra manchas e marcas, relevo áspero com mãos 2D e ondas sonoras animadas.

Nos quatro primeiros slides, arraste o modelo para girar e use a roda do mouse ou **− / +** para zoom. O botão de foco destaca o tema do slide. O enquadramento se adapta ao ângulo e à janela, mantendo o coletor inteiro, com margem nas bordas. **Reenquadrar** restaura a vista inicial; o botão de corte alterna as versões. [Modelos editáveis, prévias e referências](modelos/coletor-k24/REFERENCIAS.md). Os conteúdos das severidades 5 a 10 serão desenvolvidos gradualmente.

- **Espaço / →:** avançar. **←:** voltar. **F:** tela cheia.
- A barra inferior esquerda mostra cinco números por vez e permite saltos com fade.
- **10:** perda de controle, batida frontal em árvore, deformação, fogo e fumaça. Selecione 10 novamente para repetir.
- **Fim:** conclusão com visão geral do mapa.

Consulte [operação e reprodução](prototipo-mapa/README.md) e [validação](prototipo-mapa/validacao.md). O [modelo amassado](modelos/carro-amassado.glb) e sua [prévia](modelos/previa-carro-amassado.png) estão separados.

## Estrutura

- `prototipo-mapa/`: protótipo autossuficiente, interface e fontes editáveis.
- `modelos/`: carro, árvores e coletor K24 didático, com variantes e prévias.
- `midias/`: fontes vetoriais da marca.
- `fontes/vendor/`: Three.js, exportador GLB e licença.

O repositório atual foi limpo para concentrar este protótipo. A apresentação anterior e seus recursos continuam no histórico do Git. Não foi reescrito o histórico.

Para continuar em outra máquina: `git pull --ff-only`. Ao encerrar alterações, fazer commit e push para manter as máquinas sincronizadas. Somente a produção exige ferramentas de programação; a apresentação requer apenas navegador com WebGL.
