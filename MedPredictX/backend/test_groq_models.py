import os
from groq import Groq

# Use the existing api key from .env
from dotenv import load_dotenv
load_dotenv()

client = Groq(api_key=os.environ.get('GROQ_API_KEY'))
try:
    models = client.models.list()
    for m in models.data:
        if 'vision' in m.id:
            print("Vision model available:", m.id)
except Exception as e:
    print("Error:", e)
