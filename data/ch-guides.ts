// Swiss Guides — Mortgage & Property Calculators
// High-quality, NLP-friendly content for semantic search ranking

export interface ChGuide {
    slug: string;
    title: string;
    description: string;
    icon: string;
    readTime: string;
    relatedCalculators: string[];
    relatedGlossary: string[];
    sections: { heading: string; content: string }[];
    faq: { question: string; answer: string }[];
}

export const CH_GUIDES: ChGuide[] = [
    {
        slug: "hypothek-schweiz-erklaert",
        title: "Wie funktioniert eine Hypothek in der Schweiz — Vollständiger Leitfaden 2026",
        description: "Alles über Hypotheken in der Schweiz: Festhypothek vs SARON, 1. und 2. Hypothek, Belehnung, Tragbarkeit, indirekte Amortisation und aktuelle Zinssätze. Der umfassende Ratgeber für Immobilienkäufer.",
        icon: "🏠",
        readTime: "12 Min",
        relatedCalculators: ["hypothekenrechner", "tragbarkeitsrechner", "belehnungsrechner"],
        relatedGlossary: ["hypothek", "belehnung", "tragbarkeit", "saron", "festhypothek"],
        sections: [
            {
                heading: "Was ist eine Hypothek?",
                content: `Eine Hypothek ist ein **grundpfandgesicherter Kredit** zur Finanzierung von Wohneigentum. In der Schweiz wird die Immobilie als Sicherheit eingetragen — bei Zahlungsausfall kann die Bank die Immobilie verwerten.

Die Schweiz hat im internationalen Vergleich eine **Besonderheit**: Hypotheken werden in der Regel nicht vollständig amortisiert. Die meisten Eigenheimbesitzer behalten eine Hypothek lebenslang und zahlen nur den Zins. Das unterscheidet die Schweiz von Ländern wie Deutschland oder den USA.

**Warum?** Weil die Hypothekarzinsen steuerlich absetzbar sind und der **Eigenmietwert** (ein fiktives Einkommen für selbst bewohnte Immobilien) eine Steuerlast darstellt. Die Hypothek reduziert also die Steuerlast.`
            },
            {
                heading: "1. und 2. Hypothek — was ist der Unterschied?",
                content: `In der Schweiz wird die Hypothek in zwei Tranchen aufgeteilt:

| Merkmal | 1. Hypothek | 2. Hypothek |
|---|---|---|
| Belehnung | Bis 67% des Verkehrswerts | 67–80% des Verkehrswerts |
| Amortisation | Keine Pflicht | Muss amortisiert werden |
| Frist | Unbefristet | Innerhalb 15 Jahren oder bis Alter 65 |
| Zinssatz | Tiefer | Leicht höher (mehr Risiko) |

**Beispiel:** Bei einem Haus im Wert von CHF 1'000'000 und 20% Eigenkapital:
- 1. Hypothek: CHF 670'000 (67%)
- 2. Hypothek: CHF 130'000 (13%)
- Eigenkapital: CHF 200'000 (20%)`
            },
            {
                heading: "Hypothekarmodelle im Vergleich",
                content: `Die Schweiz bietet drei Haupttypen von Hypotheken:

| Modell | Zinssatz | Laufzeit | Für wen? |
|---|---|---|---|
| **Festhypothek** | Fix (z.B. 1.8%) | 2–15 Jahre | Wer Sicherheit will |
| **SARON-Hypothek** | Variabel (SARON + Marge) | Laufend, 3–6 Monate Kündigung | Wer Zinsvorteile sucht |
| **Variable Hypothek** | Bank bestimmt | Jederzeit kündbar (6 Mt.) | Kaum noch verbreitet |

**Festhypothek** — Sie fixieren den Zinssatz für 2 bis 15 Jahre. Vorteil: absolute Planungssicherheit. Nachteil: bei einem Zinsrückgang profitieren Sie nicht. Eine vorzeitige Kündigung kostet eine **Vorfälligkeitsentschädigung**.

**SARON-Hypothek** — Seit 2021 ersetzt der SARON den LIBOR als Referenzzins. Die Hypothek besteht aus dem SARON-Zinssatz plus einer Bankmarge (0.6–1.0%). Historisch gesehen sind SARON-Hypotheken günstiger als Festhypotheken, aber mit Zinsänderungsrisiko.

**Empfehlung:** In Tiefzinsphasen lohnt sich eine **Festhypothek mit mittlerer Laufzeit (5–7 Jahre)**. Bei hohen Zinsen kann eine SARON-Hypothek günstiger sein, wenn Sie Zinssenkungen erwarten.`
            },
            {
                heading: "Aktuelle Hypothekarzinsen (2026)",
                content: `Die Hypothekarzinsen in der Schweiz hängen vom SNB-Leitzins, den Kapitalmarktzinsen und der individuellen Bonität ab.

| Laufzeit | Richtzins (2026) |
|---|---|
| SARON-Hypothek | 1.2–1.8% |
| 2 Jahre fest | 1.4–1.9% |
| 5 Jahre fest | 1.5–2.0% |
| 10 Jahre fest | 1.7–2.3% |
| 15 Jahre fest | 2.0–2.5% |

**Tipps für die besten Zinsen:**
- Mindestens 3–5 Angebote vergleichen (Online-Vergleichsportale nutzen)
- Eigenkapital über 25% bringt bessere Konditionen
- Kürzere Laufzeiten haben tiefere Zinsen
- Guter Tragbarkeitsnachweis verbessert den Zinssatz

Verwenden Sie unseren **Hypothekenrechner**, um die monatlichen Kosten für Ihr Wunschobjekt zu berechnen.`
            },
            {
                heading: "Steuerliche Vorteile einer Hypothek",
                content: `Die Hypothek hat in der Schweiz mehrere steuerliche Auswirkungen:

**Abzüge vom steuerbaren Einkommen:**
- Hypothekarzinsen (reduzieren die Einkommenssteuer)
- Liegenschaftsunterhalt (Pauschalabzug oder effektive Kosten)
- Indirekte Amortisation via Säule 3a

**Steuerpflichtig:**
- Eigenmietwert (fiktives Einkommen, 60–70% der Marktmiete)

**Rechenbeispiel (Kanton Zürich, verheiratet):**
- Eigenmietwert: + CHF 24'000
- Hypothekarzinsen (CHF 800'000 × 1.8%): − CHF 14'400
- Liegenschaftsunterhalt (Pauschale): − CHF 4'800
- Netto steuerbare Belastung: + CHF 4'800

Die Hypothek reduziert also die steuerliche Belastung durch den Eigenmietwert erheblich. Eine **vollständige Amortisation** wäre deshalb steuerlich nachteilig.`
            }
        ],
        faq: [
            {
                question: "Kann ich meine Hypothek jederzeit erhöhen?",
                answer: "Eine Hypothekarerhöhung ist möglich, wenn die Tragbarkeit weiterhin gegeben ist und der Belehnungswert 80% nicht übersteigt. Die Bank prüft dies individuell. Typischerweise werden Erhöhungen für Renovationen oder Umbauten bewilligt."
            },
            {
                question: "Was passiert bei einer Scheidung mit der Hypothek?",
                answer: "Die Hypothek muss neu geregelt werden. Möglichkeiten: Ein Partner übernimmt die Hypothek (Tragbarkeit muss allein erfüllt sein), das Haus wird verkauft, oder die Hypothek wird aufgeteilt. Die Bank muss der Lösung zustimmen."
            },
            {
                question: "Wie viel Hypothek kann ich mir leisten?",
                answer: "Die Faustregel: Die kalkulatorischen Wohnkosten (Hypothek × 5% + Nebenkosten 1% + Amortisation) dürfen max. 33% des Bruttoeinkommens betragen. Nutzen Sie unseren Tragbarkeitsrechner für eine genaue Berechnung."
            }
        ]
    },
    {
        slug: "tragbarkeit-hypothek-berechnen",
        title: "Wie berechnet man die Tragbarkeit einer Hypothek — Schritt für Schritt",
        description: "Die Tragbarkeitsberechnung ist der wichtigste Schritt beim Immobilienkauf in der Schweiz. Erfahren Sie, wie Banken die 33%-Regel anwenden und was der kalkulatorische Zinssatz von 5% bedeutet.",
        icon: "📊",
        readTime: "10 Min",
        relatedCalculators: ["tragbarkeitsrechner", "hypothekenrechner", "belehnungsrechner"],
        relatedGlossary: ["tragbarkeit", "kalkulatorischer-zinssatz", "hypothek", "belehnung"],
        sections: [
            {
                heading: "Was bedeutet Tragbarkeit?",
                content: `Die **Tragbarkeit** ist die Fähigkeit, die gesamten Wohnkosten einer Hypothek zu tragen. Banken in der Schweiz prüfen die Tragbarkeit bei jeder Hypothekenvergabe nach einer einheitlichen Regel:

**Die 33%-Regel:** Die kalkulatorischen Wohnkosten dürfen maximal **ein Drittel des Bruttoeinkommens** betragen.

Wichtig: Die Bank rechnet nicht mit dem aktuellen Hypothekarzins (z.B. 1.8%), sondern mit einem **kalkulatorischen Zinssatz von 5%**. Dieser höhere Zinssatz stellt sicher, dass Kreditnehmer auch bei steigenden Zinsen ihre Hypothek bedienen können.`
            },
            {
                heading: "Die drei Komponenten der Tragbarkeit",
                content: `Die kalkulatorischen Wohnkosten setzen sich aus drei Komponenten zusammen:

| Komponente | Berechnung | Beispiel (CHF 800'000 Hypothek) |
|---|---|---|
| **Kalkulatorischer Zins** | Hypothek × 5% | CHF 40'000/Jahr |
| **Nebenkosten** | Liegenschaftswert × 1% | CHF 10'000/Jahr |
| **Amortisation 2. Hypothek** | 2. Hypothek ÷ 15 Jahre | CHF 8'667/Jahr |
| **Total** | | **CHF 58'667/Jahr** |

Für dieses Beispiel bräuchten Sie ein **Bruttoeinkommen von mindestens CHF 176'000** (58'667 × 3 = 176'001).

**Die Formel:**
- Tragbar wenn: (Hypothek × 5% + Immobilienwert × 1% + Amortisation) ÷ Bruttoeinkommen ≤ 33%`
            },
            {
                heading: "Konkrete Rechenbeispiele",
                content: `**Beispiel 1: Wohnung CHF 800'000**
- Eigenkapital: CHF 160'000 (20%)
- Hypothek: CHF 640'000
- Kalkulatorischer Zins: CHF 32'000
- Nebenkosten: CHF 8'000
- Amortisation: CHF 6'933
- Total: CHF 46'933/Jahr
- **Benötigtes Einkommen: CHF 140'800**

**Beispiel 2: Einfamilienhaus CHF 1'200'000**
- Eigenkapital: CHF 240'000 (20%)
- Hypothek: CHF 960'000
- Kalkulatorischer Zins: CHF 48'000
- Nebenkosten: CHF 12'000
- Amortisation: CHF 10'400
- Total: CHF 70'400/Jahr
- **Benötigtes Einkommen: CHF 211'200**

Nutzen Sie unseren **Tragbarkeitsrechner** für Ihre persönliche Situation.`
            },
            {
                heading: "Was tun, wenn die Tragbarkeit nicht reicht?",
                content: `Fünf Strategien, um die Tragbarkeit zu verbessern:

- **Mehr Eigenkapital einbringen** — Jeder zusätzliche Franken Eigenkapital reduziert die Hypothek und damit die kalkulatorischen Kosten. 25% statt 20% macht einen grossen Unterschied.
- **Günstigere Immobilie suchen** — Manchmal reicht eine Region mit tieferen Preisen oder eine Wohnung statt eines Hauses.
- **Zweiteinkommen einbeziehen** — Bei Paaren werden beide Einkommen berücksichtigt. Teilzeit aufstocken kann die Tragbarkeit sicherstellen.
- **Pensionskassen-Einkäufe nutzen** — PK-Einkäufe reduzieren zwar das freie Kapital, aber erhöhen das Altersguthaben. Manche Banken werten dies positiv.
- **Familiendarlehen** — Eltern können ein Darlehen gewähren, das als Eigenkapital zählt (allerdings müssen die Zinsen in die Tragbarkeit eingerechnet werden).`
            }
        ],
        faq: [
            {
                question: "Warum rechnet die Bank mit 5% Zinssatz und nicht mit dem aktuellen Zins?",
                answer: "Der kalkulatorische Zinssatz von 5% ist ein Sicherheitspuffer. Er stellt sicher, dass Kreditnehmer auch bei deutlich steigenden Zinsen ihre Hypothek bedienen können. Der aktuelle Zins ist für die tatsächlichen Kosten relevant, der kalkulatorische für die Bewilligung."
            },
            {
                question: "Wird Bonus und 13. Monatslohn angerechnet?",
                answer: "Ja, der 13. Monatslohn wird in der Regel vollständig angerechnet. Bonuszahlungen werden je nach Bank zu 50-100% berücksichtigt, meist basierend auf dem Durchschnitt der letzten 2-3 Jahre."
            },
            {
                question: "Können zwei Einkommen kombiniert werden?",
                answer: "Ja, bei Ehepaaren oder eingetragenen Partnerschaften werden beide Einkommen addiert. Bei Konkubinatspaaren akzeptieren viele Banken das Zweiteinkommen ebenfalls, allerdings kann dies an Bedingungen geknüpft sein."
            }
        ]
    },
    {
        slug: "eigenkapital-haus-schweiz",
        title: "Wie viel Eigenkapital braucht man für ein Haus in der Schweiz?",
        description: "Mindestens 20% Eigenkapital sind nötig, aber was zählt alles dazu? Säule 3a, Pensionskasse, Erbvorbezug und Schenkungen — der vollständige Überblick.",
        icon: "💰",
        readTime: "10 Min",
        relatedCalculators: ["eigenkapitalrechner", "hypothekenrechner", "tragbarkeitsrechner"],
        relatedGlossary: ["eigenkapital", "wef", "saeule-3a", "bvg"],
        sections: [
            {
                heading: "Die 20%-Regel beim Eigenkapital",
                content: `Beim Kauf von selbst genutztem Wohneigentum in der Schweiz müssen Sie **mindestens 20% des Kaufpreises** als Eigenkapital einbringen. Die restlichen 80% finanziert die Bank als Hypothek.

**Wichtige Einschränkung:** Von den 20% Eigenkapital müssen mindestens **10% aus sogenanntem «hartem» Eigenkapital** stammen. Das bedeutet: Ersparnisse, Wertschriften, Erbvorbezüge oder Säule-3a-Guthaben. Pensionskassengelder (2. Säule) dürfen maximal 10% ausmachen.

**Beispiel: Haus für CHF 1'000'000**
- Minimum Eigenkapital: CHF 200'000 (20%)
- Davon hartes EK: mindestens CHF 100'000 (10%)
- Davon PK-Gelder: maximal CHF 100'000 (10%)`
            },
            {
                heading: "Welche Quellen zählen als Eigenkapital?",
                content: `| Quelle | Zählt als «hart»? | Max. Anteil | Besonderheit |
|---|---|---|---|
| **Bankguthaben** | ✅ Ja | Unbegrenzt | Direkt verfügbar |
| **Wertschriften** | ✅ Ja | Unbegrenzt | Zum aktuellen Kurswert |
| **Säule 3a** | ✅ Ja | Unbegrenzt | Wird bei Bezug besteuert |
| **Pensionskasse (2. Säule)** | ❌ Nein | Max. 10% des Kaufpreises | Reduziert Altersvorsorge |
| **Erbvorbezug** | ✅ Ja | Unbegrenzt | Muss bei Erbteilung angerechnet werden |
| **Schenkung** | ✅ Ja | Unbegrenzt | Je nach Kanton steuerpflichtig |
| **Darlehen (Familie)** | ⚠️ Bedingt | Bank entscheidet | Zinsen müssen in Tragbarkeit einfliessen |`
            },
            {
                heading: "Säule 3a und Pensionskasse für Eigenkapital nutzen",
                content: `**Säule 3a (3. Säule)**
Der Bezug von Säule-3a-Geldern für Wohneigentum ist möglich und zählt als hartes Eigenkapital. Vorteile: Steuerersparnis über Jahre + Eigenkapitalaufbau. Der Bezug wird zu einem reduzierten Satz besteuert (Kapitalleistungssteuer).

**Tipp:** Wenn Sie den Hauskauf planen, eröffnen Sie mehrere 3a-Konten (bis zu 5). So können Sie gestaffelt beziehen und die Steuerlast optimieren.

**Pensionskasse (2. Säule)**
PK-Gelder können für Wohneigentum verwendet werden (WEF = Wohneigentumsförderung). Regeln:
- Mindestbezug: CHF 20'000
- Alle 5 Jahre möglich
- Bis Alter 50: Ganzes Guthaben oder Hälfte des aktuellen Guthabens (das höhere)
- Ab Alter 50: Guthaben mit 50 oder Hälfte des aktuellen (das höhere)

**Achtung:** Ein PK-Bezug reduziert Ihre Altersvorsorge erheblich. Rechnen Sie die Rentenlücke mit unserem **Pensionskasserechner** aus.`
            },
            {
                heading: "Wie viel Eigenkapital ist optimal?",
                content: `Mehr Eigenkapital als die Mindestanforderung hat mehrere Vorteile:

- **Bessere Zinsen** — Banken belohnen tiefere Belehnungen mit günstigeren Konditionen. Ab 60% Belehnung sinkt der Zins spürbar.
- **Tiefere monatliche Kosten** — Weniger Hypothek = weniger Zinszahlungen + weniger Amortisation.
- **Bessere Tragbarkeit** — Je mehr Eigenkapital, desto einfacher erfüllen Sie die 33%-Regel.
- **Weniger Zinsrisiko** — Bei steigenden Zinsen trifft Sie der Effekt weniger stark.

**Fazit:** 25–30% Eigenkapital sind ideal. Mehr als 35% ist steuerlich nicht optimal, weil die Hypothekarzinsabzüge wegfallen.`
            }
        ],
        faq: [
            {
                question: "Kann ich ohne Eigenkapital ein Haus kaufen?",
                answer: "Nein, in der Schweiz ist das grundsätzlich nicht möglich. Die 20%-Regel ist ein regulatorischer Standard, den alle Banken einhalten müssen. In Ausnahmefällen (z.B. bei kombinierten Finanzierungen mit Bauland von der Gemeinde) können leicht reduzierte Anforderungen gelten."
            },
            {
                question: "Zählt eine Erbschaft als hartes Eigenkapital?",
                answer: "Ja, eine bereits erhaltene Erbschaft oder ein Erbvorbezug zählt als hartes Eigenkapital. Ein blosser Erbanspruch (zukünftige Erbschaft) wird von Banken hingegen nicht berücksichtigt."
            },
            {
                question: "Soll ich die Pensionskasse anzapfen?",
                answer: "Das ist eine individuelle Entscheidung. PK-Bezüge reduzieren Ihre Altersrente dauerhaft. Prüfen Sie zuerst alle anderen Eigenkapitalquellen (3a, Ersparnisse, Erbvorbezug). Falls ein PK-Bezug nötig ist, planen Sie eine spätere Rückzahlung, um die Rentenlücke zu schliessen."
            }
        ]
    },
    {
        slug: "nebenkosten-immobilienkauf-schweiz",
        title: "Nebenkosten beim Immobilienkauf in der Schweiz berechnen",
        description: "Handänderungssteuer, Notargebühren, Grundbuch und mehr: Alle Kaufnebenkosten in der Schweiz auf einen Blick — mit kantonalen Unterschieden und Rechenbeispiel.",
        icon: "📋",
        readTime: "8 Min",
        relatedCalculators: ["kaufnebenkostenrechner", "hypothekenrechner"],
        relatedGlossary: ["kaufnebenkosten"],
        sections: [
            {
                heading: "Übersicht der Kaufnebenkosten",
                content: `Beim Immobilienkauf in der Schweiz fallen neben dem Kaufpreis **zusätzliche Kosten von ca. 3–5%** des Kaufpreises an. Diese variieren stark nach Kanton.

| Kostenart | Typischer Bereich | Wer zahlt |
|---|---|---|
| **Notargebühren** | 0.1–0.5% | Käufer |
| **Grundbuchgebühren** | 0.1–0.5% | Käufer |
| **Handänderungssteuer** | 0–3.3% | Käufer (kantonsabhängig) |
| **Grundpfandrechtserrichtung** | 0.1–0.3% | Käufer |
| **Maklerprovision** | 2–3% | Verkäufer (üblicherweise) |

**Gesamtkosten** variieren von ca. **1% (Zürich, keine Handänderungssteuer)** bis **5% (Genf, Waadt)** des Kaufpreises.`
            },
            {
                heading: "Handänderungssteuer nach Kanton",
                content: `Die Handänderungssteuer ist die grösste Variable bei den Kaufnebenkosten. Einige Kantone erheben **keine** Handänderungssteuer.

| Kanton | Steuersatz | Bemerkung |
|---|---|---|
| **Zürich** | 0% | Keine Handänderungssteuer |
| **Bern** | 1.8% | Auf Kaufpreis |
| **Luzern** | 1.5% | Auf Kaufpreis |
| **Aargau** | 0% | Keine Handänderungssteuer |
| **Basel-Stadt** | 3.0% | Höchster Satz der Schweiz |
| **St. Gallen** | 1.0% | Auf Kaufpreis |
| **Waadt** | 3.3% | Auf Kaufpreis |
| **Genf** | 3.0% | Auf Kaufpreis |
| **Zug** | 0% | Keine Handänderungssteuer |
| **Schwyz** | 0% | Keine Handänderungssteuer |

**Tipp:** In Grenzkantonen kann die Wahl des Wohnorts tausende Franken sparen.`
            },
            {
                heading: "Rechenbeispiel: Wohnung für CHF 850'000",
                content: `**Szenario 1: Kanton Zürich (keine Handänderungssteuer)**
- Notargebühren: CHF 2'500
- Grundbuchgebühren: CHF 1'700
- Grundpfandrechtserrichtung: CHF 1'500
- **Total Nebenkosten: ca. CHF 5'700 (0.7%)**

**Szenario 2: Kanton Bern (1.8% Handänderungssteuer)**
- Handänderungssteuer: CHF 15'300
- Notargebühren: CHF 3'200
- Grundbuchgebühren: CHF 1'700
- Grundpfandrechtserrichtung: CHF 1'500
- **Total Nebenkosten: ca. CHF 21'700 (2.6%)**

**Szenario 3: Kanton Waadt (3.3% Handänderungssteuer)**
- Handänderungssteuer: CHF 28'050
- Notargebühren: CHF 4'000
- Grundbuchgebühren: CHF 2'000
- Grundpfandrechtserrichtung: CHF 1'500
- **Total Nebenkosten: ca. CHF 35'550 (4.2%)**

→ Nutzen Sie unseren **Kaufnebenkostenrechner** für Ihren Kanton.`
            },
            {
                heading: "Laufende Kosten nach dem Kauf",
                content: `Neben den einmaligen Kaufnebenkosten fallen dauerhaft Kosten an:

- **Hypothekarzinsen** — Ca. 1.5–2.5% der Hypothek pro Jahr
- **Nebenkosten/Unterhalt** — Faustregel: 1% des Liegenschaftswerts pro Jahr (Versicherung, Unterhalt, Wasser, Elektrizität, Heizung)
- **Eigenmietwert** — Fiktives Einkommen, das versteuert werden muss
- **Erneuerungsfonds** — Bei Stockwerkeigentum: monatlicher Beitrag für grössere Renovationen

**Merke:** Die tatsächlichen Wohnkosten (Hypothekarzinsen + Unterhalt + Amortisation) werden bei der **Tragbarkeitsberechnung** mit dem kalkulatorischen Zins von 5% gerechnet.`
            }
        ],
        faq: [
            {
                question: "Muss ich die Nebenkosten aus dem Eigenkapital bezahlen?",
                answer: "Ja, die Kaufnebenkosten müssen zusätzlich zum 20% Eigenkapital bezahlt werden. Rechnen Sie also mit 22-25% des Kaufpreises als Gesamtbedarf an Eigenmitteln."
            },
            {
                question: "Ist die Maklerprovision vom Käufer zu bezahlen?",
                answer: "In der Regel bezahlt der Verkäufer die Maklerprovision. In Einzelfällen (bei Käufermaklern) kann auch der Käufer provisionspflichtig sein. Klären Sie dies vor Vertragsabschluss."
            }
        ]
    },
    {
        slug: "mieten-oder-kaufen-schweiz",
        title: "Mieten oder Kaufen in der Schweiz — Was lohnt sich mehr?",
        description: "Der grosse Vergleich: Wann lohnt sich Wohneigentum in der Schweiz und wann ist Mieten die bessere Wahl? Rechnung mit Opportunitätskosten, Steuereffekten und Rendite.",
        icon: "⚖️",
        readTime: "12 Min",
        relatedCalculators: ["hypothekenrechner", "tragbarkeitsrechner", "zinseszinsrechner"],
        relatedGlossary: ["eigenmietwert", "tragbarkeit", "hypothek", "zinseszins"],
        sections: [
            {
                heading: "Mieten vs. Kaufen: Die Ausgangslage",
                content: `Die Schweiz hat eine der **tiefsten Wohneigentumsquoten** Europas: Nur ca. 36% der Haushalte besitzen ihre Immobilie. In de  meisten anderen Ländern liegt die Quote bei 50–70%. Das hat verschiedene Gründe:

- **Hohe Immobilienpreise** — Die Medianpreise für Wohnungen liegen bei CHF 700'000–1'200'000 je nach Region.
- **Attraktiver Mietmarkt** — Tiefe Mietrenditen und guter Mieterschutz.
- **Steuerliche Nachteile beim Kauf** — Der Eigenmietwert belastet Eigenheimbesitzer.

Die Frage «Mieten oder Kaufen?» lässt sich nicht pauschal beantworten. Es hängt von **Zinsniveau, Immobilienpreisen, persönlicher Situation und Anlagehorizont** ab.`
            },
            {
                heading: "Kostenvergleich: Miete vs. Eigentum",
                content: `**Beispiel: Wohnung CHF 900'000 (Kanton Zürich)**

| Kostenposition | Mieten | Kaufen |
|---|---|---|
| Monatliche Kosten | CHF 2'800 Miete | CHF 1'350 Zinsen (Hyp. 720k × 1.8%) |
| | | + CHF 750 Nebenkosten (1% Wert) |
| | | + CHF 578 Amortisation (2. Hyp.) |
| | | + CHF 720 Eigenmietwert-Steuerlast |
| **Total pro Monat** | **CHF 2'800** | **CHF 3'398** |
| Eigenkapital gebunden | CHF 0 | CHF 180'000 |
| Opportunitätskosten EK (5% Rendite) | --- | CHF 9'000/Jahr |

**Auf den ersten Blick** scheint Mieten günstiger. Aber: Beim Kaufen bauen Sie Vermögen auf, bei der Miete nicht.`
            },
            {
                heading: "Wann lohnt sich Kaufen?",
                content: `Kaufen lohnt sich, wenn:

- **Sie langfristig planen** (≥ 10 Jahre am selben Ort). Die Kaufnebenkosten amortisieren sich erst über die Jahre.
- **Die Zinsen tief bleiben** — Bei Hypothekarzinsen unter 2.5% sind die effektiven Wohnkosten oft tiefer als die Miete.
- **Immobilienpreise steigen** — Historisch haben Schweizer Immobilien 2–3% pro Jahr an Wert gewonnen.
- **Ihr Eigenkapital nicht anderweitig höher rentiert** — Wenn die Aktienrendite (7% langfristig) höher ist als die Wertsteigerung + Einsparung, ist Mieten + Investieren besser.
- **Emotionale Gründe** — Eigenheim = Freiheit, Gestaltungsmöglichkeiten, Sicherheit.`
            },
            {
                heading: "Die Opportunitätskosten verstehen",
                content: `Das oft vergessene Argument: Was würde passieren, wenn Sie das Eigenkapital statt in eine Immobilie am Kapitalmarkt investieren?

**Rechenbeispiel über 20 Jahre:**
- Eigenkapital: CHF 200'000
- Anlagerendite: 6% p.a. (weltweiter ETF-Index)
- Wert nach 20 Jahren: **CHF 641'000**
- Wertzuwachs: CHF 441'000

**Immobilie über 20 Jahre:**
- Kaufpreis: CHF 1'000'000
- Wertsteigerung: 2% p.a.
- Wert nach 20 Jahren: **CHF 1'486'000**
- Wertzuwachs: CHF 486'000
- Amortisation abbezahlt: CHF ~130'000
- Hypothekarzinsen gezahlt: CHF ~288'000

Der Immobilienkauf lohnt sich in diesem Beispiel nur, wenn die Wertsteigerung der Immobilie die Zinskosten und Opportunitätskosten übersteigt. Nutzen Sie unseren **Zinseszinsrechner** für Ihre individuellen Berechnungen.`
            }
        ],
        faq: [
            {
                question: "Ist Kaufen immer besser als Mieten?",
                answer: "Nein. Bei hohen Zinsen, kurzen Planungshorizonten oder wenn das Eigenkapital am Kapitalmarkt höher rentiert, kann Mieten finanziell vorteilhafter sein. Es kommt auf die individuelle Situation an."
            },
            {
                question: "Ab welchem Einkommen lohnt sich Kaufen?",
                answer: "Es gibt keine feste Grenze. Die Tragbarkeit muss erfüllt sein (33%-Regel). Für eine Eigentumswohnung ab CHF 600'000 brauchen Sie ein Haushaltseinkommen ab ca. CHF 120'000-130'000."
            }
        ]
    },
    {
        slug: "hypothekarzinsen-berechnen",
        title: "Wie berechnet man Hypothekarzinsen in der Schweiz",
        description: "Schritt-für-Schritt-Anleitung zur Berechnung von Hypothekarzinsen. Festhypothek vs SARON-Hypothek, Zinsvergleich und wie Sie den besten Zinssatz finden.",
        icon: "📈",
        readTime: "8 Min",
        relatedCalculators: ["hypothekenrechner", "hypothekzinsrechner", "zinseszinsrechner"],
        relatedGlossary: ["saron", "festhypothek", "hypothek"],
        sections: [
            {
                heading: "Hypothekarzinsen einfach erklärt",
                content: `Hypothekarzinsen sind die Kosten, die Sie der Bank für das geliehene Kapital zahlen. In der Schweiz werden sie **jährlich berechnet und vierteljährlich oder monatlich belastet**.

**Die Grundformel:**
Jährliche Zinskosten = Hypothekarbetrag × Zinssatz

**Beispiel:**
- Hypothek: CHF 800'000
- Zinssatz: 1.8% (Festhypothek, 5 Jahre)
- Jährliche Zinsen: CHF 800'000 × 1.8% = **CHF 14'400**
- Monatliche Zinsen: **CHF 1'200**

Bei einer SARON-Hypothek ändert sich der Zinssatz regelmässig, basierend auf dem aktuellen SARON-Referenzzins plus der Bankmarge.`
            },
            {
                heading: "Festhypothek vs SARON: Zinsvergleich",
                content: `| Merkmal | Festhypothek | SARON-Hypothek |
|---|---|---|
| **Zinstyp** | Fix für die gesamte Laufzeit | Variabel, ändert sich laufend |
| **Zusammensetzung** | Bankzins (fix) | SARON-Zinssatz + Bankmarge |
| **Typischer Zins (2026)** | 1.5–2.3% | 1.2–1.8% |
| **Zinssicherheit** | ✅ Volle Sicherheit | ❌ Schwankt mit dem Markt |
| **Günstiger bei** | Steigenden Zinsen | Sinkenden/stabilen Zinsen |
| **Vorzeitige Ablösung** | Vorfälligkeitsentschädigung | Jederzeit möglich |

**Historische Analyse:** Über die letzten 30 Jahre waren SARON-/LIBOR-Hypotheken in etwa **75% der Zeit günstiger** als gleichlaufende Festhypotheken. Allerdings trugen die Kreditnehmer auch das Zinsänderungsrisiko.`
            },
            {
                heading: "Wie finden Sie den besten Zinssatz?",
                content: `**7 Tipps für den besten Hypothekarzins:**

- **Mehrere Offerten einholen** — Vergleichen Sie mindestens 3–5 Anbieter (Banken, Versicherungen, Pensionskassen). Die Differenzen können 0.3–0.5% betragen, was über 10 Jahre tausende Franken spart.
- **Online-Vermittler nutzen** — Plattformen wie Hypoplus, MoneyPark oder Comparis verhandeln im Namen vieler Kreditnehmer und erzielen dadurch bessere Konditionen.
- **Belehnung optimieren** — Unter 67% Belehnung (keine 2. Hypothek nötig) gibt es signifikant bessere Zinsen.
- **Amortisation anbieten** — Schnellere Amortisation kann zu besseren Zinskonditionen führen.
- **Timing beachten** — Hypothekarzinsen werden oft 3–6 Monate vor Ablauf verhandelt. Beginnen Sie rechtzeitig mit dem Vergleich.
- **Bonität verbessern** — Tiefe Verschuldung, stabiles Einkommen und ausreichend Eigenkapital verbessern den Zinssatz.
- **Tranche aufteilen** — Die Hypothek in mehrere Tranchen mit verschiedenen Laufzeiten aufteilen reduziert das Erneuerungsrisiko.

Nutzen Sie unseren **Hypothekenrechner** um verschiedene Zinsszenarien durchzurechnen.`
            }
        ],
        faq: [
            {
                question: "Was ist ein guter Hypothekarzins 2026?",
                answer: "Ein guter Zinssatz für eine 5-jährige Festhypothek liegt 2026 bei ca. 1.5-1.7%. Für SARON-Hypotheken bei ca. 1.2-1.5%. Alles unter dem Marktdurchschnitt ist gut — vergleichen Sie immer mehrere Angebote."
            },
            {
                question: "Kann ich den Zinssatz verhandeln?",
                answer: "Ja! Hypothekarzinsen sind immer verhandelbar. Die publizierten Richtzinsen sind Ausgangspunkte. Mit guter Bonität, ausreichend Eigenkapital und Konkurrenzangeboten können Sie 0.1-0.3% unter dem Richtzins erhalten."
            }
        ]
    },
    {
        slug: "amortisation-hypothek-schweiz",
        title: "Amortisation einer Hypothek erklärt — Direkt vs. Indirekt",
        description: "Verstehen Sie den Unterschied zwischen direkter und indirekter Amortisation. Warum die indirekte Variante über die Säule 3a steuerlich meist klüger ist.",
        icon: "🔄",
        readTime: "8 Min",
        relatedCalculators: ["amortisationsrechner", "hypothekenrechner", "saeule-3a-rechner"],
        relatedGlossary: ["amortisation", "indirekte-amortisation", "saeule-3a"],
        sections: [
            {
                heading: "Was ist Amortisation?",
                content: `Amortisation bedeutet die **planmässige Rückzahlung einer Hypothek**. In der Schweiz besteht eine gesetzliche Pflicht, die 2. Hypothek (67–80% Belehnung) innerhalb von **15 Jahren oder bis zum 65. Lebensjahr** zu amortisieren.

Die 1. Hypothek (bis 67%) muss hingegen **nicht amortisiert** werden. Die meisten Schweizer Eigenheimbesitzer behalten daher eine 1. Hypothek lebenslang — aus steuerlichen Gründen.

**Pflicht zur Amortisation:**
- 2. Hypothek: Muss amortisiert werden
- 1. Hypothek: Keine Pflicht, aber möglich
- Frist: 15 Jahre oder bis Alter 65 (das Kürzere gilt)`
            },
            {
                heading: "Direkte vs. indirekte Amortisation",
                content: `Es gibt zwei Wege, die Hypothek zu amortisieren:

| Merkmal | Direkte Amortisation | Indirekte Amortisation |
|---|---|---|
| **Wie?** | Regelmässige Rückzahlung an die Bank | Einzahlung in Säule 3a |
| **Hypothek sinkt** | Sofort | Erst bei Auflösung der 3a (Pensionierung/Kauf) |
| **Steuerabzug Zinsen** | Sinkt mit jeder Rückzahlung | Bleibt gleich hoch |
| **Steuerabzug 3a** | Kein Abzug | Bis CHF 7'258/Jahr abzugsfähig |
| **Steuereffekt** | Negativ (weniger Zinsabzug) | Doppelter Abzug (Zinsen + 3a) |
| **Empfehlung** | Selten empfohlen | In den meisten Fällen besser |`
            },
            {
                heading: "Indirekte Amortisation: So funktioniert es",
                content: `Bei der indirekten Amortisation zahlen Sie nicht direkt an die Bank zurück. Stattdessen:

1. Sie eröffnen ein **Säule-3a-Konto oder -Depot** bei einer Bank oder Versicherung.
2. Sie zahlen jährlich bis zu **CHF 7'258** (Angestellte mit PK) ein.
3. Die 3a-Einzahlung dient als **Amortisationsplan** — die Bank akzeptiert dies als Rückzahlung.
4. Bei Pensionierung oder Verkauf wird die 3a aufgelöst und die Hypothek reduziert.

**Steuervorteile:**
- Die 3a-Einzahlung ist vom steuerbaren Einkommen abzugsfähig (Ersparnis ca. CHF 1'500–2'500/Jahr bei Grenzsteuersatz 25–35%)
- Die Hypothekarzinsen bleiben gleich hoch und weiterhin abzugsfähig
- Das 3a-Guthaben ist von der Vermögenssteuer befreit

**Rechenbeispiel (20 Jahre, Grenzsteuersatz 30%):**
- Indirekte Amortisation Steuerersparnis: 20 × CHF 7'258 × 30% = **CHF 43'548**
- Zinsabzug erhalten (vs. direkte Amortisation): ca. **CHF 15'000**
- **Gesamtvorteil: ca. CHF 58'500**`
            },
            {
                heading: "Wann lohnt sich die freiwillige Amortisation?",
                content: `Obwohl die 1. Hypothek nicht amortisiert werden muss, kann eine freiwillige Rückzahlung sinnvoll sein:

**Freiwillige Amortisation lohnt sich, wenn:**
- Die Hypothekarzinsen **höher** sind als die erwartete Anlagerendite
- Sie bald **in Pension** gehen und die Wohnkosten senken möchten
- Ihr **Grenzsteuersatz tief** ist (der Steuerabzug bringt wenig)
- Sie **risikoavers** sind und schuldenfreies Eigentum bevorzugen

**Freiwillige Amortisation lohnt sich nicht, wenn:**
- Ihr **Grenzsteuersatz hoch** ist (30–40%) — die Steuerersparnis durch Zinsabzug ist wertvoll
- Sie das Kapital besser **investieren** können (z.B. ETF mit 6–8% Rendite)
- Sie noch Spielraum für **PK-Einkäufe** haben (steuerlich noch vorteilhafter)`
            }
        ],
        faq: [
            {
                question: "Muss ich die 1. Hypothek je amortisieren?",
                answer: "Nein, die 1. Hypothek (bis 67% Belehnung) hat keine Amortisationspflicht. Viele Schweizer behalten sie lebenslang und nutzen die steuerlichen Vorteile des Zinsabzugs."
            },
            {
                question: "Was ist besser: 3a-Konto oder 3a-Depot?",
                answer: "Für die indirekte Amortisation mit langem Horizont (>10 Jahre) ist ein 3a-Depot (Wertschriftensparen) in der Regel renditestärker als ein 3a-Sparkonto. Die höhere Rendite verstärkt den Vermögensaufbau."
            }
        ]
    },
    {
        slug: "immobilienrendite-berechnen-schweiz",
        title: "Immobilienrendite berechnen — Brutto, Netto und Cashflow",
        description: "Lernen Sie, wie man die Rendite einer Immobilie in der Schweiz korrekt berechnet. Bruttorendite, Nettorendite, Eigenkapitalrendite und Cashflow-Analyse einfach erklärt.",
        icon: "📊",
        readTime: "10 Min",
        relatedCalculators: ["immobilienrenditerechner", "hypothekenrechner", "zinseszinsrechner"],
        relatedGlossary: ["renditeliegenschaft", "hypothek", "eigenmietwert"],
        sections: [
            {
                heading: "Warum Immobilienrendite berechnen?",
                content: `Wer in Immobilien investiert, muss wissen, ob sich die Investition lohnt. Die Rendite beantwortet die zentrale Frage: **Wie viel Gewinn erwirtschaftet die Immobilie im Verhältnis zum investierten Kapital?**

In der Schweiz gibt es verschiedene Renditekennzahlen, die jeweils einen anderen Aspekt beleuchten:

- **Bruttorendite** — Schnelle Übersicht, ohne Kosten
- **Nettorendite** — Realistischer, nach Abzug aller Kosten
- **Eigenkapitalrendite** — Berücksichtigt den Hebeleffekt der Hypothek
- **Cashflow** — Zeigt den tatsächlichen monatlichen Geldzufluss`
            },
            {
                heading: "Bruttorendite und Nettorendite",
                content: `**Bruttorendite:**
Die einfachste Kennzahl. Sie setzt die Jahresmieteinnahmen ins Verhältnis zum Kaufpreis.

Bruttorendite = Jahresmieteinnahmen ÷ Kaufpreis × 100

**Nettorendite:**
Die realistischere Kennzahl. Sie berücksichtigt alle laufenden Kosten.

Nettorendite = (Jahresmieteinnahmen − laufende Kosten) ÷ (Kaufpreis + Kaufnebenkosten) × 100

**Rechenbeispiel** — Wohnung CHF 750'000:
- Jahresmieteinnahmen: CHF 24'000 (CHF 2'000/Monat)
- Laufende Kosten: CHF 6'000 (Verwaltung, Unterhalt, Versicherung, Leerstand)
- Kaufnebenkosten: CHF 15'000

- **Bruttorendite:** 24'000 ÷ 750'000 = **3.2%**
- **Nettorendite:** 18'000 ÷ 765'000 = **2.35%**

Typische Werte in der Schweiz: Bruttorendite 2.5–4.5%, Nettorendite 1.5–3.0%.`
            },
            {
                heading: "Eigenkapitalrendite (Return on Equity)",
                content: `Die **Eigenkapitalrendite** ist die wichtigste Kennzahl für fremdfinanzierte Immobilien. Sie zeigt, wie viel Rendite Ihr tatsächlich investiertes Kapital erwirtschaftet.

Eigenkapitalrendite = (Netto-Mietertrag − Hypothekarzinsen + Wertzuwachs) ÷ Eigenkapital × 100

**Rechenbeispiel** — Wohnung CHF 750'000:
- Eigenkapital: CHF 200'000 (27%)
- Hypothek: CHF 550'000 (73%)
- Netto-Mietertrag: CHF 18'000/Jahr
- Hypothekarzinsen (1.8%): CHF 9'900/Jahr
- Wertzuwachs (2% p.a.): CHF 15'000/Jahr

**Eigenkapitalrendite:** (18'000 − 9'900 + 15'000) ÷ 200'000 = **11.55%**

Der **Hebeleffekt** der Hypothek verstärkt die Rendite: Ohne Hypothek wäre die Rendite nur 4.4% auf die vollen CHF 750'000.`
            },
            {
                heading: "Worauf achten bei Renditeliegenschaften?",
                content: `**Checkliste für Renditeliegenschaften in der Schweiz:**

- **Lage, Lage, Lage** — Gute ÖV-Anbindung, Infrastruktur und Arbeitsplätze sichern die Vermietbarkeit
- **Leerstandsrisiko** — Rechnen Sie mit 5–10% Leerstand in der Kalkulation
- **Zustand der Immobilie** — Sanierungsbedarf (Heizung, Fassade, Dach) kann die Rendite stark belasten
- **Mietzinspotenzial** — Liegt die Miete im Markt oder besteht Erhöhungspotenzial?
- **Steuern** — Mieteinnahmen sind einkommenssteuerpflichtig, Wertzuwachs beim Verkauf unterliegt der Grundstückgewinnsteuer
- **Finanzierung** — Für Renditeliegenschaften gelten strengere Bedingungen (25–30% Eigenkapital, teilweise höhere Zinsen)

Nutzen Sie unseren **Immobilienrenditerechner** für Ihre individuelle Berechnung.`
            }
        ],
        faq: [
            {
                question: "Was ist eine gute Immobilienrendite?",
                answer: "In der Schweiz gilt eine Bruttorendite ab 4% als gut, eine Nettorendite ab 2.5%. In Stadtzentren (Zürich, Genf) liegen die Renditen oft tiefer (2-3% brutto), dafür ist das Wertsteigerungspotenzial höher."
            },
            {
                question: "Wie wird die Immobilienrendite besteuert?",
                answer: "Mieteinnahmen werden als Einkommen besteuert (zum persönlichen Grenzsteuersatz). Beim Verkauf fällt eine Grundstückgewinnsteuer an, die je nach Haltedauer sinkt. Hypothekarzinsen und Unterhaltskosten können steuerlich abgezogen werden."
            }
        ]
    }
];

// Helper functions
export function getAllChGuides(): ChGuide[] {
    return CH_GUIDES;
}

export function getChGuideBySlug(slug: string): ChGuide | undefined {
    return CH_GUIDES.find(g => g.slug === slug);
}
