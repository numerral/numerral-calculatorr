@echo off
set PATH=C:\Program Files\Git\bin;%PATH%
cd /d "c:\Users\Dell\Downloads\Calculator Tools\numerral-next"

git config user.email "numerral@users.noreply.github.com"
git config user.name "numerral"

git add .
git commit -m "Numerral - 339 page financial calculator platform with SEO authority"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://numerral@github.com/numerral/numerral-calculator.git
git push -u origin main

echo.
echo PUSH COMPLETE
