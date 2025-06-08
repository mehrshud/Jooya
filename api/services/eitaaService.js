// backend/services/eitaaService.js
const _ = require('lodash');

/**
 * MOCK: Simulates scraping Eitaa for posts.
 * In a real-world scenario, this function would use a library like Puppeteer or Playwright
 * to control a headless browser, navigate to Eitaa, perform a search,
 * and parse the HTML to extract channel posts.
 * This is a highly complex task that requires handling logins, CAPTCHAs, and proxy rotation.
 * For now, we return mock data.
 * @param {string} query - The search query.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of mock Eitaa message objects.
 */
const searchEitaa = async (query) => {
    console.log(`[Eitaa Service - MOCK] Simulating scrape for query: "${query}"`);
    // --- START MOCK DATA ---
    return new Promise(resolve => {
        setTimeout(() => {
            const mockResults = [
                {
                    id: `eitaa-${Date.now()}-1`,
                    chat: {
                        id: 'eitaa_channel_1',
                        title: `کانال خبری ${query}`,
                        username: `khabari_${_.snakeCase(query)}`,
                    },
                    text: `این یک پست آزمایشی از ایتا درباره "${query}" است. اخبار فوری و مهم را از اینجا دنبال کنید.`,
                    date: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
                    views: _.random(500, 5000),
                },
                {
                    id: `eitaa-${Date.now()}-2`,
                    chat: {
                        id: 'eitaa_channel_2',
                        title: 'تحلیل و بررسی ایتا',
                        username: 'tahlil_eitaa',
                    },
                    text: `تحلیل عمیق موضوعات مرتبط با ${query}. نظرات خود را با ما در میان بگذارید. #تحلیل #${query}`,
                    date: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
                    views: _.random(1000, 10000),
                }
            ];
            resolve(mockResults);
        }, _.random(500, 1500));
    });
    // --- END MOCK DATA ---
};

const transformEitaaMessage = (message) => {
    const { id, chat, text, date, views } = message;
    return {
        postId: id,
        platform: 'eitaa',
        content: text,
        author: {
            name: chat.title || 'کانال ایتا',
            username: chat.username || chat.id,
            avatar: `https://placehold.co/100x100/4099E1/FFFFFF?text=E`,
        },
        url: chat.username ? `https://eitaa.com/${chat.username}` : '',
        timestamp: new Date(date * 1000),
        metrics: {
            views: views || 0,
            likes: 0,
            comments: 0,
            shares: 0,
        },
        // AI analysis would be added later
    };
}


module.exports = {
    searchEitaa,
    transformEitaaMessage,
};