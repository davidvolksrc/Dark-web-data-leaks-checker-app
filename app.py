from flask import Flask, render_template, request
import requests
import os

app = Flask(__name__)

# Pridobivanje API ključa iz okoljskih spremenljivk
API_KEY = os.getenv("API_KEY")

@app.route('/', methods=['GET', 'POST'])
def index():
    results = None
    error = None

    if request.method == 'POST':
        email = request.form.get('email')
        if email:
            headers = {"Authorization": f"Bearer {API_KEY}"}
            url = f"https://leakcheck.io/api/public?check={email}&type=email"
            try:
                res = requests.get(url, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    if data.get('success') and data.get('found'):
                        results = data.get('sources', [])
                    else:
                        results = []
                else:
                    error = "Zahteva je potekla. Poskusite znova."
            except Exception as e:
                error = f"Sistemska napaka: {str(e)}"

    return render_template('index.html', results=results, error=error)

@app.route('/faq')
def faq():
    return render_template('faq.html')

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
