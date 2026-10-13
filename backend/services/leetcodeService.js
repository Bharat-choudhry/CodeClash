const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const BASE = 'https://alfa-leetcode-api.onrender.com';

// Only DSA core topics
const DSA_TAGS = [
    'array', 'linked-list', 'stack', 'queue', 'hash-table',
    'binary-search', 'sorting', 'two-pointers', 'sliding-window',
    'tree', 'binary-tree', 'binary-search-tree', 'graph',
    'depth-first-search', 'breadth-first-search',
    'dynamic-programming', 'recursion', 'divide-and-conquer',
    'heap-priority-queue', 'matrix', 'string', 'bit-manipulation'
];

async function fetchLeetCodeQuestion() {
    try {
        // Pick a random DSA tag each battle for variety
        const tag = DSA_TAGS[Math.floor(Math.random() * DSA_TAGS.length)];

        // Step 1: Get list of non-paid Easy/Medium DSA problems by tag
        const listRes = await fetch(`${BASE}/problems?tags=${tag}&difficulty=EASY&limit=50`);
        const listData = await listRes.json();

        const freeProbems = listData.problemsetQuestionList.filter(p => !p.isPaidOnly);
        if (!freeProbems.length) throw new Error('No free problems found');

        // Step 2: Pick a random one
        const random = freeProbems[Math.floor(Math.random() * freeProbems.length)];

        // Step 3: Fetch full problem details
        const detailRes = await fetch(`${BASE}/select?titleSlug=${random.titleSlug}`);
        const detail = await detailRes.json();

        // Step 4: Extract test cases from exampleTestcases string
        const rawCases = (detail.exampleTestcases || '').trim().split('\n');
        const testCases = [];
        for (let i = 0; i + 1 < rawCases.length; i += 2) {
            testCases.push({ input: rawCases[i], output: rawCases[i + 1] });
        }

        return {
            title: detail.questionTitle || random.title,
            difficulty: detail.difficulty || random.difficulty,
            description: detail.question || 'See problem on LeetCode.',
            testCases,
            titleSlug: random.titleSlug,
        };
    } catch (err) {
        console.error('LeetCode API Error:', err.message);
        return null;
    }
}

module.exports = { fetchLeetCodeQuestion };
