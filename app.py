import os
import requests
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
session = requests.Session()
API_KEY = os.getenv("API_KEY")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/check', methods=['POST'])
def check_email():
    data = request.get_json()
    email = data.get('email', '').strip()
    
    if not email:
        return jsonify({"success": False, "error": "E-naslov je obvezen"}), 400

    headers = {"Authorization": f"Bearer {API_KEY}"}
    url = f"https://leakcheck.io/api/public?check={email}&type=email"
    
    try:
        res = session.get(url, headers=headers, timeout=10)
        if res.status_code == 200:
            api_data = res.json()
            # We return the raw data; JS will handle severity and stats
            return jsonify(api_data)
        return jsonify({"success": False, "error": "API napaka"}), res.status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=int(os.environ.get("PORT", 5000)))
