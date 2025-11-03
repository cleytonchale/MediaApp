@echo off
echo ========================================
echo   MediaApp - Iniciar Tudo
echo ========================================
echo.

cd /d %~dp0

echo [1/3] Iniciando Backend...
start "MediaApp Backend" /MIN cmd /c "INICIAR_APP_FACIL.bat"

timeout /t 5 /nobreak >nul

echo [2/3] Iniciando Expo...
start "MediaApp Expo" cmd /c "npx expo start -c"

echo.
echo [3/3] Aguardando servidores...
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   PRONTO!
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Expo: Verificar janela aberta
echo.
echo Escaneia o QR code com o Expo Go!
echo.
pause

