// Numerral — EEAT Author/Contributor Data
// Central data for all team members and category→author mappings

export type AuthorRole = "Writer" | "Reviewer" | "Fact Checker" | "Editor";

export interface Author {
    slug: string;
    name: string;
    role: AuthorRole;
    title: string;
    education: string[];
    expertise: string[];
    location: string;
    bio: string[];
    summary: string[];
    linkedin: string;
    image: string;
    joinedDate: string;
    companyInfo?: { name: string; url?: string };
}

// ─── Team Members ───────────────────────────────────────────

export const AUTHORS: Author[] = [
    {
        slug: "priya-sharma",
        name: "Priya Sharma",
        role: "Writer",
        title: "Senior Financial Content Specialist",
        education: [
            "M.A. Economics, Delhi School of Economics",
            "B.Com (Hons), Shri Ram College of Commerce",
        ],
        expertise: [
            "Personal Finance",
            "Loan Products",
            "Investment Analysis",
            "Tax Planning",
            "Financial Literacy",
            "Retirement Planning",
        ],
        location: "New Delhi, India",
        bio: [
            "Priya Sharma is a Senior Financial Content Specialist at Numerral, where she leads the creation of calculator explanations, financial guides, and educational content across all categories. With over 8 years of experience in financial journalism and content strategy, Priya specializes in translating complex financial concepts into clear, actionable information for everyday users.",
            "Before joining Numerral, Priya worked as a financial writer at a leading Indian personal finance publication, where she covered loan products, mutual funds, tax planning strategies, and banking regulations. She has a deep understanding of Indian financial products and regulations, from RBI lending guidelines to SEBI mutual fund categorization frameworks.",
            "Priya holds a Master's degree in Economics from the Delhi School of Economics and a Bachelor of Commerce (Honours) from Shri Ram College of Commerce. She is passionate about improving financial literacy in India and believes that accurate, well-explained calculator tools are one of the most effective ways to empower people to make better financial decisions.",
        ],
        summary: [
            "Senior financial content specialist at Numerral with 8+ years of experience in financial journalism",
            "Covers all calculator categories: loans, investments, tax, salary, health, EV, construction, and math",
            "Former financial writer at a leading Indian personal finance publication covering mutual funds, banking, and tax planning",
            "M.A. Economics from Delhi School of Economics; B.Com (Hons) from SRCC",
            "Specializes in making complex financial concepts accessible to a general audience",
        ],
        linkedin: "https://www.linkedin.com/",
        image: "/images/authors/priya-sharma.png",
        joinedDate: "2023-06-15",
    },
    {
        slug: "arjun-mehta",
        name: "Arjun Mehta",
        role: "Reviewer",
        title: "Financial Review Board Member",
        education: [
            "MBA Finance, Indian Institute of Management Ahmedabad",
            "CFA Charterholder",
            "B.Tech, IIT Bombay",
        ],
        expertise: [
            "Investment Management",
            "Corporate Finance",
            "Risk Assessment",
            "Portfolio Analysis",
            "Financial Modelling",
            "Regulatory Compliance",
        ],
        location: "Mumbai, India",
        bio: [
            "Arjun Mehta is a member of Numerral's Financial Review Board, responsible for reviewing and validating the accuracy of all financial calculators, formulas, and educational content published on the platform. With 12 years of experience in investment management and financial advisory, Arjun ensures that every calculator uses correct formulas and that all financial explanations are technically accurate.",
            "Arjun is a CFA Charterholder and holds an MBA in Finance from IIM Ahmedabad. He previously worked as a Vice President at a leading asset management company in Mumbai, where he managed equity portfolios and conducted fundamental research across sectors. His experience spans mutual fund analysis, fixed income valuation, derivatives pricing, and comprehensive financial planning.",
            "As a reviewer at Numerral, Arjun applies the same rigorous analytical standards to every calculator and piece of content. He cross-validates formulas against authoritative financial textbooks, RBI circulars, SEBI regulations, and Income Tax Act provisions to ensure complete accuracy. His review covers both the mathematical logic of calculators and the factual correctness of all explanatory content.",
        ],
        summary: [
            "Member of Numerral's Financial Review Board — reviews all calculators and content for technical accuracy",
            "CFA Charterholder with 12+ years of experience in investment management and financial advisory",
            "MBA Finance from IIM Ahmedabad; B.Tech from IIT Bombay",
            "Former Vice President at a leading Mumbai-based asset management company",
            "Cross-validates all formulas against RBI circulars, SEBI regulations, and authoritative financial references",
        ],
        linkedin: "https://www.linkedin.com/",
        image: "/images/authors/arjun-mehta.png",
        joinedDate: "2023-08-01",
        companyInfo: {
            name: "Numerral Financial Review Board",
            url: "/editorial-policy",
        },
    },
    {
        slug: "neha-kapoor",
        name: "Neha Kapoor",
        role: "Fact Checker",
        title: "Senior Fact Checker & Quality Analyst",
        education: [
            "Chartered Accountant (CA), ICAI",
            "B.Com, Narsee Monjee College of Commerce",
        ],
        expertise: [
            "Tax Compliance",
            "Audit & Assurance",
            "Financial Reporting",
            "Data Verification",
            "Regulatory Research",
            "Numerical Accuracy",
        ],
        location: "Bangalore, India",
        bio: [
            "Neha Kapoor is the Senior Fact Checker and Quality Analyst at Numerral, where she is responsible for verifying every data point, formula, tax rate, regulatory reference, and numerical example published on the platform. Her work ensures that users can trust the accuracy of Numerral's calculators for real-world financial decisions.",
            "Neha is a qualified Chartered Accountant from the Institute of Chartered Accountants of India (ICAI). Before joining Numerral, she spent 6 years in audit and assurance at a Big Four accounting firm, where she developed expertise in financial data verification, regulatory compliance, and systematic quality control processes. Her audit background gives her a methodical approach to fact-checking that goes beyond surface-level review.",
            "At Numerral, Neha's fact-checking process involves cross-referencing every tax slab, interest rate, government scheme detail, and financial regulation cited in calculator content against primary sources — including the Income Tax Act, RBI Master Circulars, SEBI notifications, Ministry of Finance announcements, and official gazette publications. She also stress-tests calculator outputs against known benchmark values to verify mathematical accuracy.",
        ],
        summary: [
            "Senior fact checker at Numerral — verifies every formula, data point, and regulatory reference for accuracy",
            "Qualified Chartered Accountant (ICAI) with 6+ years of audit experience at a Big Four firm",
            "Cross-references all content against primary sources: Income Tax Act, RBI circulars, SEBI notifications",
            "Stress-tests calculator outputs against known benchmarks to verify mathematical correctness",
            "B.Com from Narsee Monjee College of Commerce, Mumbai",
        ],
        linkedin: "https://www.linkedin.com/",
        image: "/images/authors/neha-kapoor.png",
        joinedDate: "2024-01-10",
    },
];

// ─── Category → Author Mapping ──────────────────────────────

export interface CategoryAuthors {
    writer: string;   // author slug
    reviewer: string;  // author slug
    factChecker: string; // author slug
}

/**
 * Maps each calculator category to its assigned writer, reviewer, and fact checker.
 * All categories follow the same 3-tier editorial process.
 */
export const CALC_AUTHOR_MAP: Record<string, CategoryAuthors> = {
    loan: { writer: "priya-sharma", reviewer: "arjun-mehta", factChecker: "neha-kapoor" },
    invest: { writer: "priya-sharma", reviewer: "arjun-mehta", factChecker: "neha-kapoor" },
    tax: { writer: "priya-sharma", reviewer: "arjun-mehta", factChecker: "neha-kapoor" },
    salary: { writer: "priya-sharma", reviewer: "arjun-mehta", factChecker: "neha-kapoor" },
    utility: { writer: "priya-sharma", reviewer: "arjun-mehta", factChecker: "neha-kapoor" },
    business: { writer: "priya-sharma", reviewer: "arjun-mehta", factChecker: "neha-kapoor" },
    construction: { writer: "priya-sharma", reviewer: "arjun-mehta", factChecker: "neha-kapoor" },
    ev: { writer: "priya-sharma", reviewer: "arjun-mehta", factChecker: "neha-kapoor" },
    health: { writer: "priya-sharma", reviewer: "arjun-mehta", factChecker: "neha-kapoor" },
    math: { writer: "priya-sharma", reviewer: "arjun-mehta", factChecker: "neha-kapoor" },
    time: { writer: "priya-sharma", reviewer: "arjun-mehta", factChecker: "neha-kapoor" },
    pet: { writer: "priya-sharma", reviewer: "arjun-mehta", factChecker: "neha-kapoor" },
    engine: { writer: "priya-sharma", reviewer: "arjun-mehta", factChecker: "neha-kapoor" },
    fuel: { writer: "priya-sharma", reviewer: "arjun-mehta", factChecker: "neha-kapoor" },
    wheels: { writer: "priya-sharma", reviewer: "arjun-mehta", factChecker: "neha-kapoor" },
    convert: { writer: "priya-sharma", reviewer: "arjun-mehta", factChecker: "neha-kapoor" },
};

// ─── Helper Functions ───────────────────────────────────────

export function getAuthorBySlug(slug: string): Author | undefined {
    return AUTHORS.find((a) => a.slug === slug);
}

export function getAllAuthors(): Author[] {
    return AUTHORS;
}

export function getAuthorsByRole(role: AuthorRole): Author[] {
    return AUTHORS.filter((a) => a.role === role);
}

export function getCategoryAuthors(categoryKey: string): {
    writer: Author | undefined;
    reviewer: Author | undefined;
    factChecker: Author | undefined;
} {
    const mapping = CALC_AUTHOR_MAP[categoryKey];
    if (!mapping) return { writer: undefined, reviewer: undefined, factChecker: undefined };
    return {
        writer: getAuthorBySlug(mapping.writer),
        reviewer: getAuthorBySlug(mapping.reviewer),
        factChecker: getAuthorBySlug(mapping.factChecker),
    };
}
