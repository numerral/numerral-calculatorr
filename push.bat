@echo off
set PATH=C:\Program Files\Git\bin;%PATH%
cd /d "c:\Users\Dell\Downloads\Calculator Tools\numerral-next"
del /q fix-css.js 2>nul
git add .
git commit -m "Add Construction Calculators Batch 7: french drain, concrete pier, house wrap, stair railing, drop ceiling, concrete column, flashing, baluster, backsplash, trench fill"
git push origin main
echo PUSH COMPLETE
