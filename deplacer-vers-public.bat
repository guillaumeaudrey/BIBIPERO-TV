@echo off
cd /d "%~dp0"
echo Deplacement des fichiers du site vers le dossier "public"...
if not exist public mkdir public
move /Y *.html public
move /Y *.png public
move /Y *.mp3 public
if exist qr move qr public\qr
echo.
echo Termine. Le dossier "ai" et les fichiers .js restent ici.
echo Ensuite : git add -A  puis  git commit -m "Correctifs"  puis  git push
pause
