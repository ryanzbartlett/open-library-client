export function validateIsbn(isbn: string): { valid: boolean; errors: string[] } {
    if (typeof isbn !== 'string') {
        return { valid: false, errors: ['ISBN must be a string'] };
    }

    const trimmed = isbn.trim();
    const errors: string[] = [];

    if (trimmed.length !== 10 && trimmed.length !== 13) {
        errors.push('Must be 10 or 13-digit');
    }

    if (!/^\d+$/.test(trimmed)) {
        errors.push('Must consist of only numbers');
    }

    return { valid: errors.length === 0, errors };
}