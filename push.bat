@echo off
set PATH=C:\Program Files\Git\bin;%PATH%
cd /d "c:\Users\Dell\Downloads\Calculator Tools\numerral-next"
del /q fix-css.js 2>nul
git add .
git commit -m "Add Construction Calculators Batch 4: soil amendment, concrete stairs, aggregate, column, board & batten, drainage, plywood, ceiling tile, gabion wall, post hole"
git push origin main
echo PUSH COMPLETE
