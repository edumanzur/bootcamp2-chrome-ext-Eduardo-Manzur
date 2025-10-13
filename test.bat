@echo off
REM Test script for Windows CMD
echo ====================================
echo Testing Focus Extension...
echo ====================================

echo.
echo [1/4] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    exit /b 1
)

echo.
echo [2/4] Installing Playwright browsers...
call npx playwright install chromium
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install Playwright
    exit /b 1
)

echo.
echo [3/4] Building extension...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to build extension
    exit /b 1
)

echo.
echo [4/4] Running E2E tests...
call npm run test:e2e
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo TESTS FAILED!
    echo Check the output above for details.
    echo.
    echo To view the HTML report, run:
    echo   npx playwright show-report
    exit /b 1
)

echo.
echo ====================================
echo ALL TESTS PASSED!
echo ====================================
echo.
echo To view the detailed report, run:
echo   npx playwright show-report
