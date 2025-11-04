@echo off
echo ========================================
echo   PUBLICAR APLICACAO NA EXPO
echo ========================================
echo.

echo [1/3] Verificando se esta logado...
eas whoami
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Voce precisa estar logado!
    echo Execute: eas login
    pause
    exit
)

echo.
echo [2/3] Publicando update na Expo...
echo.
npx expo publish --message "Versao 1.1.0 - Upload e reproducao de musicas e videos funcionando"

echo.
echo [3/3] Publicacao concluida!
echo.
echo ========================================
echo   PROXIMOS PASSOS:
echo ========================================
echo.
echo 1. Acesse: https://expo.dev/@seu-usuario/MediaApp
echo 2. Compartilhe o link com outros usuarios
echo 3. Usuarios podem escanear o QR code
echo.
echo ========================================
pause
