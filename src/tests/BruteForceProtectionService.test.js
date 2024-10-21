// src/services/BruteForceProtectionService.test.js

const BruteForceProtectionService = require('../services/BruteForceProtectionService');
const CommonServiceIntegration = require('../services/CommonServiceIntegration');

// Mock dependencies
jest.mock('../utils/CommonServiceIntegration');

describe('BruteForceProtectionService', () => {
    const userId = 'user123';

    beforeEach(() => {
        jest.clearAllMocks(); // Clear all mocks before each test
    });

    test('should allow login on first attempt', async () => {
        const result = await BruteForceProtectionService.loginAttempt(userId, false);
        expect(result.allowed).toBe(true); // Expect login attempt to be allowed
        expect(CommonServiceIntegration.logInfo).toHaveBeenCalledWith('Login attempt allowed for user: user123');
    });

    test('should prevent login after too many failed attempts', async () => {
        // Simulate 5 consecutive failed login attempts
        for (let i = 0; i < 5; i++) {
            await BruteForceProtectionService.loginAttempt(userId, true);
        }

        const result = await BruteForceProtectionService.loginAttempt(userId, true);
        expect(result.allowed).toBe(false); // Expect login attempt to be blocked
        expect(result.locked).toBe(true); // Expect account to be locked
        expect(CommonServiceIntegration.logInfo).toHaveBeenCalledWith('Account locked for user: user123 due to too many failed attempts');
    });

    test('should reset failed attempts after a successful login', async () => {
        // Simulate 3 failed login attempts
        for (let i = 0; i < 3; i++) {
            await BruteForceProtectionService.loginAttempt(userId, true);
        }

        // Simulate a successful login
        await BruteForceProtectionService.loginAttempt(userId, false);

        const result = await BruteForceProtectionService.loginAttempt(userId, true);
        expect(result.allowed).toBe(true); // Expect login attempt to be allowed
        expect(CommonServiceIntegration.logInfo).toHaveBeenCalledWith('Login attempt allowed for user: user123');
    });

    test('should handle errors and log them', async () => {
        // Simulate an error scenario
        const error = new Error('Database error');
        BruteForceProtectionService._trackFailedAttempts = jest.fn().mockRejectedValue(error);

        await expect(BruteForceProtectionService.loginAttempt(userId, true)).rejects.toThrow('Database error');
        expect(CommonServiceIntegration.logError).toHaveBeenCalledWith('BruteForceProtectionService.loginAttempt', error);
    });

    test('should enforce rate limiting', async () => {
        const result = await BruteForceProtectionService.loginAttempt(userId, true);
        expect(result.rateLimited).toBe(false); // No rate limit on the first attempt

        // Simulate 5 failed login attempts within a short time window
        for (let i = 0; i < 5; i++) {
            await BruteForceProtectionService.loginAttempt(userId, true);
        }

        const limitedResult = await BruteForceProtectionService.loginAttempt(userId, true);
        expect(limitedResult.rateLimited).toBe(true); // Expect rate limiting to be enforced
        expect(CommonServiceIntegration.logInfo).toHaveBeenCalledWith('Rate limit reached for user: user123');
    });
});
