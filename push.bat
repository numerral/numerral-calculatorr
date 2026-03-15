@echo off
set PATH=C:\Program Files\Git\bin;%PATH%
cd /d "c:\Users\Dell\Downloads\Calculator Tools\numerral-next"
del /q fix-css.js 2>nul
git add .
git commit -m "Add Construction Calculators Batch 8: concrete driveway, vapor barrier, expansion joint, sump pump basin, weep hole, mortar joint, concrete curb, drainage swale, window flashing, roof underlayment"
git push origin main
echo PUSH COMPLETE
