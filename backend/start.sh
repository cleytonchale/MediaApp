#!/bin/bash

echo "================================="
echo "  Media Player - Backend Server"
echo "================================="
echo ""

# Verificar se o ambiente virtual existe
if [ ! -d "venv" ]; then
    echo "[1/3] Criando ambiente virtual..."
    python3 -m venv venv
    echo ""
fi

echo "[2/3] Ativando ambiente virtual..."
source venv/bin/activate
echo ""

echo "[3/3] Instalando/Atualizando dependências..."
pip install -r requirements.txt --quiet
echo ""

echo "================================="
echo "  Iniciando servidor..."
echo "================================="
echo ""
echo "Backend rodando em: http://localhost:8000"
echo "Documentação API: http://localhost:8000/docs"
echo ""
echo "Pressione Ctrl+C para parar o servidor"
echo ""

python main.py

