import os
import base64
from groq import Groq

client = Groq(api_key=os.environ.get('GROQ_API_KEY'))

# create a dummy image (1x1 transparent png base64)
dummy_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

try:
    completion = client.chat.completions.create(
        model="llama-3.2-11b-vision-preview",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "What is in this image?"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{dummy_b64}"
                        }
                    }
                ]
            }
        ]
    )
    print("Success:", completion.choices[0].message.content)
except Exception as e:
    print("Error:", str(e))
