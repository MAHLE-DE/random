# Fontes e reutilização

Para apresentar, abra o PPTX escolhido em `entrega`. Nenhuma ferramenta de produção é necessária para a execução.

## Conteúdo

`roteiros/cenas.json` contém títulos, mensagens, cadeias, tempos, perguntas, barreiras e falas. `montar.mjs` cria os objetos editáveis com a biblioteca de apresentações do ambiente Codex. `powerpoint.ps1` incorpora os vídeos e configura as animações nativas sem inserir código executável no PPTX. `finalizar_principal.mjs` configura as transições de transformação nativas e valida o pacote.

Os comandos PowerShell são ferramentas de produção fora da apresentação. Não são macros e não precisam ser executados pelo apresentador.

## Modelos

`modelos/cena.mjs` é o código-fonte da cena genérica e dos modelos. Os quatro GLB acompanham a entrega e podem ser importados em um editor 3D compatível. O carro tem 2.404 triângulos, quatro rodas separadas e logotipos em paths nos dois lados. A estrada possui segmentos nomeados e conectados. As unidades são esquemáticas e não são dimensões de produção.

O coletor inclui câmara comum, entrada, quatro dutos, flanges com aberturas, juntas, insertos e conexões genéricas. Os cortes usados nas cenas são ilustrações para revelar os mecanismos. O fluxo e as cores não são resultados de simulação nem de medição.

O motor é deliberadamente simplificado. Não representa uma plataforma comercial nem constitui documentação de engenharia de produto.

## Renderização

`renderizar.mjs` usa Playwright e um navegador local para executar a cena Three.js. O servidor de produção atende somente em `127.0.0.1`; os módulos gráficos estão em `fontes/vendor` e não dependem de CDN na renderização. A licença da biblioteca acompanha esses arquivos.

As imagens de origem são PNG Full HD. Os vídeos são H.264, 1920×1080, 24 quadros/s. Os deslocamentos ambientais duram 1,5 segundo e os mecanismos técnicos, 3 segundos. `codificar.ps1` utiliza FFmpeg para codificar os quadros. `posteres.mjs` gera os pôsteres locais das mídias.

## Ambiente de produção

É necessário um ambiente Node com `@oai/artifact-tool`, `sharp`, `playwright` e `jszip`, além das dependências de apresentações fornecidas pelo ambiente Codex. Para a etapa nativa, usar Windows com Microsoft PowerPoint. O executável FFmpeg é uma ferramenta externa de produção. As versões e origens estão em `referencias.md`.

`preparar-producao.ps1` recebe os caminhos de Node, bibliotecas, Python e habilidade de apresentações fornecidos pelo ambiente Codex. Ele prepara a pasta privada `.producao` e as variáveis `RUNTIME_NODE_MODULES`, `RUNTIME_PYTHON`, `PRESENTATIONS_SKILL_DIR`, `PRESENTATION_BROWSER` e, quando informado, `FFMPEG_PATH`. Esses caminhos são usados somente na produção e não são vínculos externos do PPTX entregue.

Antes de gerar uma nova revisão, usar novos nomes de saída para preservar a entrega existente. O fluxo inclui renderizar as cenas, codificar as mídias, criar as bases editáveis, incorporar as animações no PowerPoint, normalizar e validar os pacotes. A versão principal passa também por conferência de execução no PowerPoint.
