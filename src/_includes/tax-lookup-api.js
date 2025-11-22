/**
 * GST Tax Lookup API Module
 * Revealing Module Pattern for FastGST API integration
 */

const TaxLookupAPI = (function() {
    // API Configuration
    const API_BASE_URL = 'https://api.taxlookup.fastgst.in';

    // Default headers for all requests
    // Headers are now generated dynamically per request


    /**
     * Helper function to make API requests
     * @param {string} url - The API endpoint URL
     * @param {object} options - Additional fetch options
     * @returns {Promise} - Promise resolving to JSON response
     */
    async function makeRequest(url, options = {}) {
        const requestOptions = {
            method: 'GET',
            headers: {
                'X-API-Key': RPAK.generate(60, JSON.stringify({})),
                'ext-headers': '--extscr=true',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            ...options
        };

        try {
            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error response:', errorText);
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    }

    /**
     * Search HSN/SAC codes by keywords
     * @param {string} query - Search term (product name, HSN code, etc.)
     * @returns {Promise} - Promise resolving to search results
     */
    async function searchByKeywords(query) {
        if (!query || query.trim().length === 0) {
            throw new Error('Search query cannot be empty');
        }

        const url = `${API_BASE_URL}/search/hsn?query=${encodeURIComponent(query.trim())}`;
        return await makeRequest(url);
    }

    /**
     * Get hierarchy details for a specific HSN code
     * @param {string} hsnCode - The HSN code to get hierarchy for
     * @returns {Promise} - Promise resolving to hierarchy data
     */
    async function getHierarchy(hsnCode) {
        if (!hsnCode || hsnCode.trim().length === 0) {
            throw new Error('HSN code cannot be empty');
        }

        // Validate HSN code format (basic validation)
        if (!/^\d{4,8}$/.test(hsnCode.trim())) {
            throw new Error('Invalid HSN code format. Must be 4-8 digits.');
        }

        const url = `${API_BASE_URL}/search/hsn/${hsnCode.trim()}`;
        return await makeRequest(url);
    }

    /**
     * Get tax information for a specific HSN code
     * @param {string} hsnCode - The HSN code to get tax information for
     * @returns {Promise} - Promise resolving to tax data
     */
    async function getTaxInfo(hsnCode) {
        if (!hsnCode || hsnCode.trim().length === 0) {
            throw new Error('HSN code cannot be empty');
        }

        // Validate HSN code format (basic validation)
        if (!/^\d{4,8}$/.test(hsnCode.trim())) {
            throw new Error('Invalid HSN code format. Must be 4-8 digits.');
        }

        const url = `${API_BASE_URL}/search/hsn/${hsnCode.trim()}/taxes`;
        return await makeRequest(url);
    }

    /**
     * Combined function to get both hierarchy and tax info for an HSN code
     * @param {string} hsnCode - The HSN code
     * @returns {Promise} - Promise resolving to combined data
     */
    async function getCompleteHSNInfo(hsnCode) {
        try {
            const [hierarchyData, taxData] = await Promise.all([
                getHierarchy(hsnCode),
                getTaxInfo(hsnCode)
            ]);

            return {
                success: true,
                hierarchy: hierarchyData.data,
                taxInfo: taxData.data,
                meta: {
                    ...hierarchyData.meta,
                    tax_request_id: taxData.meta.request_id
                }
            };
        } catch (error) {
            throw new Error(`Failed to get complete HSN info: ${error.message}`);
        }
    }

    /**
     * Utility function to format GST rates for display
     * @param {number} rate - GST rate
     * @returns {string} - Formatted rate string
     */
    function formatGSTRate(rate) {
        return `${rate}%`;
    }

    /**
     * Utility function to format currency values
     * @param {string|number} value - Value to format
     * @returns {string} - Formatted currency string
     */
    function formatCurrency(value) {
        if (typeof value === 'string' && value.toLowerCase().includes('no')) {
            return value;
        }
        return `₹${value}`;
    }

    // Public API - Revealing Module Pattern
    return {
        // Core API functions
        searchByKeywords,
        getHierarchy,
        getTaxInfo,
        getCompleteHSNInfo,

        // Utility functions
        formatGSTRate,
        formatCurrency,

        // Constants (read-only)
        get API_BASE_URL() { return API_BASE_URL; }
    };
})();

// Test function to verify API connectivity
async function testAPIConnection() {
    try {
        console.log('Testing API connection...');
        const result = await TaxLookupAPI.searchByKeywords('milk');
        console.log('API Test Successful:', result);
        return result;
    } catch (error) {
        console.error('API Test Failed:', error);
        return null;
    }
}

// Make it available globally for the playground
window.TaxLookupAPI = TaxLookupAPI;
window.testAPIConnection = testAPIConnection;
