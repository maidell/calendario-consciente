param(
    [Parameter(Mandatory = $true)]
    [string]$OutputPath
)

$ErrorActionPreference = 'Stop'
[Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$previewText = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($previewText)) {
    throw 'Preview speech text is empty.'
}

Add-Type -AssemblyName System.Speech
$previewSynth = [System.Speech.Synthesis.SpeechSynthesizer]::new()
try {
    $previewSynth.SelectVoice('Microsoft Maria Desktop')
    $previewSynth.Rate = 0
    $previewSynth.Volume = 100
    $previewFormat = [System.Speech.AudioFormat.SpeechAudioFormatInfo]::new(
        22050,
        [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen,
        [System.Speech.AudioFormat.AudioChannel]::Mono
    )
    $previewSynth.SetOutputToWaveFile(
        [System.IO.Path]::GetFullPath($OutputPath),
        $previewFormat
    )
    $previewSynth.Speak($previewText)
    $previewSynth.SetOutputToNull()
}
finally {
    $previewSynth.Dispose()
}
