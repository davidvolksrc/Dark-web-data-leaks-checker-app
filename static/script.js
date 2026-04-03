// Runs when the page loads
function initApp() {
    loadTheme();
    // Your original fade function if needed
    if (typeof runFadeOnce === "function") runFadeOnce();
}

function showSpinner() {
    const spinner = document.getElementById('spinner');
    if (spinner) spinner.classList.remove('hidden');
}

// Persistent Theme Logic
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    }
}

function clearSession() {
    const emailInput = document.getElementById('email');
    const results = document.getElementById('resultsContainer');
    if (emailInput) emailInput.value = '';
    if (results) results.innerHTML = '';
    // Optional: Refresh URL to clear POST data
    window.location.href = window.location.pathname;
}

function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const email = document.getElementById('email').value;
    
    doc.setFontSize(18);
    doc.text("Varnostno poročilo", 10, 20);
    
    doc.setFontSize(12);
    doc.text(`Naslov: ${email}`, 10, 30);
    doc.text(`Datum preverjanja: ${new Date().toLocaleDateString('sl-SI')}`, 10, 40);
    
    const items = document.querySelectorAll('#leakList li');
    if (items.length) {
        doc.setTextColor(200, 0, 0);
        doc.text("Zaznana uhajanja podatkov:", 10, 55);
        doc.setTextColor(0, 0, 0);
        
        let y = 65;
        items.forEach((item, index) => {
            // Basic page overflow protection
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
            doc.text(`${index + 1}. ${item.textContent.trim()}`, 15, y);
            y += 10;
        });
    } else {
        doc.text("Ni bilo najdenih zadetkov v bazah vdorov.", 10, 60);
    }
    
    doc.save(`porocilo_${email}.pdf`);
}