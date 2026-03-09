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
    // ═══════════════════════════════════════════════════
    // SWISS TAX CALCULATORS
    // ═══════════════════════════════════════════════════
    {
        id: "steuerrechner",
        title: "Steuerrechner Schweiz",
        keyword: "Steuerrechner Schweiz",
        calcType: "tax-overview",
        icon: "🧾",
        subtitle: "Berechnen Sie Ihre gesamte Steuerbelastung in der Schweiz: Bundessteuer, Kantonssteuer und Gemeindesteuer. Wählen Sie Ihren Kanton und Ihre Gemeinde.",
        explanation: {
            heading: "Wie funktioniert das Schweizer Steuersystem?",
            paragraphs: [
                "In der Schweiz werden Steuern auf drei Ebenen erhoben: Bund, Kanton und Gemeinde. Die direkte Bundessteuer ist für alle Kantone gleich und progressiv (max. 11.5%). Die Kantonssteuer variiert stark — Zug und Schwyz haben die tiefsten, Genf und Basel die höchsten Sätze.",
                "Die Gemeindesteuer wird als Vielfaches (Steuerfuss) der Kantonssteuer berechnet. Ein Steuerfuss von 115% bedeutet: Kantonssteuer × 1.15. So kann die Gesamtbelastung innerhalb desselben Kantons je nach Gemeinde stark variieren. Abzüge wie Berufskosten, Säule 3a, Versicherungsprämien und Hypothekarzinsen senken das steuerbare Einkommen.",
            ],
            highlight: "Beispiel: Bruttoeinkommen CHF 120'000, verheiratet, 2 Kinder, Kanton Zürich, Stadt Zürich (Steuerfuss 119%) → Steuerbelastung ca. CHF 14'500 (12.1%). Im Kanton Zug wären es nur ca. CHF 8'200 (6.8%).",
        },
        faq: [
            { question: "Warum sind die Steuern in der Schweiz so unterschiedlich?", answer: "Die Steuerhoheit der Kantone und Gemeinden ist in der Bundesverfassung verankert. Jeder Kanton hat eigene Steuergesetze und -tarife. Der Steuerwettbewerb zwischen Kantonen führt zu grossen Unterschieden — von ca. 8% (Zug) bis über 35% (Genf) Grenzsteuersatz." },
            { question: "Was kann ich von der Steuer abziehen?", answer: "Typische Abzüge: Berufskosten (Pauschale oder effektiv), Fahrkosten zur Arbeit, Säule 3a (max. CHF 7'258), Hypothekarzinsen, Unterhalt der Liegenschaft, Krankenkassenprämien (pauschal), Kinderabzüge, Ausbildungskosten und Spenden." },
            { question: "Wann muss ich die Steuererklärung einreichen?", answer: "In den meisten Kantonen bis 31. März des Folgejahres. Fristverlängerungen sind fast überall möglich (bis September/November). Tipp: Online-Steuererklärung nutzen — sie berechnet viele Abzüge automatisch." },
            { question: "Was ist der Steuerfuss?", answer: "Der Steuerfuss ist ein Multiplikator, der auf die einfache Kantonssteuer angewandt wird. Er wird jährlich von der Gemeindeversammlung festgelegt. Ein Steuerfuss von 100% = einfache Steuer. 120% = 20% Zuschlag. Der Steuerfuss variiert innerhalb eines Kantons zwischen den Gemeinden." },
        ],
        richSections: [
            {
                heading: "Steuerbelastung nach Kanton (Richtwerte für CHF 100'000 Einkommen, ledig)",
                table: {
                    headers: ["Kanton", "Hauptort", "Ungefähre Belastung", "Effektiver Steuersatz"],
                    rows: [
                        ["Zug", "Zug", "CHF 8'200", "8.2%"],
                        ["Schwyz", "Schwyz", "CHF 10'100", "10.1%"],
                        ["Nidwalden", "Stans", "CHF 10'500", "10.5%"],
                        ["Zürich", "Zürich", "CHF 14'500", "14.5%"],
                        ["Bern", "Bern", "CHF 17'800", "17.8%"],
                        ["Basel-Stadt", "Basel", "CHF 22'400", "22.4%"],
                        ["Genf", "Genf", "CHF 24'600", "24.6%"],
                    ],
                },
            },
        ],
        relatedIds: ["einkommenssteuerrechner", "vermoegenssteuerrechner", "steuervergleich"],
    },
    {
        id: "einkommenssteuerrechner",
        title: "Einkommenssteuer Rechner",
        keyword: "Einkommenssteuer Rechner Schweiz",
        calcType: "income-tax",
        icon: "💼",
        subtitle: "Berechnen Sie Ihre Einkommenssteuer nach Bund, Kanton und Gemeinde. Mit Berücksichtigung von Abzügen, Zivilstand und Kindern.",
        explanation: {
            heading: "Einkommenssteuer in der Schweiz berechnen",
            paragraphs: [
                "Die Einkommenssteuer wird auf das steuerbare Einkommen (Reineinkommen minus Abzüge) erhoben. Die direkte Bundessteuer ist progressiv mit einem Maximalsatz von 11.5%. Kantone und Gemeinden erheben zusätzlich ihre eigenen Einkommenssteuern mit unterschiedlichen Tarifen.",
                "Das steuerbare Einkommen berechnet sich wie folgt: Bruttoeinkommen minus Sozialversicherungsbeiträge (AHV/IV/EO/ALV: ca. 6.4%), minus Berufskosten, minus Versicherungsprämien, minus Säule 3a, minus weitere Abzüge. Verheiratete Paare profitieren oft vom Verheiratetentarif mit tieferen Sätzen.",
            ],
            highlight: "Bruttoeinkommen CHF 100'000, ledig, keine Kinder → Steuerbares Einkommen ca. CHF 80'000 (nach Abzügen). Bundessteuer: ca. CHF 1'200. Kantons-/Gemeindesteuer (Zürich): ca. CHF 12'300. Total: ca. CHF 13'500.",
        },
        faq: [
            { question: "Wie unterscheidet sich der Tarif für Verheiratete?", answer: "Verheiratete werden gemeinsam besteuert (Zusammenveranlagung). Der Verheiratetentarif hat tiefere Sätze bei gleichem Einkommen. Bei Doppelverdienern gibt es zusätzlich einen Zweiverdienerabzug. Achtung: Ab einem gewissen Einkommen kann die 'Heiratsstrafe' (höhere Steuern als zwei Einzelpersonen) eintreten." },
            { question: "Was sind die wichtigsten Abzüge?", answer: "Berufskosten (Pauschale CHF 2'000-4'000), Fahrkosten (max. CHF 3'200 Bundessteuer), Säule 3a (CHF 7'258), Versicherungsprämien (kantonal unterschiedlich), Kinderabzug (CHF 6'600 pro Kind Bundessteuer), und Hypothekarzinsen." },
            { question: "Werden Bonuszahlungen höher besteuert?", answer: "Nein, es gibt keinen speziellen Bonus-Steuersatz. Boni werden zum regulären Einkommen addiert. Da die Steuer progressiv ist, kann ein Bonus aber dazu führen, dass Sie in eine höhere Progressionsstufe rutschen und einen höheren Grenzsteuersatz zahlen." },
        ],
        relatedIds: ["steuerrechner", "steuerabzugrechner", "steueroptimierungrechner"],
    },
    {
        id: "vermoegenssteuerrechner",
        title: "Vermögenssteuer Rechner",
        keyword: "Vermögenssteuer Rechner Schweiz",
        calcType: "wealth-tax",
        icon: "🏦",
        subtitle: "Berechnen Sie Ihre kantonale und kommunale Vermögenssteuer. Die Schweiz ist eines der wenigen Länder, das Vermögen jährlich besteuert.",
        explanation: {
            heading: "Vermögenssteuer in der Schweiz",
            paragraphs: [
                "Die Vermögenssteuer wird von Kantonen und Gemeinden erhoben (nicht vom Bund). Sie besteuert das Reinvermögen: Wertschriften, Bankguthaben, Immobilien (zum Steuerwert), Fahrzeuge, Lebensversicherungen und weitere Vermögenswerte, abzüglich Schulden (v.a. Hypotheken).",
                "Die Steuersätze sind progressiv und variieren stark nach Kanton. In steuergünstigen Kantonen wie Schwyz beträgt der Satz nur ca. 1‰, in Basel-Stadt bis zu 8‰. Freibeträge liegen je nach Kanton und Zivilstand zwischen CHF 50'000 und CHF 200'000.",
            ],
            highlight: "Beispiel: Reinvermögen CHF 1'000'000, Kanton Zürich → Vermögenssteuer ca. CHF 2'500 (2.5‰). Im Kanton Schwyz: ca. CHF 800 (0.8‰). Differenz: CHF 1'700 pro Jahr.",
        },
        faq: [
            { question: "Wie wird der Wert meiner Immobilie für die Vermögenssteuer berechnet?", answer: "Immobilien werden zum amtlichen oder kantonalen Steuerwert bewertet, nicht zum Marktwert. Der Steuerwert liegt je nach Kanton bei 60-100% des Marktwertes. Durch regelmässige Neubewertungen nähern sich viele Kantone dem Marktwert an." },
            { question: "Welche Schulden kann ich vom Vermögen abziehen?", answer: "Alle nachgewiesenen Schulden: Hypotheken, Darlehen, Privatkredite, Steuerschulden, offene Rechnungen. Wichtig: Hypothekarschulden reduzieren das steuerbare Vermögen direkt — ein Grund, warum viele Schweizer ihre Hypothek nicht vollständig zurückzahlen." },
            { question: "Gibt es einen Freibetrag?", answer: "Ja, die meisten Kantone kennen Freibeträge: z.B. Zürich CHF 77'000 (ledig) / CHF 154'000 (verheiratet). Bern CHF 97'000 / CHF 194'000. Auf den Betrag unter dem Freibetrag wird keine Vermögenssteuer erhoben." },
        ],
        relatedIds: ["steuerrechner", "einkommenssteuerrechner", "steuervergleich"],
    },
    {
        id: "quellensteuerrechner",
        title: "Quellensteuer Rechner",
        keyword: "Quellensteuer Rechner Schweiz",
        calcType: "withholding-tax",
        icon: "✂️",
        subtitle: "Berechnen Sie die Quellensteuer für ausländische Arbeitnehmer ohne C-Bewilligung. Mit kantonalen Tarifen und Abzugsmöglichkeiten.",
        explanation: {
            heading: "Quellensteuer in der Schweiz",
            paragraphs: [
                "Die Quellensteuer betrifft ausländische Arbeitnehmer ohne Niederlassungsbewilligung C (also mit B- oder L-Bewilligung). Der Arbeitgeber zieht die Steuer direkt vom Lohn ab und überweist sie an das Steueramt. Ab einem Bruttojahreseinkommen von CHF 120'000 wird nachträglich eine ordentliche Veranlagung durchgeführt.",
                "Der Quellensteuertarif berücksichtigt bereits Standardabzüge (Berufskosten, Versicherungen etc.). Es gibt verschiedene Tarife: A (ledig), B (verheiratet, Alleinverdiener), C (verheiratet, Doppelverdiener), und Sondertarife. Die Sätze variieren je nach Kanton und Bruttoeinkommen.",
            ],
            highlight: "Beispiel: Bruttoeinkommen CHF 8'000/Monat, ledig (Tarif A0), Kanton Zürich → Quellensteuer ca. CHF 920/Monat (11.5%). Im Kanton Zug: ca. CHF 520/Monat (6.5%).",
        },
        faq: [
            { question: "Wer unterliegt der Quellensteuer?", answer: "Ausländische Arbeitnehmer mit B- oder L-Bewilligung (keine C-Bewilligung), Grenzgänger, und ausländische Arbeitnehmer mit vorübergehendem Aufenthalt. Sobald Sie die C-Bewilligung erhalten, werden Sie ordentlich veranlagt." },
            { question: "Kann ich eine nachträgliche Korrektur beantragen?", answer: "Ja, wenn Sie Abzüge geltend machen möchten, die im Quellensteuertarif nicht pauschal enthalten sind (z.B. höhere effektive Berufskosten, Säule 3a, Kinderbetreuungskosten). Frist: bis 31. März des Folgejahres." },
            { question: "Was passiert bei Einkommen über CHF 120'000?", answer: "Ab einem Jahresbruttoeinkommen von CHF 120'000 erfolgt eine nachträgliche ordentliche Veranlagung (NOV). Sie müssen eine vollständige Steuererklärung einreichen. Die bezahlte Quellensteuer wird angerechnet." },
        ],
        relatedIds: ["einkommenssteuerrechner", "steuerrechner", "steuerabzugrechner"],
    },
    {
        id: "mehrwertsteuerrechner",
        title: "Mehrwertsteuer Rechner (MWST)",
        keyword: "Mehrwertsteuer Rechner Schweiz",
        calcType: "vat",
        icon: "🧮",
        subtitle: "Berechnen Sie die Schweizer Mehrwertsteuer (MWST) für Normal-, Sonder- und reduzierte Sätze. Mit Netto-/Brutto-Umrechnung und MWST-Pflicht-Prüfung.",
        explanation: {
            heading: "Mehrwertsteuer (MWST) in der Schweiz",
            paragraphs: [
                "Die Schweizer MWST wird auf die meisten Waren und Dienstleistungen erhoben. Es gibt drei Sätze: Normalsatz 8.1% (seit 2024), reduzierter Satz 2.6% (Lebensmittel, Bücher, Medikamente, Zeitungen) und Sondersatz 3.8% (Beherbergung).",
                "Unternehmen mit einem Jahresumsatz über CHF 100'000 sind MWST-pflichtig und müssen sich bei der ESTV (Eidgenössische Steuerverwaltung) registrieren. Die Vorsteuer (MWST auf Einkäufe) kann von der geschuldeten MWST abgezogen werden. Exporte und bestimmte Dienstleistungen sind von der MWST befreit.",
            ],
            highlight: "Produkt zum Nettopreis CHF 100: Mit 8.1% MWST = CHF 108.10 Bruttopreis. Lebensmittel zum Nettopreis CHF 100: Mit 2.6% MWST = CHF 102.60.",
        },
        faq: [
            { question: "Was ist der Unterschied zu Deutschland/Österreich?", answer: "Die Schweizer MWST (8.1%) ist deutlich tiefer als in der EU (19-27%). Dafür sind weniger Waren/Dienstleistungen befreit. Beim Import in die Schweiz fällt statt ausländischer Umsatzsteuer die Schweizer MWST an (sogenannte Einfuhrsteuer)." },
            { question: "Wann muss ich mich für die MWST registrieren?", answer: "Ab einem weltweiten Jahresumsatz von CHF 100'000 mit steuerbaren Leistungen. Freiwillige Registrierung ist ab CHF 0 möglich und lohnt sich, wenn Sie viel Vorsteuer geltend machen können. Die Registrierung erfolgt bei der ESTV." },
            { question: "Welche Abrechnungsmethoden gibt es?", answer: "Effektive Methode: Geschuldete MWST minus Vorsteuer. Saldosteuersatz-Methode: Vereinfachte Berechnung mit einem branchenspezifischen Pauschalsatz (0.1-6.7%). Letztere eignet sich für KMU mit geringer Vorsteuer." },
        ],
        richSections: [
            {
                heading: "MWST-Sätze Schweiz (ab 01.01.2024)",
                table: {
                    headers: ["Satz", "Prozentsatz", "Anwendung"],
                    rows: [
                        ["Normalsatz", "8.1%", "Standardsatz für die meisten Waren und Dienstleistungen"],
                        ["Reduzierter Satz", "2.6%", "Lebensmittel, Medikamente, Bücher, Zeitungen, Wasser"],
                        ["Sondersatz", "3.8%", "Beherbergungsleistungen (Hotels, Ferienwohnungen)"],
                        ["Befreit", "0%", "Exporte, Gesundheit, Bildung, Versicherungen, Bankdienstleistungen"],
                    ],
                },
            },
        ],
        relatedIds: ["steuerrechner", "unternehmenssteuerrechner", "kapitalgewinnsteuerrechner"],
    },
    {
        id: "steuervergleich",
        title: "Steuervergleich Kantone",
        keyword: "Steuervergleich Kantone Schweiz",
        calcType: "tax-compare",
        icon: "📊",
        subtitle: "Vergleichen Sie die Steuerbelastung zwischen verschiedenen Kantonen und Gemeinden. Ermitteln Sie die günstigste Wohnlage für Ihre Steuersituation.",
        explanation: {
            heading: "Steuervergleich zwischen Kantonen",
            paragraphs: [
                "Der Steuerwettbewerb ist ein zentrales Merkmal des Schweizer Föderalismus. Die Steuerbelastung kann je nach Wohnort von unter 10% bis über 35% des Einkommens betragen. Nicht nur der Kanton, sondern die konkrete Gemeinde bestimmt die Steuerbelastung — durch den Steuerfuss.",
                "Für einen sinnvollen Vergleich müssen Sie neben Einkommenssteuern auch Vermögenssteuern, Erbschaftssteuern und Lebenshaltungskosten berücksichtigen. Ein Umzug in einen steuergünstigen Kanton kann sich finanziell lohnen, hat aber auch Konsequenzen für Pendelwege, soziales Umfeld und Dienstleistungsangebot.",
            ],
            highlight: "Verheiratet, 2 Kinder, CHF 200'000 Einkommen: Kanton Zug (Stadt Baar) ca. CHF 15'400 vs. Kanton Basel-Stadt ca. CHF 39'200 — eine Differenz von CHF 23'800 pro Jahr!",
        },
        faq: [
            { question: "Lohnt sich ein Umzug aus Steuergründen?", answer: "Bei hohem Einkommen oder Vermögen kann sich ein Umzug in einen steuergünstigen Kanton finanziell stark lohnen. Beispiel: Bei einer Steuerersparnis von CHF 20'000/Jahr und 20 Jahren Wohndauer sparen Sie CHF 400'000. Aber: Berücksichtigen Sie auch Immobilienpreise, Pendelkosten und Lebensqualität." },
            { question: "Welche Kantone haben die tiefsten Steuern?", answer: "Für natürliche Personen: Zug, Schwyz, Nidwalden, Obwalden, Appenzell Innerrhoden, Uri. Für juristische Personen: Zug, Luzern, Nidwalden. Die konkrete Gemeinde innerhalb des Kantons macht aber einen grossen Unterschied." },
        ],
        relatedIds: ["steuerrechner", "einkommenssteuerrechner", "vermoegenssteuerrechner"],
    },
    {
        id: "kapitalgewinnsteuerrechner",
        title: "Kapitalgewinnsteuer Rechner",
        keyword: "Kapitalgewinnsteuer Rechner Schweiz",
        calcType: "capital-gains",
        icon: "📈",
        subtitle: "Berechnen Sie die Grundstückgewinnsteuer beim Immobilienverkauf. Mit kantonalen Sätzen und Haltedauer-Ermässigungen.",
        explanation: {
            heading: "Kapitalgewinnsteuer in der Schweiz",
            paragraphs: [
                "Privatpersonen zahlen in der Schweiz grundsätzlich keine Kapitalgewinnsteuer auf Wertschriften (Aktien, Fonds etc.) — ein international seltener Vorteil. ABER: Auf Immobiliengewinne wird die Grundstückgewinnsteuer erhoben, die je nach Kanton und Haltedauer erheblich sein kann.",
                "Die Grundstückgewinnsteuer ist progressiv: Kurze Haltedauer führt zu Zuschlägen (bis +50% bei unter 1 Jahr), lange Haltedauer zu Ermässigungen (bis -60% nach 25+ Jahren). Der Gewinn berechnet sich aus Verkaufspreis minus Anlagekosten (Kaufpreis + wertvermehrende Investitionen + Kaufnebenkosten).",
            ],
            highlight: "Kaufpreis CHF 800'000, Verkaufspreis CHF 1'200'000, Haltedauer 10 Jahre, Kanton Zürich → Gewinn CHF 400'000, Steuer ca. CHF 72'000 (18%). Nach 25 Jahren Haltedauer: nur noch ca. CHF 40'000 (10%).",
        },
        faq: [
            { question: "Muss ich auf Aktiengewinne Steuern zahlen?", answer: "Nein! Als Privatperson sind Kapitalgewinne auf beweglichem Vermögen (Aktien, Obligationen, Fonds, Kryptowährungen) in der Schweiz steuerfrei. Achtung: Wer als 'gewerbsmässiger Händler' eingestuft wird, muss Gewinne als Einkommen versteuern." },
            { question: "Kann ich die Grundstückgewinnsteuer aufschieben?", answer: "Ja, bei Ersatzbeschaffung (Verkauf + Kauf einer gleichwertigen selbstbewohnten Liegenschaft innert 2 Jahren) wird die Steuer aufgeschoben. Auch bei Erbgang oder Schenkung an Nachkommen wird aufgeschoben. Die Steuer wird dann beim nächsten Verkauf fällig." },
        ],
        relatedIds: ["steuerrechner", "renditerechner", "steueroptimierungrechner"],
    },
    {
        id: "unternehmenssteuerrechner",
        title: "Unternehmenssteuer Rechner",
        keyword: "Unternehmenssteuer Rechner Schweiz",
        calcType: "corporate-tax",
        icon: "🏢",
        subtitle: "Berechnen Sie die Gewinnsteuer und Kapitalsteuer für Ihre GmbH oder AG nach Kanton. Inkl. direkte Bundessteuer (8.5%) und kantonale Sätze.",
        explanation: {
            heading: "Unternehmensbesteuerung in der Schweiz",
            paragraphs: [
                "Juristische Personen (AG, GmbH) zahlen Gewinn- und Kapitalsteuer auf drei Ebenen: Bund (8.5% Gewinnsteuer, keine Kapitalsteuer), Kanton und Gemeinde. Die effektive Gesamtsteuerbelastung variiert je nach Kanton von ca. 11% (Zug, Luzern) bis ca. 22% (Genf, Basel-Stadt).",
                "Seit der Steuerreform STAF (2020) gelten schweizweit einheitliche Regeln: Patentbox (tiefere Besteuerung von Erträgen aus Patenten), zusätzlicher Abzug für F&E-Aufwand, und Entlastungsbegrenzung von 70%. Die Kapitalsteuer wird vom einbezahlten Eigenkapital berechnet (ca. 0.01-0.4‰ je nach Kanton).",
            ],
            highlight: "AG mit CHF 500'000 Reingewinn: Kanton Zug (Stadt Zug) → Gesamtsteuer ca. CHF 57'500 (11.5%). Kanton Zürich (Stadt Zürich) → ca. CHF 95'000 (19.0%). Differenz: CHF 37'500.",
        },
        faq: [
            { question: "AG oder GmbH — steuerliche Unterschiede?", answer: "Kaum: Beide unterliegen der gleichen Gewinn- und Kapitalsteuer. Der Unterschied liegt im Gesellschaftsrecht (Mindestkapital AG CHF 100'000, GmbH CHF 20'000). Steuerlich relevant: Bei der AG kann die Lohnsumme flexibler gestaltet werden." },
            { question: "Was ist die wirtschaftliche Doppelbelastung?", answer: "Unternehmensgewinne werden einmal als Gewinn beim Unternehmen besteuert, und ein zweites Mal als Dividende beim Aktionär (Einkommenssteuer). Seit der Teilbesteuerung (Bund 70%, Kantone 50-80%) wurde diese Belastung gemildert." },
        ],
        richSections: [
            {
                heading: "Effektive Gewinnsteuersätze nach Kanton (AG/GmbH)",
                table: {
                    headers: ["Kanton", "Hauptort", "Effektiver Gesamtsatz"],
                    rows: [
                        ["Zug", "Zug", "11.9%"],
                        ["Luzern", "Luzern", "12.2%"],
                        ["Nidwalden", "Stans", "12.0%"],
                        ["Schwyz", "Schwyz", "14.1%"],
                        ["Zürich", "Zürich", "19.7%"],
                        ["Bern", "Bern", "21.0%"],
                        ["Basel-Stadt", "Basel", "13.0%"],
                        ["Genf", "Genf", "14.0%"],
                    ],
                },
            },
        ],
        relatedIds: ["steuerrechner", "mehrwertsteuerrechner", "steuervergleich"],
    },
    {
        id: "steuerabzugrechner",
        title: "Steuerabzug Rechner",
        keyword: "Steuerabzug Rechner Schweiz",
        calcType: "tax-deductions",
        icon: "📝",
        subtitle: "Berechnen Sie alle möglichen Steuerabzüge: Berufskosten, Säule 3a, Versicherungen, Hypothekarzinsen, Kinderabzüge und mehr.",
        explanation: {
            heading: "Steuerabzüge optimal nutzen",
            paragraphs: [
                "Steuerabzüge senken Ihr steuerbares Einkommen und damit Ihre Steuerrechnung. In der Schweiz gibt es zahlreiche Abzugsmöglichkeiten, die viele Steuerpflichtige nicht vollständig ausschöpfen. Die wichtigsten: Berufskosten, Säule 3a, Versicherungen, Hypothekarzinsen, und Kinderbetreuung.",
                "Tipp: Es gibt Pauschalabzüge und effektive Abzüge. Oft lohnt es sich, die effektiven Kosten zu berechnen, da sie höher sein können als die Pauschale. Besonders bei Berufskosten (Heimarbeit, Fachliteratur, Weiterbildung) und Liegenschaftsunterhalt (Renovationen) können die effektiven Kosten erheblich sein.",
            ],
            highlight: "Typische Abzüge bei CHF 120'000 Einkommen (ledig): Berufskosten CHF 4'000 + Fahrkosten CHF 3'200 + Säule 3a CHF 7'258 + Versicherungen CHF 2'600 + Verpflegung CHF 3'200 = Total CHF 20'258 Abzüge → Steuerersparnis ca. CHF 5'000.",
        },
        faq: [
            { question: "Wie viel kann ich in die Säule 3a einzahlen?", answer: "Angestellte mit Pensionskasse: max. CHF 7'258 (2026). Selbständige ohne PK: max. 20% des Nettoeinkommens, höchstens CHF 36'288. Der Betrag ist vollständig vom steuerbaren Einkommen abzugsfähig." },
            { question: "Kann ich Homeoffice-Kosten abziehen?", answer: "Ja, wenn Sie regelmässig von zu Hause arbeiten: Anteilige Miete/Hypothekarzins für das Arbeitszimmer, Stromkosten, Internet. Viele Kantone akzeptieren einen Pauschalabzug von CHF 2'000-3'000 für Homeoffice. Alternative: Effektive Kosten nachweisen." },
            { question: "Lohnt sich der effektive oder pauschale Abzug für Berufskosten?", answer: "Vergleichen Sie: Pauschale Berufskosten betragen je nach Kanton ca. CHF 2'000-4'000. Wenn Ihre tatsächlichen Kosten (Weiterbildung, Fachliteratur, Werkzeuge, Arbeitskleider) höher sind, lohnt sich der Nachweis der effektiven Kosten." },
        ],
        relatedIds: ["einkommenssteuerrechner", "steueroptimierungrechner", "steuerrechner"],
    },
    {
        id: "steueroptimierungrechner",
        title: "Steueroptimierung Rechner",
        keyword: "Steueroptimierung Rechner Schweiz",
        calcType: "tax-optimization",
        icon: "🎯",
        subtitle: "Berechnen Sie Ihr Steueroptimierungspotenzial: Säule 3a, Einkauf in Pensionskasse, Liegenschaftsunterhalt, Hypothekarstrategie und optimaler Wohnort.",
        explanation: {
            heading: "Legale Steueroptimierung in der Schweiz",
            paragraphs: [
                "Die Schweiz bietet zahlreiche legale Möglichkeiten zur Steueroptimierung. Die wichtigsten Hebel sind: Maximale Einzahlung in Säule 3a (sofortige Steuerersparnis), Einkauf in die Pensionskasse (grosse Beträge abzugsfähig), strategische Hypothekenverwaltung (Zinsen abziehen, indirekte Amortisation), und zeitliche Verteilung von Renovationskosten.",
                "Fortgeschrittene Strategien: Gestaffelte PK-Einkäufe über mehrere Jahre (Progression brechen), Renovationen in Steuer-Hochjahren durchführen, Schenkungen an gemeinnützige Organisationen, und Prüfung des optimalen Wohnorts. Ein Treuhandexperte kann Ihnen helfen, Ihre individuelle Strategie zu optimieren.",
            ],
            highlight: "Optimierungspotenzial pro Jahr (Einkommen CHF 150'000): Säule 3a: CHF 1'800 Ersparnis + PK-Einkauf CHF 10'000 (bei CHF 30'000 Einkauf): CHF 9'000 Ersparnis + Hypothekarstrategie: CHF 1'200 = Total bis CHF 12'000/Jahr Steuerersparnis!",
        },
        faq: [
            { question: "Was ist die gestaffelte PK-Einkaufsstrategie?", answer: "Statt einen grossen PK-Einkauf auf einmal zu machen, verteilen Sie ihn auf mehrere Jahre (z.B. 3 × CHF 30'000 statt 1 × CHF 90'000). Durch die Progression sparen Sie insgesamt mehr Steuern, da jeder Einkauf in einem Jahr den Grenzsteuersatz senkt." },
            { question: "Wie optimiere ich meine Hypothek steuerlich?", answer: "Indirekte Amortisation über Säule 3a: Hypothek bleibt konstant (maximaler Zinsabzug), 3a-Beiträge sind abzugsfähig. Doppelter Steuervorteil! Am Ende lösen Sie die Hypothek mit dem 3a-Guthaben ab. Tipp: Hypothekarzinsen mit Liegenschaftsunterhalt kombinieren." },
            { question: "Lohnt sich der PK-Einkauf?", answer: "Meist ja: Der Einkaufsbetrag ist vollständig vom steuerbaren Einkommen abziehbar. Bei einem Grenzsteuersatz von 30% spart ein Einkauf von CHF 50'000 sofort CHF 15'000 Steuern. Bedingung: Kein Kapitalbezug innerhalb von 3 Jahren nach dem Einkauf." },
        ],
        relatedIds: ["steuerabzugrechner", "einkommenssteuerrechner", "steuervergleich"],
    },
];

export function getChCalculatorBySlug(slug: string): ChCalculator | undefined {
    return CH_CALCULATORS.find(c => c.id === slug);
}

