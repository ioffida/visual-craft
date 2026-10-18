@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
cd /d "%~dp0"
set "PIDFILE=%~dp0mcp\visual-craft\visual-craft-mcp.pid"

if exist "%PIDFILE%" (
  set /p OLDPID=<"%PIDFILE%"
  tasklist /FI "PID eq !OLDPID!" 2>nul | find "!OLDPID!" >nul
  if not errorlevel 1 (
    echo visual-craft MCP уже запущен. PID !OLDPID!
    echo http://127.0.0.1:3847/mcp
    exit /b 0
  )
  del "%PIDFILE%"
)

where npm >nul 2>&1
if errorlevel 1 (
  echo npm не найден в PATH.
  exit /b 1
)

start "visual-craft-mcp" /MIN /D "%~dp0mcp\visual-craft" cmd /c npm start
set /a TRIES=0

:wait
if exist "%PIDFILE%" goto ready
set /a TRIES+=1
if !TRIES! GEQ 20 goto failed
ping -n 2 127.0.0.1 >nul
goto wait

:ready
set /p PID=<"%PIDFILE%"
echo visual-craft MCP запущен. PID !PID!
echo http://127.0.0.1:3847/mcp
exit /b 0

:failed
echo visual-craft MCP не запустился. Откройте свёрнутое окно visual-craft-mcp.
exit /b 1
