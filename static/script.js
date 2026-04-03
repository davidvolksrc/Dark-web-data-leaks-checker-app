function showSpinner() {
    document.getElementById('spinner').classList.remove('hidden');
}

function clearSession() {
    document.getElementById('email').value = '';
    const container = document.getElementById('resultsContainer');
    if (container) container.innerHTML = '';
}

function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString('sl-SI');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 150, 219);
    doc.text("VARNOSTNO POROČILO - SRC", 10, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Datum: ${dateStr}`, 10, 28);
    doc.line(10, 32, 200, 32);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Seznam zaznanih vdorov:", 10, 45);
    
    let y = 55;
    // Črpanje podatkov iz tabele
    const breachNames = document.querySelectorAll('.breach-name');
    
    breachNames.forEach((item, i) => {
        doc.text(`${i + 1}. ${item.textContent.trim()}`, 15, y);
        y += 10;
        if (y > 270) { doc.addPage(); y = 20; }
    });

    y += 15;
    doc.setFillColor(240, 240, 240);
    doc.rect(10, y, 190, 45, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("VARNOSTNI KONTROLNI SEZNAM:", 15, y + 10);
    doc.setFont("helvetica", "normal");
    doc.text("[  ] Zamenjava gesla na ogroženih računih", 15, y + 20);
    doc.text("[  ] Vklop dvofaktorske avtentikacije (2FA)", 15, y + 30);
    doc.text("[  ] Preverjanje podvojenih gesel drugje", 15, y + 40);

    doc.save("SRC_Varnostno_Porocilo.pdf");
}
