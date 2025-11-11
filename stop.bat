@echo off
title Focus PWA - Parando...
cls
echo.
echo ╔════════════════════════════════════════╗
echo ║      Focus PWA - Finalizando           ║
echo ╚════════════════════════════════════════╝
echo.

echo Parando todos os servidores Node.js...
taskkill /F /IM node.exe >nul 2>&1

if %errorlevel% equ 0 (
    echo.
    echo ✓ Servidores parados com sucesso!
) else (
    echo.
    echo ! Nenhum servidor estava rodando.
)

echo.
timeout /t 2 /nobreak >nul
