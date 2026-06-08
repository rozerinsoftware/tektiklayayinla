Add-Type -AssemblyName System.Drawing

$w = 900
$h = 1100
$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$g.TextRenderingHint = 'ClearTypeGridFit'
$g.Clear([System.Drawing.Color]::Transparent)

$iconPath = Join-Path $PSScriptRoot '..\assets\splash-icon.png'
$icon = [System.Drawing.Image]::FromFile($iconPath)
$iconSize = 320
$ix = [int](($w - $iconSize) / 2)
$iy = 80
$g.DrawImage($icon, $ix, $iy, $iconSize, $iconSize)
$icon.Dispose()

$fontTitle = New-Object System.Drawing.Font('Segoe UI', 38, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font('Segoe UI', 20, [System.Drawing.FontStyle]::Regular)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = 'Center'
$sf.LineAlignment = 'Center'

$titleRect = New-Object System.Drawing.RectangleF 0, 720, $w, 55
$subRect = New-Object System.Drawing.RectangleF 0, 785, $w, 40
$g.DrawString('TekTıklaYayınla', $fontTitle, $brush, $titleRect, $sf)

$brushSub = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(220, 255, 255, 255))
$g.DrawString('ilan ver · yayınla · keşfet', $fontSub, $brushSub, $subRect, $sf)

$out = Join-Path $PSScriptRoot '..\assets\splash-with-text.png'
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()

Write-Output "Splash kaydedildi: $out"
