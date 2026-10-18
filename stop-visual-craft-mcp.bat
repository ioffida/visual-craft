@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
cd /d "%~dp0"
set "PIDFILE=%~dp0mcp\visual-craft\visual-craft-mcp.pid"

if not exist "%PIDFILE%" (
  echo visual-craft MCP не запущен.
  exit /b 0
)

set /p PID=<"%PIDFILE%"
taskkill /PID !PID! /F >nul 2>&1
del "%PIDFILE%" 2>nul
echo visual-craft MCP остановлен.
exit /b 0
