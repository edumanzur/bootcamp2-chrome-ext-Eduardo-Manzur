@echo off
title Focus PWA - Iniciando...
cls
echo.
echo ╔════════════════════════════════════════╗
echo ║       Focus PWA - Inicializando        ║
echo ╚════════════════════════════════════════╝
echo.

REM Matar processos node anteriores
taskkill /F /IM node.exe >nul 2>&1

REM Limpar cache do Vite
echo [1/3] Limpando cache...
if exist apps\web\node_modules\.vite rmdir /s /q apps\web\node_modules\.vite >nul 2>&1

REM Iniciar API
echo [2/3] Iniciando API (porta 3000)...
start "Focus API" cmd /k "cd /d %~dp0apps\api && node index.js"
timeout /t 2 /nobreak >nul

REM Iniciar PWA
echo [3/3] Iniciando PWA (porta 8080)...
start "Focus PWA" cmd /k "cd /d %~dp0apps\web && node C:\Users\eduma\nodejs\node-v22.8.0-win-x64\node_modules\npm\bin\npx-cli.js vite --port 8080 --force"

echo.
echo ╔════════════════════════════════════════╗
echo ║           Servidores Ativos            ║
echo ╠════════════════════════════════════════╣
echo ║  API:  http://localhost:3000           ║
echo ║  PWA:  http://localhost:8080           ║
echo ╚════════════════════════════════════════╝
echo.
echo Aguardando inicializacao...
timeout /t 10 /nobreak >nul

echo Abrindo navegador...
start http://localhost:8080

echo.
echo Pronto! Para parar, feche as janelas "Focus API" e "Focus PWA".
echo.
timeout /t 3 /nobreak >nul
