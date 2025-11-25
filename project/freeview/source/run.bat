@echo off
cd /d "%~dp0"

:: Check for Administrator privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    goto :RunScript
) else (
    echo Requesting Administrator privileges...
    powershell -Command "Start-Process '%~0' -Verb RunAs"
    exit /b
)

:RunScript
    echo ========================================================
    echo  QPI FreeView @2025 QPI
    echo ========================================================
    
    :: Run the python script
    python app.py

    echo.
    echo ========================================================
    echo  Program finished. Press any key to close.
    echo ========================================================
    pause >nul