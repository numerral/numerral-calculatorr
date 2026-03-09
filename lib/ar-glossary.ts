// Arabic Glossary helper — /ar/mujam
import glossaryData from "@/data/ar-glossary.json";

export interface ArGlossaryTerm {
    term: string;
    slug: string;
    definition: string;
    importance?: string;
    category: string;
    formula?: string;
    related?: string[];
    relatedTerms?: string[];
}

export function getAllArGlossaryTerms(): ArGlossaryTerm[] {
    return glossaryData as ArGlossaryTerm[];
}

export function getArGlossaryTermBySlug(slug: string): ArGlossaryTerm | undefined {
    return (glossaryData as ArGlossaryTerm[]).find(t => t.slug === slug);
}
