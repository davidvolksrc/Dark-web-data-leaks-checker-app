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
    
    doc.setFontSize(16);
    doc.text("Poročilo o varnosti e-naslova", 10, 15);
    
    doc.setFontSize(12);
    let y = 30;
    const items = document.querySelectorAll('.breach-item');
    
    if (items.length > 0) {
        doc.text(`Najdenih virov: ${items.length}`, 10, y);
        y += 10;
        items.forEach((item, index) => {
            doc.text(`${index + 1}. ${item.textContent.trim()}`, 10, y);
            y += 10;
            if (y > 280) { doc.addPage(); y = 20; }
        });
    } else {
        doc.text("Ni najdenih vdorov.", 10, y);
    }
    
    doc.save("varnostno-porocilo.pdf");
}
