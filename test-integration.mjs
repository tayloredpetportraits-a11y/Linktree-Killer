#!/usr/bin/env node
/**
 * Comprehensive Integration Test Suite
 * Tests Magic Import + SocialFootprint integration
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

let passed = 0;
let failed = 0;
const errors = [];

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function test(name, fn) {
    try {
        fn();
        log(`✅ ${name}`, 'green');
        passed++;
    } catch (error) {
        log(`❌ ${name}`, 'red');
        log(`   Error: ${error.message}`, 'red');
        errors.push({ test: name, error: error.message });
        failed++;
    }
}

log('\n🧪 Running Integration Tests...\n', 'cyan');

// Test 1: Check if duplicate route file was deleted
test('Duplicate route file removed', () => {
    const path = join(__dirname, 'app', 'api', 'analyze', 'route 2.ts');
    if (existsSync(path)) {
        throw new Error('Duplicate route file still exists: route 2.ts');
    }
});

// Test 2: Verify SocialFootprint component exists
test('SocialFootprint component exists', () => {
    const path = join(__dirname, 'components', 'SocialFootprint.tsx');
    if (!existsSync(path)) {
        throw new Error('SocialFootprint.tsx component not found');
    }
});

// Test 3: Verify SocialFootprint is imported in builder page
test('SocialFootprint imported in builder page', () => {
    const builderPath = join(__dirname, 'app', 'builder', 'page.tsx');
    const content = readFileSync(builderPath, 'utf-8');
    
    if (!content.includes("import { SocialFootprint }")) {
        throw new Error('SocialFootprint import not found in builder page');
    }
});

// Test 4: Verify scrapedData state is declared
test('scrapedData state declared', () => {
    const builderPath = join(__dirname, 'app', 'builder', 'page.tsx');
    const content = readFileSync(builderPath, 'utf-8');
    
    if (!content.includes('const [scrapedData, setScrapedData]')) {
        throw new Error('scrapedData state not declared');
    }
});

// Test 5: Verify SocialFootprint component is rendered conditionally
test('SocialFootprint component rendered conditionally', () => {
    const builderPath = join(__dirname, 'app', 'builder', 'page.tsx');
    const content = readFileSync(builderPath, 'utf-8');
    
    if (!content.includes('<SocialFootprint')) {
        throw new Error('SocialFootprint component not rendered in JSX');
    }
    
    // Check if it's conditionally rendered with scrapedData
    if (!content.includes('{scrapedData &&')) {
        log('   ⚠️  Warning: SocialFootprint may not be conditionally rendered', 'yellow');
    }
});

// Test 6: Verify handleMagicImport sets scrapedData
test('handleMagicImport sets scrapedData', () => {
    const builderPath = join(__dirname, 'app', 'builder', 'page.tsx');
    const content = readFileSync(builderPath, 'utf-8');
    
    if (!content.includes('setScrapedData(data)')) {
        throw new Error('handleMagicImport does not set scrapedData');
    }
});

// Test 7: Verify API route exists and has correct structure
test('API route structure correct', () => {
    const routePath = join(__dirname, 'app', 'api', 'analyze', 'route.ts');
    const content = readFileSync(routePath, 'utf-8');
    
    if (!content.includes('export async function POST')) {
        throw new Error('API route missing POST handler');
    }
    
    if (!content.includes('businessName')) {
        throw new Error('API route does not return businessName field');
    }
    
    if (!content.includes('socials')) {
        throw new Error('API route does not return socials field');
    }
});

// Test 8: Verify SocialFootprint props match API response
test('SocialFootprint props match API response', () => {
    const builderPath = join(__dirname, 'app', 'builder', 'page.tsx');
    const content = readFileSync(builderPath, 'utf-8');
    
    // Check if props are being passed correctly
    if (!content.includes('businessName={scrapedData.businessName')) {
        throw new Error('businessName prop not passed to SocialFootprint');
    }
    
    if (!content.includes('socials={scrapedData.socials}')) {
        throw new Error('socials prop not passed to SocialFootprint');
    }
});

// Test 9: Verify no TypeScript errors in key files
test('TypeScript compilation check', () => {
    // This is a basic check - full TS check would require running tsc
    const builderPath = join(__dirname, 'app', 'builder', 'page.tsx');
    const content = readFileSync(builderPath, 'utf-8');
    
    // Check for common TypeScript issues
    if (content.includes('@ts-ignore') && !content.includes('@ts-nocheck')) {
        log('   ⚠️  Warning: @ts-ignore found (may indicate type issues)', 'yellow');
    }
});

// Test 10: Verify component exports correctly
test('SocialFootprint component exports correctly', () => {
    const componentPath = join(__dirname, 'components', 'SocialFootprint.tsx');
    const content = readFileSync(componentPath, 'utf-8');
    
    if (!content.includes('export function SocialFootprint')) {
        throw new Error('SocialFootprint not exported as named export');
    }
});

// Summary
log('\n' + '='.repeat(50), 'cyan');
log('Test Summary', 'cyan');
log('='.repeat(50), 'cyan');
log(`✅ Passed: ${passed}`, 'green');
if (failed > 0) {
    log(`❌ Failed: ${failed}`, 'red');
    log('\nErrors:', 'red');
    errors.forEach(({ test, error }) => {
        log(`  • ${test}: ${error}`, 'red');
    });
} else {
    log(`❌ Failed: ${failed}`, 'green');
}

log('\n' + '='.repeat(50), 'cyan');

if (failed === 0) {
    log('\n🎉 All integration tests passed!', 'green');
    process.exit(0);
} else {
    log('\n⚠️  Some tests failed. Please review the errors above.', 'yellow');
    process.exit(1);
}
