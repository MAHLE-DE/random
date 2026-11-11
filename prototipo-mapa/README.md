# Operação e roteiro da versão completa

Abra `iniciar.html` no Edge ou Chrome. Esse arquivo é autossuficiente e funciona offline, com WebGL. `F` alterna tela cheia.

## Apresentação

- **→, Espaço, Page Down ou Próxima etapa:** avançar a demonstração. Ao terminar a última etapa real, o mesmo controle abre o próximo slide.
- **←, Page Up ou Voltar:** voltar uma etapa. Na primeira etapa, retornar à última etapa real do slide anterior.
- **Barra inferior:** saltar para um slide e reiniciar sua demonstração. Os números repetidos indicam funções diferentes da mesma severidade.
- **Arraste / roda / − / +:** girar e ampliar o coletor. A câmera mantém a geometria inteira enquadrada.
- **Legendas 1, 2 e 3:** orientar a vista para o alvo e selecionar o indicador correspondente. A partir de S3, regiões ocultas podem ativar transparência para permitir a localização. S1 e S2 orientam a vista sem transparência.
- **Vista em corte, Transparência e Reenquadrar:** inspecionar o interior, alternar opacidade e restaurar a orientação e zoom iniciais.

As animações não avançam o roteiro automaticamente. Transporte, partículas ou ondas podem se movimentar na etapa atual; só outro comando libera a próxima consequência. Não há uma etapa adicional de inspeção: giro, corte, zoom e reenquadramento funcionam durante toda a demonstração. A última etapa mantém o seu cenário e seus efeitos. O mapeador de demonstração guiada foi retirado; a coluna esquerda contém somente o texto explicativo.

## Roteiro

| Parada | Funções na sequência da planilha | Representação |
|---|---|---|
| S1 | Identificação permanente | Campos identificados, apagamento e ampliação do conjunto sob investigação |
| S2 | Aparência | Uma etapa: manchas na lateral, marcas curvas de fluxo no topo central e uma faixa ampla e lisa de tonalidade no topo direito |
| S3 | Rugosidade e tato | Uma etapa: lateral rugosa e mãos, sem ar; linha de partição em relevo no topo e canto vivo destacado na flange |
| S4 | Ruído | Uma etapa: vibração sutil, ondas e espectro ativos; enquadramento fixo, sem aproximar ou afastar automaticamente |
| S5 | Embalagem, transporte e entrega | Duas etapas: caixa fechada; abertura por duas abas com vista superior, uma junta parcialmente solta, seis limitadores montados e dois caídos |
| S6 · 1 | Rastreabilidade | QR e identificadores na peça; campos ausentes com interrogações no 3D; lote ampliado com seis réplicas sem vínculo |
| S6 · 2 | Manutenção e serviço | Duas etapas: parafuso solto; montagem gradual do motor e entorno, com chave em L bloqueada pela travessa e X vermelho em loop |
| S6 · 3 | Produção e montagem interna | Moldagem, união, linha bloqueada e envelopes corrigidos |
| S7 · 1 | Resistência química | Referência e exposição, fissuras, inserto e redução do fluxo |
| S7 · 2 | Limpeza interna | Carcaça translúcida, partículas e congelamento antes da válvula |
| S7 · 3 | Quantidade e distribuição de ar | Fluxo equilibrado, restrição em um ramo, pulsos e torque qualitativo |
| S8 | Água e condensado | Gotas, bolsa de água, aspiração e interrupção da admissão |
| S9 · 1 | Retorno de chama | Pressão inversa, solicitação, fissura e fragmentos contidos |
| S9 · 2 | Estanqueidade | Verificação de fuga, partículas, divergência de medição e diagnóstico |
| S10 | Vácuo para o servofreio | Circuito íntegro, interrupção, esforço no pedal e parada sem colisão |
| Fim | Conclusão | Efeito no sistema, funções primárias e secundárias e intensidade percebida |

Fonte técnica: `../apresentacao_qualidade_completa.xlsx`, `Sheet1!B3:F17`. A nota acompanha o cenário da planilha. As cenas são ilustrações didáticas; não são simulações CFD, análises estruturais ou ensaios de frenagem. A geometria K24 é uma reconstrução própria de referência, sem dimensões de fabricação.

## Edição e reprodução

S2–S4 apresentam a frase completa “Sensação percebida … desagradável”, com ajuste de fonte para uma linha. S5 abre a tampa em uma animação de 2,4 segundos, simultaneamente à mudança de vista; a orientação inicial é a deixada pelo apresentador. Uma interação manual interrompe apenas o movimento automático da vista. As abas continuam a abrir e a cena final fica livre para giro e zoom. Ao focar uma legenda interna, o enquadramento prioriza o coletor e os componentes, permitindo que partes externas das abas saiam da janela.

A etiqueta em S6.1 contém um QR válido que codifica texto didático local, sem URL externa: part number `K24-DEMO-001`, lote `L26-041`, cavidade `04` e série `DEMO-0001`. A matriz está em `codigo-rastreabilidade.json` e é incorporada pelo gerador. Não é um código de produção. Na última etapa, as seis peças reutilizam a geometria existente e têm indicadores de identificação ausente.

Para a regressão específica, execute `node prototipo-mapa/verificar-embalagem-rastreio.mjs`. Capturas e relatório ficam em `.producao/qa-embalagem-rastreio/`.

S6.2 mostra primeiro o fixador solto, com folga e rosca exposta. Na segunda etapa, seis grupos surgem em sequência: bloco/cabeçote, acessórios, travessa, contorno transparente do compartimento, chave e sinais de bloqueio. O cabeçote encosta na face traseira da flange. O soquete sextavado tem o mesmo eixo do parafuso, mas a inserção de cima para baixo é impedida pela travessa. O loop de 2,4 segundos desce até o contato e recua; não libera acesso nem avança o slide. O enquadramento usa os volumes de cada componente e o curso completo da chave, com transição inicial de 2,65 segundos; o contorno translúcido pode se prolongar até as bordas do visor. A rotação manual interrompe o ajuste automático da vista. Execute `node prototipo-mapa/verificar-servico.mjs` para validar fades, contato, loop estável, retorno e legendas. A saída fica em `.producao/qa-servico/`.

Edite o roteiro em `slides.json`; cada função tem `severidade`, `linha` de origem, textos, três alvos 3D e `etapas`. A severidade determina a parada. São 38 etapas reais. S1 e S2 não têm animação de ar ou função de transparência. S2 já inicia com os três efeitos visuais ativos. S3 e S4 também iniciam diretamente em sua única etapa. S3 não tem animação de ar; os balões 2 e 3 acompanham a linha em relevo no topo e o canto superior da flange, respectivamente. Selecionar a linha com a tampa em corte restaura a vista completa. Na S4, um volume conservador da onda define o enquadramento e a animação não recalcula a distância da câmera; somente uma rotação de até 0,0015 rad (cerca de 0,086°) para cada lado faz o coletor vibrar. Os controles manuais continuam funcionando. `configuracao.json` mantém somente as configurações do painel e do mapa. Execute `node prototipo-mapa/gerar.mjs` na raiz do repositório para atualizar `iniciar.html`.

O painel tem 90% da largura e da altura, começando em 5% na horizontal e 2% na vertical para reservar a navegação inferior. O visor ocupa a coluna direita; diagramas, legendas e ferramentas têm linhas próprias, sem sobrepor o modelo. Nas trocas entre funções da mesma parada, o fade é aplicado a `#slide-content`, sem apagar o painel branco ou aplicar o véu global sobre o mapa. Conteúdo e controles são verificados em 1600×900, 1280×720 e 1280×960.

Instale as dependências de `package.json` e execute `node prototipo-mapa/verificar-completa.mjs`. O teste abre o navegador apenas em modo headless e produz relatório e capturas em `.producao/qa-completa/`. Para indicar outro executável Chromium, configure `PRESENTATION_BROWSER`. Os nomes anteriores `verificar-prototipo.mjs` e `verificar-sensoriais.mjs` encaminham à suíte atual, porque a navegação e o estado padrão mudaram.

A floresta, os dez marcadores e o percurso de 2,5 segundos entre severidades foram preservados. Não há novas paradas entre funções da mesma severidade. A antiga batida de S10 deixou de ser acionada nesta versão; o roteiro atual trata do servofreio e da distância de parada.
