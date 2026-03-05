@echo off
set PATH=C:\Program Files\Git\bin;%PATH%
cd /d "c:\Users\Dell\Downloads\Calculator Tools\numerral-next"
del /q fix-css.js cleanup.ps1 2>nul
git add .
git commit -m "Add CIBIL Score Eligibility Insight module to all loan calculator pages"
git push origin main
echo PUSH COMPLETE
