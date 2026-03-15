@echo off
set PATH=C:\Program Files\Git\bin;%PATH%
cd /d "c:\Users\Dell\Downloads\Calculator Tools\numerral-next"
del /q fix-css.js 2>nul
git add .
git commit -m "Add Construction Calculators Batch 5: mortar, concrete footing, landscape rock, roof truss, wainscoting, grading, stucco, rain barrel, concrete curb, wire mesh"
git push origin main
echo PUSH COMPLETE
