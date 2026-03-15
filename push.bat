@echo off
set PATH=C:\Program Files\Git\bin;%PATH%
cd /d "c:\Users\Dell\Downloads\Calculator Tools\numerral-next"
del /q fix-css.js 2>nul
git add .
git commit -m "Add Construction Calculators Batch 9: anchor bolt, brick veneer, concrete washout, ridge vent, stair stringer, waterproofing membrane, weep screed, board foot, concrete beam, downspout"
git push origin main
echo PUSH COMPLETE
