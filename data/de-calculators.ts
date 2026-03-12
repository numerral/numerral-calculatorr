// German /de Calculator definitions — 35 calculators across 7 categories

export interface DeCalculator {
    id: string; title: string; keyword: string; calcType: string; icon: string; subtitle: string;
    explanation: { heading: string; paragraphs: string[]; highlight: string };
    faq: { question: string; answer: string }[];
    relatedIds?: string[];
}

export const DE_CATEGORIES = [
    { label: "Gesundheit", icon: "🏥", ids: ["bmi-rechner","kalorien-rechner","herzfrequenz-rechner","idealgewicht-rechner","koerperfett-rechner"] },
    { label: "Mathematik", icon: "📐", ids: ["prozentrechner","dreisatz-rechner","bruchrechner","ggt-kgv-rechner","flaechenrechner"] },
    { label: "Finanzen", icon: "💰", ids: ["zinsrechner","kredit-rechner","sparrechner","inflationsrechner","tilgungsrechner"] },
    { label: "Physik", icon: "⚡", ids: ["geschwindigkeit-rechner","kraft-rechner","dichte-rechner","ohm-rechner","energie-rechner"] },
    { label: "Statistiken", icon: "📊", ids: ["mittelwert-rechner","standardabweichung-rechner","median-rechner","perzentil-rechner","wahrscheinlichkeit-rechner"] },
    { label: "Alltag", icon: "🔧", ids: ["altersrechner","datumsrechner","einheiten-rechner","rabattrechner","trinkgeld-rechner"] },
    { label: "KI-Tools", icon: "🤖", ids: ["zeichenanzahl-rechner","wortanzahl-rechner","seitenanzahl-rechner","token-rechner","textanalyse-rechner"] },
];

export const DE_CALCULATORS: DeCalculator[] = [
    // ═══ GESUNDHEIT ═══
    { id:"bmi-rechner", title:"BMI Rechner", keyword:"BMI Rechner", calcType:"bmi", icon:"⚖️",
      subtitle:"Berechnen Sie Ihren Body-Mass-Index und erfahren Sie, ob Ihr Gewicht im gesunden Bereich liegt.",
      explanation:{ heading:"Was ist der BMI?", paragraphs:["Der Body-Mass-Index (BMI) ist ein Richtwert für das Verhältnis von Körpergewicht zu Körpergröße. Er wird berechnet als Gewicht (kg) geteilt durch Größe (m) zum Quadrat.","Normalgewicht liegt bei einem BMI von 18,5 bis 24,9. Werte darunter deuten auf Untergewicht, Werte darüber auf Übergewicht hin. Der BMI berücksichtigt jedoch nicht Muskelmasse oder Fettverteilung."], highlight:"Beispiel: 75 kg bei 1,80 m → BMI 23,1 = Normalgewicht. Idealbereich: 60–81 kg." },
      faq:[{question:"Ist der BMI für Sportler geeignet?",answer:"Bedingt. Sportler mit hoher Muskelmasse können einen hohen BMI haben, obwohl sie nicht übergewichtig sind. Der Körperfettanteil ist dann aussagekräftiger."},{question:"Ab welchem BMI gilt man als adipös?",answer:"Ab einem BMI von 30 spricht man von Adipositas. Grad I: 30–34,9, Grad II: 35–39,9, Grad III: ab 40."}],
      relatedIds:["idealgewicht-rechner","koerperfett-rechner","kalorien-rechner"] },

    { id:"kalorien-rechner", title:"Kalorienrechner", keyword:"Kalorienrechner Tagesbedarf", calcType:"calories", icon:"🔥",
      subtitle:"Berechnen Sie Ihren täglichen Kalorienbedarf basierend auf Alter, Geschlecht, Größe, Gewicht und Aktivitätslevel.",
      explanation:{ heading:"Wie wird der Kalorienbedarf berechnet?", paragraphs:["Der Grundumsatz (BMR) wird nach der Mifflin-St-Jeor-Formel berechnet. Multipliziert mit dem Aktivitätsfaktor ergibt sich der Gesamtenergiebedarf (TDEE).","Für Gewichtsabnahme: TDEE minus 500 kcal/Tag ≈ 0,5 kg Verlust pro Woche. Für Zunahme: TDEE plus 500 kcal/Tag."], highlight:"Mann, 30 Jahre, 80 kg, 180 cm, moderat aktiv → Grundumsatz ca. 1.780 kcal, Gesamtbedarf ca. 2.760 kcal." },
      faq:[{question:"Was ist der Unterschied zwischen Grundumsatz und Gesamtbedarf?",answer:"Der Grundumsatz ist die Energie, die Ihr Körper in Ruhe verbraucht. Der Gesamtbedarf berücksichtigt zusätzlich körperliche Aktivität."}],
      relatedIds:["bmi-rechner","idealgewicht-rechner"] },

    { id:"herzfrequenz-rechner", title:"Herzfrequenz Rechner", keyword:"Herzfrequenz Zonen Rechner", calcType:"heartrate", icon:"❤️",
      subtitle:"Berechnen Sie Ihre optimalen Herzfrequenzzonen nach der Karvonen-Methode für effektives Training.",
      explanation:{ heading:"Trainingszonen nach Karvonen", paragraphs:["Die Karvonen-Formel nutzt Ihre maximale und Ruheherzfrequenz, um individuelle Trainingszonen zu berechnen. Die maximale Herzfrequenz wird als 220 minus Alter geschätzt.","Jede Zone hat einen spezifischen Trainingseffekt: Zone 1–2 für Fettverbrennung, Zone 3 für Ausdauer, Zone 4–5 für Leistungssteigerung."], highlight:"Alter 35, Ruhepuls 65 → Max HF 185, Fettverbrennungszone: 137–149 Schläge/Min." },
      faq:[{question:"Was ist eine gute Ruheherzfrequenz?",answer:"60–80 bpm ist normal. Trainierte Sportler erreichen 40–60 bpm. Unter 60 bpm spricht man von Bradykardie, über 100 bpm von Tachykardie."}],
      relatedIds:["kalorien-rechner","bmi-rechner"] },

    { id:"idealgewicht-rechner", title:"Idealgewicht Rechner", keyword:"Idealgewicht berechnen", calcType:"idealweight", icon:"🎯",
      subtitle:"Berechnen Sie Ihr Idealgewicht nach vier anerkannten Formeln (Robinson, Miller, Hamwi, Devine).",
      explanation:{ heading:"Idealgewicht nach verschiedenen Formeln", paragraphs:["Es gibt keine einheitliche Definition des Idealgewichts. Dieser Rechner verwendet vier etablierte Formeln und bildet den Durchschnitt für einen ausgewogenen Richtwert.","Robinson, Miller, Hamwi und Devine nutzen jeweils unterschiedliche Basisfaktoren, weshalb die Ergebnisse leicht variieren."], highlight:"Frau, 170 cm → Robinson: 61,4 kg, Miller: 63,1 kg, Hamwi: 59,8 kg, Devine: 60,5 kg. Durchschnitt: 61,2 kg." },
      faq:[{question:"Welche Formel ist am genauesten?",answer:"Keine Formel ist perfekt. Der Durchschnitt aller vier liefert den besten Anhaltspunkt. Für individuelle Beratung konsultieren Sie einen Arzt."}],
      relatedIds:["bmi-rechner","koerperfett-rechner"] },

    { id:"koerperfett-rechner", title:"Körperfettanteil Rechner", keyword:"Körperfettanteil berechnen", calcType:"bodyfat", icon:"📏",
      subtitle:"Schätzen Sie Ihren Körperfettanteil mit der U.S. Navy-Methode anhand von Körpermaßen.",
      explanation:{ heading:"Körperfettanteil nach der Navy-Methode", paragraphs:["Die U.S. Navy-Methode nutzt Taillen-, Hals- und bei Frauen auch Hüftumfang zur Schätzung des Körperfettanteils. Die Formel ist wissenschaftlich validiert und liefert gute Näherungswerte.","Gesunde Bereiche: Männer 14–24%, Frauen 21–31%. Athleten liegen typisch bei 6–13% (Männer) bzw. 14–20% (Frauen)."], highlight:"Mann, Taille 85 cm, Hals 38 cm, 180 cm → ca. 17% Körperfett = Fitness-Bereich." },
      faq:[{question:"Wie genau ist die Methode?",answer:"Die Navy-Methode hat eine Genauigkeit von ±3–4%. Für präzisere Werte eignen sich DEXA-Scan oder Calipometrie."}],
      relatedIds:["bmi-rechner","idealgewicht-rechner"] },

    // ═══ MATHEMATIK ═══
    { id:"prozentrechner", title:"Prozentrechner", keyword:"Prozentrechner", calcType:"percent", icon:"％",
      subtitle:"Berechnen Sie Prozente: Wie viel Prozent von einer Zahl, Aufschlag, Abschlag und umgekehrt.",
      explanation:{ heading:"Prozentrechnung leicht gemacht", paragraphs:["Der Prozentrechner löst alle vier Grundaufgaben: X% von Y, Y + X%, Y − X%, und 'X ist wie viel % von Y'. Ideal für Rabatte, Steuerberechnungen und Statistik.","Prozent bedeutet 'von hundert'. 25% von 200 = 200 × 25/100 = 50."], highlight:"15% von 250 = 37,50. 250 + 19% MwSt = 297,50. 80 ist 40% von 200." },
      faq:[{question:"Wie berechne ich die Mehrwertsteuer?",answer:"Nettobetrag × 1,19 = Bruttobetrag (bei 19% MwSt). Umgekehrt: Bruttobetrag ÷ 1,19 = Nettobetrag."}],
      relatedIds:["dreisatz-rechner","rabattrechner"] },

    { id:"dreisatz-rechner", title:"Dreisatz Rechner", keyword:"Dreisatz Rechner", calcType:"ruleofthree", icon:"📐",
      subtitle:"Lösen Sie proportionale Aufgaben mit dem Dreisatz: Wenn A zu B, dann C zu X.",
      explanation:{ heading:"Der Dreisatz — einfach erklärt", paragraphs:["Der Dreisatz löst proportionale Zusammenhänge: Wenn 3 Äpfel 2,40 € kosten, wie viel kosten 5 Äpfel? Formel: X = (B × C) / A.","Es gibt den proportionalen (je mehr, desto mehr) und den antiproportionalen Dreisatz (je mehr, desto weniger)."], highlight:"3 Äpfel → 2,40 €, 5 Äpfel → 4,00 €. Formel: (2,40 × 5) / 3 = 4,00 €." },
      faq:[{question:"Wann verwende ich den antiproportionalen Dreisatz?",answer:"Wenn die Größen gegenläufig sind. Beispiel: 4 Arbeiter brauchen 6 Tage, wie lange brauchen 3 Arbeiter? Antwort: 8 Tage."}],
      relatedIds:["prozentrechner","bruchrechner"] },

    { id:"bruchrechner", title:"Bruchrechner", keyword:"Bruchrechner online", calcType:"fraction", icon:"½",
      subtitle:"Addieren, subtrahieren, multiplizieren und dividieren Sie Brüche. Ergebnis wird automatisch gekürzt.",
      explanation:{ heading:"Bruchrechnung", paragraphs:["Der Bruchrechner führt Addition, Subtraktion, Multiplikation und Division von Brüchen durch und kürzt das Ergebnis automatisch.","Bei Addition/Subtraktion werden Brüche auf den gemeinsamen Nenner gebracht. Bei Multiplikation werden Zähler und Nenner jeweils multipliziert."], highlight:"3/4 + 1/6 = 11/12. 2/3 × 3/5 = 2/5." },
      faq:[{question:"Wie kürze ich einen Bruch?",answer:"Teilen Sie Zähler und Nenner durch ihren größten gemeinsamen Teiler (GGT). Beispiel: 12/18 → GGT ist 6 → 2/3."}],
      relatedIds:["ggt-kgv-rechner","prozentrechner"] },

    { id:"ggt-kgv-rechner", title:"GGT & KGV Rechner", keyword:"GGT KGV Rechner", calcType:"gcdlcm", icon:"🔢",
      subtitle:"Berechnen Sie den größten gemeinsamen Teiler (GGT) und das kleinste gemeinsame Vielfache (KGV) zweier Zahlen.",
      explanation:{ heading:"GGT und KGV", paragraphs:["Der GGT ist die größte Zahl, durch die beide Zahlen teilbar sind. Das KGV ist die kleinste Zahl, die durch beide Zahlen teilbar ist.","Diese Werte werden u.a. zum Kürzen von Brüchen (GGT) und zum Finden gemeinsamer Nenner (KGV) benötigt."], highlight:"GGT(12, 18) = 6. KGV(12, 18) = 36." },
      faq:[{question:"Wie hängen GGT und KGV zusammen?",answer:"GGT(a,b) × KGV(a,b) = a × b. Beispiel: 6 × 36 = 12 × 18 = 216."}],
      relatedIds:["bruchrechner","prozentrechner"] },

    { id:"flaechenrechner", title:"Flächenrechner", keyword:"Fläche berechnen", calcType:"area", icon:"📏",
      subtitle:"Berechnen Sie die Fläche von Rechteck, Kreis und Dreieck. Schnell und einfach.",
      explanation:{ heading:"Flächenberechnung", paragraphs:["Rechteck: A = a × b. Kreis: A = π × r². Dreieck: A = ½ × Grundseite × Höhe.","Alle Formeln verwenden Meter als Standardeinheit, das Ergebnis wird in Quadratmetern (m²) angegeben."], highlight:"Rechteck 5m × 3m = 15 m². Kreis r=4m = 50,27 m². Dreieck 6m × 4m = 12 m²." },
      faq:[{question:"Wie rechne ich m² in cm² um?",answer:"1 m² = 10.000 cm². Multiplizieren Sie den Wert in m² mit 10.000."}],
      relatedIds:["prozentrechner","dreisatz-rechner"] },

    // ═══ FINANZEN ═══
    { id:"zinsrechner", title:"Zinsrechner", keyword:"Zinsrechner", calcType:"zins", icon:"💹",
      subtitle:"Berechnen Sie Zinseszins über mehrere Jahre. Sehen Sie, wie Ihr Kapital wächst.",
      explanation:{ heading:"Zinseszinsrechnung", paragraphs:["Der Zinseszins-Effekt sorgt dafür, dass nicht nur Ihr Kapital verzinst wird, sondern auch die bereits aufgelaufenen Zinsen. Das Kapital wächst exponentiell.","Formel: Endkapital = Startkapital × (1 + Zinssatz/100)^Jahre."], highlight:"10.000 € bei 5% über 10 Jahre → 16.289 € (6.289 € Zinsertrag)." },
      faq:[{question:"Was ist der Unterschied zwischen einfachem Zins und Zinseszins?",answer:"Einfacher Zins wird nur auf das Startkapital berechnet. Zinseszins wird auch auf die bereits aufgelaufenen Zinsen berechnet — so wächst das Kapital schneller."}],
      relatedIds:["sparrechner","kredit-rechner","tilgungsrechner"] },

    { id:"kredit-rechner", title:"Kreditrechner", keyword:"Kreditrechner", calcType:"kredit", icon:"🏦",
      subtitle:"Berechnen Sie Ihre monatliche Kreditrate, Gesamtkosten und Gesamtzinsen für jeden Kreditbetrag.",
      explanation:{ heading:"Kreditberechnung", paragraphs:["Die monatliche Rate wird mit der Annuitätenformel berechnet: Sie bleibt über die Laufzeit konstant, wobei der Zinsanteil sinkt und der Tilgungsanteil steigt.","Gesamtkosten = monatliche Rate × Anzahl Monate. Gesamtzinsen = Gesamtkosten − Kreditbetrag."], highlight:"Kredit 20.000 € bei 4,5% über 48 Monate → Rate 455,83 €, Gesamtzinsen 1.879,68 €." },
      faq:[{question:"Was ist ein Annuitätendarlehen?",answer:"Bei einem Annuitätendarlehen ist die monatliche Rate über die gesamte Laufzeit gleich. Der Zinsanteil sinkt dabei, der Tilgungsanteil steigt."}],
      relatedIds:["tilgungsrechner","zinsrechner"] },

    { id:"sparrechner", title:"Sparrechner", keyword:"Sparrechner monatlich", calcType:"sparen", icon:"🐷",
      subtitle:"Berechnen Sie, wie Ihr Vermögen durch regelmäßiges Sparen mit Zinseszins wächst.",
      explanation:{ heading:"Sparplan mit Zinseszins", paragraphs:["Regelmäßiges Sparen kombiniert mit Zinseszins ist der effektivste Weg zum Vermögensaufbau. Selbst kleine monatliche Beträge summieren sich über die Jahre erheblich.","Der Rechner berechnet: Startkapital + monatliche Einzahlungen + kumulierte Zinsen."], highlight:"100 €/Monat bei 5% über 20 Jahre → 41.275 € (24.000 € eingezahlt, 17.275 € Zinsen)." },
      faq:[{question:"Was bringt früh anfangen?",answer:"Dank Zinseszins ist jedes Jahr wertvoll. 100€/Monat ab 25 Jahren (bei 7%) ergibt mit 65 ca. 264.000€. Ab 35 nur noch 122.000€ — fast die Hälfte."}],
      relatedIds:["zinsrechner","inflationsrechner"] },

    { id:"inflationsrechner", title:"Inflationsrechner", keyword:"Inflationsrechner Kaufkraft", calcType:"inflation", icon:"📉",
      subtitle:"Berechnen Sie den Kaufkraftverlust durch Inflation und den realen Zinssatz Ihrer Anlage.",
      explanation:{ heading:"Inflation und Kaufkraft", paragraphs:["Inflation reduziert die Kaufkraft Ihres Geldes. Bei 3% Inflation sind 1.000 € in 10 Jahren nur noch 744 € wert.","Der reale Zinssatz = Nominalzins − Inflationsrate. Bei 2% Zins und 3% Inflation ist der reale Zinssatz negativ (−1%)."], highlight:"1.000 € bei 3% Inflation über 10 Jahre → Kaufkraft nur noch 744 €. Verlust: 256 €." },
      faq:[{question:"Was ist der reale Zinssatz?",answer:"Nominalzins minus Inflationsrate. Ein Sparkonto mit 1,5% Zins bei 2,5% Inflation ergibt einen realen Zinssatz von −1%."}],
      relatedIds:["zinsrechner","sparrechner"] },

    { id:"tilgungsrechner", title:"Tilgungsrechner", keyword:"Tilgungsrechner Immobilie", calcType:"tilgung", icon:"🏠",
      subtitle:"Erstellen Sie einen Tilgungsplan für Ihr Darlehen. Sehen Sie Zins- und Tilgungsanteile pro Jahr.",
      explanation:{ heading:"Tilgungsplan für Immobiliendarlehen", paragraphs:["Bei einem Annuitätendarlehen bleibt die jährliche Rate gleich (Zins + Tilgung). Mit jeder Zahlung sinkt die Restschuld, der Zinsanteil wird kleiner und der Tilgungsanteil größer.","Ein höherer anfänglicher Tilgungssatz verkürzt die Laufzeit erheblich und spart Zinsen."], highlight:"300.000 € Darlehen bei 3,5% Zins und 2% anfänglicher Tilgung → Monatsrate 1.375 €. Restschuld nach 10 Jahren: ca. 228.000 €." },
      faq:[{question:"Wie viel Tilgung sollte ich wählen?",answer:"Mindestens 2%, besser 3% oder mehr. Bei 1% Tilgung dauert die Rückzahlung über 40 Jahre. Bei 3% sind es nur noch ~23 Jahre."}],
      relatedIds:["kredit-rechner","zinsrechner"] },

    // ═══ PHYSIK ═══
    { id:"geschwindigkeit-rechner", title:"Geschwindigkeit Rechner", keyword:"Geschwindigkeit berechnen", calcType:"speed", icon:"🚗",
      subtitle:"Berechnen Sie Geschwindigkeit, Strecke oder Zeit aus den jeweils anderen beiden Größen.",
      explanation:{ heading:"Geschwindigkeit, Strecke, Zeit", paragraphs:["Die drei Größen hängen zusammen: v = s/t, s = v×t, t = s/v. Der Rechner löst nach jeder der drei Größen auf.","Geben Sie zwei bekannte Werte ein und der dritte wird berechnet."], highlight:"100 km in 1,5 Stunden → 66,67 km/h. 80 km/h für 2 Stunden → 160 km." },
      faq:[{question:"Wie rechne ich km/h in m/s um?",answer:"km/h ÷ 3,6 = m/s. Beispiel: 108 km/h ÷ 3,6 = 30 m/s."}],
      relatedIds:["kraft-rechner","dichte-rechner"] },

    { id:"kraft-rechner", title:"Kraft Rechner (Newton)", keyword:"Newton Kraft Rechner", calcType:"force", icon:"💪",
      subtitle:"Berechnen Sie die Kraft nach Newtons zweitem Gesetz: F = m × a.",
      explanation:{ heading:"Newtons zweites Gesetz", paragraphs:["F = m × a. Die Kraft (Newton, N) ist das Produkt aus Masse (kg) und Beschleunigung (m/s²).","Auf der Erde beträgt die Erdbeschleunigung g ≈ 9,81 m/s². Die Gewichtskraft eines 70-kg-Menschen ist also 70 × 9,81 = 686,7 N."], highlight:"Masse 10 kg × Beschleunigung 3 m/s² = 30 N." },
      faq:[{question:"Was ist 1 Newton?",answer:"1 N ist die Kraft, die benötigt wird, um 1 kg mit 1 m/s² zu beschleunigen. Etwa die Gewichtskraft einer Tafel Schokolade (100 g)."}],
      relatedIds:["geschwindigkeit-rechner","dichte-rechner"] },

    { id:"dichte-rechner", title:"Dichte Rechner", keyword:"Dichte berechnen", calcType:"density", icon:"🧪",
      subtitle:"Berechnen Sie die Dichte eines Stoffes: ρ = m/V (Masse geteilt durch Volumen).",
      explanation:{ heading:"Dichte berechnen", paragraphs:["Die Dichte ρ = Masse / Volumen. Sie ist eine Stoffeigenschaft: Eisen hat ~7.870 kg/m³, Wasser 1.000 kg/m³, Luft ~1,225 kg/m³.","Mit dem Rechner können Sie auch Masse oder Volumen bestimmen, wenn die anderen Größen bekannt sind."], highlight:"5 kg bei 0,002 m³ → Dichte = 2.500 kg/m³ (entspricht etwa Glas)." },
      faq:[{question:"Was ist die Dichte von Wasser?",answer:"Reines Wasser bei 4°C hat eine Dichte von genau 1.000 kg/m³ bzw. 1 g/cm³."}],
      relatedIds:["kraft-rechner","energie-rechner"] },

    { id:"ohm-rechner", title:"Ohmsches Gesetz Rechner", keyword:"Ohmsches Gesetz Rechner", calcType:"ohm", icon:"🔌",
      subtitle:"Berechnen Sie Spannung, Strom, Widerstand und Leistung nach dem Ohmschen Gesetz.",
      explanation:{ heading:"Ohmsches Gesetz: U = R × I", paragraphs:["U = R × I verbindet Spannung (Volt), Widerstand (Ohm) und Stromstärke (Ampere). Geben Sie zwei Werte ein, die restlichen werden berechnet.","Leistung: P = U × I = I² × R = U²/R. Der Rechner berechnet alle Größen automatisch."], highlight:"Spannung 12V, Widerstand 100Ω → Strom 0,12 A, Leistung 1,44 W." },
      faq:[{question:"Gilt das Ohmsche Gesetz immer?",answer:"Es gilt für ohmsche Widerstände (Metalle bei konstanter Temperatur). Halbleiter, Dioden und Glühlampen sind nicht-ohmsch."}],
      relatedIds:["energie-rechner","kraft-rechner"] },

    { id:"energie-rechner", title:"Energieumrechner", keyword:"Energie Einheiten umrechnen", calcType:"energy", icon:"⚡",
      subtitle:"Rechnen Sie Energie zwischen Joule, Kilojoule, Kalorien, Kilokalorien und Kilowattstunden um.",
      explanation:{ heading:"Energieeinheiten umrechnen", paragraphs:["Energie wird in verschiedenen Einheiten gemessen: Joule (J), Kilojoule (kJ), Kalorien (cal), Kilokalorien (kcal), Kilowattstunden (kWh).","1 kcal = 4.184 kJ = 4.184 J. 1 kWh = 3.600.000 J. Die Umrechnung zwischen diesen Einheiten ist häufig in Physik, Ernährung und Energie nötig."], highlight:"1.000 kcal = 4.184 kJ = 1,1622 kWh." },
      faq:[{question:"Was ist der Unterschied zwischen Kalorie und Kilokalorie?",answer:"1 Kilokalorie (kcal) = 1.000 Kalorien (cal). In der Alltagssprache werden 'Kalorien' oft für Kilokalorien verwendet."}],
      relatedIds:["dichte-rechner","ohm-rechner"] },

    // ═══ STATISTIKEN ═══
    { id:"mittelwert-rechner", title:"Mittelwert Rechner", keyword:"Mittelwert berechnen", calcType:"mean", icon:"📊",
      subtitle:"Berechnen Sie den arithmetischen Mittelwert (Durchschnitt) einer Zahlenreihe.",
      explanation:{ heading:"Arithmetischer Mittelwert", paragraphs:["Der Mittelwert ist die Summe aller Werte geteilt durch die Anzahl. Er ist das bekannteste Lagemaß in der Statistik.","Mittelwert = Σxᵢ / n. Er ist empfindlich gegenüber Ausreißern — ein einzelner extremer Wert kann den Mittelwert stark verschieben."], highlight:"Werte: 3, 7, 5, 9, 6 → Summe 30, Mittelwert = 6,0." },
      faq:[{question:"Wann ist der Median besser als der Mittelwert?",answer:"Bei schiefen Verteilungen oder Ausreißern. Beispiel: Gehälter — wenige Spitzenverdiener verzerren den Mittelwert nach oben."}],
      relatedIds:["median-rechner","standardabweichung-rechner"] },

    { id:"standardabweichung-rechner", title:"Standardabweichung Rechner", keyword:"Standardabweichung berechnen", calcType:"stddev", icon:"📈",
      subtitle:"Berechnen Sie Varianz und Standardabweichung (Stichprobe und Population) einer Zahlenreihe.",
      explanation:{ heading:"Standardabweichung und Varianz", paragraphs:["Die Standardabweichung misst die Streuung der Werte um den Mittelwert. Eine kleine Standardabweichung bedeutet, dass die Werte nahe am Mittelwert liegen.","Varianz = Σ(xᵢ − x̄)²/(n−1). Standardabweichung = √Varianz. Bei der Populationsvarianz wird durch n statt n−1 geteilt."], highlight:"Werte: 2, 4, 4, 4, 5, 5, 7, 9 → Mittelwert 5, Standardabweichung ≈ 2,14." },
      faq:[{question:"Warum wird durch n−1 statt n geteilt?",answer:"Bei Stichproben wird durch n−1 geteilt (Bessel-Korrektur), um die Populationsvarianz unverzerrt zu schätzen. Bei der gesamten Population wird durch n geteilt."}],
      relatedIds:["mittelwert-rechner","median-rechner"] },

    { id:"median-rechner", title:"Median Rechner", keyword:"Median berechnen", calcType:"median", icon:"📉",
      subtitle:"Berechnen Sie Median, Quartile (Q1, Q3) und Interquartilsabstand (IQR).",
      explanation:{ heading:"Median und Quartile", paragraphs:["Der Median ist der mittlere Wert einer sortierten Datenreihe. Bei gerader Anzahl ist er der Durchschnitt der beiden mittleren Werte.","Q1 (25. Perzentil) und Q3 (75. Perzentil) teilen die Daten in vier gleiche Teile. IQR = Q3 − Q1 misst die Streuung der mittleren 50%."], highlight:"Werte: 1, 3, 5, 7, 9 → Median = 5, Q1 = 2, Q3 = 8, IQR = 6." },
      faq:[{question:"Was zeigt der IQR an?",answer:"Der Interquartilsabstand (IQR) misst die Streuung der mittleren 50% der Daten. Er ist robust gegenüber Ausreißern."}],
      relatedIds:["mittelwert-rechner","perzentil-rechner"] },

    { id:"perzentil-rechner", title:"Perzentil Rechner", keyword:"Perzentil berechnen", calcType:"percentile", icon:"📋",
      subtitle:"Berechnen Sie den Wert an einem beliebigen Perzentil (z.B. 25., 50., 90.) einer Datenreihe.",
      explanation:{ heading:"Perzentile berechnen", paragraphs:["Das p-te Perzentil ist der Wert, unter dem p% der Daten liegen. Das 90. Perzentil bedeutet: 90% der Werte sind kleiner.","Perzentile werden in der Medizin (Wachstumskurven), Bildung (Testergebnisse) und Leistungsbenchmarks verwendet."], highlight:"Werte: 10, 20, 30, 40, 50. 25. Perzentil = 15, 75. Perzentil = 45." },
      faq:[{question:"Was ist der Unterschied zwischen Perzentil und Prozentrang?",answer:"Das Perzentil gibt den Wert an einer bestimmten Position an. Der Prozentrang gibt an, welcher Prozentsatz der Werte kleiner ist als ein bestimmter Wert."}],
      relatedIds:["median-rechner","mittelwert-rechner"] },

    { id:"wahrscheinlichkeit-rechner", title:"Wahrscheinlichkeitsrechner", keyword:"Wahrscheinlichkeit berechnen", calcType:"probability", icon:"🎲",
      subtitle:"Berechnen Sie die Wahrscheinlichkeit eines Ereignisses, die Odds und die Gegenwahrscheinlichkeit.",
      explanation:{ heading:"Wahrscheinlichkeitsrechnung", paragraphs:["P(A) = Günstige Ergebnisse / Mögliche Ergebnisse. Eine Wahrscheinlichkeit liegt immer zwischen 0 (unmöglich) und 1 (sicher).","Die Gegenwahrscheinlichkeit: P(nicht A) = 1 − P(A). Odds: Verhältnis von günstigen zu ungünstigen Ergebnissen."], highlight:"Würfel eine 6 werfen: P = 1/6 ≈ 16,67%. Odds: 1:5. Gegenwahrscheinlichkeit: 83,33%." },
      faq:[{question:"Was sind Odds?",answer:"Odds drücken das Verhältnis aus: Günstige : Ungünstige Ergebnisse. Bei P=1/6 sind die Odds 1:5 (1 günstig, 5 ungünstig)."}],
      relatedIds:["mittelwert-rechner","standardabweichung-rechner"] },

    // ═══ ALLTAG ═══
    { id:"altersrechner", title:"Altersrechner", keyword:"Alter berechnen", calcType:"age", icon:"🎂",
      subtitle:"Berechnen Sie Ihr genaues Alter in Jahren, Monaten, Tagen — plus Tage bis zum nächsten Geburtstag.",
      explanation:{ heading:"Genaues Alter berechnen", paragraphs:["Der Altersrechner berechnet Ihr exaktes Alter auf den Tag genau. Er berücksichtigt Schaltjahre und unterschiedliche Monatslängen.","Zusätzlich sehen Sie die Gesamtanzahl gelebter Tage und wie viele Tage bis zu Ihrem nächsten Geburtstag verbleiben."], highlight:"Geburtsdatum 15.03.1990 → Alter 35 Jahre, 11 Monate, 27 Tage. Nächster Geburtstag in 3 Tagen." },
      faq:[{question:"Wie berechne ich mein Alter in Tagen?",answer:"Der Rechner berechnet die exakte Differenz zwischen Geburtsdatum und heute in Tagen, inklusive Schaltjahre."}],
      relatedIds:["datumsrechner","rabattrechner"] },

    { id:"datumsrechner", title:"Datumsrechner", keyword:"Datum berechnen Tage", calcType:"dateCalc", icon:"📅",
      subtitle:"Berechnen Sie die Anzahl der Tage zwischen zwei Daten oder ein Datum in der Zukunft/Vergangenheit.",
      explanation:{ heading:"Tage zwischen Daten berechnen", paragraphs:["Geben Sie zwei Daten ein und der Rechner zeigt die Differenz in Tagen, Wochen, Monaten und Jahren.","Nützlich für Fristen, Kündigungsfristen, Countdown zu Events oder Berechnung von Lebensabschnitten."], highlight:"01.01.2026 bis 31.12.2026 = 364 Tage = 52 Wochen." },
      faq:[{question:"Wie zähle ich Werktage?",answer:"Werktage sind Montag bis Freitag. Bei 30 Kalendertagen sind es ca. 22 Werktage."}],
      relatedIds:["altersrechner","einheiten-rechner"] },

    { id:"einheiten-rechner", title:"Einheitenumrechner", keyword:"Einheiten umrechnen", calcType:"unit", icon:"🔄",
      subtitle:"Rechnen Sie Länge, Gewicht und Temperatur zwischen metrischen und imperialen Einheiten um.",
      explanation:{ heading:"Einheiten umrechnen", paragraphs:["Von Millimeter bis Meilen, von Gramm bis Pfund, von Celsius bis Fahrenheit — der Einheitenumrechner konvertiert die gängigsten Einheiten.","Deutschland verwendet das metrische System. Für internationale Kommunikation ist die Umrechnung ins imperiale System häufig nötig."], highlight:"1 Meile = 1,609 km. 1 Pfund = 0,454 kg. 100°F = 37,78°C." },
      faq:[{question:"Wie rechne ich Fahrenheit in Celsius um?",answer:"°C = (°F − 32) × 5/9. Beispiel: 72°F = (72−32) × 5/9 = 22,2°C."}],
      relatedIds:["energie-rechner","datumsrechner"] },

    { id:"rabattrechner", title:"Rabattrechner", keyword:"Rabatt berechnen", calcType:"discount", icon:"🏷️",
      subtitle:"Berechnen Sie den Endpreis nach Rabatt, die Ersparnis und den prozentualen Nachlass.",
      explanation:{ heading:"Rabatt berechnen", paragraphs:["Geben Sie den Originalpreis und den Rabattprozentsatz ein. Der Rechner zeigt den Endpreis und die Ersparnis.","Auch ideal für Vergleiche: Ist '30% Rabatt auf 80€' besser als '20€ Festrabatt'?"], highlight:"Originalpreis 120 €, 25% Rabatt → Ersparnis 30 €, Endpreis 90 €." },
      faq:[{question:"Wie berechne ich Rabatte auf bereits reduzierte Ware?",answer:"Bei Doppelrabatt (z.B. 20% + 10%): Nicht einfach addieren! 100€ × 0,80 × 0,90 = 72€ (nicht 70€)."}],
      relatedIds:["prozentrechner","trinkgeld-rechner"] },

    { id:"trinkgeld-rechner", title:"Trinkgeld Rechner", keyword:"Trinkgeld berechnen", calcType:"tip", icon:"💶",
      subtitle:"Berechnen Sie das Trinkgeld und den Gesamtbetrag pro Person für Restaurant-Rechnungen.",
      explanation:{ heading:"Trinkgeld berechnen", paragraphs:["In Deutschland sind 5–10% Trinkgeld üblich. In gehobeneren Restaurants oder bei exzellentem Service geben viele 10–15%.","Der Rechner teilt den Gesamtbetrag inklusive Trinkgeld gleichmäßig auf alle Personen auf."], highlight:"Rechnung 85 €, 10% Trinkgeld, 4 Personen → 8,50 € Trinkgeld, 23,38 € pro Person." },
      faq:[{question:"Wie viel Trinkgeld ist in Deutschland üblich?",answer:"5–10% der Rechnungssumme. Bei Lieferdiensten: 1–3 €. Bei Taxifahrten: 5–10%. Bei Friseur: 5–10%."}],
      relatedIds:["rabattrechner","prozentrechner"] },

    // ═══ KI-TOOLS ═══
    { id:"zeichenanzahl-rechner", title:"Zeichenanzahl Rechner", keyword:"Zeichenanzahl zählen", calcType:"charcount", icon:"🔤",
      subtitle:"Zählen Sie Zeichen (mit/ohne Leerzeichen), Wörter, Sätze und Absätze in Ihrem Text.",
      explanation:{ heading:"Zeichenanzahl zählen", paragraphs:["Ideal für Social-Media-Posts (Twitter/X: 280 Zeichen), Meta-Descriptions (155 Zeichen), SMS (160 Zeichen) und andere Textlimits.","Der Rechner unterscheidet zwischen Zeichen mit und ohne Leerzeichen — viele Plattformen zählen Leerzeichen mit."], highlight:"'Hallo Welt!' = 11 Zeichen (mit Leerzeichen), 10 Zeichen (ohne), 2 Wörter, 1 Satz." },
      faq:[{question:"Zählen Leerzeichen als Zeichen?",answer:"Ja, auf den meisten Plattformen (Twitter, Instagram). Unsere Anzeige zeigt beide Werte: mit und ohne Leerzeichen."}],
      relatedIds:["wortanzahl-rechner","textanalyse-rechner"] },

    { id:"wortanzahl-rechner", title:"Wortanzahl Rechner", keyword:"Wörter zählen online", calcType:"wordcount", icon:"📝",
      subtitle:"Zählen Sie Wörter und schätzen Sie Lese- und Sprechzeit für Ihren Text.",
      explanation:{ heading:"Wörter zählen", paragraphs:["Paste oder tippen Sie Ihren Text. Der Rechner zählt Wörter und berechnet die geschätzte Lesezeit (238 WPM) und Sprechzeit (150 WPM).","Ideal für Blogposts, Hausarbeiten, Reden und Präsentationen."], highlight:"500 Wörter ≈ 2 Min. Lesezeit, 3 Min. Sprechzeit." },
      faq:[{question:"Wie lang sollte ein Blogpost sein?",answer:"Für SEO: 1.500–2.500 Wörter. Für Social Media: 300–500 Wörter. Für Nachrichtenartikel: 500–1.000 Wörter."}],
      relatedIds:["zeichenanzahl-rechner","seitenanzahl-rechner"] },

    { id:"seitenanzahl-rechner", title:"Seitenanzahl Rechner", keyword:"Wörter in Seiten umrechnen", calcType:"pagecount", icon:"📄",
      subtitle:"Rechnen Sie Ihren Text in Seiten um. Standard: 250 Wörter pro Seite (12pt, doppelter Zeilenabstand).",
      explanation:{ heading:"Wörter zu Seiten", paragraphs:["Eine Standardseite hat ca. 250 Wörter (12pt Schrift, doppelter Zeilenabstand) oder 500 Wörter (einfacher Zeilenabstand).","Der Rechner hilft bei der Planung von Hausarbeiten, Berichten und Manuskripten."], highlight:"2.000 Wörter = 8 Seiten (doppelter ZA) oder 4 Seiten (einfacher ZA)." },
      faq:[{question:"Wie viele Wörter hat eine DIN-A4-Seite?",answer:"Ca. 250 Wörter (Standard: 12pt, doppelter Zeilenabstand) oder ca. 500 Wörter (einfacher Zeilenabstand)."}],
      relatedIds:["wortanzahl-rechner","token-rechner"] },

    { id:"token-rechner", title:"Token Rechner", keyword:"GPT Token Rechner", calcType:"token", icon:"🪙",
      subtitle:"Schätzen Sie die Anzahl der GPT-Tokens in Ihrem Text und die ungefähren API-Kosten.",
      explanation:{ heading:"Was sind Tokens?", paragraphs:["Tokens sind die Grundeinheiten, in denen KI-Modelle wie GPT Text verarbeiten. Ein Token entspricht ungefähr 3–4 Zeichen auf Deutsch.","Die API-Kosten basieren auf der Tokenanzahl. GPT-4o: ~$0,005/1K Tokens. GPT-4o-mini: ~$0,00015/1K Tokens."], highlight:"'Hallo, wie geht es dir?' ≈ 9 Tokens. 1.000 Wörter ≈ 1.000–1.300 Tokens." },
      faq:[{question:"Warum sind deutsche Texte token-intensiver?",answer:"Deutsche Wörter sind im Schnitt länger und zusammengesetzt (z.B. 'Geschwindigkeitsüberschreitung'). Dadurch brauchen sie mehr Tokens als englische Texte."}],
      relatedIds:["textanalyse-rechner","zeichenanzahl-rechner"] },

    { id:"textanalyse-rechner", title:"Textanalyse Rechner", keyword:"Text analysieren online", calcType:"textanalysis", icon:"🔍",
      subtitle:"Analysieren Sie Ihren Text: Wörter, Sätze, durchschnittliche Wort-/Satzlänge und Lesbarkeit.",
      explanation:{ heading:"Textanalyse und Lesbarkeit", paragraphs:["Die Textanalyse zeigt statistische Kennzahlen: Wörter, Sätze, durchschnittliche Wortlänge und Satzlänge.","Die Lesbarkeit wird anhand der Durchschnittswerte geschätzt: Kurze Wörter und Sätze = leicht lesbar, lange = schwer."], highlight:"Kurze Sätze (∅ 15 Wörter) + kurze Wörter (∅ 5 Buchstaben) = 'Leicht'. Längere Sätze (∅ 25+) = 'Schwer'." },
      faq:[{question:"Was ist eine gute Satzlänge?",answer:"Für allgemeine Texte: 15–20 Wörter pro Satz. Akademische Texte können länger sein. Online-Texte sollten kürzer sein (10–15 Wörter)."}],
      relatedIds:["zeichenanzahl-rechner","wortanzahl-rechner"] },
];

export function getDeCalculatorById(id: string): DeCalculator | undefined {
    return DE_CALCULATORS.find((c) => c.id === id);
}
