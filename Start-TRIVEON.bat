@echo off
echo ==============================================
echo TRIVEON - The Operating System of Ambition
echo Starting server...
echo ==============================================
cd /d d:\vercel
powershell.exe -ExecutionPolicy Bypass -File serve.ps1
pause
