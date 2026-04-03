import os
import requests
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
session = requests.Session()

# Get API Key from environment variable
API_KEY = os.getenv("API_KEY")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/check', methods=['POST'])
def check_email():
    data = request.get_json()
    email = data.get('email', '').strip()
    
    if not email:
        return jsonify({"success": False, "error": "E-poštni naslov je obvezen"}), 400

    headers = {"Authorization": f"Bearer {API_KEY}"}
    url = f"https://leakcheck.io/api/public?check={email}&type=email"
    
    try:
        # 10-second timeout for stability
        res = session.get(url, headers=headers, timeout=10)
        
        if res.status_code == 200:
            return jsonify(res.json())
        elif res.status_code == 429:
            return jsonify({"success": False, "error": "Preveč zahtev. Poskusite kasneje."}), 429
        else:
            return jsonify({"success": False, "error": "Napaka pri povezavi z bazo."}), res.status_code
            
    except Exception as e:
        return jsonify({"success": False, "error": "Strežnik ni dosegljiv."}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
