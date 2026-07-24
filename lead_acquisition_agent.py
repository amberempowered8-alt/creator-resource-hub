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
AIRTABLE_TABLE_NAME = os.environ.get("AIRTABLE_TABLE_NAME", "Leads")

# Initialize Gemini Client
client = genai.Client(api_key=GEMINI_API_KEY)


# ==========================================
# 1. SAMPLE PROSPECT SEARCH ENGINE
# ==========================================
def fetch_target_prospects():
    """
    Simulates finding target prospects from public directories or search results.
    Replace this dictionary array with your custom web scraper or API feed.
    """
    sample_prospects = [
        {
            "business_name": "Apex Digital Studio",
            "website": "https://example-apex-digital.com",
            "niche": "Creative Agency",
            "current_stack_notes": "Slow page load, high Shopify/WordPress app bloat, missing fast mobile checkout."
        },
        {
            "business_name": "Glow Wellness Co",
            "website": "https://example-glow-wellness.com",
            "niche": "Lifestyle & Health",
            "current_stack_notes": "Basic landing page with linktree setup, paying high monthly platform fees, manual email capture."
        }
    ]
    return sample_prospects


# ==========================================
# 2. AI EVALUATION & PITCH GENERATOR (GEMINI)
# ==========================================
def analyze_and_pitch_lead(prospect):
    """
    Uses Gemini API to evaluate tech gaps and write a personalized 2-sentence value pitch.
    """
    prompt = f"""
    You are an expert Web Infrastructure & Lead Acquisition Specialist for AE9-Labs.
    Analyze the following prospect and provide:
    1. Tech Gap Score (1 to 10, where 10 means high need for headless/automated infrastructure).
    2. A personalized, direct, value-first DM outreach pitch (maximum 2 sentences).
       Emphasize $0/month software overhead, lightning speed, and effortless setup.

    PROSPECT DETAILS:
    Business Name: {prospect['business_name']}
    Niche: {prospect['niche']}
    Current Tech Notes: {prospect['current_stack_notes']}

    OUTPUT FORMAT:
    Score: [1-10]
    Pitch: [Your 2-sentence DM pitch here]
    """

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.3,
            )
        )
        
        output_text = response.text.strip()
        
        # Parse basic output
        score = "7"
        pitch = output_text
        
        for line in output_text.split('\n'):
            if line.startswith("Score:"):
                score = line.replace("Score:", "").strip()
            elif line.startswith("Pitch:"):
                pitch = line.replace("Pitch:", "").strip()

        return score, pitch

    except Exception as e:
        print(f"❌ Error generating AI pitch for {prospect['business_name']}: {e}")
        return "N/A", "Hey! Noticed your current setup might be slowing down conversions. We build $0/mo overhead custom storefronts to fix that."


# ==========================================
# 3. AIRTABLE DATABASE INJECTION
# ==========================================
def save_lead_to_airtable(prospect, score, pitch):
    """
    Posts the analyzed prospect directly into your Airtable Lead Capture Base.
    """
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_NAME}"
    
    headers = {
        "Authorization": f"Bearer {AIRTABLE_PAT}",
        "Content-Type": "application/json"
    }

    payload = {
        "fields": {
            "Business Name": prospect["business_name"],
            "Website": prospect["website"],
            "Niche": prospect["niche"],
            "Tech Score": str(score),
            "Custom DM Pitch": pitch,
            "Status": "New Lead"
        }
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code in [200, 201]:
            print(f"✅ Successfully logged '{prospect['business_name']}' into Airtable!")
        else:
            print(f"⚠️ Airtable API Error ({response.status_code}): {response.text}")
    except Exception as e:
        print(f"❌ Failed to connect to Airtable API: {e}")


# ==========================================
# 🚀 MAIN EXECUTION PIPELINE
# ==========================================
def main():
    print("\n🔍 Running AE9-Labs Outbound Lead Acquisition Agent...\n")
    
    # Step 1: Fetch prospects
    prospects = fetch_target_prospects()
    print(f"found {len(prospects)} prospects to evaluate.")

    # Step 2 & 3: Process through Gemini and log to Airtable
    for prospect in prospects:
        print(f"\n⚙️ Analyzing: {prospect['business_name']}...")
        score, pitch = analyze_and_pitch_lead(prospect)
        
        print(f"   📊 Tech Need Score: {score}/10")
        print(f"   💬 Drafted Pitch: {pitch}")
        
        # Save to database if keys are set
        if AIRTABLE_PAT != "YOUR_AIRTABLE_PAT_HERE" and AIRTABLE_BASE_ID != "YOUR_BASE_ID_HERE":
            save_lead_to_airtable(prospect, score, pitch)
        else:
            print("   ℹ️ [Dry Run] Add your Airtable PAT and Base ID to auto-save directly to your CRM.")

    print("\n🎉 Execution complete! Your lead queue is ready.")

if __name__ == "__main__":
    main()
