@echo off
set PATH=C:\Program Files\Git\bin;%PATH%
cd /d "c:\Users\Dell\Downloads\Calculator Tools\numerral-next"
git add .
git commit -m "Redesign semantic sections: hero subtitle, top calcs card, formula trust banner"
git push origin main
echo PUSH COMPLETE
