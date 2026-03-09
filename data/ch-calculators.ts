// Swiss Calculator definitions — used by /ch/ hub and [calculator] pages

export interface ChRichSection {
    heading: string;
    paragraphs?: string[];
    bullets?: string[];
    table?: { headers: string[]; rows: string[][] };
}

export interface ChCalculator {
    id: string;
    title: string;
    keyword: string;
    calcType: string;
    icon: string;
    subtitle: string;
    explanation: {
        heading: string;
        paragraphs: string[];
        highlight: string;
    };
    faq: { question: string; answer: string }[];
    richSections?: ChRichSection[];
    relatedIds?: string[];
}

export const CH_CALCULATORS: ChCalculator[] = [
    {
        id: "hypothekenrechner",
        title: "Hypothekenrechner Schweiz",
        keyword: "Hypothekenrechner Schweiz",
        calcType: "mortgage",
        icon: "🏠",
        subtitle: "Berechnen Sie Ihre monatliche Hypothekarzahlung basierend auf Kaufpreis, Eigenkapital und Zinssatz. Mit Aufteilung in 1. und 2. Hypothek nach Schweizer Standard.",
        explanation: {
            heading: "Wie funktioniert die Hypothekenberechnung in der Schweiz?",
            paragraphs: [
                "In der Schweiz wird eine Hypothek typischerweise in zwei Tranchen aufgeteilt: Die 1. Hypothek deckt bis zu 65% des Verkehrswerts ab und muss nicht amortisiert werden. Die 2. Hypothek (65-80% des Werts) muss innerhalb von 15 Jahren oder bis zum 65. Altersjahr zurückgezahlt werden.",
                "Die monatliche Belastung setzt sich zusammen aus: Hypothekarzinsen, Amortisation der 2. Hypothek, sowie Nebenkosten (ca. 1% des Liegenschaftswerts pro Jahr für Unterhalt und Rückstellungen). Für die Tragbarkeitsberechnung verwenden Banken einen kalkulatorischen Zinssatz von ca. 5%, nicht den tatsächlichen Zinssatz.",
            ],
            highlight: "Beispiel: Liegenschaft CHF 1'000'000, Eigenkapital CHF 200'000, Hypothek CHF 800'000 bei 1.5% Zins → Monatliche Zinsen CHF 1'000 + Amortisation ca. CHF 833 + Nebenkosten CHF 833 = Total ca. CHF 2'667/Monat.",
        },
        faq: [
            { question: "Wie viel Eigenkapital brauche ich in der Schweiz?", answer: "Mindestens 20% des Kaufpreises. Davon müssen mindestens 10% aus «harten» Eigenmitteln stammen (Ersparnisse, 3. Säule, Erbvorbezug). Die restlichen 10% können aus der Pensionskasse (2. Säule) bezogen werden." },
            { question: "Was ist der Unterschied zwischen SARON und Festhypothek?", answer: "Die SARON-Hypothek hat einen variablen Zinssatz, der sich am Swiss Average Rate Overnight orientiert – aktuell oft günstiger, aber mit Zinsänderungsrisiko. Die Festhypothek bietet einen fixen Zinssatz über 2-15 Jahre und damit Planungssicherheit." },
            { question: "Kann ich den Eigenmietwert von der Steuer abziehen?", answer: "Der Eigenmietwert wird als Einkommen besteuert. Im Gegenzug können Sie Hypothekarzinsen, Unterhaltskosten und Renovationen steuerlich geltend machen. Deshalb lohnt es sich oft, die Hypothek nicht vollständig zurückzuzahlen." },
            { question: "Welche Hypothek ist für mich am besten?", answer: "Das hängt von Ihrer Risikobereitschaft und dem Zinsumfeld ab. Bei steigenden Zinsen bietet die Festhypothek Sicherheit. Bei sinkenden oder stabilen Zinsen ist die SARON-Hypothek oft günstiger. Viele Experten empfehlen eine Mischung (Tranchierung)." },
        ],
        richSections: [
            {
                heading: "Aktuelle Hypothekarzinsen Schweiz (Richtwerte 2026)",
                table: {
                    headers: ["Hypothekartyp", "Laufzeit", "Zinssatz (Richtwert)"],
                    rows: [
                        ["SARON-Hypothek", "variabel", "1.20% – 1.60%"],
                        ["Festhypothek", "2 Jahre", "1.30% – 1.70%"],
                        ["Festhypothek", "5 Jahre", "1.40% – 1.85%"],
                        ["Festhypothek", "10 Jahre", "1.60% – 2.10%"],
                        ["Festhypothek", "15 Jahre", "1.80% – 2.40%"],
                    ],
                },
            },
            {
                heading: "Aufbau einer Schweizer Hypothek",
                bullets: [
                    "1. Hypothek: bis 65% des Verkehrswerts – keine Amortisationspflicht",
                    "2. Hypothek: 65-80% des Verkehrswerts – muss in 15 Jahren oder bis Alter 65 amortisiert werden",
                    "Eigenkapital: mindestens 20% (davon 10% «hart»)",
                    "Nebenkosten: ca. 1% des Liegenschaftswerts pro Jahr",
                    "Tragbarkeit: kalkulatorische Kosten ≤ 33% des Bruttoeinkommens",
                ],
            },
        ],
        relatedIds: ["tragbarkeitsrechner", "eigenkapitalrechner", "belehnungsrechner"],
    },
    {
        id: "tragbarkeitsrechner",
        title: "Hypothek Tragbarkeit Rechner",
        keyword: "Tragbarkeitsrechner Hypothek",
        calcType: "affordability",
        icon: "📊",
        subtitle: "Prüfen Sie, ob Ihr Einkommen für die gewünschte Hypothek tragbar ist. Berechnung nach der Schweizer 33%-Regel mit kalkulatorischem Zinssatz.",
        explanation: {
            heading: "Was bedeutet Tragbarkeit bei Hypotheken?",
            paragraphs: [
                "Die Tragbarkeit ist die wichtigste Kennzahl bei der Hypothekenvergabe in der Schweiz. Sie besagt, dass die gesamten Wohnkosten (Hypothekarzinsen, Amortisation und Nebenkosten) höchstens einen Drittel (33.33%) des Brutto-Haushaltseinkommens betragen dürfen.",
                "Wichtig: Banken rechnen nicht mit dem aktuellen Zinssatz, sondern mit einem kalkulatorischen Zinssatz von rund 5%. Dies dient als Stresstest – Sie müssen sich die Hypothek auch bei höheren Zinsen leisten können. Die kalkulatorischen Kosten setzen sich zusammen aus: 5% Zins auf die Hypothek + 1% Amortisation der 2. Hypothek + 1% Nebenkosten.",
            ],
            highlight: "Bruttoeinkommen CHF 150'000 → Max. Wohnkosten CHF 50'000/Jahr → Bei kalkulatorischem Zins ergibt das eine maximale Liegenschaft von ca. CHF 750'000 (mit 20% Eigenkapital: CHF 150'000).",
        },
        faq: [
            { question: "Was passiert, wenn die Tragbarkeit nicht gegeben ist?", answer: "Die Bank wird die Hypothek ablehnen. Optionen: mehr Eigenkapital einbringen (reduziert die Hypothek), ein günstigeres Objekt suchen, oder einen Mitantragsteller mit zusätzlichem Einkommen hinzufügen." },
            { question: "Warum rechnen Banken mit 5% statt dem aktuellen Zinssatz?", answer: "Der kalkulatorische Zinssatz von ~5% ist ein Stresstest. Er stellt sicher, dass Sie die Hypothek auch tragen können, wenn die Zinsen steigen. Historisch lagen Schweizer Hypothekarzinsen bei 5-7%, daher dieser konservative Ansatz." },
            { question: "Zählt bei der Tragbarkeit nur mein Gehalt?", answer: "Nein, das gesamte Brutto-Haushaltseinkommen wird berücksichtigt: Löhne beider Partner, regelmässige Bonuszahlungen (oft nur zu 50-80%), Mieteinnahmen und andere regelmässige Einkünfte. Einmalige Einkünfte werden nicht angerechnet." },
        ],
        relatedIds: ["hypothekenrechner", "budgetrechner", "eigenkapitalrechner"],
    },
    {
        id: "eigenkapitalrechner",
        title: "Eigenkapital Rechner Haus",
        keyword: "Eigenkapital Rechner Hauskauf",
        calcType: "downpayment",
        icon: "💰",
        subtitle: "Berechnen Sie das benötigte Eigenkapital für Ihren Hauskauf in der Schweiz. Mit Aufteilung in harte Eigenmittel, Säule 3a und Pensionskasse.",
        explanation: {
            heading: "Eigenkapital beim Hauskauf in der Schweiz",
            paragraphs: [
                "Für den Erwerb von Wohneigentum in der Schweiz benötigen Sie mindestens 20% Eigenkapital. Davon müssen mindestens 10% aus sogenannten «harten» Eigenmitteln bestehen: Bankguthaben, Wertschriften, Säule 3a, Schenkungen oder Erbvorbezüge.",
                "Die restlichen 10% können aus der Pensionskasse (2. Säule) bezogen werden – als Vorbezug oder Verpfändung. Beachten Sie: Ein PK-Vorbezug reduziert Ihre Altersvorsorge und kann Steuerfolgen haben. Zusätzlich zum Eigenkapital fallen Kaufnebenkosten von 3-5% des Kaufpreises an.",
            ],
            highlight: "Kaufpreis CHF 800'000 → Eigenkapital mindestens CHF 160'000 (davon CHF 80'000 «hart») + Kaufnebenkosten ca. CHF 24'000-40'000 = Gesamtbedarf ca. CHF 200'000.",
        },
        faq: [
            { question: "Kann ich Pensionskassengeld für den Hauskauf verwenden?", answer: "Ja, bis zum 50. Altersjahr können Sie das gesamte PK-Guthaben beziehen. Ab 50 ist der Bezug auf den höheren Betrag von «Guthaben mit 50» oder «50% des aktuellen Guthabens» beschränkt. Der Bezug muss für selbstbewohntes Wohneigentum sein." },
            { question: "Was zählt als «hartes» Eigenkapital?", answer: "Bankguthaben, Wertschriften, Rückkaufswert von Lebensversicherungen, Säule 3a-Guthaben, Schenkungen, Erbvorbezüge und Erlöse aus dem Verkauf bestehender Immobilien. Nicht dazu gehören: Pensionskassenguthaben (2. Säule)." },
            { question: "Lohnt sich Vorbezug oder Verpfändung der Pensionskasse?", answer: "Verpfändung hat Vorteile: Ihr PK-Guthaben wächst weiter, der Versicherungsschutz bleibt, und es gibt keine Steuern auf den Bezug. Dafür erhalten Sie eine höhere Hypothek (und zahlen mehr Zinsen). Ein erfahrener Berater kann die optimale Strategie berechnen." },
        ],
        richSections: [
            {
                heading: "Eigenkapitalquellen im Überblick",
                table: {
                    headers: ["Quelle", "Zählt als", "Maximalbetrag", "Steuerfolgen"],
                    rows: [
                        ["Bankguthaben", "Hart", "Unbegrenzt", "Keine"],
                        ["Säule 3a", "Hart", "Gesamtes Guthaben", "Bezugssteuer (5-11%)"],
                        ["Pensionskasse (2. Säule)", "Weich", "Gemäss Reglement", "Bezugssteuer (5-11%)"],
                        ["Erbvorbezug", "Hart", "Nach Vereinbarung", "Evt. Schenkungssteuer"],
                        ["Darlehen Familie", "Hart (wenn nachrangig)", "Nach Vereinbarung", "Keine"],
                    ],
                },
            },
        ],
        relatedIds: ["hypothekenrechner", "kaufnebenkostenrechner", "budgetrechner"],
    },
    {
        id: "mieten-oder-kaufen",
        title: "Mieten oder Kaufen Rechner",
        keyword: "Mieten oder Kaufen Schweiz Rechner",
        calcType: "rent-vs-buy",
        icon: "⚖️",
        subtitle: "Vergleichen Sie die Gesamtkosten von Mieten und Kaufen über 10, 20 oder 30 Jahre. Inkl. Opportunitätskosten, Wertsteigerung und Steuereffekte.",
        explanation: {
            heading: "Mieten oder Kaufen in der Schweiz?",
            paragraphs: [
                "Die Entscheidung zwischen Mieten und Kaufen ist in der Schweiz besonders komplex. Der Eigenmietwert (fiktives Einkommen, das versteuert werden muss), die hohe Eigentumsquote-Hürde und das niedrige Zinsniveau verändern die Rechnung im Vergleich zu anderen Ländern grundlegend.",
                "Beim Vergleich müssen Sie berücksichtigen: Mietzins vs. Hypothekarzinsen + Amortisation + Nebenkosten + Eigenmietwert-Steuer, aber auch Steuerabzüge (Hypothekarzinsen, Unterhaltskosten) und die Wertsteigerung der Liegenschaft. Zudem entstehen beim Kauf Opportunitätskosten: Das Eigenkapital könnte alternativ investiert werden.",
            ],
            highlight: "Faustregel: Kaufen lohnt sich tendenziell ab einem Kaufpreis/Miet-Verhältnis unter 25 (Kaufpreis ÷ Jahresmiete). Bei einem Verhältnis über 30 ist Mieten oft günstiger.",
        },
        faq: [
            { question: "Warum mieten so viele Schweizer statt zu kaufen?", answer: "Die Schweiz hat mit ~36% eine der tiefsten Wohneigentumsquoten Europas. Gründe: hohe Immobilienpreise (Medianpreis Einfamilienhaus > CHF 1 Mio.), strenge Tragbarkeitsregeln, gut funktionierender Mietmarkt mit Mieterschutz, und der steuerliche Eigenmietwert." },
            { question: "Wie wird der Eigenmietwert berechnet?", answer: "Der Eigenmietwert entspricht ca. 60-70% der Marktmiete und wird als Einkommen besteuert. Im Gegenzug können Sie Hypothekarzinsen und Unterhaltskosten (pauschal oder effektiv) abziehen. Eine Abschaffung des Eigenmietwerts wird politisch diskutiert." },
        ],
        relatedIds: ["hypothekenrechner", "tragbarkeitsrechner", "renditerechner"],
    },
    {
        id: "renditerechner",
        title: "Immobilien Rendite Rechner",
        keyword: "Immobilien Rendite Rechner Schweiz",
        calcType: "property-roi",
        icon: "📈",
        subtitle: "Berechnen Sie die Brutto- und Nettorendite Ihrer Immobilienanlage. Inkl. Nebenkosten, Leerstand, Verwaltung und Finanzierungskosten.",
        explanation: {
            heading: "Immobilienrendite in der Schweiz berechnen",
            paragraphs: [
                "Die Bruttorendite einer Immobilie berechnet sich einfach: Jahresmieteinnahmen ÷ Kaufpreis × 100. Die Nettorendite berücksichtigt zusätzlich alle Kosten: Verwaltung, Unterhalt, Leerstand, Versicherungen und Hypothekarzinsen.",
                "In der Schweiz liegen die Bruttorenditen für Wohnimmobilien typischerweise bei 3-5% (Städte: tiefer, Agglomeration: höher). Gewerbeimmobilien können 5-7% erreichen, tragen aber ein höheres Risiko. Wichtig: Vergessen Sie nicht die potenzielle Wertsteigerung – Schweizer Immobilien haben sich langfristig um ca. 2-3% pro Jahr verteuert.",
            ],
            highlight: "Beispiel: Kaufpreis CHF 1'500'000, Jahresmieteinnahmen CHF 60'000 → Bruttorendite 4.0%. Nach Abzug von Kosten (ca. CHF 18'000) → Nettorendite ca. 2.8%.",
        },
        faq: [
            { question: "Was ist eine gute Rendite für Immobilien in der Schweiz?", answer: "Eine Bruttorendite von 4-5% gilt als gut, 3-4% als durchschnittlich. In Zürich und Genf liegen die Renditen oft unter 3% (hohe Kaufpreise), während ländliche Gebiete 5%+ bieten können – allerdings mit höherem Leerstandsrisiko." },
            { question: "Wie berechne ich die Eigenkapitalrendite?", answer: "Eigenkapitalrendite = (Nettomieteinnahmen - Hypothekarzinsen) ÷ eingesetztes Eigenkapital × 100. Durch den Hebeleffekt der Hypothek kann die Eigenkapitalrendite deutlich höher sein als die Objektrendite." },
        ],
        relatedIds: ["hypothekenrechner", "mieten-oder-kaufen", "zinsrechner"],
    },
    {
        id: "amortisationsrechner",
        title: "Hypothek Amortisation Rechner",
        keyword: "Hypothek Amortisation Rechner Schweiz",
        calcType: "amortization",
        icon: "📉",
        subtitle: "Berechnen Sie Ihren Amortisationsplan für die 2. Hypothek. Direkte vs. indirekte Amortisation mit Steuervergleich.",
        explanation: {
            heading: "Amortisation der Hypothek in der Schweiz",
            paragraphs: [
                "In der Schweiz muss die 2. Hypothek (der Teil zwischen 65% und 80% des Verkehrswerts) innerhalb von 15 Jahren oder bis zum 65. Altersjahr amortisiert werden. Die 1. Hypothek (bis 65%) hat keine Amortisationspflicht.",
                "Es gibt zwei Arten der Amortisation: Direkte Amortisation (regelmässige Rückzahlung – die Hypothek sinkt, Zinsabzüge nehmen ab) und Indirekte Amortisation (Einzahlung in die Säule 3a – die Hypothek bleibt gleich, Zinsabzug bleibt maximal, und die 3a-Einzahlung ist steuerbegünstigt). Die indirekte Amortisation ist steuerlich oft vorteilhafter.",
            ],
            highlight: "2. Hypothek CHF 150'000, Laufzeit 15 Jahre → Direkt: CHF 833/Monat Rückzahlung. Indirekt: CHF 833/Monat in Säule 3a einzahlen (steuerbegünstigt), Hypothek am Ende mit 3a-Guthaben ablösen.",
        },
        faq: [
            { question: "Was ist der Unterschied zwischen direkter und indirekter Amortisation?", answer: "Direkt: Sie zahlen die Hypothek regelmässig zurück – Schuld sinkt, Zinsabzug sinkt. Indirekt: Sie zahlen in die Säule 3a ein – Hypothek bleibt gleich (maximaler Zinsabzug), 3a-Beiträge sind vom steuerbaren Einkommen abziehbar, am Ende lösen Sie die Hypothek mit dem 3a-Guthaben ab." },
            { question: "Soll ich die 1. Hypothek freiwillig amortisieren?", answer: "Oft nicht: Hypothekarzinsen sind steuerlich absetzbar, und bei niedrigen Zinsen kann die Rendite einer alternativen Anlage höher sein. Ausnahme: Sie nähern sich dem Pensionsalter und möchten die Wohnkosten senken, oder die Zinsen steigen stark." },
        ],
        relatedIds: ["hypothekenrechner", "zinsrechner", "belehnungsrechner"],
    },
    {
        id: "zinsrechner",
        title: "Hypothek Zins Rechner",
        keyword: "Hypothek Zinsrechner Schweiz",
        calcType: "interest",
        icon: "💹",
        subtitle: "Vergleichen Sie verschiedene Hypothekarmodelle: SARON, Festhypothek 2-15 Jahre. Sehen Sie die Gesamtzinsbelastung über die Laufzeit.",
        explanation: {
            heading: "Hypothekarzinsen vergleichen",
            paragraphs: [
                "Der Zinssatz ist der grösste Kostenfaktor Ihrer Hypothek. In der Schweiz stehen Ihnen verschiedene Modelle zur Verfügung: SARON-Hypothek (variabel, orientiert am Swiss Average Rate Overnight mit Marge), Festhypothek (fixer Zins über 2-15 Jahre) und selten auch variable Hypotheken.",
                "Die richtige Wahl hängt von der Zinsentwicklung ab. SARON-Hypotheken sind aktuell oft günstiger, bergen aber ein Zinsänderungsrisiko. Festhypotheken geben Planungssicherheit. Viele Berater empfehlen eine Tranchierung: z.B. 50% SARON + 50% Festhypothek 5 Jahre.",
            ],
            highlight: "Hypothek CHF 800'000: Bei 1.5% Zins zahlen Sie CHF 12'000/Jahr Zinsen. Bei 2.5% sind es CHF 20'000/Jahr – eine Differenz von CHF 8'000 pro Jahr oder CHF 667/Monat.",
        },
        faq: [
            { question: "Was ist der SARON-Zinssatz?", answer: "SARON (Swiss Average Rate Overnight) ist der Referenzzinssatz der Schweizerischen Nationalbank (SNB). Er ersetzt seit 2022 den LIBOR. Ihre Bank addiert eine Marge (typisch 0.5-0.9%). Der SARON-Satz wird täglich berechnet, die Hypothekarzinsen werden vierteljährlich angepasst." },
            { question: "Kann ich während der Laufzeit den Hypothekartyp wechseln?", answer: "Bei SARON-Hypotheken ist ein Wechsel mit 3-6 Monaten Kündigungsfrist möglich. Festhypotheken können vor Ablauf nur gegen eine Vorfälligkeitsentschädigung (Penalty) aufgelöst werden. Planen Sie die Laufzeit daher sorgfältig." },
        ],
        richSections: [
            {
                heading: "Zinskosten-Vergleich über 10 Jahre (Hypothek CHF 800'000)",
                table: {
                    headers: ["Zinssatz", "Jährliche Zinsen", "Zinsen total (10 J.)", "Monatliche Belastung"],
                    rows: [
                        ["1.25%", "CHF 10'000", "CHF 100'000", "CHF 833"],
                        ["1.50%", "CHF 12'000", "CHF 120'000", "CHF 1'000"],
                        ["2.00%", "CHF 16'000", "CHF 160'000", "CHF 1'333"],
                        ["2.50%", "CHF 20'000", "CHF 200'000", "CHF 1'667"],
                        ["3.00%", "CHF 24'000", "CHF 240'000", "CHF 2'000"],
                    ],
                },
            },
        ],
        relatedIds: ["hypothekenrechner", "amortisationsrechner", "tragbarkeitsrechner"],
    },
    {
        id: "kaufnebenkostenrechner",
        title: "Kaufnebenkosten Rechner Immobilie",
        keyword: "Kaufnebenkosten Rechner Schweiz",
        calcType: "closing-costs",
        icon: "📋",
        subtitle: "Berechnen Sie die Nebenkosten beim Immobilienkauf: Grundbuchgebühren, Notarkosten und Handänderungssteuer nach Kanton.",
        explanation: {
            heading: "Kaufnebenkosten beim Immobilienerwerb in der Schweiz",
            paragraphs: [
                "Beim Kauf einer Liegenschaft in der Schweiz fallen neben dem Kaufpreis zusätzliche Kosten an: Grundbuchgebühren (0.1-0.5%), Notarkosten (0.1-0.5%), Handänderungssteuer (0-3.3% je nach Kanton), und eventuell Maklergebühren. Diese Nebenkosten variieren erheblich zwischen den Kantonen.",
                "In einigen Kantone wie Zürich, Schwyz und Zug gibt es keine Handänderungssteuer – dort sind die Nebenkosten am niedrigsten (ca. 1-2%). In Kantonen wie Waadt (3.3%), Genf (3%) oder Tessin (2.5%) können die Nebenkosten dagegen bis zu 5% des Kaufpreises betragen.",
            ],
            highlight: "Kaufpreis CHF 1'000'000 in Kanton Zürich: Grundbuch ca. CHF 2'000 + Notar ca. CHF 3'000 + Schuldbrieferrichtung ca. CHF 5'000 = Total ca. CHF 10'000 (1%). Im Kanton Waadt: ca. CHF 38'000 (3.8%).",
        },
        faq: [
            { question: "Was ist die Handänderungssteuer?", answer: "Die Handänderungssteuer ist eine kantonale Steuer, die beim Eigentumswechsel einer Liegenschaft anfällt. Sie wird vom Kaufpreis berechnet und variiert je nach Kanton zwischen 0% (z.B. Zürich, Schwyz) und 3.3% (Waadt). In einigen Kantonen tragen Käufer und Verkäufer die Steuer je zur Hälfte." },
            { question: "Wer zahlt den Notar beim Hauskauf?", answer: "In der Regel teilen sich Käufer und Verkäufer die Notarkosten, wobei der Käufer den grösseren Anteil trägt. Die genaue Aufteilung wird im Kaufvertrag geregelt. In einigen Kantonen ist die Beurkundung durch einen Notar obligatorisch, in anderen reicht eine öffentliche Urkunde." },
        ],
        richSections: [
            {
                heading: "Handänderungssteuer nach Kanton",
                table: {
                    headers: ["Kanton", "Handänderungssteuer", "Hinweis"],
                    rows: [
                        ["Zürich", "0%", "Keine Handänderungssteuer"],
                        ["Bern", "1.8%", "Käufer und Verkäufer je 50%"],
                        ["Luzern", "1.5%", "Käufer zahlt"],
                        ["Schwyz", "0%", "Keine Handänderungssteuer"],
                        ["Zug", "0%", "Keine Handänderungssteuer"],
                        ["Basel-Stadt", "3.0%", "Käufer zahlt"],
                        ["St. Gallen", "1.0%", "Käufer zahlt"],
                        ["Aargau", "Keine (Grundbuchgebühr)", "Tiefe Nebenkosten"],
                        ["Waadt (Vaud)", "3.3%", "Höchster Satz"],
                        ["Genf", "3.0%", "Käufer zahlt"],
                        ["Tessin", "2.5%", "Käufer und Verkäufer je 50%"],
                    ],
                },
            },
        ],
        relatedIds: ["hypothekenrechner", "eigenkapitalrechner", "budgetrechner"],
    },
    {
        id: "belehnungsrechner",
        title: "Belehnung Rechner Hypothek",
        keyword: "Belehnung Rechner Hypothek Schweiz",
        calcType: "ltv",
        icon: "🔢",
        subtitle: "Berechnen Sie die Belehnung (Loan-to-Value) und die Aufteilung in 1. und 2. Hypothek nach Schweizer Standard.",
        explanation: {
            heading: "Was ist die Belehnung?",
            paragraphs: [
                "Die Belehnung (Loan-to-Value, LTV) beschreibt das Verhältnis zwischen Hypothek und Verkehrswert der Liegenschaft. In der Schweiz beträgt die maximale Belehnung 80% für Wohnliegenschaften. Für Ferienobjekte gelten strengere Regeln (max. 60-70%).",
                "Die Hypothek wird in zwei Tranchen aufgeteilt: Die 1. Hypothek (bis 65% Belehnung) hat keine Amortisationspflicht. Die 2. Hypothek (65-80%) muss innerhalb von 15 Jahren oder bis Alter 65 zurückgezahlt werden. Je tiefer die Belehnung, desto besser die Zinskonditionen.",
            ],
            highlight: "Verkehrswert CHF 1'000'000, Hypothek CHF 800'000 → Belehnung 80%. 1. Hypothek: CHF 650'000 (65%), 2. Hypothek: CHF 150'000 (15%). Die 2. Hypothek muss amortisiert werden.",
        },
        faq: [
            { question: "Kann ich mehr als 80% belehnen?", answer: "In der Regel nicht für Wohnliegenschaften. Ausnahmen sind selten und erfordern zusätzliche Sicherheiten (z.B. Lebensversicherungen). Für Renditeliegenschaften kann die maximale Belehnung je nach Bank bei 70-75% liegen." },
            { question: "Was passiert bei sinkenden Immobilienpreisen?", answer: "Wenn der Verkehrswert unter die Belehnung sinkt, kann die Bank zusätzliches Eigenkapital oder eine Sondertilgung verlangen. Dies geschieht aber selten bei selbstbewohnten Liegenschaften und moderaten Preiskorrekturen." },
        ],
        relatedIds: ["hypothekenrechner", "amortisationsrechner", "eigenkapitalrechner"],
    },
    {
        id: "budgetrechner",
        title: "Eigenheim Budget Rechner",
        keyword: "Eigenheim Budget Rechner Schweiz",
        calcType: "budget",
        icon: "🏡",
        subtitle: "Ermitteln Sie Ihr maximales Budget für den Hauskauf basierend auf Einkommen und vorhandenem Eigenkapital. Mit Tragbarkeitsprüfung.",
        explanation: {
            heading: "Wie viel Haus können Sie sich leisten?",
            paragraphs: [
                "Der Budget Rechner kombiniert Tragbarkeit und Eigenkapital, um Ihr maximales Kaufbudget zu ermitteln. Es gelten zwei Limiten: (1) Die Tragbarkeit – Ihre kalkulatorischen Wohnkosten dürfen maximal 33% des Bruttoeinkommens betragen. (2) Das Eigenkapital – Sie benötigen mindestens 20% des Kaufpreises.",
                "Der limitierende Faktor bestimmt Ihr Budget: Haben Sie viel Eigenkapital aber ein moderates Einkommen, limitiert die Tragbarkeit. Haben Sie ein hohes Einkommen aber wenig Erspartes, limitiert das Eigenkapital. Idealeweise stimmen beide Faktoren überein.",
            ],
            highlight: "Bruttoeinkommen CHF 180'000, Eigenkapital CHF 250'000 → Tragbarkeits-Limit: ca. CHF 1'080'000. Eigenkapital-Limit: CHF 1'250'000 (250'000 ÷ 0.20). → Ihr Budget: CHF 1'080'000 (Tragbarkeit limitiert).",
        },
        faq: [
            { question: "Wie kann ich mein Budget erhöhen?", answer: "Mehr Eigenkapital ansparen (3a-Sparen, Erbvorbezug), Einkommen erhöhen, Partner-Einkommen einberechnen, oder in einer günstigeren Region suchen. Auch eine Renovation oder ein Neubau auf eigenem Land kann günstiger sein als ein Kauf." },
            { question: "Sind Renovationskosten im Budget einzuplanen?", answer: "Ja, unbedingt. Bei älteren Liegenschaften sollten Sie 5-15% des Kaufpreises für Renovationen einplanen. Energetische Sanierungen (Heizung, Isolation, Fenster) können schnell CHF 50'000-200'000 kosten, werden aber teilweise von Bund und Kantonen subventioniert." },
        ],
        relatedIds: ["tragbarkeitsrechner", "eigenkapitalrechner", "hypothekenrechner"],
    },
];

export function getChCalculatorBySlug(slug: string): ChCalculator | undefined {
    return CH_CALCULATORS.find(c => c.id === slug);
}
