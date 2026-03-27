[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

function Get-LineList {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Pattern,
    [switch]$SimpleMatch
  )

  $hits = if ($SimpleMatch) {
    Select-String -Path $Path -Pattern $Pattern -SimpleMatch
  } else {
    Select-String -Path $Path -Pattern $Pattern
  }

  if (-not $hits) {
    return '-'
  }

  return (($hits | Select-Object -ExpandProperty LineNumber | ForEach-Object { $_.ToString() }) -join ', ')
}

function Show-Section {
  param(
    [Parameter(Mandatory = $true)][string]$Title,
    [Parameter(Mandatory = $true)][object[]]$Entries
  )

  Write-Output ''
  Write-Output $Title
  Write-Output ('-' * $Title.Length)

  foreach ($entry in $Entries) {
    $lines = Get-LineList -Path $entry.Path -Pattern $entry.Pattern -SimpleMatch:$entry.SimpleMatch
    '{0,-24} {1,-20} {2}' -f $entry.Name, $lines, $entry.Pattern
  }
}

Write-Output "Repo: $root"
Write-Output ''
Write-Output 'Files'
Write-Output '-----'
Get-Item 'index.html', 'styles.css', 'scripts/main.js', 'client-revisions.md', 'AGENTS.md' |
  Sort-Object Name |
  ForEach-Object {
    '{0,-20} {1,8} bytes' -f $_.Name, $_.Length
  }

$indexEntries = @(
  @{ Name = 'Hero';        Path = 'index.html';       Pattern = 'id="top"';          SimpleMatch = $true }
  @{ Name = 'Company';     Path = 'index.html';       Pattern = 'id="company"';      SimpleMatch = $true }
  @{ Name = 'Services';    Path = 'index.html';       Pattern = 'id="services"';     SimpleMatch = $true }
  @{ Name = 'Projects';    Path = 'index.html';       Pattern = 'id="projects"';     SimpleMatch = $true }
  @{ Name = 'Testimonials';Path = 'index.html';       Pattern = 'id="testimonials"'; SimpleMatch = $true }
  @{ Name = 'Awards';      Path = 'index.html';       Pattern = 'id="awards"';       SimpleMatch = $true }
  @{ Name = 'Contact CTA'; Path = 'index.html';       Pattern = 'id="contact-cta"';  SimpleMatch = $true }
  @{ Name = 'Directions';  Path = 'index.html';       Pattern = 'id="directions"';   SimpleMatch = $true }
  @{ Name = 'News';        Path = 'index.html';       Pattern = 'id="news"';         SimpleMatch = $true }
  @{ Name = 'Footer';      Path = 'index.html';       Pattern = '<footer class="site-footer"'; SimpleMatch = $true }
)

$jsEntries = @(
  @{ Name = 'Counters';        Path = 'scripts/main.js'; Pattern = 'const statCounters';       SimpleMatch = $true }
  @{ Name = 'Testimonials';    Path = 'scripts/main.js'; Pattern = 'const testimonialsSlider'; SimpleMatch = $true }
  @{ Name = 'Company logos';   Path = 'scripts/main.js'; Pattern = 'const companyLogosSlider'; SimpleMatch = $true }
  @{ Name = 'Reveal helpers';  Path = 'scripts/main.js'; Pattern = 'const applyClasses';       SimpleMatch = $true }
  @{ Name = 'Sticky header';   Path = 'scripts/main.js'; Pattern = 'const updateStickyHeader';  SimpleMatch = $true }
  @{ Name = 'Phone format';    Path = 'scripts/main.js'; Pattern = 'const formatPhoneValue';    SimpleMatch = $true }
  @{ Name = 'Open modal';      Path = 'scripts/main.js'; Pattern = 'const openModal';           SimpleMatch = $true }
)

$cssEntries = @(
  @{ Name = 'Hero header';     Path = 'styles.css'; Pattern = '.hero-top {';                SimpleMatch = $true }
  @{ Name = 'Company logos';   Path = 'styles.css'; Pattern = '.company-logos {';           SimpleMatch = $true }
  @{ Name = 'Projects shell';  Path = 'styles.css'; Pattern = '.projects-shell {';          SimpleMatch = $true }
  @{ Name = 'Testimonials nav';Path = 'styles.css'; Pattern = '.testimonials-nav-button {'; SimpleMatch = $true }
  @{ Name = 'Awards shell';    Path = 'styles.css'; Pattern = '.awards-shell {';            SimpleMatch = $true }
  @{ Name = 'Contact CTA';     Path = 'styles.css'; Pattern = '.contact-cta-shell {';       SimpleMatch = $true }
  @{ Name = 'Directions';      Path = 'styles.css'; Pattern = '.directions-shell {';        SimpleMatch = $true }
  @{ Name = 'News shell';      Path = 'styles.css'; Pattern = '.news-shell {';              SimpleMatch = $true }
  @{ Name = 'Footer';          Path = 'styles.css'; Pattern = '.site-footer {';             SimpleMatch = $true }
)

Show-Section -Title 'HTML anchors' -Entries $indexEntries
Show-Section -Title 'JS anchors' -Entries $jsEntries
Show-Section -Title 'CSS anchors' -Entries $cssEntries

Write-Output ''
Write-Output 'Suggested first read order'
Write-Output '--------------------------'
Write-Output '1. client-revisions.md'
Write-Output '2. AGENTS.md'
Write-Output '3. Targeted file slices based on the anchors above'
Write-Output ''
Write-Output 'Noise to ignore'
Write-Output '---------------'
Write-Output '- backups/'
Write-Output '- server*.log'
Write-Output '- server*.err'
