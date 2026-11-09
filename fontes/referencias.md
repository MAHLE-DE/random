# Referências e recursos

## Entradas do usuário

- `prompt_apresentacao.txt`, commit fac09a8.
- `prompt2.txt`, commit b1b257b.
- Esclarecimento em conversa: cenário de retorno de combustão em parede insuficiente, trinca, alteração de distribuição e possível parada; acidente como possibilidade.
- Lista de 16 funções e classificações do DFMEA fornecida em conversa. Valores preservados em `matriz-dfmea.md`.

## Referências técnicas públicas consultadas em 09/11/2026

1. Bosch Mobility, gestão do ar: https://www.bosch-mobility.com/en/solutions/air-management/ . Sustenta a relação geral entre controle de ar, desempenho e emissões; não valida o cenário completo de acidente.
2. Bosch Mobility, sensor de pressão e temperatura: https://www.bosch-mobility.com/en/solutions/sensors/intake-manifold-and-boost-pressure-sensor/ . Mostra que a estratégia pode usar pressão e temperatura. Por isso, perda de estanqueidade não será chamada universalmente de “ar não medido”.
3. RAETECH, Ensaio de retorno de combustão em coletores compósitos: https://www.raetech.com/Manifold/manifold%20test.pdf . Referência sobre ensaio de pulsos e resistência de coletores; não fornece limites aplicáveis ao modelo ilustrativo.
4. SAE, Fatores que afetam a pressão de ruptura dinâmica de coletores plásticos, 2005-01-1514: https://saemobilus.sae.org/papers/factors-affecting-dynamic-burst-pressure-plastics-air-intake-manifold-2005-01-1514 . Apenas resumo público de busca consultado, texto integral indisponível. Apoio bibliográfico, sem extrair resultados ou valores.
5. Honda, boletim de recall hospedado na NHTSA: https://static.nhtsa.gov/odi/rcl/2011/RCRIT-11V101-7934.pdf . Exemplo público da relação entre parada em movimento e aumento de risco de acidente. Causa diferente do coletor, sem equivalência com produto MAHLE. Não será usado como evidência da cadeia completa.
6. MAHLE, página institucional e logotipo raster oficial: https://www.mahle.com/ e https://www.mahle.com/media/system_files/img/mahle_logo_2020.png . Marca pertence à MAHLE. Não há associação dos cenários a casos reais da empresa.
7. Logotipo vetorial 2020: https://commons.wikimedia.org/wiki/File:Mahle_(Unternehmen)_2020_logo.svg . O arquivo preserva os paths da marca e declara como origem o relatório anual MAHLE de 2019, cujo endereço hoje redireciona. O recurso SVG atual do newsroom contém PNG embutido, por isso não foi tratado como vetor. A versão de paths é entregue separadamente, com origem identificada, para conferência com o manual de marca da planta. Não houve redesenho ou substituição tipográfica.

## Recursos autorais

Modelos de carro, coletor, motor e estrada criados para esta apresentação. Geometria genérica e esquemática, sem dimensões de produção. Arquivos-fonte e modelos reutilizáveis acompanham a entrega. Nenhuma fotografia de defeito real, limite de ensaio, tolerância, taxa de falha ou índice de capacidade foi inventado.

## Ferramentas de produção

Three.js 0.170.0 (MIT), renderização e exportação GLB: https://threejs.org/ . Microsoft PowerPoint instalado no equipamento, para incorporação, animações e exportação. Biblioteca Artifact Tool do ambiente Codex, para criação dos objetos editáveis. FFmpeg 6.1.1, codificação H.264, distribuição ffmpeg-static: https://github.com/eugeneware/ffmpeg-static/releases/tag/b6.1.1 . As ferramentas de produção não são necessárias para executar a apresentação.

Blender 4.5.9 foi avaliado, mas apresentou falha local de ativação de dependência. O render final é produzido com Three.js; não se afirma que os arquivos finais foram renderizados no Blender.
