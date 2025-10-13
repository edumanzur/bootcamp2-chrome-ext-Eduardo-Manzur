@echo off
REM Build script for Windows CMD
echo ====================================
echo Building Focus Extension...
echo ====================================

echo.
echo [1/3] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    exit /b 1
)

echo.
echo [2/3] Building extension...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to build extension
    exit /b 1
)

echo.
echo [3/3] Verifying build...
if exist dist\extension.zip (
    echo SUCCESS: Build completed!
    echo.
    echo Generated files:
    dir dist
    echo.
    echo ====================================
    echo Extension ready at: dist\
    echo Package ready at: dist\extension.zip
    echo ====================================
) else (
    echo ERROR: extension.zip not found
    exit /b 1
)
