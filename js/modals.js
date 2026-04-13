function openInfoModal() {
    document.getElementById('menuBtn').classList.remove('open');
    document.getElementById('settingsMenu').classList.remove('open');
    
    let initialTab = 'ciphers';
    if (appMode === 'password') {
        initialTab = opMode === 'auto' ? 'auto' : 'manual';
    }
    switchInfoTab(initialTab);
    
    document.getElementById('infoModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeInfoModal() {
    document.getElementById('infoModal').classList.remove('show');
    document.body.style.overflow = '';
}

function openDownloadModal() {
    document.getElementById('menuBtn').classList.remove('open');
    document.getElementById('settingsMenu').classList.remove('open');
    document.getElementById('downloadModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeDownloadModal() {
    document.getElementById('downloadModal').classList.remove('show');
    document.body.style.overflow = '';
}

function switchInfoTab(tabId) {
    document.querySelectorAll('.info-tab').forEach(el => el.classList.remove('active'));
    document.getElementById('tab_' + tabId).classList.add('active');
    
    const data = infoModalData[tabId];
    let html = `
        <div class="info-title-wrapper">
            <span class="info-main-title">Информация</span>
        </div>
        <div class="info-legend-container">
            <span class="info-legend-sim">Симуляция: невозможно реализовать без использования пакетов pip, а также занял бы тысячи строк кода. Был использован приближённый вариант</span>
            <p>Надёжность — показывает сложность взлома</p>
            <p>Простота — показывает лёгкость восстановления</p>
            <p>Актуальность — актуальность в 2026</p>
            <p class="legend-disclaimer">* Данные были взяты с открытых источников, согласованы с тремя ИИ(Grok, Gemini, ChatGPT) и по личным наблюдениям автора. <br><strong>МОГУТ НЕ СООТВЕТСТВОВАТЬ ДЕЙСТВИТЕЛЬНОСТИ</strong></p>
        </div>
    `;
    
    if (tabId !== 'manual') {
        html += `<div class="info-nav-links">`;
        data.forEach(item => {
            html += `<span class="info-nav-link" onclick="scrollToInfo('${item.id}')">${item.name}</span>`;
        });
        html += `</div>`;
    }
    
    data.forEach((item, index) => {
        html += `
            <div class="info-section" id="${item.id}">
                <div class="info-section-title"><span>${item.name}</span></div>
                <div class="info-desc-container">
                    <div class="info-text">${item.desc}</div>
                    <div class="info-rating-box">
                        <div class="rating-title">Оценка:</div>
                        <div class="rating-item">Надёжность: ${item.rating.sec}</div>
                        <div class="rating-item">Простота: ${item.rating.simp}</div>
                        <div class="rating-item">Актуальность: ${item.rating.rel}</div>
                    </div>
                </div>
            </div>
        `;
        if (index < data.length - 1) {
            html += `<div class="info-full-separator"></div>`;
        }
    });
    
    document.getElementById('infoModalContent').innerHTML = html;
    document.getElementById('infoModalContent').scrollTop = 0;
}

function scrollToInfo(id) {
    const el = document.getElementById(id);
    if(el) {
        const parent = document.getElementById('infoModalContent');
        parent.scrollTo({ top: el.offsetTop - parent.offsetTop - 20, behavior: 'smooth' });
    }
}

function scrollToTopInfo() {
    document.getElementById('infoModalContent').scrollTo({ top: 0, behavior: 'smooth' });
}

function openCatModal(slotIndex) {
    activeManualSlotId = slotIndex;
    const list = document.getElementById('catList');
    list.innerHTML = '';
    
    let selectedIds = manualData.map((m, i) => i !== slotIndex ? m.id : null).filter(id => id !== null);
    
    manualCategories.forEach((cat, idx) => {
        if (!selectedIds.includes(idx)) {
            const btn = document.createElement('button');
            btn.className = 'cat-btn';
            btn.innerText = cat;
            btn.onclick = () => { selectCategory(idx); };
            list.appendChild(btn);
        }
    });
    
    document.getElementById('catModal').classList.add('show');
}

function closeCatModal(e) {
    if(e.target.id === 'catModal') {
        document.getElementById('catModal').classList.remove('show');
    }
}

function selectCategory(catIndex) {
    manualData[activeManualSlotId].id = catIndex;
    manualData[activeManualSlotId].value = ''; 
    document.getElementById('catModal').classList.remove('show');
    buildManualGrid();
    hideError();
}
