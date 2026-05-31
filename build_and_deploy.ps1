$ErrorActionPreference = "Stop"

Write-Host "Building SvelteKit App..."
npm run build

$espDataDir = "ESP_Board_Codes\Central_Server\nonAsyncWifiCounter_withScreen_TextOnly\data"
Write-Host "Creating ESP data directory if it doesn't exist..."
if (!(Test-Path -Path $espDataDir)) {
    New-Item -ItemType Directory -Force -Path $espDataDir | Out-Null
}

Write-Host "Cleaning ESP data directory..."
Remove-Item -Path "$espDataDir\*" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Copying build files to ESP data directory..."
Copy-Item -Path "build\*" -Destination $espDataDir -Recurse -Force

Write-Host "Done! The files are ready to be uploaded to LittleFS."
Write-Host "In PlatformIO, run the 'Build Filesystem Image' and 'Upload Filesystem Image' tasks."
