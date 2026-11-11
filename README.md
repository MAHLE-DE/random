# Jornada MAHLE — apresentação 3D offline

Abra **[prototipo-mapa/iniciar.html](prototipo-mapa/iniciar.html)** no Edge ou Chrome. O HTML contém código, biblioteca, modelos e marca. Pode ser copiado sozinho para outro computador, sem internet, servidor ou instalação.

A apresentação completa tem **15 funções e uma conclusão**, organizadas em dez severidades. O roteiro técnico vem de `apresentacao_qualidade_completa.xlsx`, aba `Sheet1`, linhas 3 a 17. Os textos mantêm a estrutura de função, efeito no sistema e exemplos da apresentação original.

O carro percorre dez paradas. S6 e S7 têm três funções cada; S9 tem duas. Entre funções da mesma severidade, apenas o slide muda: o carro permanece na mesma parada. A barra inferior identifica esses slides como `6·1`, `6·2`, `6·3`, por exemplo.

São **42 etapas reais**, sem uma fase adicional de inspeção. **Clique em Próxima etapa ou pressione → / Espaço** para continuar; ao final da sequência, o controle abre o próximo slide. **←** retorna uma etapa; na primeira, retorna à última etapa real do slide anterior. O coletor pode ser girado em qualquer etapa. A coluna esquerda fica reservada ao texto explicativo, sem mapeador de demonstração guiada ou botão de inspeção.

O coletor entra **completo** em todos os slides. Arraste para girar, use a roda ou − / + para zoom e selecione as legendas numeradas para localizar cada região. Corte e reenquadramento permanecem disponíveis. Transparência é um recurso dos slides a partir de S3; S1 e S2 não têm esse botão nem ativação automática de transparência pelas legendas.

S1 e S2 não exibem animação de ar. S2 tem uma única etapa: manchas localizadas na lateral esquerda, marcas curvas de fluxo do polímero no topo central e uma mudança ampla de tonalidade no lado direito do topo, sem textura de manchas. O enquadramento permite comparar as três regiões. Entre funções da mesma parada, apenas o conteúdo desaparece e reaparece; o painel branco, o carro e a câmera do mapa permanecem estáveis.

O painel ocupa 90% da largura e da altura, com uma faixa inferior exclusiva para navegação. Os gráficos, efeitos, fragmentos, tempos, distâncias e fluxos são ilustrativos, sem valores de ensaio ou simulação. S10 representa perda de assistência do servofreio e uma comparação qualitativa da distância de parada, **sem colisão**.

## Desenvolvimento

Node.js é suficiente para gerar a apresentação: `node prototipo-mapa/gerar.mjs`. Three.js 0.170.0 e todos os recursos gráficos estão incluídos. Para os testes, instale as dependências de desenvolvimento de `package.json` com pnpm ou npm e execute `node prototipo-mapa/verificar-completa.mjs`.

Os testes usam Edge em modo headless, com navegação offline, capturas e verificações de interação, enquadramento, layout e sequência. `PRESENTATION_BROWSER` permite indicar outro executável Chromium; `QA_OUTPUT` altera a pasta do relatório. A saída padrão é `.producao/qa-completa/`, ignorada pelo Git. Não é necessário abrir uma janela de navegador para executar a validação.

- `prototipo-mapa/slides.json`: textos, alvos de legenda e etapas das 15 funções, na ordem da planilha.
- `prototipo-mapa/configuracao.json`: dez paradas, escala, transições e painel.
- `prototipo-mapa/demonstracoes.js`: cenas 3D e diagramas das demonstrações.
- `prototipo-mapa/efeitos-coletor.js`: aparência, rugosidade e materiais.
- `prototipo-mapa/visor-coletor.js`: rotação, zoom, corte, transparência, legendas e câmera do coletor.
- `prototipo-mapa/movimento.js`: mapa, navegação por slide e etapa, carro e câmera do percurso.
- `prototipo-mapa/interface.html` e `apresentacao.css`: interface e composição responsiva.
- `modelos/`, `midias/` e `fontes/vendor/`: modelos editáveis, marca, biblioteca e licenças.

Veja [operação e roteiro](prototipo-mapa/README.md) e [validação](prototipo-mapa/validacao.md). Recursos de versões anteriores permanecem no histórico do Git.
