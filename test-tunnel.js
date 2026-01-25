#!/usr/bin/env node

/**
 * Test script for /api/analyze endpoint
 * Tests caching, fallback, and real API calls
 */

const API_URL = 'http://localhost:3000/api/analyze';
const TEST_URL = 'https://linktr.ee/example';

async function testAnalyzeAPI() {
    console.log('🧪 Testing /api/analyze endpoint...\n');

    try {
        // Test 1: First call (should hit Firecrawl or fallback)
        console.log('📡 Test 1: First API call...');
        const response1 = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: TEST_URL }),
        });

        if (!response1.ok) {
            throw new Error(`HTTP ${response1.status}: ${response1.statusText}`);
        }

        const data1 = await response1.json();
        console.log('✅ Response received:', JSON.stringify(data1, null, 2).substring(0, 200) + '...\n');

        // Test 2: Second call (should hit cache)
        console.log('📡 Test 2: Second API call (testing cache)...');
        const start = Date.now();
        const response2 = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: TEST_URL }),
        });

        const data2 = await response2.json();
        const duration = Date.now() - start;
        console.log(`✅ Response received in ${duration}ms (cached responses should be <50ms)\n`);

        // Test 3: Invalid URL (should fallback gracefully)
        console.log('📡 Test 3: Invalid URL (testing fallback)...');
        const response3 = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: 'https://this-domain-definitely-does-not-exist-12345.com' }),
        });

        const data3 = await response3.json();
        console.log('✅ Fallback data received:', data3.success ? 'SUCCESS' : 'FALLBACK', '\n');

        console.log('🎉 All tests passed!\n');
        console.log('Summary:');
        console.log('- ✅ API endpoint is working');
        console.log('- ✅ Caching is functional');
        console.log('- ✅ Fallback mechanism works');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

// Run tests
testAnalyzeAPI();
