[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

function Get-LineList {
  param([string]$Path,[string]$Pattern,[switch]$SimpleMatch)
  $hits = if ($SimpleMatch) { Select-String -Path $Path -Pattern $Pattern -SimpleMatch } else { Select-String -Path $Path -Pattern $Pattern }
  if (-not $hits) { return '-' }
  return (($hits | Select-Object -ExpandProperty LineNumber | ForEach-Object { $_.ToString() }) -join ', ')
}

function Show-Section {
  param([string]$Title,[object[]]$Entries)
  Write-Output ''
  Write-Output $Title
  Write-Output ('-' * $Title.Length)
  foreach ($entry in $Entries) {
    $lines = Get-LineList -Path $entry.Path -Pattern $entry.Pattern -SimpleMatch:$entry.SimpleMatch
    '{0,-18} {1,-14} {2}' -f $entry.Name, $lines, $entry.Pattern
  }
}

Write-Output "Repo: $root"
Write-Output ''
Write-Output 'Files'
Write-Output '-----'
Get-Item 'index.html','awards.html','styles.css','scripts/main.js','scripts/context-map.ps1','AGENTS.md' | Sort-Object Name | ForEach-Object { '{0,-20} {1,8} bytes' -f $_.Name, $_.Length }

$homeEntries = @(
  @{ Name='Hero'; Path='index.html'; Pattern="id='top'"; SimpleMatch=$true },
  @{ Name='Company'; Path='index.html'; Pattern="id='company'"; SimpleMatch=$true },
  @{ Name='Projects'; Path='index.html'; Pattern="id='projects'"; SimpleMatch=$true },
  @{ Name='Awards'; Path='index.html'; Pattern="id='awards'"; SimpleMatch=$true },
  @{ Name='News'; Path='index.html'; Pattern="id='news'"; SimpleMatch=$true },
  @{ Name='Testimonials'; Path='index.html'; Pattern="id='testimonials'"; SimpleMatch=$true },
  @{ Name='Contact'; Path='index.html'; Pattern="id='contact-cta'"; SimpleMatch=$true },
  @{ Name='Footer'; Path='index.html'; Pattern="<footer class='footer'"; SimpleMatch=$true }
)

$awardsEntries = @(
  @{ Name='Hero'; Path='awards.html'; Pattern="<h1>Профессиональные награды ГИНТ-М</h1>"; SimpleMatch=$true },
  @{ Name='List'; Path='awards.html'; Pattern="class='shell awards-list'"; SimpleMatch=$true },
  @{ Name='2021'; Path='awards.html'; Pattern="id='award-2021'"; SimpleMatch=$true }
)

$jsEntries = @(
  @{ Name='Sticky'; Path='scripts/main.js'; Pattern='const stickyHeader'; SimpleMatch=$true },
  @{ Name='Open'; Path='scripts/main.js'; Pattern='const openModal'; SimpleMatch=$true },
  @{ Name='Close'; Path='scripts/main.js'; Pattern='const closeModal'; SimpleMatch=$true },
  @{ Name='Fields'; Path='scripts/main.js'; Pattern='const syncContactFields'; SimpleMatch=$true },
  @{ Name='Phone'; Path='scripts/main.js'; Pattern='const formatPhoneValue'; SimpleMatch=$true }
)

$cssEntries = @(
  @{ Name='Header'; Path='styles.css'; Pattern='.header {'; SimpleMatch=$true },
  @{ Name='Logos'; Path='styles.css'; Pattern='.logos {'; SimpleMatch=$true },
  @{ Name='Projects'; Path='styles.css'; Pattern='.projects {'; SimpleMatch=$true },
  @{ Name='Timeline'; Path='styles.css'; Pattern='.timeline {'; SimpleMatch=$true },
  @{ Name='Cards'; Path='styles.css'; Pattern='.cards,'; SimpleMatch=$true },
  @{ Name='Contact'; Path='styles.css'; Pattern='.contact {'; SimpleMatch=$true },
  @{ Name='Modal'; Path='styles.css'; Pattern='.modal {'; SimpleMatch=$true },
  @{ Name='Footer'; Path='styles.css'; Pattern='.footer {'; SimpleMatch=$true }
)

Show-Section -Title 'Home HTML anchors' -Entries $homeEntries
Show-Section -Title 'Awards HTML anchors' -Entries $awardsEntries
Show-Section -Title 'JS anchors' -Entries $jsEntries
Show-Section -Title 'CSS anchors' -Entries $cssEntries
