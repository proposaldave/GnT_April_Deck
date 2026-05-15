$ErrorActionPreference = "Stop"
$root = "C:\Users\dave\CLAUDE COWORK\07_PRODUCT\pitch_visuals"
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$files = Get-ChildItem -LiteralPath (Join-Path $root "assets\v2") -Recurse -Filter "*.html" |
  Where-Object { $_.FullName -notmatch "\\_shared\\" }

foreach ($file in $files) {
  $out = [System.IO.Path]::ChangeExtension($file.FullName, "-preview.png")
  $url = "file:///" + ($file.FullName -replace "\\", "/").Replace(" ", "%20")
  & $chrome --headless=new --disable-gpu --hide-scrollbars --window-size=1920,1080 --screenshot="$out" "$url" | Out-Null
}

"rendered $($files.Count) previews"
