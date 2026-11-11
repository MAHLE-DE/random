# Jornada MAHLE — apresentação 3D offline

Abra **[prototipo-mapa/iniciar.html](prototipo-mapa/iniciar.html)** no Edge ou Chrome. O HTML contém código, biblioteca, modelos e marca. Pode ser copiado sozinho para outro computador, sem internet, servidor ou instalação.

A apresentação tem **13 funções e uma conclusão**, organizadas em dez severidades. O roteiro técnico vem de `apresentacao_qualidade_completa.xlsx`, aba `Sheet1`, linhas 3 a 17, com as linhas 10 e 12 retiradas da apresentação. Os textos mantêm a estrutura de função, efeito no sistema e exemplos da apresentação original.

O carro percorre dez paradas. S6, S7 e S9 têm duas funções cada. Entre funções da mesma severidade, apenas o slide muda: o carro permanece na mesma parada. Após `6·2`, a sequência segue diretamente para `7·1`. A distribuição de ar ocupa `7·2`, após resistência química.

São **30 etapas reais**, sem uma fase adicional de inspeção. **Clique em Próxima etapa ou pressione → / Espaço** para continuar; ao final da sequência, o controle abre o próximo slide. **←** retorna uma etapa; na primeira, retorna à última etapa real do slide anterior. O coletor pode ser girado em qualquer etapa. A coluna esquerda fica reservada ao texto explicativo, sem mapeador de demonstração guiada ou botão de inspeção.

O coletor entra **completo** em todos os slides. Arraste para girar, use a roda ou − / + para zoom e selecione as legendas numeradas para localizar cada região. Corte e reenquadramento permanecem disponíveis. O botão de transparência existe somente no slide de distribuição de ar, que começa com o recurso ativado. Os efeitos de transparência usados nas demais demonstrações seguem seu roteiro.

S1 e S2 não exibem animação de ar. S2 tem uma única etapa: manchas localizadas na lateral esquerda, marcas curvas de fluxo do polímero no topo central e uma mudança ampla de tonalidade no lado direito do topo, sem textura de manchas. O enquadramento permite comparar as três regiões. Entre funções da mesma parada, apenas o conteúdo desaparece e reaparece; o painel branco, o carro e a câmera do mapa permanecem estáveis.

S3 e S4 também têm uma única etapa, já com os efeitos ativos. Na S3, a lateral rugosa e as mãos aparecem sem animação de ar; o balão 2 aponta para uma linha de partição em relevo no topo, e o balão 3 destaca o canto superior direito da flange. Na S4, as ondas, cores e espectro continuam animados, mas a câmera não acompanha a expansão das ondas: o coletor mantém somente uma vibração angular sutil. Giro e zoom manuais permanecem disponíveis.

Em S2, S3 e S4, o efeito é escrito como “Sensação percebida … desagradável”; a fonte se ajusta à largura para manter a frase completa em uma linha. S5 tem duas etapas: caixa de papelão fechada e abertura das duas abas, com transição contínua para a vista superior inclinada a partir da orientação deixada pelo apresentador. Quatro juntas aparecem nos bocais dos runners; uma está parcialmente solta. Seis limitadores metálicos permanecem nos furos e dois estão no fundo da caixa. As legendas permitem aproximar os detalhes internos.

A primeira função de S6 mantém três etapas: etiqueta existente, registro inadequado/ausente e lote inteiro. QR code, part number, lote, série e cavidade usam dados demonstrativos coerentes. Uma demarcação destaca a etiqueta no coletor; interrogações grandes aparecem diretamente no 3D quando os registros falham. O lote usa seis réplicas da geometria do coletor em uma área ampliada.

A segunda função de S6 tem duas etapas: um parafuso parcialmente solto na flange; depois, a montagem gradual do motor, acessórios, travessa e limites transparentes do compartimento. A chave em L desce, encontra a travessa e recua em loop, com X vermelho e indicação de falta de passagem. O coletor está na face de admissão do cabeçote. A vista se ajusta suavemente durante a montagem; o loop mantém o enquadramento estável. Giro e legendas continuam disponíveis.

S7.1 foca os componentes metálicos em duas etapas. Dois insertos roscados e seis limitadores começam limpos e brilhantes nos furos da flange. Ao avançar, a câmera aproxima o inserto e o limitador do lado direito, enquanto o indicador de tempo avança e a ferrugem se espalha. O acabamento perde brilho e ganha irregularidade. As legendas aproximam cada peça; Reenquadrar volta ao coletor inteiro, mantendo o estado de corrosão. A passagem de tempo não tem escala de vida útil.

S7.2 tem duas etapas de distribuição de ar. Primeiro, 24 trajetórias desenham segmentos curtos animados dentro do pleno e dos runners, com alimentação semelhante. Depois, o runner 4, mais distante da entrada, tem menos linhas e menor velocidade; uma seção vermelha pulsa transversalmente ao duto. Dois gráficos simples, sobrepostos dentro do visor, mostram a diferença entre runners e a redução qualitativa do desempenho. Não há valores numéricos de vazão ou potência. As legendas R1–R4 relacionam os dutos às barras.

O painel ocupa 90% da largura e da altura, com uma faixa inferior exclusiva para navegação. Os gráficos, efeitos, fragmentos, tempos, distâncias e fluxos são ilustrativos, sem valores de ensaio ou simulação. S10 representa perda de assistência do servofreio e uma comparação qualitativa da distância de parada, **sem colisão**.

## Desenvolvimento

Node.js é suficiente para gerar a apresentação: `node prototipo-mapa/gerar.mjs`. Three.js 0.170.0 e todos os recursos gráficos estão incluídos. Para os testes, instale as dependências de desenvolvimento de `package.json` com pnpm ou npm e execute `node prototipo-mapa/verificar-completa.mjs`.

Os testes usam Edge em modo headless, com navegação offline, capturas e verificações de interação, enquadramento, layout e sequência. `PRESENTATION_BROWSER` permite indicar outro executável Chromium; `QA_OUTPUT` altera a pasta do relatório. A saída padrão é `.producao/qa-completa/`, ignorada pelo Git. Não é necessário abrir uma janela de navegador para executar a validação.

- `prototipo-mapa/slides.json`: textos, alvos de legenda e etapas das 13 funções, na ordem da planilha.
- `prototipo-mapa/configuracao.json`: dez paradas, escala, transições e painel.
- `prototipo-mapa/demonstracoes.js`: cenas 3D e diagramas das demonstrações.
- `prototipo-mapa/cenas-produto.js`: caixa articulada, juntas, limitadores e identificação/lote em 3D.
- `prototipo-mapa/cena-servico.js`: fixador, motor, compartimento translúcido e chave bloqueada, com montagem em fade e loop de tentativa.
- `prototipo-mapa/cena-corrosao.js`: insertos e limitadores, metal reflexivo, corrosão progressiva, detalhe e indicador de tempo.
- `prototipo-mapa/cena-distribuicao.js`: streamlines curtas, desbalanceamento do R4, seção transversal pulsante e gráficos dentro do visor.
- `prototipo-mapa/codigo-rastreabilidade.json`: dados didáticos e matriz do QR incorporados no HTML; não exige biblioteca ou rede durante a apresentação.
- `prototipo-mapa/efeitos-coletor.js`: aparência, rugosidade e materiais.
- `prototipo-mapa/visor-coletor.js`: rotação, zoom, corte, transparência, legendas e câmera do coletor.
- `prototipo-mapa/movimento.js`: mapa, navegação por slide e etapa, carro e câmera do percurso.
- `prototipo-mapa/interface.html` e `apresentacao.css`: interface e composição responsiva.
- `modelos/`, `midias/` e `fontes/vendor/`: modelos editáveis, marca, biblioteca e licenças.

Veja [operação e roteiro](prototipo-mapa/README.md) e [validação](prototipo-mapa/validacao.md). Recursos de versões anteriores permanecem no histórico do Git.
