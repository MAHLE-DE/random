param([switch]$Inspecionar)
$ErrorActionPreference='Stop'
$rootPath=(Get-Location).Path
$ppt=New-Object -ComObject PowerPoint.Application
Write-Output "POWERPOINT $($ppt.Version) BUILD $($ppt.Build)"
if(-not $Inspecionar){
    $pres=$ppt.Presentations.Open((Join-Path $rootPath '.producao/bases/base-principal-final.pptx'),0,0,0)
    $sw=$pres.PageSetup.SlideWidth;$sh=$pres.PageSetup.SlideHeight
    foreach($slide in $pres.Slides){
        $idCena=$slide.SlideIndex
        # A placa raster fica como pôster de contingência; o vídeo inicia sobre ela.
        if($idCena -notin 24,25,26,28){
        $videoPath=Join-Path $rootPath ('midias/videos/transicao-{0:00}.mp4' -f $idCena)
        $v=$slide.Shapes.AddMediaObject2($videoPath,0,-1,0,0,$sw,$sh)
        $v.Name='Deslocamento_camera'
        # Posição 2, acima da placa e abaixo de todos os textos/diagramas.
        $v.ZOrder(1)
        $v.ZOrder(2)
        $v.AnimationSettings.PlaySettings.PlayOnEntry=-1
        $v.AnimationSettings.PlaySettings.HideWhileNotPlaying=0
        $v.AnimationSettings.PlaySettings.LoopUntilStopped=0
        $v.AnimationSettings.PlaySettings.RewindMovie=0
        $v.MediaFormat.SetDisplayPictureFromFile((Join-Path $rootPath ('midias/posteres/transicao-{0:00}.jpg' -f $idCena)))
        }
        $slide.SlideShowTransition.AdvanceOnClick=-1
        $slide.SlideShowTransition.AdvanceOnTime=0
        $slide.SlideShowTransition.EntryEffect=0
        # Sequência causal acionada pelo apresentador.
        $etapas=@($slide.Shapes | Where-Object Name -Match '^Etapa_\d+$' | Sort-Object Name)
        foreach($shape in $etapas){
            $effect=$slide.TimeLine.MainSequence.AddEffect($shape,10,0,1)
            $effect.Timing.Duration=.30
            $numEtapa=[int]($shape.Name -replace 'Etapa_','')
            if($numEtapa -gt 1){
                $conexao=$slide.Shapes.Item(('Conexao_{0}' -f ($numEtapa-1)))
                $seta=$slide.TimeLine.MainSequence.AddEffect($conexao,10,0,2)
                $seta.Timing.Duration=.30
            }
        }
        if($idCena -in 3,4,12,13,14,15,16,20,21,22){
            $tech=$slide.Shapes.AddMediaObject2((Join-Path $rootPath "midias/videos/mecanismo-$idCena.mp4"),0,-1,0,0,$sw,$sh)
            $tech.Name='Mecanismo_por_clique';$tech.ZOrder(1);$tech.ZOrder(2);$tech.ZOrder(2)
            $tech.MediaFormat.SetDisplayPictureFromFile((Join-Path $rootPath "midias/posteres/mecanismo-$idCena.jpg"))
            $tech.AnimationSettings.PlaySettings.HideWhileNotPlaying=0
            $entrada=$slide.TimeLine.MainSequence.AddEffect($tech,1,0,1)
            $play=$slide.TimeLine.MainSequence.AddEffect($tech,83,0,2)
            # Vídeo técnico uma vez por acionamento, sem repetição automática.
            $tech.AnimationSettings.PlaySettings.LoopUntilStopped=0
            $tech.AnimationSettings.PlaySettings.RewindMovie=0
        }
        # Atalhos internos de navegação, acessíveis também por número + Enter.
        if($idCena -notin 27,28){
            $nav=$slide.Shapes.AddTextbox(1,($sw-225),($sh-36),130,20)
            $nav.Name='Ir_para_dinamica';$nav.TextFrame.TextRange.Text='Ir à dinâmica'
            $nav.TextFrame.TextRange.Font.Name='Arial';$nav.TextFrame.TextRange.Font.Size=12
            $nav.TextFrame.TextRange.Font.Color.RGB=12337920
            $nav.ActionSettings(1).Action=7
            $target=$pres.Slides.Item(27)
            $nav.ActionSettings(1).Hyperlink.SubAddress="$($target.SlideID),27,$($target.Name)"
        }
        foreach($efeito in $slide.TimeLine.MainSequence){if($efeito.Shape.Name -eq 'Deslocamento_camera'){$efeito.Timing.TriggerType=2}}
        Write-Output "ANIMACOES $idCena"
    }
    $pres.SlideShowSettings.ShowMediaControls=0
    $finalPath=Join-Path $rootPath '.producao/principal-nativo-final.pptx'
    $pres.SaveAs($finalPath,24,-1)
    $pres.Close()
}
# Exportações nativas para verificação visual da versão estática e principal.
foreach($name in 'seguranca-sem-animacoes-final','contingencia-reduzida-final'){
    $file=Join-Path $rootPath "entrega/$name.pptx"
    if(-not (Test-Path -LiteralPath $file)){continue}
    $p=$ppt.Presentations.Open($file,-1,0,0)
    $out=Join-Path $rootPath ".producao/revisao/$name"
    New-Item -ItemType Directory -Force $out | Out-Null
    $p.Export($out,'PNG',1920,1080)
    Write-Output "ABERTO_E_EXPORTADO $name SLIDES $($p.Slides.Count)"
    $p.Close()
}
# Não encerrar o aplicativo para preservar sessões do usuário.
