# Otimização das animações — 12/11/2026

As cenas continuam com os mesmos modelos, materiais, texturas, resoluções de renderização, comandos e tempos. A otimização atua no preparo e na repetição do trabalho. O arquivo permanece offline e autossuficiente.

## Alterações

- As 24 etapas técnicas conservam modelos e materiais próprios em cache. O preparo inicial inclui compilação de shaders, upload de texturas/buffers e dados de enquadramento, antes da viagem do carro. As voltas e repetições reativam cenas existentes.
- Legendas usam uma BVH dos triângulos originais, compartilhada entre geometrias idênticas, e reaproveitam o resultado quando a vista fica estável. Foram comparados 1280 raios em 16 casos com o algoritmo original: zero divergências.
- Enquadramentos usam cache de pose e projeção. Quando a vista está completamente em macro, calculam apenas o volume do detalhe. Giro, zoom, resize, corte e movimento de câmera continuam invalidando os resultados necessários.
- As 106 gotas e volumes esféricos da água usam um lote instanciado, preservando suas posições, escalas, trajetórias, material e visibilidade. Na amostra de entrada da água, as chamadas de desenho no visor caíram de 394 para 184. O modelo não foi simplificado.
- Sombras estáticas são reaproveitadas onde os emissores permanecem imóveis. As sombras de cenas com emissores móveis, incluindo o circuito do servofreio, continuam dinâmicas.
- O clique recebido durante o preparo fica guardado. Após carregar, a abertura mantém os mesmos 2 segundos de capô/logo e 1,5 segundo de viagem.

## Medições locais

Edge headless com a RTX 3050 real via ANGLE/Direct3D11, 1920×1080, DPR 1, monitor de 60 Hz. Cada linha inclui uma janela curta de aproximadamente 4–6 segundos; a média pode esconder picos isolados. São medidas de requestAnimationFrame e tempo de JavaScript, não captura dos quadros fisicamente apresentados pelo monitor. A instrumentação é temporária e não está no HTML distribuído.

| Cenário | FPS antes | FPS depois | Maior intervalo antes (ms) | Maior intervalo depois (ms) |
| --- | ---: | ---: | ---: | ---: |
| viagem-real-0 | 59,5 | 60,0 | 50,1 | 18,7 |
| viagem-real-1 | 56,0 | 58,5 | 266,3 | 116,6 |
| viagem-real-2 | 56,7 | 59,7 | 217,0 | 33,4 |
| viagem-real-3 | 58,5 | 59,7 | 116,8 | 33,3 |
| entrada-servico-0 | 58,3 | 59,8 | 117,0 | 33,2 |
| entrada-servico-1 | 58,3 | 60,0 | 133,7 | 17,2 |
| entrada-agua-0 | 50,9 | 60,0 | 616,8 | 17,2 |
| entrada-agua-1 | 57,0 | 60,0 | 150,0 | 17,5 |
| entrada-estanqueidade-0 | 57,6 | 60,0 | 250,0 | 17,2 |
| entrada-estanqueidade-1 | 57,6 | 60,0 | 232,9 | 17,4 |

CPU média por atualização em S9.2 já carregado: 12,7 → 0,8 ms (aproximadamente 94,1% menos). Os loops finais de água, S9.2 e distribuição ficaram próximos de 60 FPS nesta amostra.

O preparo inicial medido foi de 10,4 segundos. Esse custo é pago ao abrir o arquivo, enquanto a capa informa o carregamento; evita reconstruir as cenas durante a apresentação. O cache mantém mais recursos em memória.

Permaneceu um pico isolado de aproximadamente 117 ms na primeira chegada ao slide tátil em uma execução completa. Em três repetições dedicadas, os máximos ficaram entre 18 e 33 ms. O registro não promete ausência absoluta de variação do navegador/sistema; os picos antigos de centenas de milissegundos nas entradas de água e S9.2 não apareceram na medição otimizada.

Os testes funcionais cobrem a abertura, ingestão pelos quatro runners, bloqueio dos pistões, interrupção manual da câmera, legendas, cortes, transparência, navegação e conclusão nas três resoluções usuais. Os dados locais estão em .producao/perf/antes, .producao/perf/depois e .producao/qa-performance/comparacao.json. A revisão final preservou as sombras dinâmicas de S10 após essa medição; as cenas comparadas acima permaneceram iguais.
