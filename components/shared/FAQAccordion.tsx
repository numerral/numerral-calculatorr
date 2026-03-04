// FAQAccordion — Client component with styled accordion
"use client";

import { useState } from "react";
import { type FAQItem } from "@/lib/types";

interface FAQAccordionProps {
    title: string;
    items: FAQItem[];
}

export default function FAQAccordion({ title, items }: FAQAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="faq">
            <h2>{title}</h2>
            {items.map((item, i) => (
                <div key={i} className="faq__item">
                    <button
                        className="faq__trigger"
                        aria-expanded={openIndex === i}
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    >
                        <span>{item.question}</span>
                        <span className="faq__trigger-icon">
                            {openIndex === i ? "▲" : "▼"}
                        </span>
                    </button>
                    {openIndex === i && (
                        <div className="faq__answer" role="region">
                            <p>{item.answer}</p>
                        </div>
                    )}
                </div>
            ))}
        </section>
    );
}
