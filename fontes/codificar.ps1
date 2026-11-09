$ErrorActionPreference='Stop'
$rootPath=(Get-Location).Path
$ffmpegPath=if($env:FFMPEG_PATH){$env:FFMPEG_PATH}else{Join-Path $env:LOCALAPPDATA 'Codex/recursos-video/ffmpeg.exe'}
$destino=Join-Path $rootPath 'midias/videos'
New-Item -ItemType Directory -Force $destino | Out-Null
foreach($i in 1..28){
    $idCena=$i.ToString('00')
    $origem=Join-Path $rootPath ".producao/quadros/$idCena/%03d.png"
    $video=Join-Path $destino "transicao-$idCena.mp4"
    & $ffmpegPath -hide_banner -loglevel error -y -framerate 24 -i $origem -c:v libx264 -preset fast -crf 21 -pix_fmt yuv420p -movflags +faststart $video
    if($LASTEXITCODE -ne 0){throw "Falha ao codificar $idCena"}
    Write-Output "VIDEO $idCena"
}
foreach($i in 3,4,12,13,14,15,16,20,21,22){
    $origem=Join-Path $rootPath ".producao/quadros/tecnica-$i/%03d.png"
    $video=Join-Path $destino "mecanismo-$i.mp4"
    & $ffmpegPath -hide_banner -loglevel error -y -framerate 24 -i $origem -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -movflags +faststart $video
    if($LASTEXITCODE -ne 0){throw "Falha ao codificar mecanismo $i"}
}
