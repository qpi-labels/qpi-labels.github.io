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
    :: Run the python script in detached mode
    start "" /B pythonw.exe app.py
    timeout /t 1 /nobreak >nul
    exit /b