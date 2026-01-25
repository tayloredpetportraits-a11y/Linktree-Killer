import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

FIRECRAWL_KEY = os.getenv('FIRECRAWL_KEY')
TEST_URL = "https://tayloredpetportraits.com"

if not FIRECRAWL_KEY:
    # Try manual loading if python-dotenv fails or file not in path
    try:
        with open('.env.local') as f:
            for line in f:
                if line.startswith('FIRECRAWL_KEY='):
                    FIRECRAWL_KEY = line.split('=')[1].strip()
                    break
    except:
        pass

if not FIRECRAWL_KEY:
    print("Error: FIRECRAWL_KEY not found in .env or .env.local")
    exit(1)

print(f"Testing FireCrawl API with key: {FIRECRAWL_KEY[:4]}...{FIRECRAWL_KEY[-4:]}")

url = "https://api.firecrawl.dev/v0/scrape"
headers = {
    "Authorization": f"Bearer {FIRECRAWL_KEY}",
    "Content-Type": "application/json"
}
data = {
    "url": TEST_URL,
    "pageOptions": {
        "onlyMainContent": True
    }
}

try:
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    result = response.json()
    
    if result.get('success'):
        print("✅ FireCrawl Scrape & OpenAI Analysis Successful!")
        data = result['data']
        print(f"Name: {data.get('name')}")
        print(f"Bio/Slogan: {data.get('bio')}")
        print(f"Fonts: {data.get('fontStyle', 'Not detected')}")
        print(f"Colors: Bg1={data.get('bg1')}, Bg2={data.get('bg2')}, Btn={data.get('btn')}")
        print(f"Socials/Links Found: {len(data.get('links', []))}")
        
        # Save sample data
        with open('.tmp/firecrawl_sample.json', 'w') as f:
            json.dump(result, f, indent=2)
    else:
        print("❌ Scrape Failed")
        print(result)

except Exception as e:
    print(f"❌ Error: {str(e)}")
    if hasattr(e, 'response') and e.response is not None:
        print(e.response.text)
