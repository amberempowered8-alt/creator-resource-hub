// =========================================================================
// 🚀 CLEAN CMS ARCHITECTURE CONFIGURATION
// =========================================================================
const CONFIG = {
    BASE_ID: 'app2dNCzkf61VdNKa',
    TABLE_NAME: 'Resources',
    TOKEN: 'patyL33svMDeXQTBl.ec9405459cca137c101221070ea758779035d955e4180a6d2b21beab4d147611'
};

const URL_ENDPOINT = `https://api.airtable.com/v0/${CONFIG.BASE_ID}/${encodeURIComponent(CONFIG.TABLE_NAME)}?filterByFormula=Status%3D%27Published%27`;

async function fetchResources() {
    const container = document.getElementById('resource-container');
    if (!container) return;
    
    try {
        container.innerHTML = '<p class="loading">Syncing live catalog entries...</p>';

        const response = await fetch(URL_ENDPOINT, {
            headers: {
                'Authorization': `Bearer ${CONFIG.TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`Gateway Error: ${response.status}`);
        const data = await response.json();
        
        container.innerHTML = ''; // Wipe loading indicator

        if (!data.records || data.records.length === 0) {
            container.innerHTML = `<p class="loading">No published products found. Set item status to 'Published' inside Airtable to display.</p>`;
            return;
        }

        data.records.forEach(record => {
            const fields = record.fields;
            
            const name = fields['Resource Name'] || 'Untitled System Asset';
            const description = fields['Description'] || 'No description provided for this dynamic resource item.';
            
            // Extract the direct access target pathway
            let link = '#';
            if (fields['Access Link']) {
                if (Array.isArray(fields['Access Link'])) {
                    link = fields['Access Link'][0];
                } else if (typeof fields['Access Link'] === 'object') {
                    link = fields['Access Link'].url || Object.values(fields['Access Link'])[0];
                } else {
                    link = fields['Access Link'];
                }
            }

            // Fallback checking framework override
            if (typeof link === 'string' && (link.includes('generated') || link === '#')) {
                if (name.includes("3P's")) {
                    link = 'https://payhip.com/b/Zf4Bz';
                } else if (name.includes("Headless") || name.includes("Storefront")) {
                    link = 'https://payhip.com/b/p7zMX';
                } else {
                    link = 'https://payhip.com/b/p7zMX';
                }
            }

            // Clean spacing and absolute routing safety paths
            if (link !== '#' && typeof link === 'string') {
                link = link.trim();
                if (!link.startsWith('http://') && !link.startsWith('https://')) {
                    link = 'https://' + link;
                }
            }
            
            // Target the premium attachment image resolution path
            let imageUrl = '';
            if (fields['Cover Image'] && fields['Cover Image'].length > 0) {
                const attachment = fields['Cover Image'][0];
                if (attachment.thumbnails && attachment.thumbnails.full) {
                    imageUrl = attachment.thumbnails.full.url;
                } else {
                    imageUrl = attachment.url;
                }
            }

            // Construct and bind the element card cleanly
            const cardHTML = `
                <div class="card">
                    ${imageUrl 
                        ? `<img src="${imageUrl}" alt="${name}" class="card-image" loading="lazy">` 
                        : '<div class="card-image" style="background: linear-gradient(135deg, #1f2833 0%, #0b0c10 100%);"></div>'
                    }
                    <div class="card-content">
                        <h3 class="card-title">${name}</h3>
                        <p class="card-description">${description}</p>
                        <a href="${link}" target="_blank" rel="noopener noreferrer" class="card-btn">
                           Access Resource
                        </a>
                    </div>
                </div>
            `;
            
            container.innerHTML += cardHTML;
        });

    } catch (error) {
        console.error('System Exception:', error);
        container.innerHTML = `<p class="loading" style="color: #ff4d4d;">🔒 Connection baseline dropped. Check configurations.</p>`;
    }
}

// Fire application instantly upon module initialization
fetchResources();
