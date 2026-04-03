import os
import requests
from flask import Flask, render_template, request

app = Flask(__name__)

# Use a session for connection pooling (faster repeated requests)
session = requests.Session()

# Securely fetch API Key from environment
API_KEY = os.getenv("API_KEY")

@app.route('/', methods=['GET', 'POST'])
def index():
    results = None
    error = None
    email_val = ""

    if request.method == 'POST':
        email_val = request.form.get('email', '').strip()
        
        if email_val:
            headers = {"Authorization": f"Bearer {API_KEY}"}
            url = f"https://leakcheck.io/api/public?check={email_val}&type=email"
            
            try:
                # Added a 5-second timeout to prevent the app from hanging
                res = session.get(url, headers=headers, timeout=5)
                
                if res.status_code == 200:
                    data = res.json()
                    if data.get('success'):
                        # 'found' is boolean, 'sources' is the list
                        results = data.get('sources', []) if data.get('found') else []
                    else:
                        error = "API Error: Zahteva ni bila uspešna."
                elif res.status_code == 401:
                    error = "Napaka avtorizacije: Preverite API ključ."
                elif res.status_code == 429:
                    error = "Preveč zahtev (Rate limit). Poskusite kasneje."
                else:
                    error = f"Strežnik je vrnil napako: {res.status_code}"
                    
            except requests.exceptions.Timeout:
                error = "Zahteva je potekla. Poskusite znova."
            except Exception as e:
                # Log the actual error 'e' to your server logs, show user a clean message
                error = "Prišlo je do nepričakovane napake pri povezavi."

    return render_template('index.html', results=results, error=error, email_val=email_val)

if __name__ == '__main__':
    # Default to 5000 for local dev, but allow environment to override
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host='0.0.0.0', port=port)