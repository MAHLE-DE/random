$ErrorActionPreference='Stop'
$rootPath=(Get-Location).Path
$a=New-Object -ComObject PowerPoint.Application
$p=$a.Presentations.Open((Join-Path $rootPath 'entrega/final/principal.pptx'),0,0,0)
$count=0
foreach($slide in $p.Slides){foreach($effect in $slide.TimeLine.MainSequence){if($effect.Shape.Name -eq 'Deslocamento_camera'){$effect.Timing.TriggerType=2;$count++}}}
$p.SaveAs((Join-Path $rootPath '.producao/principal-reproducao.pptx'),24,-1)
$p.Close()
Write-Output "INICIOS_AUTOMATICOS $count"
