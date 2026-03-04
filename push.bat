@echo off
set SRC=C:\Users\Dell\.gemini\antigravity\brain\1364a3df-dbd0-448e-b460-2d7e246eff68
set DST=c:\Users\Dell\Downloads\Calculator Tools\numerral-next\public\images\guides

copy /Y "%SRC%\reduce_loan_emi_1772659568607.png" "%DST%\how-to-reduce-loan-emi.png"
copy /Y "%SRC%\car_vs_personal_1772659585088.png" "%DST%\car-loan-vs-personal-loan.png"
copy /Y "%SRC%\home_loan_tenure_1772659600081.png" "%DST%\best-tenure-for-home-loan.png"
copy /Y "%SRC%\sip_compounding_1772659616139.png" "%DST%\how-sip-compounding-works.png"

echo Images copied!

set PATH=C:\Program Files\Git\bin;%PATH%
cd /d "c:\Users\Dell\Downloads\Calculator Tools\numerral-next"
git add .
git commit -m "Add 4 new guides: reduce EMI, car vs personal loan, best tenure, SIP compounding"
git push origin main

echo PUSH COMPLETE
