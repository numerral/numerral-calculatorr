@echo off
set PATH=C:\Program Files\Git\bin;%PATH%
cd /d "c:\Users\Dell\Downloads\Calculator Tools\numerral-next"

git add .
git commit -m "Beautified header with mega dropdown, hero gradient, footer update, breadcrumb spacing fix"
git push origin main
echo.
echo PUSH COMPLETE
