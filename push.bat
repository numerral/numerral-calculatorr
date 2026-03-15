@echo off
set PATH=C:\Program Files\Git\bin;%PATH%
cd /d "c:\Users\Dell\Downloads\Calculator Tools\numerral-next"
del /q fix-css.js 2>nul
git add .
git commit -m "Add Construction Calculators Batch 12: deck stain, paver base, polymeric sand, asphalt sealer, gravel driveway, fence stain, vinyl fence, fence cost, linear-sqft, flooring cost"
git push origin main
echo PUSH COMPLETE
