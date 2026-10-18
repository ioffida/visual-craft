@echo off
chcp 65001 >nul
cd /d "%~dp0mcp\visual-craft"
call npm run stop
exit /b %ERRORLEVEL%
