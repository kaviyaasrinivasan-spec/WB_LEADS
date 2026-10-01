/**
 * Data Completion Score Configuration
 * Calculates account data completion percentage based on filled fields
 */

import { AccountFull } from '@/types';

// Details field weights (50 points total)
export const DETAILS_WEIGHTS: Record<string, number> = {
    account_name: 8,
    industry: 6,
    country: 5,
    head_office: 4,
    primary_lob: 5,
    company_website: 4,
    company_phone: 4,
    employee_count: 3,
    contact_email: 4,
    lead_source: 3,
    remarks: 2,
    total_revenue: 2,
};

// Category max scores
export const CATEGORY_MAX = {
    details: 50,
    contacts: 25,
    lob: 15,
    departments: 10,
};

export const TOTAL_MAX_SCORE = 100;

interface ScoreBreakdown {
    details: { score: number; max: number; filledFields: string[]; missingFields: { field: string; score: number }[] };
    contacts: { score: number; max: number; conditions: { condition: string; met: boolean; score: number }[] };
    lob: { score: number; max: number; conditions: { condition: string; met: boolean; score: number }[] };
    departments: { score: number; max: number; conditions: { condition: string; met: boolean; score: number }[] };
    total: number;
}

/**
 * Check if a field has a non-empty value
 */
function hasValue(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return value > 0;
    return Boolean(value);
}

/**
 * Calculate details section score
 */
function calculateDetailsScore(account: Partial<AccountFull>): { score: number; filledFields: string[]; missingFields: { field: string; score: number }[] } {
    let score = 0;
    const filledFields: string[] = [];
    const missingFields: { field: string; score: number }[] = [];

    for (const [field, weight] of Object.entries(DETAILS_WEIGHTS)) {
        const value = (account as any)[field];
        if (hasValue(value)) {
            score += weight;
            filledFields.push(field);
        } else {
            missingFields.push({ field, score: weight });
        }
    }

    return { score, filledFields, missingFields };
}

/**
 * Calculate contacts section score (25 points max)
 */
function calculateContactsScore(account: Partial<AccountFull>): { score: number; conditions: { condition: string; met: boolean; score: number }[] } {
    const contacts = account.contacts || [];
    const conditions: { condition: string; met: boolean; score: number }[] = [];
    let score = 0;

    // Has at least 1 contact (10 points)
    const hasOneContact = contacts.length >= 1;
    conditions.push({ condition: 'Has at least 1 contact', met: hasOneContact, score: 10 });
    if (hasOneContact) score += 10;

    // Has 2+ contacts (8 points)
    const hasTwoContacts = contacts.length >= 2;
    conditions.push({ condition: 'Has 2+ contacts', met: hasTwoContacts, score: 8 });
    if (hasTwoContacts) score += 8;

    // Primary contact has phone (4 points)
    const hasPhone = hasValue(account.contact_phone) || contacts.some(c => hasValue(c.phone));
    conditions.push({ condition: 'Contact has phone', met: hasPhone, score: 4 });
    if (hasPhone) score += 4;

    // Primary contact has email (3 points)
    const hasEmail = hasValue(account.contact_email) || contacts.some(c => hasValue(c.email));
    conditions.push({ condition: 'Contact has email', met: hasEmail, score: 3 });
    if (hasEmail) score += 3;

    return { score, conditions };
}

/**
 * Calculate LOB section score (15 points max)
 */
function calculateLOBScore(account: Partial<AccountFull>): { score: number; conditions: { condition: string; met: boolean; score: number }[] } {
    const lobs = account.lineOfBusiness || [];
    const conditions: { condition: string; met: boolean; score: number }[] = [];
    let score = 0;

    // Has at least 1 LOB (10 points)
    const hasOneLOB = lobs.length >= 1;
    conditions.push({ condition: 'Has at least 1 Line of Business', met: hasOneLOB, score: 10 });
    if (hasOneLOB) score += 10;

    // Has 2+ LOBs (5 points)
    const hasTwoLOBs = lobs.length >= 2;
    conditions.push({ condition: 'Has 2+ Lines of Business', met: hasTwoLOBs, score: 5 });
    if (hasTwoLOBs) score += 5;

    return { score, conditions };
}

/**
 * Calculate departments section score (10 points max)
 */
function calculateDepartmentsScore(account: Partial<AccountFull>): { score: number; conditions: { condition: string; met: boolean; score: number }[] } {
    const departments = account.departments || [];
    const painPoints = account.painPoints || [];
    const useCases = account.useCases || [];
    const conditions: { condition: string; met: boolean; score: number }[] = [];
    let score = 0;

    // Has at least 1 department (5 points)
    const hasDept = departments.length >= 1;
    conditions.push({ condition: 'Has at least 1 department', met: hasDept, score: 5 });
    if (hasDept) score += 5;

    // Has at least 1 pain point (3 points)
    const hasPainPoint = painPoints.length >= 1;
    conditions.push({ condition: 'Has at least 1 pain point', met: hasPainPoint, score: 3 });
    if (hasPainPoint) score += 3;

    // Has at least 1 use case (2 points)
    const hasUseCase = useCases.length >= 1;
    conditions.push({ condition: 'Has at least 1 use case', met: hasUseCase, score: 2 });
    if (hasUseCase) score += 2;

    return { score, conditions };
}

/**
 * Calculate total data completion score
 * Returns a percentage (0-100)
 */
export function calculateDataCompletionScore(account: Partial<AccountFull>): number {
    const details = calculateDetailsScore(account);
    const contacts = calculateContactsScore(account);
    const lob = calculateLOBScore(account);
    const departments = calculateDepartmentsScore(account);

    const total = details.score + contacts.score + lob.score + departments.score;
    return Math.min(100, Math.round(total));
}

/**
 * Get detailed score breakdown for UI display
 */
export function getScoreBreakdown(account: Partial<AccountFull>): ScoreBreakdown {
    const details = calculateDetailsScore(account);
    const contacts = calculateContactsScore(account);
    const lob = calculateLOBScore(account);
    const departments = calculateDepartmentsScore(account);

    const total = details.score + contacts.score + lob.score + departments.score;

    return {
        details: {
            score: details.score,
            max: CATEGORY_MAX.details,
            filledFields: details.filledFields,
            missingFields: details.missingFields,
        },
        contacts: {
            score: contacts.score,
            max: CATEGORY_MAX.contacts,
            conditions: contacts.conditions,
        },
        lob: {
            score: lob.score,
            max: CATEGORY_MAX.lob,
            conditions: lob.conditions,
        },
        departments: {
            score: departments.score,
            max: CATEGORY_MAX.departments,
            conditions: departments.conditions,
        },
        total: Math.min(100, Math.round(total)),
    };
}

/**
 * Format field name for display
 */
export function formatFieldName(field: string): string {
    return field
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}
