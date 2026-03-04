@echo off
set PATH=C:\Program Files\Git\bin;%PATH%
cd /d "c:\Users\Dell\Downloads\Calculator Tools\numerral-next"
git add .
git commit -m "Add semantic text blocks: hero intro, top calculations section, formula verified trust"
git push origin main
echo PUSH COMPLETE
