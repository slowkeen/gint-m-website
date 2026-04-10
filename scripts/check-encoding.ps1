Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$textExtensions = @(
  '.html', '.css', '.js', '.ts', '.jsx', '.tsx', '.json', '.md', '.txt',
  '.yml', '.yaml', '.svg', '.xml', '.toml', '.ini', '.ps1'
)
$textNames = @('.editorconfig', '.gitattributes', '.gitignore', '.nojekyll')
$mojibakePattern = '(?:[\u0420\u0421\u00D0\u00D1][^\s<>&;]){3,}|\uFFFD'
$utf8Strict = [System.Text.UTF8Encoding]::new($false, $true)
$issues = [System.Collections.Generic.List[string]]::new()
$checkedFiles = 0

function Get-EncodingKind {
  param([byte[]]$Bytes)

  if ($Bytes.Length -ge 3 -and $Bytes[0] -eq 0xEF -and $Bytes[1] -eq 0xBB -and $Bytes[2] -eq 0xBF) {
    return 'utf8-bom'
  }

  if ($Bytes.Length -ge 2 -and $Bytes[0] -eq 0xFF -and $Bytes[1] -eq 0xFE) {
    return 'utf16-le'
  }

  if ($Bytes.Length -ge 2 -and $Bytes[0] -eq 0xFE -and $Bytes[1] -eq 0xFF) {
    return 'utf16-be'
  }

  try {
    [void]$utf8Strict.GetString($Bytes)
    return 'utf8'
  } catch {
    return 'legacy-8bit-or-invalid'
  }
}

Get-ChildItem -Path $root -Recurse -File |
  Where-Object {
    $_.FullName -notmatch '\\.git(\\|$)' -and
    $_.FullName -notmatch '\\backups(\\|$)' -and
    $_.Name -notlike '.codex_*'
  } |
  Sort-Object FullName |
  ForEach-Object {
    $ext = $_.Extension.ToLowerInvariant()
    if (($textExtensions -notcontains $ext) -and ($textNames -notcontains $_.Name)) {
      return
    }

    $checkedFiles++
    $relativePath = $_.FullName.Substring($root.Length + 1)
    $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
    $encodingKind = Get-EncodingKind -Bytes $bytes

    if ($encodingKind -ne 'utf8') {
      $issues.Add("${relativePath}: expected UTF-8 without BOM, found $encodingKind")
      return
    }

    $text = $utf8Strict.GetString($bytes)
    if ($text -cmatch $mojibakePattern) {
      $issues.Add("${relativePath}: detected likely mojibake or replacement characters")
    }

    $looksLikeFullHtmlDocument = $_.Extension -ieq '.html' -and (
      $text -match '(?is)<!doctype\s+html' -or
      $text -match '(?is)<html\b' -or
      $text -match '(?is)<head\b'
    )

    if ($looksLikeFullHtmlDocument -and $text -notmatch '(?i)<meta\s+charset\s*=\s*["'']?utf-8') {
      $issues.Add("${relativePath}: missing explicit UTF-8 meta charset")
    }
  }

if ($issues.Count -gt 0) {
  Write-Host 'Encoding validation failed:' -ForegroundColor Red
  $issues | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "Encoding validation passed for $checkedFiles text files." -ForegroundColor Green
