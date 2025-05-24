import { validateIsbn } from './index';

describe('validateIsbn', () => {
    describe('valid ISBNs', () => {
        it('should accept valid 10-digit ISBN', () => {
            const result = validateIsbn('0123456789');
            expect(result.valid).toBe(true);
            expect(result.errors).toEqual([]);
        });

        it('should accept valid 13-digit ISBN', () => {
            const result = validateIsbn('9781234567890');
            expect(result.valid).toBe(true);
            expect(result.errors).toEqual([]);
        });

        it('should trim whitespace and validate', () => {
            const result = validateIsbn('  0123456789  ');
            expect(result.valid).toBe(true);
            expect(result.errors).toEqual([]);
        });
    });

    describe('invalid ISBNs', () => {
        it('should reject non-string input', () => {
            const result = validateIsbn(123 as any);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('ISBN must be a string');
        });

        it('should reject empty string', () => {
            const result = validateIsbn('');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Must be 10 or 13-digit');
        });

        it('should reject too short ISBN', () => {
            const result = validateIsbn('123456789');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Must be 10 or 13-digit');
        });

        it('should reject too long ISBN', () => {
            const result = validateIsbn('12345678901234');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Must be 10 or 13-digit');
        });

        it('should reject 11-digit ISBN', () => {
            const result = validateIsbn('12345678901');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Must be 10 or 13-digit');
        });

        it('should reject 12-digit ISBN', () => {
            const result = validateIsbn('123456789012');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Must be 10 or 13-digit');
        });

        it('should reject ISBN with non-numeric characters', () => {
            const result = validateIsbn('012345678X');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Must consist of only numbers');
        });

        it('should reject ISBN with letters', () => {
            const result = validateIsbn('abcdefghij');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Must consist of only numbers');
        });

        it('should reject ISBN with special characters', () => {
            const result = validateIsbn('0-12-345678-9');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Must consist of only numbers');
        });

        it('should reject ISBN with spaces in middle', () => {
            const result = validateIsbn('01234 56789');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Must consist of only numbers');
        });

        it('should return multiple errors for multiple issues', () => {
            const result = validateIsbn('abc');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Must be 10 or 13-digit');
            expect(result.errors).toContain('Must consist of only numbers');
            expect(result.errors).toHaveLength(2);
        });
    });

    describe('edge cases', () => {
        it('should handle null input', () => {
            const result = validateIsbn(null as any);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('ISBN must be a string');
        });

        it('should handle undefined input', () => {
            const result = validateIsbn(undefined as any);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('ISBN must be a string');
        });

        it('should handle whitespace-only string', () => {
            const result = validateIsbn('   ');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Must be 10 or 13-digit');
        });
    });
});