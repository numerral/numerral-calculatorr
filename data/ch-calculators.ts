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
    // ═══════════════════════════════════════════════════
    // SWISS SALARY & PAYROLL CALCULATORS
    // ═══════════════════════════════════════════════════
    {
        id: "brutto-netto-rechner",
        title: "Brutto Netto Rechner Schweiz",
        keyword: "Brutto Netto Rechner Schweiz",
        calcType: "gross-net",
        icon: "💵",
        subtitle: "Berechnen Sie Ihren Nettolohn aus dem Bruttolohn. Mit allen Schweizer Sozialversicherungsabzügen: AHV, IV, EO, ALV, BVG und NBU.",
        explanation: {
            heading: "Vom Bruttolohn zum Nettolohn in der Schweiz",
            paragraphs: [
                "In der Schweiz werden vom Bruttolohn obligatorische Sozialversicherungsbeiträge abgezogen: AHV (Alters- und Hinterlassenenversicherung) 4.35%, IV (Invalidenversicherung) 0.7%, EO (Erwerbsersatzordnung) 0.25%, und ALV (Arbeitslosenversicherung) 1.1%. Zusammen ergibt das den Arbeitnehmerbeitrag von 6.4%.",
                "Zusätzlich werden abgezogen: BVG-Beiträge (Pensionskasse, ca. 5-8% je nach Alter und Plan), NBU-Prämie (Nichtbetriebsunfallversicherung, ca. 1-2%), und allenfalls Quellensteuer bei ausländischen Arbeitnehmern. Der Arbeitgeber zahlt mindestens denselben Betrag nochmals (paritätische Beiträge).",
            ],
            highlight: "Bruttolohn CHF 8'000/Monat: AHV/IV/EO/ALV –CHF 512, BVG ca. –CHF 400, NBU ca. –CHF 100 = Nettolohn ca. CHF 6'988 (87.4%). Ohne Quellensteuer und Steuern.",
        },
        faq: [
            { question: "Was ist der Unterschied zwischen Brutto und Netto?", answer: "Brutto = Gesamtlohn vor Abzügen (inkl. 13. Monatslohn). Netto = Auszahlungsbetrag nach Abzug von AHV/IV/EO/ALV, BVG, NBU und evtl. Quellensteuer. Steuern (Einkommens- und Vermögenssteuer) werden nicht vom Lohn abgezogen, sondern separat in Rechnung gestellt." },
            { question: "Muss ich den 13. Monatslohn berücksichtigen?", answer: "Ja, der 13. Monatslohn ist in vielen Branchen üblich (aber nicht gesetzlich vorgeschrieben). Er wird pro rata im Dezember ausbezahlt. Bei der Berechnung des Jahreslohns: Monatslohn × 13 (wenn 13. ML vereinbart)." },
            { question: "Warum ist der Nettolohn in der Schweiz so hoch im Vergleich?", answer: "Die Schweizer Sozialabgaben (ca. 12-15% Arbeitnehmeranteil) sind deutlich tiefer als in Deutschland (~20%) oder Frankreich (~22%). Zudem wird die Einkommenssteuer separat bezahlt, nicht vom Lohn abgezogen (ausser Quellensteuer)." },
        ],
        richSections: [
            {
                heading: "Obligatorische Lohnabzüge 2026 (Arbeitnehmeranteil)",
                table: {
                    headers: ["Abzug", "Satz", "Auf Lohn bis", "Monatlich (bei CHF 8'000)"],
                    rows: [
                        ["AHV (Altersvorsorge)", "4.35%", "Unbegrenzt", "CHF 348"],
                        ["IV (Invalidenversicherung)", "0.70%", "Unbegrenzt", "CHF 56"],
                        ["EO (Erwerbsersatz)", "0.25%", "Unbegrenzt", "CHF 20"],
                        ["ALV (Arbeitslosenversicherung)", "1.10%", "CHF 148'200/Jahr", "CHF 88"],
                        ["BVG (Pensionskasse)", "~5-8%", "Koordinierter Lohn", "CHF ~400"],
                        ["NBU (Unfallversicherung)", "~1-2%", "CHF 148'200/Jahr", "CHF ~100"],
                    ],
                },
            },
        ],
        relatedIds: ["nettolohnrechner", "stundenlohnrechner", "lohn-nach-steuern"],
    },
    {
        id: "nettolohnrechner",
        title: "Nettolohn Rechner",
        keyword: "Nettolohn Rechner Schweiz",
        calcType: "net-salary",
        icon: "💰",
        subtitle: "Berechnen Sie Ihren Nettolohn nach allen Abzügen. Geben Sie Ihren gewünschten Nettolohn ein und erfahren Sie, welcher Bruttolohn nötig ist.",
        explanation: {
            heading: "Nettolohn in der Schweiz berechnen",
            paragraphs: [
                "Der Nettolohn ist der Betrag, den Sie tatsächlich auf Ihr Konto überwiesen bekommen. Er berechnet sich aus dem Bruttolohn minus aller obligatorischen Abzüge. In der Schweiz liegt das Netto-zu-Brutto-Verhältnis typischerweise bei 85-90%.",
                "Dieser Rechner funktioniert auch umgekehrt: Geben Sie Ihren gewünschten Nettolohn ein und berechnen Sie, welchen Bruttolohn Sie dafür verhandeln müssen. Besonders nützlich bei Gehaltsverhandlungen und Jobwechsel.",
            ],
            highlight: "Gewünschter Nettolohn CHF 6'000/Monat → Benötigter Bruttolohn ca. CHF 6'900-7'200 (je nach BVG-Plan und Alter).",
        },
        faq: [
            { question: "Wie verhandle ich mein Gehalt richtig?", answer: "Verhandeln Sie immer den Bruttolohn. Fragen Sie nach dem 13. Monatslohn, Bonusregelungen und dem BVG-Plan (überobligatorische Leistungen können den Nettolohn stark beeinflussen). Tipp: Ein besserer BVG-Plan bedeutet zwar mehr Abzüge, aber auch mehr Altersvorsorge." },
            { question: "Was beeinflusst die Höhe meiner Abzüge?", answer: "Das Alter (BVG-Beiträge steigen mit dem Alter: 25-34 Jahre: 7%, 35-44: 10%, 45-54: 15%, 55-64: 18%), der PK-Plan (obligatorisch vs. überobligatorisch), und ob Sie quellensteuerpflichtig sind." },
        ],
        relatedIds: ["brutto-netto-rechner", "jahreslohnrechner", "monatslohnrechner"],
    },
    {
        id: "stundenlohnrechner",
        title: "Stundenlohn Rechner",
        keyword: "Stundenlohn Rechner Schweiz",
        calcType: "hourly-rate",
        icon: "⏱️",
        subtitle: "Berechnen Sie Ihren Stundenlohn aus dem Monats- oder Jahreslohn. Oder ermitteln Sie den Monatslohn aus einem Stundensatz. Mit Ferienanspruch und Feiertagen.",
        explanation: {
            heading: "Stundenlohn in der Schweiz berechnen",
            paragraphs: [
                "Die Umrechnung von Monatslohn in Stundenlohn berücksichtigt die durchschnittliche Arbeitsstunden pro Monat. In der Schweiz beträgt die Normalarbeitszeit je nach Branche 40-42 Stunden/Woche (in Büroberufen 42h, in der Industrie 41h).",
                "Bei der Berechnung des Stundenlohns müssen Ferien (4-5 Wochen) und Feiertage (8-9 Tage je nach Kanton) berücksichtigt werden. Der effektive Stundenlohn inkl. Ferienentschädigung ist ca. 8-10% höher als der reine Stundenlohn. Bei Teilzeit wird der Ferienzuschlag oft direkt auf den Stundenlohn aufgerechnet.",
            ],
            highlight: "Monatslohn CHF 7'000 bei 42h/Woche → Stundenlohn CHF 38.46. Inkl. 8.33% Ferienentschädigung (4 Wochen): CHF 41.67. Bei 5 Wochen Ferien (10.64%): CHF 42.55.",
        },
        faq: [
            { question: "Wie berechne ich den Ferienanteil im Stundenlohn?", answer: "4 Wochen Ferien = 8.33% Zuschlag (4/48). 5 Wochen Ferien = 10.64% Zuschlag (5/47). 6 Wochen Ferien = 13.04% Zuschlag. Bei Stundenlöhnen muss der Ferienzuschlag separat ausgewiesen werden." },
            { question: "Was ist die durchschnittliche Arbeitszeit pro Monat?", answer: "Bei 42h/Woche: 42 × 52 / 12 = 182 Stunden/Monat. Bei 40h/Woche: 40 × 52 / 12 = 173.3 Stunden/Monat. Diese Zahl wird für die Umrechnung Monats- ↔ Stundenlohn verwendet." },
        ],
        relatedIds: ["brutto-netto-rechner", "monatslohnrechner", "ueberstundenrechner"],
    },
    {
        id: "monatslohnrechner",
        title: "Monatslohn Rechner",
        keyword: "Monatslohn Rechner Schweiz",
        calcType: "monthly-salary",
        icon: "📅",
        subtitle: "Berechnen Sie Ihren Monatslohn aus dem Jahreslohn (inkl./exkl. 13. Monatslohn) oder aus dem Stundenlohn. Mit Teilzeitfaktor.",
        explanation: {
            heading: "Monatslohn berechnen — mit oder ohne 13. Monatslohn",
            paragraphs: [
                "In der Schweiz wird der Monatslohn oft als 1/12 oder 1/13 des Jahreslohns berechnet — je nachdem, ob ein 13. Monatslohn vereinbart ist. Der 13. Monatslohn ist kein gesetzlicher Anspruch, aber in vielen Branchen und GAV (Gesamtarbeitsverträge) üblich.",
                "Bei Teilzeitarbeit wird der Monatslohn proportional berechnet: Ein 80%-Pensum bedeutet 80% des Vollzeit-Monatslohns. Beachten Sie: Sozialversicherungsbeiträge werden auf den reduzierten Lohn berechnet, was den BVG-Koordinationsabzug besonders relevant macht.",
            ],
            highlight: "Jahreslohn CHF 100'000 mit 13. ML: Monatslohn CHF 7'692 (× 13). Ohne 13. ML: CHF 8'333 (× 12). Bei 80% Pensum mit 13. ML: CHF 6'154.",
        },
        faq: [
            { question: "Ist der 13. Monatslohn obligatorisch?", answer: "Nein, er ist nicht gesetzlich vorgeschrieben. Er muss im Arbeitsvertrag oder GAV vereinbart sein. Einige Branchen (z.B. Gastgewerbe, Detailhandel) sehen ihn im GAV vor. Manche Arbeitgeber zahlen stattdessen einen Bonus oder eine Gratifikation." },
            { question: "Wie wird Teilzeit in der Schweiz abgerechnet?", answer: "Der Lohn wird proportional zum Pensum berechnet. Ein 60%-Pensum erhält 60% des Vollzeitlohns. Achtung beim BVG: Der Koordinationsabzug (CHF 25'725) wird bei Teilzeit nicht immer angepasst, was den versicherten Lohn überproportional reduziert." },
        ],
        relatedIds: ["jahreslohnrechner", "stundenlohnrechner", "brutto-netto-rechner"],
    },
    {
        id: "jahreslohnrechner",
        title: "Jahreslohn Rechner",
        keyword: "Jahreslohn Rechner Schweiz",
        calcType: "annual-salary",
        icon: "📊",
        subtitle: "Berechnen Sie Ihren Jahreslohn aus dem Monatslohn. Inkl. 13. Monatslohn, Bonus, Spesen und Sozialversicherungsbeiträge (Arbeitgeberkosten).",
        explanation: {
            heading: "Jahreslohn und Gesamtkosten für den Arbeitgeber",
            paragraphs: [
                "Der Jahreslohn umfasst mehr als 12 × Monatslohn: 13. Monatslohn, variable Vergütung (Bonus), und regelmässige Zulagen. Für den Arbeitgeber kommen die paritätischen Sozialversicherungsbeiträge hinzu (ca. 12-15%), was die Gesamtkosten pro Mitarbeiter deutlich erhöht.",
                "Die Arbeitgeberkosten setzen sich zusammen aus: Bruttolohn + AHV/IV/EO/ALV (6.4%) + BVG-Arbeitgeberanteil (mindestens 50%) + BU/NBU + FAK (Familienausgleichskasse, ca. 1-3%) + evt. Krankentaggeld. Als Faustregel: Arbeitgeberkosten ≈ Bruttolohn × 1.15-1.20.",
            ],
            highlight: "Monatslohn CHF 8'000 × 13 = CHF 104'000 Jahreslohn. + Arbeitgeberbeiträge (~15%): CHF 15'600. = Gesamtkosten Arbeitgeber: CHF 119'600.",
        },
        faq: [
            { question: "Was sind die Gesamtkosten für den Arbeitgeber?", answer: "Faustregel: Bruttolohn × 1.15-1.20. Zusatzkosten: AHV/IV/EO/ALV (6.4%), BVG-Arbeitgeberanteil (50-60% der PK-Beiträge), BU-Prämie (100% Arbeitgeber), FAK (1-3%), evt. Krankentaggeld und Weiterbildungskosten." },
            { question: "Wie berechne ich meinen Gesamtjahreslohn?", answer: "Grundlohn × 12 (oder × 13 bei 13. ML) + Bonus/Variable + regelmässige Zulagen (Schichtzulage, Pikettentschädigung etc.). Nicht dazu gehören: Spesen (sind Auslagenersatz, kein Lohn) und einmalige Prämien." },
        ],
        relatedIds: ["monatslohnrechner", "brutto-netto-rechner", "bonusrechner"],
    },
    {
        id: "freelancer-rechner",
        title: "Freelancer Einkommen Rechner",
        keyword: "Freelancer Einkommen Rechner Schweiz",
        calcType: "freelancer",
        icon: "💻",
        subtitle: "Berechnen Sie Ihr Nettoeinkommen als Selbständiger in der Schweiz. Inkl. AHV/IV/EO, BVG-Optionen, MWST-Pflicht und Steuerbelastung.",
        explanation: {
            heading: "Einkommen als Freelancer in der Schweiz",
            paragraphs: [
                "Als Selbständiger in der Schweiz zahlen Sie AHV/IV/EO-Beiträge auf das Nettoeinkommen (ca. 10% bis CHF 57'400, darüber 5.371%). Es gibt keine ALV-Pflicht, aber auch keinen Anspruch auf Arbeitslosenentschädigung. BVG ist freiwillig, wird aber empfohlen (steuerlich absetzbar).",
                "Wichtig: Ab CHF 100'000 Jahresumsatz müssen Sie sich für die MWST registrieren. Berufsauslagen (Büro, Equipment, Reisen, Weiterbildung) sind vom steuerbaren Einkommen abziehbar. Säule 3a: Ohne PK können Sie bis zu 20% des Nettoeinkommens einzahlen (max. CHF 36'288).",
            ],
            highlight: "Freelancer-Umsatz CHF 150'000, Berufsauslagen CHF 20'000 → Nettoeinkommen CHF 130'000. AHV/IV/EO ca. –CHF 7'000. Steuern (Zürich) ca. –CHF 18'000. Netto: ca. CHF 105'000.",
        },
        faq: [
            { question: "Selbständig oder Angestellt — was lohnt sich mehr?", answer: "Finanziell: Als Angestellter zahlt der AG die Hälfte der Sozialversicherungen (~6.4% + BVG). Als Selbständiger tragen Sie alles selbst. Dafür können Sie Berufsauslagen abziehen und haben mehr Flexibilität. Faustregel: Ihr Stundensatz als Freelancer sollte 30-50% höher sein als ein vergleichbares Angestelltengehalt." },
            { question: "Muss ich als Freelancer BVG haben?", answer: "Nein, BVG ist für Selbständige freiwillig. Sie können sich aber freiwillig bei einer Stiftung oder der Auffangeinrichtung BVG versichern. Der Vorteil: BVG-Beiträge sind steuerlich abzugsfähig. Alternative: Höhere Einzahlungen in die Säule 3a." },
            { question: "Wie berechne ich meinen Stundensatz als Freelancer?", answer: "Ziel-Nettoeinkommen + Sozialversicherungen + Steuern + Berufsauslagen + Ferien/Krankheit (20% Zuschlag) = benötigter Bruttoumsatz. Geteilt durch fakturierbare Stunden (ca. 1'600-1'800/Jahr). Beispiel: CHF 120'000 Ziel → ca. CHF 170'000 Umsatz → CHF 95-106/Stunde." },
        ],
        relatedIds: ["brutto-netto-rechner", "stundenlohnrechner", "lohn-nach-steuern"],
    },
    {
        id: "quellensteuer-lohn",
        title: "Quellensteuer Lohn Rechner",
        keyword: "Quellensteuer Lohn Rechner Schweiz",
        calcType: "payroll-withholding",
        icon: "✂️",
        subtitle: "Berechnen Sie den Nettolohn nach Quellensteuerabzug. Für ausländische Arbeitnehmer (B- und L-Bewilligung) mit kantonalen Tarifen.",
        explanation: {
            heading: "Lohn nach Quellensteuer berechnen",
            paragraphs: [
                "Die Quellensteuer wird direkt vom Lohn abgezogen — anders als bei der ordentlichen Veranlagung, wo Sie die Steuer separat bezahlen. Der Quellensteuertarif berücksichtigt bereits Standardabzüge (Berufskosten, Versicherungen). Zusätzlich werden die normalen Sozialversicherungsbeiträge abgezogen.",
                "Die Quellensteuer-Tarife: A = ledig/geschieden ohne Kinder, B = verheiratet, Alleinverdiener, C = verheiratet, Doppelverdiener. Nachgestellte Ziffer = Anzahl Kinder (z.B. B2 = verheiratet mit 2 Kindern). Ab CHF 120'000 Jahreseinkommen erfolgt eine nachträgliche ordentliche Veranlagung.",
            ],
            highlight: "Bruttolohn CHF 7'500/Mt., Tarif B2 (verheiratet, 2 Kinder), Kanton Zürich → Sozialabzüge ca. CHF 975 + Quellensteuer ca. CHF 525 = Nettolohn ca. CHF 6'000.",
        },
        faq: [
            { question: "Welchen Tarif habe ich?", answer: "A0 = ledig, keine Kinder. A1 = ledig, 1 Kind. B0 = verheiratet, Alleinverdiener, keine Kinder. B2 = verheiratet, 2 Kinder. C0 = verheiratet, Doppelverdiener. Der Arbeitgeber bestimmt den Tarif anhand Ihrer Angaben." },
            { question: "Kann ich als Quellensteuerpflichtiger eine 3a-Einzahlung abziehen?", answer: "Ja! Sie müssen aber eine Nachkorrektur (Tarifkorrektur) beantragen. Häufige zusätzliche Abzüge: Säule 3a, Kinderbetreuungskosten, höhere Berufskosten. Frist: 31. März des Folgejahres." },
        ],
        relatedIds: ["quellensteuerrechner", "brutto-netto-rechner", "nettolohnrechner"],
    },
    {
        id: "bonusrechner",
        title: "Bonus Rechner",
        keyword: "Bonus Rechner Schweiz",
        calcType: "bonus",
        icon: "🎁",
        subtitle: "Berechnen Sie den Nettobetrag Ihres Bonus nach Abzug von Sozialversicherungen. Inkl. AHV/IV/EO/ALV und BVG-Relevanz.",
        explanation: {
            heading: "Bonus und 13. Monatslohn in der Schweiz",
            paragraphs: [
                "Ein Bonus wird in der Schweiz wie normaler Lohn behandelt: Es fallen die gleichen Sozialversicherungsbeiträge an (AHV/IV/EO/ALV: 6.4%). BVG-Beiträge fallen auf den Bonus nur an, wenn er im versicherten Lohn berücksichtigt ist (bei vielen PK-Plänen nicht der Fall).",
                "Steuerlich wird der Bonus zum Jahreseinkommen addiert. Da die Einkommenssteuer progressiv ist, kann ein hoher Bonus zu einer überproportionalen Steuerbelastung führen. Tipp: Prüfen Sie, ob eine Aufteilung auf zwei Steuerjahre möglich ist, oder investieren Sie den Bonus in die Säule 3a oder einen PK-Einkauf.",
            ],
            highlight: "Bonus CHF 20'000 brutto → AHV/IV/EO/ALV –CHF 1'280 = Netto vor Steuern CHF 18'720. Steuern auf den Bonus (Grenzsteuersatz 30%): ca. –CHF 6'000. Effektiver Netto-Bonus: ca. CHF 12'720.",
        },
        faq: [
            { question: "Muss der Arbeitgeber einen Bonus zahlen?", answer: "Nur wenn vertraglich vereinbart. Es gibt drei Arten: (1) Gratifikation (freiwillig, kann aber durch langjährige Praxis zum Anspruch werden), (2) Variabler Lohnbestandteil (vertraglich, z.B. '0-20% des Grundlohns'), (3) Erfolgsbeteiligung (oft an Unternehmensergebnis gekoppelt)." },
            { question: "Wird der Bonus für die Pensionskasse berücksichtigt?", answer: "Das hängt vom PK-Reglement ab. Viele Pläne versichern nur den Grundlohn. Einige überobligatorische Pläne berücksichtigen Bonuszahlungen bis zu einer Obergrenze. Prüfen Sie Ihren PK-Ausweis." },
        ],
        relatedIds: ["brutto-netto-rechner", "jahreslohnrechner", "lohn-nach-steuern"],
    },
    {
        id: "ueberstundenrechner",
        title: "Überstunden Rechner",
        keyword: "Überstunden Rechner Schweiz",
        calcType: "overtime",
        icon: "⏰",
        subtitle: "Berechnen Sie die Vergütung für Überstunden und Überzeit in der Schweiz. Inkl. gesetzlicher Zuschlag (25%) und maximale Arbeitszeiten.",
        explanation: {
            heading: "Überstunden und Überzeit in der Schweiz",
            paragraphs: [
                "Das Schweizer Arbeitsgesetz unterscheidet zwischen Überstunden und Überzeit: Überstunden = Arbeit über die vertraglich vereinbarte Arbeitszeit hinaus (z.B. über 42h/Woche). Überzeit = Arbeit über die gesetzliche Höchstarbeitszeit hinaus (45h für Büro/Industrie, 50h für andere).",
                "Überzeit muss mit einem Zuschlag von 25% entschädigt werden (oder durch Freizeit gleicher Dauer kompensiert, wenn der Arbeitnehmer zustimmt). Überstunden werden gemäss Arbeitsvertrag/GAV geregelt — oft ohne Zuschlag kompensierbar. Maximale Überzeit pro Jahr: 170h (bei 45h-Grenze) bzw. 140h (bei 50h-Grenze).",
            ],
            highlight: "Monatslohn CHF 7'000, 42h/Woche → Stundenlohn CHF 38.46. 10h Überzeit × CHF 38.46 × 1.25 = CHF 480.77 Zuschlag. 10h Überstunden × CHF 38.46 × 1.0 = CHF 384.62 (ohne Zuschlag).",
        },
        faq: [
            { question: "Wann muss ich einen Zuschlag zahlen/erhalten?", answer: "Überzeit (über gesetzliche Höchstarbeitszeit): 25% Zuschlag ist gesetzlich vorgeschrieben. Nacht- und Sonntagsarbeit: Lohnzuschlag je nach GAV/Vertrag (üblich: 25-100%). Überstunden: Zuschlag nur, wenn vertraglich vereinbart." },
            { question: "Kann mein Arbeitgeber Überstunden anordnen?", answer: "Ja, sofern betrieblich notwendig, dem Arbeitnehmer zumutbar, und die gesetzliche Höchstarbeitszeit nicht überschritten wird. Regelmässige Überzeit muss der Behörde gemeldet werden. Schwangere und Jugendliche haben besondere Schutzbestimmungen." },
        ],
        relatedIds: ["stundenlohnrechner", "brutto-netto-rechner", "monatslohnrechner"],
    },
    {
        id: "lohn-nach-steuern",
        title: "Lohn nach Steuern Rechner",
        keyword: "Lohn nach Steuern Rechner Schweiz",
        calcType: "after-tax-salary",
        icon: "🏦",
        subtitle: "Berechnen Sie Ihren tatsächlichen Lohn nach allen Abzügen UND Steuern. Der vollständige Blick auf Ihr verfügbares Einkommen.",
        explanation: {
            heading: "Was bleibt wirklich vom Lohn?",
            paragraphs: [
                "In der Schweiz werden Einkommens- und Vermögenssteuern nicht direkt vom Lohn abgezogen (ausser Quellensteuer). Viele Arbeitnehmer sind überrascht, wenn die Steuerrechnung kommt. Dieser Rechner zeigt den tatsächlichen Nettobetrag nach ALLEN Abzügen: Sozialversicherungen + Steuern.",
                "Für eine realistische Budgetplanung sollten Sie monatlich 10-15% des Bruttolohns für Steuern zurücklegen. Das tatsächlich verfügbare Einkommen nach Sozialabgaben und Steuern liegt in der Schweiz typischerweise bei 70-80% des Bruttolohns — je nach Kanton, Zivilstand und Kinderzahl.",
            ],
            highlight: "Bruttolohn CHF 8'000/Mt.: Sozialabzüge ca. –CHF 1'000 = Nettolohn CHF 7'000. Monatliche Steuerbelastung (Zürich, ledig): ca. –CHF 1'100. Verfügbares Einkommen: ca. CHF 5'900 (73.8% des Brutto).",
        },
        faq: [
            { question: "Wie viel sollte ich für Steuern zurücklegen?", answer: "Faustregel: 10-15% des Bruttolohns. Als ledig in Zürich bei CHF 100'000: ca. 14%. Als verheiratet mit Kindern in Zug: nur ca. 6%. Tipp: Richten Sie einen Dauerauftrag auf ein separates Steuerkonto ein." },
            { question: "Was sind die grössten Abzugsposten?", answer: "1. Einkommenssteuer (10-25% je nach Kanton/Einkommen), 2. AHV/IV/EO/ALV (6.4%), 3. BVG/Pensionskasse (5-18% je nach Alter), 4. Krankenversicherung (nicht vom Lohn, aber CHF 300-600/Mt.). Total: 25-40% des Bruttolohns." },
        ],
        richSections: [
            {
                heading: "Typische Lohnabrechnung Schweiz (Vollzeit, Zürich, ledig)",
                table: {
                    headers: ["Position", "Monatlich", "Anteil"],
                    rows: [
                        ["Bruttolohn", "CHF 8'000", "100%"],
                        ["– AHV/IV/EO/ALV", "–CHF 512", "6.4%"],
                        ["– BVG (Pensionskasse)", "–CHF 400", "~5%"],
                        ["– NBU", "–CHF 100", "~1.3%"],
                        ["= Nettolohn (Auszahlung)", "CHF 6'988", "87.4%"],
                        ["– Einkommenssteuer (geschätzt)", "–CHF 1'100", "~13.8%"],
                        ["= Verfügbares Einkommen", "CHF 5'888", "73.6%"],
                    ],
                },
            },
        ],
        relatedIds: ["brutto-netto-rechner", "steuerrechner", "nettolohnrechner"],
    },
    // ═══════════════════════════════════════════════════
    // SWISS PENSION SYSTEM CALCULATORS
    // ═══════════════════════════════════════════════════
    {
        id: "ahv-rentenrechner",
        title: "AHV Rentenrechner",
        keyword: "AHV Rentenrechner Schweiz",
        calcType: "ahv-pension",
        icon: "👴",
        subtitle: "Berechnen Sie Ihre AHV-Rente (1. Säule). Mit Beitragsjahren, massgebendem durchschnittlichem Jahreseinkommen und Ehepaarplafonierung.",
        explanation: {
            heading: "AHV-Rente in der Schweiz — die 1. Säule",
            paragraphs: [
                "Die AHV (Alters- und Hinterlassenenversicherung) ist die 1. Säule der Schweizer Altersvorsorge. Die volle AHV-Rente erhalten Sie bei 44 Beitragsjahren (Männer) bzw. 43 Jahren (Frauen). Fehlende Beitragsjahre führen zu einer prozentualen Kürzung — jedes fehlende Jahr reduziert die Rente um ca. 1/44.",
                "Die Rente wird anhand des massgebenden durchschnittlichen Jahreseinkommens (MDJE) berechnet. Die Minimalrente beträgt CHF 1'225/Monat, die Maximalrente CHF 2'450/Monat (2026). Bei Ehepaaren gilt eine Plafonierung: Die Summe beider Renten darf 150% der Maximalrente nicht übersteigen (CHF 3'675).",
            ],
            highlight: "MDJE CHF 88'200 (Maximum), 44 Beitragsjahre → Maximale AHV-Rente: CHF 2'450/Monat (CHF 29'400/Jahr). Ehepaar mit beiden Maximalrenten: 150% × CHF 2'450 = CHF 3'675/Monat.",
        },
        faq: [
            { question: "Wie viele Beitragsjahre brauche ich für die volle Rente?", answer: "Männer: 44 Jahre, Frauen: 43 Jahre (ab AHV-Reform 21). Beitragsjahre beginnen ab dem 1. Januar nach dem 20. Geburtstag. Fehlende Jahre können unter Umständen durch Nachzahlungen (max. 5 Jahre rückwirkend) ausgeglichen werden." },
            { question: "Was ist das massgebende durchschnittliche Jahreseinkommen?", answer: "Das MDJE ist der Durchschnitt aller aufgewerteten Einkommen über die Beitragsjahre. Einkommen werden mit Aufwertungsfaktoren an die Lohnentwicklung angepasst. Erziehungs- und Betreuungsgutschriften werden hinzugerechnet. Maximum 2026: CHF 88'200." },
            { question: "Kann ich die AHV-Rente vorbeziehen?", answer: "Ja, ab 63 Jahren (Männer) bzw. 62 Jahren (Frauen). Pro Vorbezugsjahr wird die Rente um 6.8% gekürzt — lebenslang. 2 Jahre Vorbezug = 13.6% Kürzung. Seit der AHV-Reform können Sie auch einzelne Monate vorbeziehen." },
            { question: "Was ist die Ehepaarplafonierung?", answer: "Wenn beide Ehepartner AHV-Rente beziehen, darf die Summe 150% der Maximaleinzelrente nicht übersteigen. Bei CHF 2'450 Maximum: CHF 3'675/Monat für das Ehepaar. Die einzelnen Renten werden proportional gekürzt." },
        ],
        richSections: [
            {
                heading: "AHV-Renten 2026 (Vollrente, 44/43 Beitragsjahre)",
                table: {
                    headers: ["MDJE", "Monatsrente", "Jahresrente"],
                    rows: [
                        ["Minimum (CHF 14'700)", "CHF 1'225", "CHF 14'700"],
                        ["CHF 30'000", "CHF 1'488", "CHF 17'856"],
                        ["CHF 50'000", "CHF 1'791", "CHF 21'492"],
                        ["CHF 70'000", "CHF 2'094", "CHF 25'128"],
                        ["Maximum (CHF 88'200)", "CHF 2'450", "CHF 29'400"],
                    ],
                },
            },
        ],
        relatedIds: ["bvg-rechner", "altersvorsorgerechner", "rentenluckerechner"],
    },
    {
        id: "bvg-rechner",
        title: "BVG Rechner",
        keyword: "BVG Rechner Schweiz",
        calcType: "bvg",
        icon: "🏛️",
        subtitle: "Berechnen Sie Ihre BVG-Rente (2. Säule). Mit Koordinationsabzug, Altersgutschriften, Umwandlungssatz und Kapitaloption.",
        explanation: {
            heading: "Berufliche Vorsorge (BVG) — die 2. Säule",
            paragraphs: [
                "Das BVG (Bundesgesetz über die berufliche Vorsorge) ist die 2. Säule und ergänzt die AHV. Der versicherte Lohn berechnet sich: Bruttolohn minus Koordinationsabzug (CHF 25'725 in 2026). Der maximal versicherte Lohn beträgt CHF 62'475. Die Beiträge (Altersgutschriften) steigen mit dem Alter.",
                "Das angesparte Kapital wird bei Pensionierung mit dem Umwandlungssatz in eine lebenslange Rente umgewandelt. Der gesetzliche Mindestsatz beträgt 6.8% für das obligatorische BVG-Guthaben. Viele Pensionskassen wenden tiefere Sätze für den überobligatorischen Teil an. Alternative: Kapitalbezug (ganz oder teilweise).",
            ],
            highlight: "Eintritt mit 25, Lohn CHF 85'000, volle Beitragsjahre → BVG-Kapital bei 65 ca. CHF 450'000. Rente (6.8%): CHF 2'550/Monat. Oder Kapital: CHF 450'000 auf einmal.",
        },
        faq: [
            { question: "Was ist der Koordinationsabzug?", answer: "Der Koordinationsabzug (CHF 25'725) ist der Teil des Lohns, der bereits durch die AHV gedeckt ist. Nur der darüber liegende Lohn wird in der Pensionskasse versichert. Bei Teilzeit: Achtung, der Koordinationsabzug wird oft nicht angepasst, was den versicherten Lohn überproportional reduziert." },
            { question: "Wie hoch sind die Altersgutschriften?", answer: "25-34 Jahre: 7% des koordinierten Lohns. 35-44 Jahre: 10%. 45-54 Jahre: 15%. 55-64/65 Jahre: 18%. Der Arbeitgeber zahlt mindestens die Hälfte. Viele Arbeitgeber zahlen mehr (z.B. 60/40 oder sogar 70/30)." },
            { question: "Soll ich Kapital oder Rente wählen?", answer: "Rente: Lebenslang garantiert, inkl. Partnerrente (60%). Kapital: Flexibel, vererbbar, aber Anlagerisiko. Faustregel: Wenn Sie lange leben und wenig Vermögen haben → Rente. Wenn Sie vermögend sind und flexibel bleiben wollen → Kapital. Kombination ist oft optimal." },
        ],
        relatedIds: ["ahv-rentenrechner", "pensionskasserechner", "pension-kapital"],
    },
    {
        id: "saeule-3a-rechner",
        title: "Säule 3a Rechner",
        keyword: "Säule 3a Rechner Schweiz",
        calcType: "pillar-3a",
        icon: "🏦",
        subtitle: "Berechnen Sie Ihr Säule-3a-Vermögen bei Pensionierung. Mit jährlichen Einzahlungen, Rendite und steuerfreiem Kapitalwachstum.",
        explanation: {
            heading: "Säule 3a — die gebundene Altersvorsorge",
            paragraphs: [
                "Die Säule 3a ist die freiwillige, steuerlich begünstigte Altersvorsorge (3. Säule). Maximale Einzahlung 2026: CHF 7'258 (mit Pensionskasse) oder CHF 36'288 (ohne PK, max. 20% des Nettoeinkommens). Der gesamte Betrag ist vom steuerbaren Einkommen abziehbar.",
                "Das 3a-Vermögen wächst steuerfrei (keine Vermögenssteuer, keine Verrechnungssteuer auf Zinsen). Bei Bezug (frühestens 5 Jahre vor AHV-Alter) wird eine reduzierte Kapitalleistungssteuer fällig — je nach Kanton 3-10% des Kapitals. Tipp: Mehrere 3a-Konten führen und gestaffelt beziehen.",
            ],
            highlight: "30 Jahre × CHF 7'258/Jahr bei 3% Rendite = CHF 354'000 Kapital. Steuerersparnis über 30 Jahre (bei 30% Grenzsteuersatz): CHF 65'322. Effektive Eigenleistung: nur CHF 288'678.",
        },
        faq: [
            { question: "Wann kann ich die Säule 3a beziehen?", answer: "Frühestens 5 Jahre vor dem AHV-Referenzalter (aktuell ab 60). Ausnahmen für früheren Bezug: Kauf von selbstgenutztem Wohneigentum, Aufnahme einer selbständigen Tätigkeit, definitives Verlassen der Schweiz, oder IV-Rente." },
            { question: "Wie viele 3a-Konten sollte ich haben?", answer: "Empfehlung: 3-5 Konten. Grund: Jedes Konto muss komplett aufgelöst werden. Durch gestaffelten Bezug über mehrere Steuerjahre brechen Sie die Steuerprogression und zahlen insgesamt weniger Kapitalleistungssteuer." },
            { question: "3a-Konto oder 3a-Wertschriftenlösung?", answer: "Bei langem Anlagehorizont (>10 Jahre): Wertschriften mit Aktienanteil (z.B. 50-80%) bringen historisch deutlich höhere Renditen (5-7% vs. 0.5-1.5% Sparkonto). Bei kurzem Horizont (<5 Jahre): Sparkonto für Sicherheit." },
        ],
        relatedIds: ["saeule-3a-steuerersparnis", "altersvorsorgerechner", "ahv-rentenrechner"],
    },
    {
        id: "saeule-3a-steuerersparnis",
        title: "Säule 3a Steuerersparnis Rechner",
        keyword: "Säule 3a Steuerersparnis Rechner",
        calcType: "pillar-3a-tax",
        icon: "💰",
        subtitle: "Berechnen Sie, wie viel Steuern Sie mit der Säule 3a sparen. Mit kantonalen Steuersätzen und kumulierter Ersparnis über die Jahre.",
        explanation: {
            heading: "Steuerersparnis mit der Säule 3a",
            paragraphs: [
                "Jeder in die Säule 3a eingezahlte Franken reduziert Ihr steuerbares Einkommen. Bei einem Grenzsteuersatz von 30% sparen Sie mit der maximalen Einzahlung von CHF 7'258 jährlich CHF 2'177 Steuern. Über ein Berufsleben von 30+ Jahren summiert sich das auf über CHF 65'000.",
                "Die Steuerersparnis variiert stark nach Kanton: In Genf oder Basel (hohe Steuern) sparen Sie mehr, in Zug oder Schwyz (tiefe Steuern) weniger. Beim Bezug fällt eine reduzierte Kapitalleistungssteuer an — deutlich tiefer als die reguläre Einkommenssteuer.",
            ],
            highlight: "Maximale 3a-Einzahlung CHF 7'258, Kanton Zürich, ledig, CHF 100'000 Einkommen → Jährliche Steuerersparnis: ca. CHF 2'177. Über 35 Jahre: CHF 76'200 gespart!",
        },
        faq: [
            { question: "Lohnt sich die 3a-Einzahlung in einem steuergünstigen Kanton?", answer: "Ja, auch bei tiefen Steuersätzen lohnt sich die 3a-Einzahlung: In Zug sparen Sie ca. CHF 800/Jahr, über 35 Jahre = CHF 28'000. Zudem wächst das Kapital steuerfrei (keine Vermögenssteuer, keine Verrechnungssteuer). Die Bezugssteuer ist in steuergünstigen Kantonen ebenfalls tiefer." },
            { question: "Wie wird die 3a bei Bezug besteuert?", answer: "Die Kapitalleistungssteuer wird separat vom übrigen Einkommen berechnet, zu einem reduzierten Tarif. Je nach Kanton und Betrag: 3-10% des Kapitals. Durch gestaffelten Bezug (mehrere 3a-Konten über verschiedene Jahre auflösen) können Sie die Progression brechen." },
        ],
        relatedIds: ["saeule-3a-rechner", "steueroptimierungrechner", "steuerabzugrechner"],
    },
    {
        id: "fruehpensionierung-rechner",
        title: "Frühpensionierung Rechner",
        keyword: "Frühpensionierung Rechner Schweiz",
        calcType: "early-retirement",
        icon: "🏖️",
        subtitle: "Berechnen Sie die finanziellen Auswirkungen einer Frühpensionierung: AHV-Kürzung, BVG-Reduktion und benötigtes Überbrückungskapital.",
        explanation: {
            heading: "Frühpensionierung in der Schweiz",
            paragraphs: [
                "Eine Frühpensionierung ist in der Schweiz ab 58-63 Jahren möglich (je nach PK-Reglement). Die Konsequenzen: AHV-Vorbezug ab 63 (Männer) mit 6.8% Kürzung pro Jahr (lebenslang), tieferes BVG-Kapital (weniger Beitragsjahre + tieferer Umwandlungssatz), und Überbrückungsrente bis zum AHV-Alter.",
                "Finanziell müssen Sie drei Phasen finanzieren: (1) Überbrückung bis AHV-Alter (kein AHV, evt. PK-Rente), (2) AHV-Bezug mit Kürzung, (3) Langfristiger Ruhestand. Für jedes Jahr Frühpensionierung brauchen Sie ca. CHF 60'000-80'000 Überbrückungskapital.",
            ],
            highlight: "Frühpensionierung mit 62 (3 Jahre früher): AHV-Kürzung 3 × 6.8% = 20.4% lebenslang. Bei Max-Rente: CHF 2'450 → CHF 1'950/Monat. Überbrückung 62-65: ca. CHF 180'000-240'000 benötigt.",
        },
        faq: [
            { question: "Was kostet mich jedes Jahr Frühpensionierung?", answer: "AHV: 6.8% Kürzung pro Vorbezugsjahr (lebenslang). BVG: Ca. 5-8% weniger Kapital pro fehlendes Jahr + tieferer Umwandlungssatz. Fehlende Beiträge: AHV-Beitragslücke (CHF 514/Jahr für Nichterwerbstätige). Plus Überbrückungskosten: CHF 60'000-80'000/Jahr." },
            { question: "Wie kann ich die Frühpensionierung finanzieren?", answer: "Strategien: (1) PK-Überbrückungsrente (viele Kassen bieten dies an), (2) Gestaffelter Bezug von 3a-Konten, (3) Teilzeitarbeit (Teilpensionierung), (4) Freies Vermögen. Am effizientesten: Kombination aus PK-Überbrückungsrente und gestaffeltem 3a-Bezug." },
        ],
        relatedIds: ["ahv-rentenrechner", "rentenluckerechner", "altersvorsorgerechner"],
    },
    {
        id: "altersvorsorgerechner",
        title: "Altersvorsorge Rechner",
        keyword: "Altersvorsorge Rechner Schweiz",
        calcType: "retirement-planning",
        icon: "📊",
        subtitle: "Berechnen Sie Ihre gesamte Altersvorsorge: AHV + BVG + Säule 3a + freies Vermögen. Der Überblick über alle 3 Säulen.",
        explanation: {
            heading: "Das 3-Säulen-System der Schweiz",
            paragraphs: [
                "Die Schweizer Altersvorsorge basiert auf 3 Säulen: 1. Säule (AHV): Für alle obligatorisch, deckt den Grundbedarf (CHF 1'225-2'450/Monat). 2. Säule (BVG/Pensionskasse): Für Arbeitnehmer obligatorisch ab CHF 22'050 Lohn, soll den gewohnten Lebensstandard sichern. 3. Säule (3a/3b): Freiwillig, private Vorsorge.",
                "Das Ziel: Die Renten aus allen 3 Säulen sollen zusammen ca. 60-70% des letzten Erwerbseinkommens erreichen. Bei mittleren Einkommen funktioniert das Modell gut. Bei hohen Einkommen (>CHF 150'000) gibt es eine Vorsorgelücke, da die AHV und das obligatorische BVG gedeckelt sind.",
            ],
            highlight: "Lohn CHF 100'000: AHV ca. CHF 2'200/Mt. + BVG ca. CHF 2'000/Mt. + 3a-Kapital CHF 350'000 = Gesamtrente ca. CHF 5'600/Mt. (67% des Lohns). Ziel erreicht!",
        },
        faq: [
            { question: "Reichen AHV und BVG für meinen Lebensstandard?", answer: "Bei Einkommen bis CHF 85'000: Meist ja (AHV + BVG = ca. 60-70%). Bei CHF 85'000-150'000: Knapp, Säule 3a dringend empfohlen. Über CHF 150'000: Erhebliche Vorsorgelücke, freies Vermögen oder überobligatorische PK nötig." },
            { question: "Wie viel sollte ich monatlich für die Altersvorsorge sparen?", answer: "Faustregel: 15-20% des Bruttoeinkommens (inkl. AHV/BVG-Beiträge). Davon sind ca. 12-15% bereits obligatorisch (AHV + BVG). Zusätzlich empfohlen: Maximale 3a-Einzahlung (CHF 605/Monat) und idealerweise freies Sparen." },
        ],
        relatedIds: ["ahv-rentenrechner", "bvg-rechner", "saeule-3a-rechner"],
    },
    {
        id: "pensionskasserechner",
        title: "Pensionskasse Rechner",
        keyword: "Pensionskasse Rechner Schweiz",
        calcType: "pension-fund",
        icon: "🏢",
        subtitle: "Berechnen Sie Ihr voraussichtliches Pensionskassen-Kapital und die daraus resultierende Rente. Mit PK-Einkauf-Simulation.",
        explanation: {
            heading: "Pensionskasse (BVG) — Kapitalaufbau und Einkauf",
            paragraphs: [
                "Ihre Pensionskasse baut sich über die Beitragsjahre auf: Jedes Jahr fliessen Altersgutschriften auf Ihr Konto (7-18% des koordinierten Lohns, je nach Alter). Hinzu kommt die Verzinsung (BVG-Mindestzins 2026: 1.25%). Viele Kassen bieten deutlich bessere Konditionen im überobligatorischen Bereich.",
                "PK-Einkauf: Wenn Sie Beitragslücken haben (z.B. durch Jobwechsel, Zuzug aus dem Ausland, Lohnerhöhung), können Sie freiwillige Einkäufe tätigen. Diese sind vollständig vom steuerbaren Einkommen abzugsfähig — oft die attraktivste Steueroptimierungsmöglichkeit.",
            ],
            highlight: "PK-Einkauf CHF 50'000 bei Grenzsteuersatz 30% → Sofortige Steuerersparnis CHF 15'000. Plus langfristige Verzinsung des Einkaufsbetrags. Achtung: 3-Jahres-Sperrfrist für Kapitalbezug nach Einkauf!",
        },
        faq: [
            { question: "Wie finde ich heraus, wie viel ich einkaufen kann?", answer: "Auf Ihrem PK-Ausweis ist die 'maximale Einkaufssumme' ausgewiesen. Diese berechnet sich aus: Reglementarisches Guthaben bei lückenloser Beitragsdauer minus Ihr aktuelles Guthaben. Bei Lohnerhöhungen oder nach einem Zuzug kann die Einkaufssumme hoch sein." },
            { question: "Was passiert mit meiner PK bei Stellenwechsel?", answer: "Das gesamte BVG-Guthaben (Freizügigkeitsleistung) wird an die neue PK überwiesen. Es geht nichts verloren. Bei Arbeitslosigkeit: Übertragung auf ein Freizügigkeitskonto bei einer Bank oder Versicherung." },
        ],
        relatedIds: ["bvg-rechner", "pension-kapital", "saeule-3a-rechner"],
    },
    {
        id: "rentenluckerechner",
        title: "Rentenlücke Rechner",
        keyword: "Rentenlücke Rechner Schweiz",
        calcType: "pension-gap",
        icon: "📉",
        subtitle: "Berechnen Sie Ihre Rentenlücke: Differenz zwischen gewünschtem Einkommen im Alter und den voraussichtlichen Renten aus AHV und BVG.",
        explanation: {
            heading: "Was ist die Rentenlücke?",
            paragraphs: [
                "Die Rentenlücke ist die Differenz zwischen Ihrem gewünschten Einkommen im Alter (üblicherweise 70-80% des letzten Lohns) und den voraussichtlichen Rentenleistungen aus AHV und BVG. Je höher Ihr Einkommen, desto grösser die Lücke, da AHV und BVG gedeckelt sind.",
                "Beispiel: Bei einem Lohn von CHF 150'000 erwarten Sie im Alter CHF 105'000 (70%). AHV gibt max. CHF 29'400, BVG geschätzt CHF 35'000 = Total CHF 64'400. Rentenlücke: CHF 40'600/Jahr. Diese muss durch Säule 3a, freies Vermögen oder Kapitalverzehr gedeckt werden.",
            ],
            highlight: "Lohn CHF 120'000, Ziel 70%: CHF 84'000/Jahr. AHV: CHF 28'000 + BVG: CHF 30'000 = CHF 58'000. Rentenlücke: CHF 26'000/Jahr = CHF 2'167/Monat. Über 20 Jahre Ruhestand: CHF 520'000 benötigt!",
        },
        faq: [
            { question: "Wie gross ist die typische Rentenlücke?", answer: "Bei CHF 80'000 Lohn: Gering (0-5'000/Jahr). Bei CHF 120'000: Mittel (20'000-30'000/Jahr). Bei CHF 200'000: Gross (70'000-90'000/Jahr). Die Lücke wird oft unterschätzt, besonders von Gutverdiener." },
            { question: "Wie schliesse ich die Rentenlücke?", answer: "1. Säule 3a maximal nutzen (CHF 7'258/Jahr). 2. PK-Einkauf prüfen. 3. Freies Vermögen aufbauen (ETF-Sparplan). 4. Überobligatorische Pensionskasse (Arbeitgeber wechseln?). 5. Immobilie als Altersvorsorge. 6. Teilzeitarbeit im Alter." },
        ],
        relatedIds: ["altersvorsorgerechner", "ahv-rentenrechner", "saeule-3a-rechner"],
    },
    {
        id: "pension-kapital",
        title: "Pension Kapital Rechner",
        keyword: "Pension Kapital vs Rente Rechner Schweiz",
        calcType: "capital-vs-annuity",
        icon: "⚖️",
        subtitle: "Rente oder Kapital? Vergleichen Sie beide Optionen bei der Pensionierung. Mit Breakeven-Berechnung und steuerlichen Auswirkungen.",
        explanation: {
            heading: "Rente oder Kapital — der wichtigste Entscheid",
            paragraphs: [
                "Bei der Pensionierung stehen Sie vor der Wahl: Lebenslanges Rentenversprechen der Pensionskasse oder einmaliger Kapitalbezug. Die Rente bietet Sicherheit (garantiert lebenslang, inkl. 60% Partnerrente), das Kapital bietet Flexibilität (vererbbar, frei investierbar).",
                "Der Breakeven-Punkt zeigt, ab welchem Alter die Rente 'günstiger' wird als der Kapitalbezug. Bei einem Umwandlungssatz von 6.8% liegt er bei ca. 82-85 Jahren. Steuerlich: Rente wird als Einkommen besteuert, Kapitalbezug unterliegt der reduzierten Kapitalleistungssteuer.",
            ],
            highlight: "PK-Kapital CHF 500'000: Rente (6.8%) = CHF 2'833/Monat lebenslang. Kapitalbezug: CHF 500'000 – Steuer ~CHF 30'000 = CHF 470'000 verfügbar. Breakeven: ca. 83 Jahre.",
        },
        faq: [
            { question: "Wann lohnt sich die Rente?", answer: "Wenn Sie (1) eine hohe Lebenserwartung haben, (2) wenig finanzielles Know-how oder Interesse an Geldanlage, (3) Sicherheit bevorzugen, (4) einen hohen Umwandlungssatz (>6%) haben, (5) einen Partner absichern wollen (60% Partnerrente)." },
            { question: "Wann lohnt sich der Kapitalbezug?", answer: "Wenn Sie (1) über anderes Einkommen/Vermögen verfügen, (2) Kapital vererben wollen (Rente erlischt), (3) einen tiefen Umwandlungssatz haben (<5%), (4) in einen steuergünstigen Kanton ziehen vor Bezug, (5) das Kapital selbst renditestärker anlegen können." },
        ],
        relatedIds: ["bvg-rechner", "pension-auszahlung", "pensionskasserechner"],
    },
    {
        id: "pension-auszahlung",
        title: "Pension Auszahlung Rechner",
        keyword: "Pension Auszahlung Rechner Schweiz",
        calcType: "pension-payout",
        icon: "💸",
        subtitle: "Berechnen Sie die Kapitalleistungssteuer bei Bezug von PK-Kapital und Säule 3a. Mit kantonalen Steuersätzen und Staffelungsoptimierung.",
        explanation: {
            heading: "Kapitalleistungssteuer bei Pensionierung",
            paragraphs: [
                "Beim Bezug von Pensionskassen-Kapital und Säule 3a fällt eine einmalige Kapitalleistungssteuer an. Diese wird separat vom übrigen Einkommen berechnet und ist deutlich tiefer als die reguläre Einkommenssteuer. Die Sätze variieren stark nach Kanton — von ca. 3% (Schwyz) bis 12% (Genf).",
                "Optimierungsstrategie: Gestaffelter Bezug über mehrere Jahre (z.B. PK-Kapital im Jahr X, 3a-Konto 1 im Jahr X+1, 3a-Konto 2 im Jahr X+2). Durch die Staffelung bleiben Sie in tieferen Progressionsstufen. Kantonsumzug vor dem Bezug kann ebenfalls Tausende sparen.",
            ],
            highlight: "Kapital CHF 600'000 in Zürich: Steuer ca. CHF 42'000 (7%). In Schwyz: ca. CHF 18'000 (3%). Gestaffelt (3 × CHF 200'000): Zürich ca. CHF 30'000 (5%). Ersparnis durch Staffelung: CHF 12'000.",
        },
        faq: [
            { question: "Wie hoch ist die Kapitalleistungssteuer?", answer: "Abhängig von Kanton und Betrag: Schwyz/Zug 3-5%, Zürich 5-8%, Bern 6-9%, Basel 7-10%, Genf 8-12%. Bund: Progressiv, ca. 1-3%. Verheiratete zahlen oft weniger (geteilte Progression). Die genauen Tarife variieren je nach Steuerperiode." },
            { question: "Kann ich den Bezugszeitpunkt optimieren?", answer: "Ja! PK-Kapital und 3a-Guthaben in verschiedenen Steuerjahren beziehen. 3a-Konten einzeln über mehrere Jahre auflösen. Idealerweise in einem Jahr mit tiefem sonstigem Einkommen beziehen. Umzug in einen steuergünstigen Kanton (mind. 2 Jahre vor Bezug) prüfen." },
        ],
        relatedIds: ["pension-kapital", "saeule-3a-rechner", "saeule-3a-steuerersparnis"],
    },
    // ═══════════════════════════════════════════════════
    // SWISS INVESTMENT & WEALTH CALCULATORS
    // ═══════════════════════════════════════════════════
    {
        id: "zinseszinsrechner",
        title: "Zinseszins Rechner",
        keyword: "Zinseszins Rechner Schweiz",
        calcType: "compound-interest",
        icon: "📈",
        subtitle: "Berechnen Sie den Zinseszinseffekt auf Ihre Ersparnisse und Investitionen. Mit monatlichen Einzahlungen und Verrechnungssteuer-Rückforderung.",
        explanation: {
            heading: "Zinseszins — die stärkste Kraft der Finanzwelt",
            paragraphs: [
                "Albert Einstein nannte den Zinseszins 'das achte Weltwunder'. Der Zinseszinseffekt bedeutet, dass Sie nicht nur auf Ihr Kapital, sondern auch auf die bereits erzielten Zinsen Zinsen erhalten. Je länger der Anlagehorizont und je höher der Zinssatz, desto stärker wirkt der Effekt.",
                "In der Schweiz unterliegen Zinserträge der Verrechnungssteuer (35%), die Sie bei der Steuererklärung zurückfordern können. Dividenden und Kursgewinne auf Privatvermögen sind in der Schweiz steuerfrei (kein Capital Gains Tax). Zinsen auf Sparkonten und Obligationen unterliegen der Einkommenssteuer.",
            ],
            highlight: "CHF 100'000 zu 5% über 30 Jahre: Ohne Zinseszins = CHF 250'000. Mit Zinseszins = CHF 432'194. Differenz: CHF 182'194 — fast doppelt so viel!",
        },
        faq: [
            { question: "Wie wirkt sich der Zinseszins aus?", answer: "Die '72er-Regel': Teilen Sie 72 durch den Zinssatz = Anzahl Jahre bis zur Verdoppelung. Bei 6% Rendite: 72/6 = 12 Jahre. Bei 3%: 24 Jahre. Bei 8%: nur 9 Jahre. Der Zinseszins beschleunigt das Wachstum exponentiell." },
            { question: "Was ist die Verrechnungssteuer?", answer: "Die Verrechnungssteuer (VST) von 35% wird auf Schweizer Zinserträge und Dividenden erhoben. Sie wird an der Quelle abgezogen. Bei korrekter Deklaration in der Steuererklärung wird sie vollständig zurückerstattet. Also kein Verlust — nur ein Liquiditätsnachteil." },
        ],
        relatedIds: ["sparzielrechner", "etf-rendite-rechner", "portfolio-rechner"],
    },
    {
        id: "sparzielrechner",
        title: "Sparziel Rechner",
        keyword: "Sparziel Rechner Schweiz",
        calcType: "savings-goal",
        icon: "🎯",
        subtitle: "Wie viel müssen Sie monatlich sparen, um Ihr Ziel zu erreichen? Oder wann erreichen Sie Ihr Ziel mit der aktuellen Sparrate?",
        explanation: {
            heading: "Sparziel berechnen — Ihr Weg zum finanziellen Ziel",
            paragraphs: [
                "Ob Eigentum, Ausbildung, Weltreise oder Notgroschen — ein klares Sparziel motiviert und gibt Struktur. Dieser Rechner zeigt Ihnen, welche monatliche Sparrate Sie brauchen, um Ihr Ziel in der gewünschten Zeit zu erreichen — oder wie lange es mit der aktuellen Rate dauert.",
                "Tipp: Für den Eigenkapitalaufbau beim Hauskauf benötigen Sie mindestens 20% des Kaufpreises (davon max. 10% aus der Pensionskasse). Bei einer Immobilie für CHF 1'000'000 sind das CHF 200'000 hartes Eigenkapital. Frühzeitig anfangen lohnt sich!",
            ],
            highlight: "Sparziel CHF 200'000 in 10 Jahren bei 3% Rendite → Benötigte monatliche Sparrate: CHF 1'432. Bei 5% Rendite: nur CHF 1'287. Der Zinseszins spart Ihnen CHF 17'400!",
        },
        faq: [
            { question: "Wie viel sollte ich als Notgroschen haben?", answer: "Faustregel: 3-6 Monatsgehälter. Bei CHF 7'000 Netto: CHF 21'000-42'000. Auf einem zugänglichen Sparkonto (nicht in der Säule 3a). Für Selbständige: 6-12 Monatsausgaben." },
            { question: "Wo spare ich am besten?", answer: "Kurzfristig (<3 Jahre): Sparkonto (Sicherheit). Mittelfristig (3-10 Jahre): ETF-Sparplan mit Obligationenanteil. Langfristig (>10 Jahre): ETF-Sparplan mit hohem Aktienanteil (70-100%). Steuerbegünstigt: Säule 3a (max. CHF 7'258/Jahr)." },
        ],
        relatedIds: ["zinseszinsrechner", "sparquoterechner", "vermoegens-rechner"],
    },
    {
        id: "etf-rendite-rechner",
        title: "ETF Rendite Rechner",
        keyword: "ETF Rendite Rechner Schweiz",
        calcType: "etf-return",
        icon: "📊",
        subtitle: "Berechnen Sie die erwartete Rendite Ihres ETF-Sparplans. Mit TER-Kosten, Inflation und historischen Vergleichswerten.",
        explanation: {
            heading: "ETF-Investing in der Schweiz",
            paragraphs: [
                "ETFs (Exchange Traded Funds) sind in der Schweiz die beliebteste Form des passiven Investierens. Sie bieten breite Diversifikation zu tiefen Kosten (TER von 0.05-0.30%). Die historische Durchschnittsrendite des MSCI World liegt bei ca. 7-8% pro Jahr (nominal), bzw. 5-6% real (nach Inflation).",
                "Schweizer Besonderheit: Kursgewinne auf Privatvermögen sind steuerfrei! Nur Dividenden unterliegen der Einkommenssteuer. Bei ausländischen Quellensteuern können je nach Doppelbesteuerungsabkommen Teilrückforderungen gestellt werden (z.B. 15% von US-Dividenden via DA-1).",
            ],
            highlight: "CHF 500/Monat in MSCI World ETF (TER 0.20%) über 25 Jahre bei 7% Brutto → Vermögen: CHF 405'000. Eingezahlt: CHF 150'000. Rendite: CHF 255'000 (steuerfrei!).",
        },
        faq: [
            { question: "Welcher ETF ist für Schweizer am besten?", answer: "Populäre Choices: (1) Vanguard FTSE All-World (VWRL), TER 0.22%, (2) iShares MSCI World (IWDA), TER 0.20%, (3) SPI-ETF für Schweizer Aktien (keine Quellensteuer). Tipp: Thesaurierende ETFs (acc) sind steuerlich einfacher als ausschüttende (dist)." },
            { question: "Sind ETF-Gewinne in der Schweiz steuerfrei?", answer: "Kursgewinne: Ja, steuerfrei für Privatanleger. Dividenden: Nein, einkommenssteuerpflichtig (auch thesaurierte). Verrechnungssteuer: Nur bei Schweizer ETFs/Aktien (35%, rückforderbar). Ausländische Quellensteuer: Teilweise rückforderbar via DA-1." },
        ],
        relatedIds: ["zinseszinsrechner", "portfolio-rechner", "dividendenrechner"],
    },
    {
        id: "dividendenrechner",
        title: "Dividenden Rechner",
        keyword: "Dividenden Rechner Schweiz",
        calcType: "dividend",
        icon: "💎",
        subtitle: "Berechnen Sie Ihre Dividendeneinnahmen. Mit Brutto/Netto nach Verrechnungssteuer und steuerlichen Auswirkungen.",
        explanation: {
            heading: "Dividenden in der Schweiz — Brutto vs. Netto",
            paragraphs: [
                "Dividenden aus Schweizer Aktien unterliegen der Verrechnungssteuer (VST) von 35%. Diese wird automatisch abgezogen, ist aber bei korrekter Deklaration rückforderbar. Zusätzlich werden Dividenden als Einkommen besteuert (Einkommenssteuer). Bei qualifizierten Beteiligungen (≥10%) gilt eine Teilbesteuerung (70%).",
                "Bei ausländischen Aktien fällt die Quellensteuer des Herkunftslandes an (z.B. USA: 30%, reduziert auf 15% via DBA). Die über 15% hinausgehende Quellensteuer ist via DA-1-Formular rückforderbar. Die 15% Restquellensteuer werden an die Schweizer Steuern angerechnet.",
            ],
            highlight: "Portfolio CHF 500'000, Dividendenrendite 3%: Brutto CHF 15'000. VST –CHF 5'250 (rückforderbar). Einkommenssteuer (30%) ca. –CHF 4'500. Netto: CHF 10'500/Jahr = CHF 875/Monat.",
        },
        faq: [
            { question: "Muss ich Dividenden versteuern?", answer: "Ja, Dividenden sind einkommenssteuerpflichtig. Sie werden zum steuerbaren Einkommen addiert. Die Verrechnungssteuer (35%) ist separat und wird zurückerstattet, wenn Sie die Dividenden korrekt in der Steuererklärung angeben." },
            { question: "Was sind die besten Schweizer Dividendenzahler?", answer: "Historisch hohe und stabile Dividenden: Nestlé, Roche, Novartis, Zurich Insurance, Swiss Re, Swisscom. Dividendenrenditen: typisch 2.5-5%. Schweizer Dividendenaktien profitieren von der vollen VST-Rückerstattung." },
        ],
        relatedIds: ["etf-rendite-rechner", "portfolio-rechner", "investitionsrechner"],
    },
    {
        id: "portfolio-rechner",
        title: "Portfolio Wachstum Rechner",
        keyword: "Portfolio Wachstum Rechner Schweiz",
        calcType: "portfolio-growth",
        icon: "🧮",
        subtitle: "Simulieren Sie das Wachstum Ihres Portfolios über die Zeit. Mit Asset-Allokation, Rebalancing und monatlichen Einzahlungen.",
        explanation: {
            heading: "Portfolio-Wachstum und Asset-Allokation",
            paragraphs: [
                "Die Asset-Allokation (Aufteilung zwischen Aktien, Obligationen und Cash) bestimmt ca. 90% der langfristigen Rendite. Je höher der Aktienanteil, desto höher die erwartete Rendite — aber auch das Risiko. Für einen Anlagehorizont von 10+ Jahren empfehlen Experten 60-80% Aktien.",
                "In der Schweiz ist die 3a-Wertschriftenlösung eine beliebte Form des steueroptimierten Investierens: Kein Vermögenssteuer, keine Einkommenssteuer auf Erträge, und Steuerabzug bei der Einzahlung. Ausserhalb der 3. Säule profitieren Schweizer von steuerfreien Kapitalgewinnen.",
            ],
            highlight: "60% Aktien (7%) / 30% Obligationen (2%) / 10% Cash (0.5%), CHF 1'000/Mt. über 20 Jahre → Vermögen: CHF 450'000. Nur Aktien (7%): CHF 520'000. Nur Sparkonto (0.5%): CHF 256'000.",
        },
        faq: [
            { question: "Wie oft sollte ich rebalancen?", answer: "Empfehlung: 1-2× pro Jahr oder bei Abweichung >5% von der Ziel-Allokation. Am besten rebalancen Sie durch neue Einzahlungen (weniger Transaktionskosten). Viele Broker bieten automatisches Rebalancing." },
            { question: "Welche Asset-Allokation ist richtig für mich?", answer: "Faustregel: 100 minus Alter = Aktienanteil (z.B. 35 Jahre → 65% Aktien). Aggressiver: 120 minus Alter. Konservativ: 80 minus Alter. Entscheidend: Risikotoleranz und Anlagehorizont." },
        ],
        relatedIds: ["etf-rendite-rechner", "zinseszinsrechner", "vermoegens-rechner"],
    },
    {
        id: "vermoegens-rechner",
        title: "Vermögens Rechner",
        keyword: "Vermögens Rechner Schweiz",
        calcType: "net-worth",
        icon: "🏆",
        subtitle: "Berechnen Sie Ihr Nettovermögen und die resultierende Vermögenssteuer. Inkl. Immobilien, Wertschriften, PK und Schulden.",
        explanation: {
            heading: "Nettovermögen und Vermögenssteuer in der Schweiz",
            paragraphs: [
                "Ihr Nettovermögen = Summe aller Aktiven (Bankkonten, Wertschriften, Immobilien, Fahrzeuge) minus Schulden (Hypothek, Kredite). In der Schweiz unterliegt das Reinvermögen der Vermögenssteuer — eine Besonderheit, die es in den meisten anderen Ländern nicht gibt.",
                "Die Vermögenssteuer variiert stark nach Kanton: Von ca. 0.1‰ (Schwyz) bis 1% (Genf). Freibeträge: CHF 100'000 (ledig) bzw. CHF 200'000 (verheiratet) in vielen Kantonen. Pensionskassenguthaben und Säule 3a sind von der Vermögenssteuer ausgenommen.",
            ],
            highlight: "Nettovermögen CHF 1'000'000 (nach Freibetrag CHF 800'000), Kanton Zürich → Vermögenssteuer ca. CHF 2'000/Jahr. In Zug: nur CHF 480. In Genf: ca. CHF 6'000.",
        },
        faq: [
            { question: "Was zählt zum steuerbaren Vermögen?", answer: "Bankkonten, Wertschriften (zum Steuerwert/Kurswert 31.12.), Immobilien (zum Eigenmietwert oder Steuerwert), Fahrzeuge, Lebensversicherungen (Rückkaufswert), Darlehen an Dritte, und sonstige Vermögenswerte. NICHT dazu: 2. und 3a-Säule." },
            { question: "Wie kann ich die Vermögenssteuer senken?", answer: "1. PK-Einkauf (reduziert steuerbares Vermögen). 2. Hypothek beibehalten (Schulden mindern Vermögen). 3. Indirekte Amortisation via 3a (statt direkte Hypothek-Rückzahlung). 4. Kantonsumzug in steuergünstigen Kanton." },
        ],
        relatedIds: ["portfolio-rechner", "sparquoterechner", "vermoegenssteuerrechner"],
    },
    {
        id: "sparquoterechner",
        title: "Sparquote Rechner",
        keyword: "Sparquote Rechner Schweiz",
        calcType: "savings-rate",
        icon: "💹",
        subtitle: "Berechnen Sie Ihre persönliche Sparquote und vergleichen Sie mit dem Schweizer Durchschnitt. Mit Tipps zur Optimierung.",
        explanation: {
            heading: "Sparquote — der wichtigste Finanzkennwert",
            paragraphs: [
                "Die Sparquote ist der Anteil Ihres Einkommens, den Sie sparen (inkl. Investitionen und Altersvorsorge). Die Schweiz hat eine der höchsten Sparquoten weltweit: ca. 18-20% im Durchschnitt. In der FIRE-Bewegung (Financial Independence, Retire Early) gilt: Je höher die Sparquote, desto schneller die finanzielle Unabhängigkeit.",
                "Eine Sparquote von 50% bedeutet, dass Sie alle 1 Jahr Arbeit 1 Jahr Ruhestand finanzieren können. Bei 25% brauchen Sie 3 Jahre Arbeit für 1 Jahr Ruhestand. Die obligatorischen Beiträge zu AHV und BVG zählen bereits zur Sparquote.s",
            ],
            highlight: "Bruttoeinkommen CHF 120'000. Ausgaben CHF 72'000. Sparquote: 40%. Bei 7% Rendite können Sie in ca. 17 Jahren finanziell unabhängig sein (FIRE-Prinzip, 4%-Regel).",
        },
        faq: [
            { question: "Was ist eine gute Sparquote?", answer: "10-15%: Grundsolide (Schweizer Durchschnitt). 20-30%: Überdurchschnittlich, guter Vermögensaufbau. 30-50%: Exzellent, schneller Weg zur finanziellen Unabhängigkeit. 50%+: FIRE-Niveau, Frühpensionierung möglich." },
            { question: "Was zählt zur Sparquote?", answer: "Alle Formen der Vermögensbildung: Banksparen, Investitionen, Hypothek-Amortisation, Säule 3a, freiwillige PK-Einkäufe. Die obligatorischen AHV/BVG-Beiträge werden je nach Definition eingerechnet oder nicht." },
        ],
        relatedIds: ["sparzielrechner", "finanzielle-freiheit-rechner", "vermoegens-rechner"],
    },
    {
        id: "inflationsrechner",
        title: "Inflation Rechner",
        keyword: "Inflation Rechner Schweiz",
        calcType: "inflation",
        icon: "📉",
        subtitle: "Berechnen Sie den Kaufkraftverlust durch Inflation. Was sind CHF 100'000 heute in 10, 20 oder 30 Jahren noch wert?",
        explanation: {
            heading: "Inflation in der Schweiz — historisch tief, aber real",
            paragraphs: [
                "Die Schweiz hat historisch eine sehr tiefe Inflation (Ø 0.5-1% über die letzten 20 Jahre). Trotzdem: Bei 1% Inflation verliert Geld in 30 Jahren ca. 26% seiner Kaufkraft. CHF 100'000 sind dann nur noch CHF 74'000 wert. Bei 2% Inflation sogar nur CHF 55'000.",
                "Für langfristige Finanzplanung ist die Realrendite entscheidend: Nominalrendite minus Inflation. Ein Sparkonto mit 1% Zins bei 1% Inflation ergibt eine Realrendite von 0%. Aktien (historisch 7% nominal) bieten eine Realrendite von ca. 5-6%.",
            ],
            highlight: "CHF 100'000 heute bei 1% Inflation/Jahr: In 10 Jahren = CHF 90'438 Kaufkraft. In 20 Jahren = CHF 81'791. In 30 Jahren = CHF 74'009. Realrendite Sparkonto: ca. 0%.",
        },
        faq: [
            { question: "Wie hoch ist die Inflation in der Schweiz?", answer: "Historisch: Ø 0.5-1% (2000-2023). 2022 war ein Ausreisser mit 2.8% (Ukraine-Krise). Die SNB strebt eine Inflation von 0-2% an. Im internationalen Vergleich ist die Schweizer Inflation sehr tief (Eurozone: 2-3%, USA: 2-3%)." },
            { question: "Wie schütze ich mich vor Inflation?", answer: "1. Aktien und Immobilien (Sachwerte, historisch inflationsschützend). 2. Inflationsgeschützte Obligationen (TIPS). 3. Lohnverhandlung (reale Lohnerhöhung). 4. NICHT: Geld auf dem Sparkonto liegen lassen (reale Entwertung)." },
        ],
        relatedIds: ["zinseszinsrechner", "etf-rendite-rechner", "vermoegens-rechner"],
    },
    {
        id: "finanzielle-freiheit-rechner",
        title: "Finanzielle Freiheit Rechner",
        keyword: "Finanzielle Freiheit Rechner Schweiz FIRE",
        calcType: "fire",
        icon: "🔥",
        subtitle: "Wann sind Sie finanziell unabhängig? Berechnen Sie Ihre FIRE-Zahl nach der 4%-Regel mit Schweizer Lebenshaltungskosten.",
        explanation: {
            heading: "FIRE — Financial Independence, Retire Early",
            paragraphs: [
                "Das FIRE-Prinzip basiert auf der 4%-Regel (Trinity Study): Wenn Ihr jährlicher Kapitalbezug 4% Ihres Vermögens nicht übersteigt, reicht das Kapital statistisch für 30+ Jahre. FIRE-Zahl = Jährliche Ausgaben × 25. In der Schweiz sind die Lebenshaltungskosten hoch, was eine höhere FIRE-Zahl erfordert.",
                "Schweizer Besonderheit: Die AHV (ab 65) und allenfalls eine BVG-Rente reduzieren die benötigte FIRE-Zahl erheblich. Sie müssen nur die Lücke bis zum AHV-Alter und die Differenz zwischen AHV/BVG und Ihren Ausgaben selbst finanzieren.",
            ],
            highlight: "Monatliche Ausgaben CHF 5'000. FIRE-Zahl: CHF 5'000 × 12 × 25 = CHF 1'500'000. Mit AHV (CHF 2'000/Mt ab 65): Reduzierte FIRE-Zahl ab 65: CHF 900'000.",
        },
        faq: [
            { question: "Funktioniert die 4%-Regel in der Schweiz?", answer: "Grundsätzlich ja, mit Anpassungen: (1) Tiefere Inflation = positiv. (2) Höhere Lebenshaltungskosten = höhere FIRE-Zahl. (3) AHV/BVG reduzieren den Bedarf ab 65. (4) Vermögenssteuer und Krankenversicherung beachten. In der Schweiz empfehlen Experten konservativ 3.5% statt 4%." },
            { question: "Wie lange dauert es bis zur finanziellen Freiheit?", answer: "Abhängig von der Sparquote: 10% = 51 Jahre. 20% = 37 Jahre. 30% = 28 Jahre. 50% = 17 Jahre. 70% = 8.5 Jahre. Die Sparquote ist der entscheidende Faktor — wichtiger als die Rendite!" },
        ],
        relatedIds: ["sparquoterechner", "vermoegens-rechner", "portfolio-rechner"],
    },
    {
        id: "investitionsrechner",
        title: "Investitions Rechner",
        keyword: "Investitions Rechner Schweiz",
        calcType: "investment-return",
        icon: "💼",
        subtitle: "Berechnen Sie den Return on Investment (ROI) Ihrer Anlagen. Mit Einmal- und regelmässigen Einzahlungen und Opportunitätskosten.",
        explanation: {
            heading: "Return on Investment (ROI) berechnen",
            paragraphs: [
                "Der ROI zeigt, wie rentabel eine Investition war: (Endwert - Eingesetztes Kapital) / Eingesetztes Kapital × 100. Für den Vergleich verschiedener Anlagen ist der annualisierte ROI (CAGR) aussagekräftiger: Er berücksichtigt den Zeitfaktor und ermöglicht faire Vergleiche.",
                "Opportunitätskosten: Was hätten Sie mit dem Geld alternativ verdienen können? Vergleichen Sie Ihre Investition immer mit einem passiven ETF-Investment (ca. 7% p.a.) oder zumindest mit einem Sparkonto. Erst wenn Ihr ROI höher liegt, hat sich die Investition gelohnt.",
            ],
            highlight: "Investition CHF 50'000 → nach 5 Jahren CHF 72'000. ROI: 44%. Annualisiert (CAGR): 7.6%. Vergleich: MSCI World (7%/Jahr) hätte CHF 70'128 ergeben. Ihre Investition war leicht besser!",
        },
        faq: [
            { question: "Was ist ein guter ROI?", answer: "Sparkonto: 0.5-1.5% (2026). Obligationen: 1.5-3%. Schweizer Immobilien: 3-5% (Mietrendite). Aktien/ETFs: 7-8% (langfristig, nominal). Start-up: 20-100% (aber hohes Risiko). Alles über der risikolosen Rendite (Bundesobligation, ca. 1%) ist eine Risikoprämie." },
            { question: "Was sind Opportunitätskosten?", answer: "Die 'entgangene Rendite' der besten nicht gewählten Alternative. Beispiel: Sie parken CHF 100'000 auf dem Sparkonto (1%) statt in ETFs (7%). Opportunitätskosten: 6% × CHF 100'000 = CHF 6'000/Jahr. Über 10 Jahre: ca. CHF 80'000 entgangen." },
        ],
        relatedIds: ["zinseszinsrechner", "etf-rendite-rechner", "portfolio-rechner"],
    },
];

export function getChCalculatorBySlug(slug: string): ChCalculator | undefined {
    return CH_CALCULATORS.find(c => c.id === slug);
}
