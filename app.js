// ==========================================
// CONFIGURATION MATRIX: PASTE YOUR INFRASTRUCTURE INFO HERE
// ==========================================
const CONFIG = {
    BASE_ID: 'app2dNCzkf61VdNKa',
    TABLE_NAME: 'Resources',
    // Advise customers to use a READ-ONLY scope PAT for public safety!
    TOKEN: 'patlORoiynqK5x7FM.cd39aef0ad04d04d923aeb8a4b48dd78b490f5a9c930fb69cbf6ea767a6d9dae' 
};

// Construct the filtered URL target
const url = `https://api.airtable.com/v0/${CONFIG.BASE_ID}/${encodeURIComponent(CONFIG.TABLE_NAME)}?filterByFormula=Status%3D%27Published%27`;

async function fetchResources() {
    const container = document.getElementById('resource-container');
    if (!container) return;
    
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${CONFIG.TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`Airtable Sync Error: ${response.status}`);
        const data = await response.json();
        
        container.innerHTML = '';

        if (data.records.length === 0) {
            container.innerHTML = `<p class="loading">No live items marked as 'Published' were found.</p>`;
            return;
        }

        data.records.forEach(record => {
            const fields = record.fields;
            
            const name = fields['Resource Name'] || 'Untitled Resource';
            const category = fields['Category'] || 'Resource';
            const description = fields['Description'] || 'No description provided.';
            const link = fields['Access Link'] || '#';
            
            let imageUrl = '';
            if (fields['Cover Image'] && fields['Cover Image'].length > 0) {
                imageUrl = fields['Cover Image'][0].url;
            }

            const badgeClass = `badge-${category.toLowerCase().replace(/\s+/g, '-')}`;

            const cardHTML = `
                <div class="card card-anim">
                    ${imageUrl ? `<img src="${imageUrl}" alt="${name}" class="card-image">` : '<div class="card-image" style="background:#e5e7eb;"></div>'}
                    <div class="card-content">
                        <span class="badge ${badgeClass}">${category}</span>
                        <h3 class="card-title">${name}</h3>
                        <p class="card-description">${description}</p>
                        <a href="${link}" target="_blank" class="card-btn">Access Resource</a>
                    </div>
                </div>
            `;
            
            container.innerHTML += cardHTML;
        });

    } catch (error) {
        console.error('Data Fetch Exception:', error);
        container.innerHTML = `<p class="loading" style="color: #ef4444;">Failed to sync with Airtable gateway. Check credentials.</p>`;
    }
}

fetchResources();
