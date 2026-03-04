@echo off
set SRC=C:\Users\Dell\.gemini\antigravity\brain\1364a3df-dbd0-448e-b460-2d7e246eff68
set DST=c:\Users\Dell\Downloads\Calculator Tools\numerral-next\public\images\guides

copy /Y "%SRC%\emi_vs_sip_1772660048945.png" "%DST%\emi-vs-sip-comparison.png"
copy /Y "%SRC%\rent_vs_buy_1772660076173.png" "%DST%\rent-vs-buy-analysis.png"
copy /Y "%SRC%\loan_vs_cash_1772660089096.png" "%DST%\loan-vs-cash-purchase.png"
copy /Y "%SRC%\fd_vs_sip_1772660106483.png" "%DST%\fd-vs-sip-returns.png"

echo Images copied!

set PATH=C:\Program Files\Git\bin;%PATH%
cd /d "c:\Users\Dell\Downloads\Calculator Tools\numerral-next"
git add .
git commit -m "Add 4 comparison guides: EMI vs SIP, Rent vs Buy, Loan vs Cash, FD vs SIP"
git push origin main

echo PUSH COMPLETE
