@echo off
REM AutoDiscovery Deployment Diagnostic Script for Windows
REM This script checks all prerequisites and reports issues

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║        AutoDiscovery Deployment Diagnostic Tool               ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check Node.js
echo 🔍 Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo   ✅ Node.js installed: !NODE_VERSION!
) else (
    echo   ❌ Node.js NOT found
    echo   💾 Download: https://nodejs.org/
)

REM Check npm
echo.
echo 🔍 Checking npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo   ✅ npm installed: !NPM_VERSION!
) else (
    echo   ❌ npm NOT found
    echo   💾 Download: https://nodejs.org/
)

REM Check Docker
echo.
echo 🔍 Checking Docker...
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('docker --version') do set DOCKER_VERSION=%%i
    echo   ✅ Docker installed: !DOCKER_VERSION!
) else (
    echo   ❌ Docker NOT found
    echo   💾 Download: https://www.docker.com/products/docker-desktop
)

REM Check current directory
echo.
echo 🔍 Checking directory structure...
if exist "AutoDiscovery" (
    echo   ✅ AutoDiscovery folder found
) else (
    echo   ❌ AutoDiscovery folder NOT found
    echo   📁 Current directory: %cd%
)

REM Check AutoDiscovery structure
echo.
echo 🔍 Checking AutoDiscovery contents...
if exist "AutoDiscovery\autodiscovery-cli" (
    echo   ✅ autodiscovery-cli folder found
) else (
    echo   ❌ autodiscovery-cli folder NOT found
)

if exist "AutoDiscovery\autodiscovery-contract" (
    echo   ✅ autodiscovery-contract folder found
) else (
    echo   ❌ autodiscovery-contract folder NOT found
)

if exist "AutoDiscovery\package.json" (
    echo   ✅ package.json found
) else (
    echo   ❌ package.json NOT found
)

REM Check node_modules
echo.
echo 🔍 Checking dependencies...
if exist "AutoDiscovery\node_modules" (
    echo   ✅ node_modules exists
) else (
    echo   ⚠️  node_modules NOT found
    echo   💡 Run: cd AutoDiscovery ^&^& npm install
)

REM Check Port 6300
echo.
echo 🔍 Checking if port 6300 is available...
netstat -ano | findstr :6300 >nul 2>&1
if %errorlevel% equ 0 (
    echo   ⚠️  Port 6300 is in use
    echo   💡 Run: netstat -ano ^| findstr :6300
    echo   💡 Then: taskkill /PID ^<PID^> /F
) else (
    echo   ✅ Port 6300 is available
)

REM Check npm scripts
echo.
echo 🔍 Checking npm scripts...
if exist "AutoDiscovery\autodiscovery-cli\package.json" (
    findstr "deploy-preprod" AutoDiscovery\autodiscovery-cli\package.json >nul 2>&1
    if %errorlevel% equ 0 (
        echo   ✅ deploy-preprod script found
    ) else (
        echo   ❌ deploy-preprod script NOT found
    )
) else (
    echo   ❌ package.json NOT found in autodiscovery-cli
)

REM Summary
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║                    Diagnostic Complete                         ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📋 NEXT STEPS:
echo.
echo 1. If you see ❌ for Node.js, npm, or Docker:
echo    Download and install from the links shown
echo.
echo 2. If node_modules missing:
echo    cd AutoDiscovery
echo    npm install
echo.
echo 3. If port 6300 in use:
echo    netstat -ano ^| findstr :6300
echo    taskkill /PID ^<PID^> /F
echo.
echo 4. Once all checks pass:
echo    Ready to deploy!
echo.
pause
