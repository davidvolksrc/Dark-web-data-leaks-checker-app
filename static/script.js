async function handleCheck() {
    const email = document.getElementById('email').value.trim();
    const container = document.getElementById('resultsContainer');
    const skeleton = document.getElementById('skeleton');
    const edu = document.getElementById('eduSection');

    if (!email) {
        alert("Prosimo, vnesite e-poštni naslov.");
        return;
    }

    // Reset UI for new search
    container.innerHTML = '';
    edu.classList.add('hidden');
    skeleton.classList.remove('hidden');

    try {
        const response = await fetch('/api/check', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();
        skeleton.classList.add('hidden');

        if (data.success === false) {
            container.innerHTML = `<p class="error">❌ ${data.error}</p>`;
        } else if (data.found) {
            renderResults(data.sources);
            edu.classList.remove('hidden');
        } else {
            container.innerHTML = '<div class="success-box"><p>✅ Odlično! Ta e-naslov ni bil najden v bazi vdorov.</p></div>';
        }
    } catch (err) {
        skeleton.classList.add('hidden');
        container.innerHTML = '<p class="error">❌ Prišlo je do napake pri povezavi.</p>';
    }
}

function renderResults(sources) {
    const container = document.getElementById('resultsContainer');
    const severity = sources.length > 5 ? 'VISOKA' : 'ZMERNA';
    const color = sources.length > 5 ? '#d93025' : '#f4b400';

    let html = `
        <div class="stats-card" style="border-top: 5px solid ${color}">
            <h4>Stopnja ogroženosti: <span style="color:${color}">${severity}</span></h4>
            <p>Vaši podatki so bili najdeni v <strong>${sources.length}</strong> različnih virih.</p>
        </div>
        <ul id="leakList">`;

    sources.forEach(source => {
        html += `
            <li class="breach-box">
                <span class="source-name">${source}</span>
                <button class="copy-btn" onclick="copyText('${source}', this)">Kopiraj</button>
            </li>`;
    });

    html += '</ul>';
    container.innerHTML = html;
}

function copyText(text, btn) {
    navigator.clipboard.writeText(text);
    const originalText = btn.innerText;
    btn.innerText = 'Kopirano!';
    btn.style.background = '#28a745';
    btn.style.color = '#fff';
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = '#eee';
        btn.style.color = '#555';
    }, 2000);
}

function clearSession() {
    document.getElementById('email').value = '';
    document.getElementById('resultsContainer').innerHTML = '';
    document.getElementById('eduSection').classList.add('hidden');
}

function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const email = document.getElementById('email').value;
    
    doc.setFontSize(18);
    doc.text("Varnostno poročilo: Uhajanje podatkov", 10, 20);
    doc.setFontSize(12);
    doc.text(`E-naslov: ${email}`, 10, 30);
    doc.text(`Datum: ${new Date().toLocaleDateString('sl-SI')}`, 10, 40);
    
    const items = document.querySelectorAll('#leakList li .source-name');
    let y = 60;
    doc.text("Seznam virov vdorov:", 10, 50);
    
    items.forEach((item, index) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(`${index + 1}. ${item.textContent.trim()}`, 15, y);
        y += 10;
    });
    
    doc.save(`porocilo_${email}.pdf`);
}
