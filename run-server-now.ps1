
$ErrorActionPreference = "Continue"
$port = 3000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "TRIVEON - LOCAL SERVER RUNNING!" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server is LIVE at: http://localhost:$port" -ForegroundColor Green
Write-Host "Serving files from: c:\vercel\vercel\dist" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor DarkGray
Write-Host ""

function Get-MimeType($path) {
    $ext = [System.IO.Path]::GetExtension($path)
    switch ($ext) {
        ".html" { "text/html; charset=utf-8" }
        ".css" { "text/css; charset=utf-8" }
        ".js" { "application/javascript; charset=utf-8" }
        ".json" { "application/json; charset=utf-8" }
        ".png" { "image/png" }
        ".jpg" { "image/jpeg" }
        ".jpeg" { "image/jpeg" }
        ".gif" { "image/gif" }
        ".svg" { "image/svg+xml" }
        ".ico" { "image/x-icon" }
        default { "application/octet-stream" }
    }
}

try {
    $listener.Start()
    
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $url = $request.Url.LocalPath
            if ($url -eq "/") { $url = "/index.html" }
            $filePath = Join-Path "c:\vercel\vercel\dist" $url.TrimStart("/")

            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Request: $url" -ForegroundColor Gray

            if (Test-Path $filePath -PathType Leaf) {
                $content = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentType = Get-MimeType $filePath
                $response.ContentLength64 = $content.Length
                $response.StatusCode = 200
                $response.OutputStream.Write($content, 0, $content.Length)
            } else {
                # SPA fallback
                $indexPath = Join-Path "c:\vercel\vercel\dist" "index.html"
                if (Test-Path $indexPath -PathType Leaf) {
                    $content = [System.IO.File]::ReadAllBytes($indexPath)
                    $response.ContentType = Get-MimeType $indexPath
                    $response.ContentLength64 = $content.Length
                    $response.StatusCode = 200
                    $response.OutputStream.Write($content, 0, $content.Length)
                } else {
                    $response.StatusCode = 404
                    $response.StatusDescription = "Not Found"
                    $errorMsg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                    $response.OutputStream.Write($errorMsg, 0, $errorMsg.Length)
                }
            }

            $response.Close()
        } catch {
            Write-Host "Error serving request: $_" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "Fatal error: $_" -ForegroundColor Red
} finally {
    $listener.Stop()
    Write-Host ""
    Write-Host "Server stopped" -ForegroundColor Yellow
}
