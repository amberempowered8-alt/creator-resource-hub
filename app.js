// Airtable Configuration
const AIRTABLE_BASE_ID = 'app2dNCzkf61VdNKa';
const AIRTABLE_TABLE_NAME = 'Resources';
const AIRTABLE_PAT = 'patlORoiynqK5x7FM.cd39aef0ad04d04d923aeb8a4b48dd78b490f5a9c930fb69cbf6ea767a6d9dae';

// Construct the secure API endpoint
// We add a formula filter to only fetch records where Status = "Published"
const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?filterByFormula=Status%3D%27Published%27`;

async function fetchResources() {
    const container = document.getElementById('resource-container');
    
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${AIRTABLE_PAT}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Airtable API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Clear out the loading message
        container.innerHTML = '';

        if (data.records.length === 0) {
            container.innerHTML = `<p class="loading">No published resources found.</p>`;
            return;
        }

        // Loop over the published records and build the UI cards
        data.records.forEach(record => {
            const fields = record.fields;
            
            // Extract fields safely with clean fallbacks
            const name = fields['Resource Name'] || 'Untitled Resource';
            const category = fields['Category'] || 'Resource';
            const description = fields['Description'] || 'No description provided.';
            const link = fields['Access Link'] || '#';
            
            // Handle the Cover Image attachment smoothly
            let imageUrl = '';
            if (fields['Cover Image'] && fields['Cover Image'].length > 0) {
                imageUrl = fields['Cover Image'][0].url;
            }

            // Create a dynamic CSS class helper for category badge colors
            const badgeClass = `badge-${category.toLowerCase().replace(/\s+/g, '-')}`;

            // Build the card HTML skeleton
            const cardHTML = `
                <div class="card">
                    ${imageUrl ? `<img src="${imageUrl}" alt="${name}" class="card-image">` : '<div class="card-image" style="background:#ddd;"></div>'}
                    <div class="card-content">
                        <span class="badge ${badgeClass}">${category}</span>
                        <h3 class="card-title">${name}</h3>
                        <p class="card-description">${description}</p>
                        <a href="${link}" target="_blank" class="card-btn">Access Resource</a>
                    </div>
                </div>
            `;
            
            // Inject the card right into our grid
            container.innerHTML += cardHTML;
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        container.innerHTML = `<p class="loading" style="color: red;">Failed to load resources. Check console logs.</p>`;
    }
}

// Fire off the API call immediately when the script runs
fetchResources();
