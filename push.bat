@echo off
set PATH=C:\Program Files\Git\bin;%PATH%
cd /d "c:\Users\Dell\Downloads\Calculator Tools\numerral-next"
del /q fix-css.js 2>nul
git add .
git commit -m "Upgrade homepage content for topical authority & redesign footer with content/terms/policy links"
git push origin main
echo PUSH COMPLETE
