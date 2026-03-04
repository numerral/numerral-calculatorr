@echo off
set PATH=C:\Program Files\Git\bin;%PATH%
cd /d "c:\Users\Dell\Downloads\Calculator Tools\numerral-next"
git add .
git commit -m "Add interactive Chart.js charts to all calculator pages (doughnut + bar/area)"
git push origin main
echo PUSH COMPLETE
