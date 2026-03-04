@echo off
set PATH=C:\Program Files\Git\bin;%PATH%
cd /d "c:\Users\Dell\Downloads\Calculator Tools\numerral-next"
del /q fix-css.js cleanup.ps1 2>nul
git add .
git commit -m "Polish Top Financial Calculations: styled icon boxes, shadow, gradient, CTA link"
git push origin main
echo PUSH COMPLETE
