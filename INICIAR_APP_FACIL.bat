@echo off
echo ========================================
echo   MediaApp - Iniciar Backend
echo ========================================
echo.

cd /d %~dp0backend

if not exist "venv\" (
    echo Criando ambiente virtual...
    python -m venv venv
)

echo Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo.
echo ========================================
echo   Backend rodando em: http://localhost:8000
echo ========================================
echo.
echo Pressione Ctrl+C para parar
echo.

python main.py

pause

