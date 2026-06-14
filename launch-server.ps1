
# Launch TRIVEON Server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "c:\vercel\start-server.ps1"
Write-Host "Server starting at http://localhost:8080" -ForegroundColor Green
Start-Sleep -Seconds 2
Start-Process "http://localhost:8080"
