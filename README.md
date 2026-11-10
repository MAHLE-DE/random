# Jornada MAHLE — protótipo 3D offline

Abra **[prototipo-mapa/iniciar.html](prototipo-mapa/iniciar.html)** no Edge ou Chrome. O arquivo pode ser copiado sozinho para outro computador: contém código, biblioteca, modelo e marca. Não precisa de internet, instalação, servidor ou vídeo.

São cinco paradas conectadas por uma estrada contínua e um sexto slide de conclusão. Carro e câmera se movimentam juntos em transições de três segundos. Há espaços reservados para conteúdo, uma floresta ampla e logo MAHLE nas laterais e no capô.

A floresta tem 20 variantes e cerca de 5,6 mil árvores, sem raízes externas, com galhos, copas irregulares e vento leve. A estrada continua da esquerda para a direita na vista geral, sem pontas visíveis. Veja a [galeria de árvores](modelos/arvores/galeria.png). O desenho das instâncias e das sombras foi otimizado para reduzir o custo das animações.

O primeiro slide já tem o **coletor de admissão 3D**, reconstruído a partir da referência K24 indicada: arraste para girar e alterne entre corte e conjunto completo. [Modelos editáveis, prévias e referências](modelos/coletor-k24/REFERENCIAS.md). Os demais slides continuam reservados para desenvolver o conteúdo gradualmente.

- **Espaço / →:** avançar. **←:** voltar. **F:** tela cheia.
- A barra inferior esquerda mostra cinco números por vez e permite saltos com fade.
- **05:** perda de controle, batida frontal em árvore, deformação, fogo e fumaça. Selecione 05 novamente para repetir.
- **06:** conclusão com visão geral do mapa.

Consulte [operação e reprodução](prototipo-mapa/README.md) e [validação](prototipo-mapa/validacao.md). O [modelo amassado](modelos/carro-amassado.glb) e sua [prévia](modelos/previa-carro-amassado.png) estão separados.

## Estrutura

- `prototipo-mapa/`: protótipo autossuficiente, interface e fontes editáveis.
- `modelos/`: carro, árvores e coletor K24 didático, com variantes e prévias.
- `midias/`: fontes vetoriais da marca.
- `fontes/vendor/`: Three.js, exportador GLB e licença.

O repositório atual foi limpo para concentrar este protótipo. A apresentação anterior e seus recursos continuam no histórico do Git. Não foi reescrito o histórico.

Para continuar em outra máquina: `git pull --ff-only`. Ao encerrar alterações, fazer commit e push para manter as máquinas sincronizadas. Somente a produção exige ferramentas de programação; a apresentação requer apenas navegador com WebGL.
