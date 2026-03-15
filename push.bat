@echo off
set PATH=C:\Program Files\Git\bin;%PATH%
cd /d "c:\Users\Dell\Downloads\Calculator Tools\numerral-next"
del /q fix-css.js 2>nul
git add .
git commit -m "Add Construction Calculators Batch 6: lintel, concrete slab, roof decking, vapor barrier, excavation, crown molding, soffit, rip rap, baseboard, concrete wall"
git push origin main
echo PUSH COMPLETE
