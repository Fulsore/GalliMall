import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

def generate_from_hf(prompt):
    token = os.getenv("HUGGINGFACE_API_KEY")
    url = "https://api-inference.huggingface.co/models/google/flan-t5-large"

    if not token:
        return {"error": "Missing HF_API_TOKEN in environment"}

    headers = {
        "Authorization": f"Bearer {token}"
    }

    payload = {
        "inputs": prompt
    }

    response = requests.post(url, headers=headers, json=payload)

    print("Status code:", response.status_code)
    print("Raw response:", response.text)

    try:
        return response.json()
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    prompt = "Write a short poem about stars."
    output = generate_from_hf(prompt)
    print("Model response:")
    print(output)
