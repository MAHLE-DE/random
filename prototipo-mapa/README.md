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
| S3 | Rugosidade e tato | Lateral rugosa do plenum, linha de partição e mãos ilustradas |
| S4 | Ruído | Fluxo preservado, vibração leve, ondas e espectro visual |
| S5 | Embalagem, transporte e entrega | Peças em contêiner, contato, suporte deformado e separadores |
| S6 · 1 | Rastreabilidade | Rede de registros, elos rompidos e contenção ampliada |
| S6 · 2 | Manutenção e serviço | Ferramenta bloqueada, operações adicionais e corredor de acesso |
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

Edite o roteiro em `slides.json`; cada função tem `severidade`, `linha` de origem, textos, três alvos 3D e `etapas`. A severidade determina a parada. São 42 etapas reais. S1 e S2 não têm animação de ar ou função de transparência. S2 já inicia com os três efeitos visuais ativos. `configuracao.json` mantém somente as configurações do painel e do mapa. Execute `node prototipo-mapa/gerar.mjs` na raiz do repositório para atualizar `iniciar.html`.

O painel tem 90% da largura e da altura, começando em 5% na horizontal e 2% na vertical para reservar a navegação inferior. O visor ocupa a coluna direita; diagramas, legendas e ferramentas têm linhas próprias, sem sobrepor o modelo. Nas trocas entre funções da mesma parada, o fade é aplicado a `#slide-content`, sem apagar o painel branco ou aplicar o véu global sobre o mapa. Conteúdo e controles são verificados em 1600×900, 1280×720 e 1280×960.

Instale as dependências de `package.json` e execute `node prototipo-mapa/verificar-completa.mjs`. O teste abre o navegador apenas em modo headless e produz relatório e capturas em `.producao/qa-completa/`. Para indicar outro executável Chromium, configure `PRESENTATION_BROWSER`. Os nomes anteriores `verificar-prototipo.mjs` e `verificar-sensoriais.mjs` encaminham à suíte atual, porque a navegação e o estado padrão mudaram.

A floresta, os dez marcadores e o percurso de 2,5 segundos entre severidades foram preservados. Não há novas paradas entre funções da mesma severidade. A antiga batida de S10 deixou de ser acionada nesta versão; o roteiro atual trata do servofreio e da distância de parada.
