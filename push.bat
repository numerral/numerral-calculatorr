@echo off
set PATH=C:\Program Files\Git\bin;%PATH%
cd /d "c:\Users\Dell\Downloads\Calculator Tools\numerral-next"
del /q fix-css.js 2>nul
git add .
git commit -m "Add Construction Calculators Batch 11: block fill, concrete mix, concrete weight, rebar weight, concrete cost, soil volume, roofing cost, foundation, beam span, header size"
git push origin main
echo PUSH COMPLETE
