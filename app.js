// =========================================================================
// 🚀 DYNAMIC CMS MASTER CONFIGURATION MODULE
// Instruct your buyer to change these 3 parameters to sync their database.
// =========================================================================
const CONFIG = {
    BASE_ID: 'app2dNCzkf61VdNKa.',
    TABLE_NAME: 'Resources',
    // ⚠️ CRITICAL NOTICE TO BUYER: Use an Airtable Personal Access Token (PAT) 
    // with strictly scoped *Read-Only* (data.records:read) access for security.
    TOKEN: 'patniE8a38x2LJxDp.1b7f34b848c3402848c4f17eee3e30cfde6972d1a23a402ed84d39e56e39b104'
};

// Construct the secure, filtered REST API gateway endpoint
const URL_ENDPOINT = `https://api.airtable.com/v0/${CONFIG.BASE_ID}/${encodeURIComponent(CONFIG.TABLE_NAME)}?filterByFormula=Status%3D%27Published%27`;

/**
 * Executes a real-time data fetch from the configured Airtable database architecture,
 * processes the returned record payloads, and renders optimized responsive cards.
 */
async function fetchResources() {
    const container = document.getElementById('resource-container');
    
    // Safety check: Exit gracefully if the mounting point does not exist in the HTML DOM
    if (!container) {
        console.warn("Application Initialization Warning: Mount target element '#resource-container' was not found in the DOM.");
        return;
    }
    
    try {
        const response = await fetch(URL_ENDPOINT, {
            headers: {
                'Authorization': `Bearer ${CONFIG.TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Airtable Sync Protocol Exception. Status Code: ${response.status}`);
        }

        const data = await response.json();
        
        // Purge the initial fallback loading state
        container.innerHTML = '';

        // Handle empty database returns cleanly
        if (!data.records || data.records.length === 0) {
            container.innerHTML = `<p class="loading">No live assets found. Set item status to 'Published' inside Airtable to display.</p>`;
            return;
        }

        // Loop over the published data records and systematically render the layout card UI
        data.records.forEach(record => {
            const fields = record.fields;
            
            // Safe extraction fallbacks to maintain visual structural integrity if data fields are left blank
            const name = fields['Resource Name'] || 'Untitled Resource Asset';
            const category = fields['Category'] || 'Resource';
            const description = fields['Description'] || 'No description provided for this dynamic resource item.';
            const link = fields['Access Link'] || '#';
            
            // Extract the attachment object securely
            let imageUrl = '';
            if (fields['Cover Image'] && fields['Cover Image'].length > 0) {
                imageUrl = fields['Cover Image'][0].url;
            }

            // Generate clean, system-standard class strings for dynamic badge colors
            const badgeClass = `badge-${category.toLowerCase().replace(/\s+/g, '-')}`;

            // Build out the clean responsive layout template skeleton
            const cardHTML = `
                <div class="card card-anim">
                    ${imageUrl 
                        ? `<img src="${imageUrl}" alt="${name}" class="card-image" loading="lazy">` 
                        : '<div class="card-image" style="background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%); flex-shrink: 0;"></div>'
                    }
                    <div class="card-content">
                        <span class="badge ${badgeClass}">${category}</span>
                        <h3 class="card-title">${name}</h3>
                        <p class="card-description">${description}</p>
                        <a href="${link}" target="_blank" class="card-btn">Access Resource</a>
                    </div>
                </div>
            `;
            
            // Inject the completed asset cleanly right into the grid framework
            container.innerHTML += cardHTML;
        });

    } catch (error) {
        console.error('Data Transmission Error:', error);
        container.innerHTML = `
            <p class="loading" style="color: #ef4444; font-weight: 600;">
                🔒 Secure Database Gateway Connection Failure. Check credentials inside app.js configuration panel.
            </p>
        `;
    }
}

// Instantiate the application process instantly upon script initialization
fetchResources();
