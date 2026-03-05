@echo off
set PATH=C:\Program Files\Git\bin;%PATH%
cd /d "c:\Users\Dell\Downloads\Calculator Tools\numerral-next"
del /q fix-css.js 2>nul
git add .
git commit -m "Fix empty loan-eligibility page: add rich NLP content, CIBIL module, fix rendering condition"
git push origin main
echo PUSH COMPLETE
