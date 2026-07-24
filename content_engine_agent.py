import os
import requests
from google import genai
from google.genai import types

# ==========================================
# ⚙️ CONFIGURATION & API KEYS
# ==========================================
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
AIRTABLE_PAT = os.environ.get("AIRTABLE_PAT")
AIRTABLE_BASE_ID = os.environ.get("AIRTABLE_BASE_ID")
AIRTABLE_TABLE_NAME = os.environ.get("CONTENT_TABLE_NAME", "Content Calendar")

# Initialize Gemini Client
client = genai.Client(api_key=GEMINI_API_KEY)


# ==========================================
# 1. CORE CONTENT TOPICS / CONTENT PILLARS
# ==========================================
def get_daily_content_prompts():
    """
    Returns core content themes aligned with AE9-Labs offers:
    Tier 1 ($97 Headless DIY Starter) & Tier 2 ($997 VIP Business-in-a-Box).
    """
    return [
        {
            "pillar": "Tech Overhead / Cost Savings",
            "topic": "Why paying $200/mo for Shopify apps and plugins is trapping small creators, and how $0/mo headless storefronts fix it."
        },
        {
            "pillar": "Speed & Systems Engineering",
            "topic": "How to wire GitHub Pages, Airtable, and Make.com webhooks to run an automated storefront with zero monthly software fees."
        }
    ]


# ==========================================
# 2. AI SHORT-FORM SCRIPT & POST GENERATOR
# ==========================================
def generate_social_assets(item):
    """
    Uses Gemini 2.5 Flash to write a high-converting TikTok/IG Reel script 
    and a formatted Base44 social post.
    """
    prompt = f"""
    You are the Senior Content Strategist for AE9-Labs. 
    Create two high-converting content assets for the following topic:
    
    PILLAR: {item['pillar']}
    TOPIC: {item['topic']}

    ---
    ASSET 1: SHORT-FORM VIDEO SCRIPT (TikTok / IG Reel)
    * Hook: 3-second visual/verbal scroll-stopper.
    * On-Screen Text: Text overlay suggestions.
    * Body Script: Concise, high-value spoken lines (15-30 seconds).
    * Call to Action: Direct viewers to comment "BLUEPRINT" or click link in bio.

    ---
    ASSET 2: BASE44 / SOCIAL MEDIA POST
    * Headline: Bold title.
    * Body: 3 bulleted key takeaways explaining the outcome.
    * CTA: Clear instruction to grab the $97 DIY Starter or $997 VIP Infrastructure.

    FORMAT YOUR OUTPUT CLEARLY WITH HEADERS:
    [TikTok Script]
    ...
    [Base44 Post]
    ...
    """

    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,  # Slightly higher for creative hooks
            )
        )
        return response.text.strip()

    except Exception as e:
        print(f"❌ Error generating social content for '{item['pillar']}': {e}")
        return None


# ==========================================
# 3. AIRTABLE DATABASE INJECTION
# ==========================================
def save_content_to_airtable(pillar, topic, generated_content):
    """
    Posts the generated social content directly into your Airtable Content Calendar.
    """
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_NAME}"
    
    headers = {
        "Authorization": f"Bearer {AIRTABLE_PAT}",
        "Content-Type": "application/json"
    }

    payload = {
        "fields": {
            "Content Pillar": pillar,
            "Topic Idea": topic,
            "Generated Script & Assets": generated_content,
            "Status": "Ready to Post"
        }
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code in [200, 201]:
            print(f"✅ Successfully saved content for '{pillar}' to Airtable!")
        else:
            print(f"⚠️ Airtable API Error ({response.status_code}): {response.text}")
    except Exception as e:
        print(f"❌ Failed to connect to Airtable API: {e}")


# ==========================================
# 🚀 MAIN EXECUTION PIPELINE
# ==========================================
def main():
    print("\n🎬 Running AE9-Labs Content & Social Media Agent...\n")
    
    prompts = get_daily_content_prompts()
    
    for item in prompts:
        print(f"⚙️ Generating assets for Pillar: {item['pillar']}...")
        content = generate_social_assets(item)
        
        if content:
            print(f"✨ Content generated successfully!")
            
            # Save to Airtable if secrets exist
            if AIRTABLE_PAT and AIRTABLE_BASE_ID:
                save_content_to_airtable(item["pillar"], item["topic"], content)
            else:
                print("ℹ️ [Dry Run] Content generated! Set AIRTABLE_PAT & AIRTABLE_BASE_ID secrets to auto-save.")
                print("\n--- SAMPLE GENERATED CONTENT ---\n")
                print(content)
                print("\n--------------------------------\n")

    print("🎉 Content generation complete! Check your Airtable Content Calendar.")

if __name__ == "__main__":
    main()
