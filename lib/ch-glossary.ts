// Swiss Glossary helper — /ch/glossar
import glossaryData from "@/data/ch-glossary.json";

export interface ChGlossaryTerm {
    term: string;
    slug: string;
    definition: string;
    category: string;
    formula?: string;
    related?: string[];
}

export function getAllChGlossaryTerms(): ChGlossaryTerm[] {
    return glossaryData as ChGlossaryTerm[];
}

export function getChGlossaryTermBySlug(slug: string): ChGlossaryTerm | undefined {
    return (glossaryData as ChGlossaryTerm[]).find(t => t.slug === slug);
}
