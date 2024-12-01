function toggleMenu() {
    var menuContent = document.getElementById('menuContent');
    menuContent.style.display = (menuContent.style.display === 'block') ? 'none' : 'block';
}

function showSection(sectionId) {
    var sections = document.querySelectorAll('.section');
    sections.forEach(function (section) {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

function showVeriGoruntuleme() {
    var form = document.getElementById('veriGoruntulemeForm');
    form.style.display = 'block';
    document.querySelector('.left-info').style.display = 'none';
    document.querySelector('.right-info').style.display = 'none';
    showSection('veriGoruntuleme');
}

// Kayıt Ol formunu işleme
document.getElementById('kayitForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    localStorage.setItem('userData', JSON.stringify(data));
    alert('Kayıt başarılı!');
    event.target.reset();
});

// Veri Görme formunu işleme
document.getElementById('veriGoruntulemeForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const okulNumarasi = formData.get('okulNumarasi');
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData.email === email && userData.okulNumarasi === okulNumarasi) {
        document.querySelector('.left-info').style.display = 'block';
        document.querySelector('.right-info').style.display = 'block';
        document.getElementById('veriGoruntulemeIsim').innerText = userData.isim;
        document.getElementById('veriGoruntulemePuan').innerText = userData.puan || '0';
        const teslimlerList = document.getElementById('gecmisTeslimler');
        teslimlerList.innerHTML = '';
        const teslimler = JSON.parse(localStorage.getItem('teslimler')) || [];
        teslimler.forEach(function(teslim) {
            const li = document.createElement('li');
            li.innerText = `Okul: ${teslim.okulIsmi}, Atık Türü: ${teslim.atikTuru}, Atık Kütlesi: ${teslim.atikKutlesi} kg, Puan: ${teslim.puan}, Teslim Eden: ${teslim.teslimEden}`;
            teslimlerList.appendChild(li);
        });
    } else {
        alert('Bilgiler uyuşmuyor, lütfen tekrar deneyin.');
    }
});

// Veri Girişi formunu işleme
document.getElementById('komiteGirisiForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const komiteAdi = formData.get('komiteAdi');
    const komiteSifresi = formData.get('komiteSifresi');

    if (komiteAdi === 'Ekolojik Kredi Noktası' && komiteSifresi === '1881') {
        document.getElementById('veriGirisiFormContainer').style.display = 'block';
    } else {
        alert('Komite adı veya şifresi yanlış.');
    }
});

document.getElementById('veriGirisiForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));

    // Puan hesaplama
    let puan = 0;
    switch (data.atikTuru.toLowerCase()) {
        case 'kağıt':
            puan = data.atikKutlesi * 10;
            break;
        case 'plastik':
            puan = data.atikKutlesi * 15;
            break;
        case 'cam':
            puan = data.atikKutlesi * 20;
            break;
        case 'metal':
            puan = data.atikKutlesi * 25;
            break;
        case 'elektronik atıklar':
            puan = data.atikKutlesi * 50;
            break;
    }
    data.puan = puan;

    // Kullanıcı verilerini güncelle
    let userData = JSON.parse(localStorage.getItem('userData'));
    userData.puan = (userData.puan || 0) + puan;
    localStorage.setItem('userData', JSON.stringify(userData));

    const teslimler = JSON.parse(localStorage.getItem('teslimler')) || [];
    teslimler.push(data);
    localStorage.setItem('teslimler', JSON.stringify(teslimler));

    alert('Veri girişi başarılı! Toplam puanınız: ' + userData.puan);
    event.target.reset();
});
