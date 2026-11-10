# Projetos recorrentes

Repositório de continuidade entre o notebook e o computador corporativo.

Antes de continuar em outra máquina, atualizar com `git pull --ff-only`. Ao encerrar um trabalho, registrar as alterações em commit e enviá-las ao repositório para manter o contexto disponível.

O trabalho atual é a apresentação da Semana da Qualidade da MAHLE em Mogi Guaçu. O conteúdo é inteiramente em português, com fundo predominantemente branco, azuis complementares e logotipo azul no canto superior direito.

O desenvolvimento ativo passou para o **[protótipo interativo offline do mapa 3D](prototipo-mapa/iniciar.html)**. Ele testa o carro percorrendo um mapa contínuo, a câmera móvel, os espaços reservados para apresentação e a navegação por slides. São cinco paradas e uma conclusão com visão geral. Consulte [operação e fontes](prototipo-mapa/README.md). O conteúdo técnico ficará para uma etapa posterior; os PPTX abaixo preservam a versão anterior.

A quinta parada inclui a demonstração de perda de controle, impacto frontal em árvore, deformação e fogo em tempo real. Para repetir, selecione 05 novamente. O [modelo amassado](modelos/carro-amassado.glb) está disponível separadamente.

Os arquivos finais ficam em [`entrega`](entrega/): [principal](entrega/qualidade-mahle.pptx), [estática](entrega/qualidade-mahle-estatica.pptx), [contingência reduzida](entrega/qualidade-mahle-contingencia.pptx) e [visão da jornada](entrega/jornada-completa.png). O contexto técnico está em [`fontes/criterios.md`](fontes/criterios.md) e a correspondência das funções do DFMEA em [`fontes/matriz-dfmea.md`](fontes/matriz-dfmea.md). Os modelos genéricos reutilizáveis ficam em [`modelos`](modelos/), as mídias em [`midias`](midias/) e o roteiro em [`roteiros`](roteiros/).

Para apresentar, basta o PPTX escolhido e o PowerPoint compatível. As bibliotecas e ferramentas de produção não são necessárias. Consulte [`roteiros/operacao.md`](roteiros/operacao.md).

Os casos são hipóteses educativas, sem vínculo com cliente, número de peça, ocorrência real ou dados de produção da MAHLE. As notas originais informadas pelo usuário permanecem na matriz e não constituem uma revisão do DFMEA aprovado.

O projeto contém três versões: principal com animações, segurança estática e contingência reduzida. As especificações originais permanecem em `prompt_apresentacao.txt` e `prompt2.txt`; os esclarecimentos posteriores em conversa têm prioridade, incluindo o uso exclusivo do português e o tema branco.
