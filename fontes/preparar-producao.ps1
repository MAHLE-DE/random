param(
    [Parameter(Mandatory=$true)][string]$RuntimeNode,
    [Parameter(Mandatory=$true)][string]$RuntimeModules,
    [Parameter(Mandatory=$true)][string]$RuntimePython,
    [Parameter(Mandatory=$true)][string]$SkillDir,
    [string]$Browser='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    [string]$FFmpeg
)
$ErrorActionPreference='Stop'
$projectPath=Split-Path -Parent $PSScriptRoot
$buildPath=Join-Path $projectPath '.producao'
New-Item -ItemType Directory -Force $buildPath | Out-Null
foreach($ext in '*.mjs','*.ps1','*.py'){
    Get-ChildItem -LiteralPath $PSScriptRoot -Filter $ext -File | Copy-Item -Destination $buildPath
}
$linkPath=Join-Path $buildPath 'node_modules'
if(-not (Test-Path -LiteralPath $linkPath)){
    New-Item -ItemType Junction -Path $linkPath -Target $RuntimeModules | Out-Null
}
$env:RUNTIME_NODE_MODULES=$RuntimeModules
$env:RUNTIME_PYTHON=$RuntimePython
$env:PRESENTATIONS_SKILL_DIR=$SkillDir
$env:PRESENTATION_BROWSER=$Browser
if($FFmpeg){$env:FFMPEG_PATH=$FFmpeg}
Set-Location -LiteralPath $projectPath
Write-Output "Ambiente preparado. Usar o Node informado: $RuntimeNode"
Write-Output 'Gerar imagens e videos: .producao/renderizar.mjs --videos --hardware'
Write-Output 'Gerar bases editaveis: .producao/montar.mjs --final'
Write-Output 'Preservar a entrega existente e usar novos nomes na proxima revisao.'
