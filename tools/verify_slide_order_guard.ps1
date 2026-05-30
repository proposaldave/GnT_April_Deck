param(
  [string]$BaseRef = "HEAD~1",
  [string]$TargetRef = "HEAD",
  [string]$File = "GnR_deck.html",
  [string[]]$AllowedRemoved = @()
)

$ErrorActionPreference = "Stop"

function Get-SlideOrderFromText {
  param([string[]]$Lines)

  $inside = $false
  $ids = New-Object System.Collections.Generic.List[string]
  foreach ($line in $Lines) {
    if ($line -match 'const\s+SLIDE_ORDER\s*=\s*\[') {
      $inside = $true
      continue
    }
    if ($inside -and $line -match '^\s*\];') {
      break
    }
    if ($inside) {
      $code = $line -replace '//.*$', ''
      foreach ($match in [regex]::Matches($code, "'([^']+)'")) {
        $ids.Add($match.Groups[1].Value)
      }
    }
  }
  return @($ids)
}

function Get-SlideOrderFromRef {
  param([string]$Ref, [string]$Path)

  if ($Ref -eq "WORKTREE") {
    $lines = Get-Content -LiteralPath $Path
  } else {
    $text = git show "${Ref}:$Path" 2>$null
    if ($LASTEXITCODE -ne 0) {
      throw "Could not read $Path at $Ref"
    }
    $lines = $text -split "`r?`n"
  }
  return Get-SlideOrderFromText -Lines $lines
}

$base = Get-SlideOrderFromRef -Ref $BaseRef -Path $File
$target = Get-SlideOrderFromRef -Ref $TargetRef -Path $File

$baseSet = [System.Collections.Generic.HashSet[string]]::new([string[]]$base)
$targetSet = [System.Collections.Generic.HashSet[string]]::new([string[]]$target)
$allowedSet = [System.Collections.Generic.HashSet[string]]::new([string[]]$AllowedRemoved)

$removed = @($base | Where-Object { -not $targetSet.Contains($_) })
$added = @($target | Where-Object { -not $baseSet.Contains($_) })
$unauthorizedRemoved = @($removed | Where-Object { -not $allowedSet.Contains($_) })

"BASE_REF=$BaseRef"
"TARGET_REF=$TargetRef"
"BASE_SLIDE_COUNT=$($base.Count)"
"TARGET_SLIDE_COUNT=$($target.Count)"
"ADDED_SLIDES=$($added -join ',')"
"REMOVED_SLIDES=$($removed -join ',')"

if ($unauthorizedRemoved.Count -gt 0) {
  "SLIDE_ORDER_GUARD=FAIL"
  "UNAUTHORIZED_REMOVED_SLIDES=$($unauthorizedRemoved -join ',')"
  exit 2
}

"SLIDE_ORDER_GUARD=PASS"
