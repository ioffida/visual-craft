@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "TARGET=%~1"
if not defined TARGET set /p TARGET=Перетащите сюда папку проекта или вставьте путь: 
set TARGET=%TARGET:"=%
if not defined TARGET (
  echo Путь к проекту не указан.
  pause
  exit /b 1
)
node "%~dp0scripts\connect.mjs" "%TARGET%"
echo.
pause
