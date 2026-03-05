// Amount Slug Not Found — triggered by notFound() in [amountSlug]/page.tsx

import Link from "next/link";

export default function AmountNotFound() {
    return (
        <main>
            <h1>Calculator Not Found</h1>
            <p>
                We don&apos;t have a calculator for this loan amount. Try one of our
                standard amount pages or use the main calculator.
            </p>
            <p>
                <Link href="/loan-calculators/car-loan-emi">
                    ← Go to Car Loan EMI Calculator
                </Link>
            </p>
        </main>
    );
}
