@echo off
echo =================================
echo   Media Player - Backend Server
echo =================================
echo.

REM Verificar se o ambiente virtual existe
if not exist "venv\" (
    echo [1/3] Criando ambiente virtual...
    python -m venv venv
    echo.
)

echo [2/3] Ativando ambiente virtual...
call venv\Scripts\activate
echo.

echo [3/3] Instalando/Atualizando dependencias...
pip install -r requirements.txt --quiet
echo.

echo =================================
echo   Iniciando servidor...
echo =================================
echo.
echo Backend rodando em: http://localhost:8000
echo Documentacao API: http://localhost:8000/docs
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

python main.py

