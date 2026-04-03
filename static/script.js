function showSpinner() {
    document.getElementById('spinner').classList.remove('hidden');
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
}

function clearSession() {
    document.getElementById('email').value = '';
    document.getElementById('resultsContainer').innerHTML = '';
}

function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Rezultati iskanja e-naslova na temnem spletu:", 10, 10);
    const items = document.querySelectorAll('ul li');
    if (items.length) {
        let y = 20;
        items.forEach(item => {
            doc.text("- " + item.textContent.trim(), 10, y);
            y += 10;
        });
    } else {
        doc.text("Ni bilo najdenih zadetkov.", 10, 20);
    }
    doc.save("rezultati.pdf");
}
