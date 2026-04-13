function clearAllFields() {
    document.getElementById('mainText').value = '';
    document.getElementById('passNormal').value = '';
    document.getElementById('passSpecial').value = '';
    hideError();
    document.getElementById('copyBtn').style.display = 'none';
    document.getElementById('fileBtn').style.display = 'none';
}

function applyTransition(callback) {
    document.getElementById('menuBtn').classList.remove('open');
    document.getElementById('settingsMenu').classList.remove('open');
    
    const overlay = document.getElementById('fadeOverlay');
    overlay.classList.add('active');
    
    setTimeout(() => {
        callback();
        overlay.classList.remove('active');
    }, 200);
}

function changeTheme(targetTheme) {
    const isLight = document.body.classList.contains('light-mode');
    if ((targetTheme === 'light' && isLight) || (targetTheme === 'dark' && !isLight)) {
        document.getElementById('menuBtn').classList.remove('open');
        document.getElementById('settingsMenu').classList.remove('open');
        return;
    }
    applyTransition(() => setTheme(targetTheme));
}

function toggleAppMode() {
    clearAllFields();
    appMode = appMode === 'crypto' ? 'password' : 'crypto';
    document.getElementById('appModeBtn').innerText = appMode === 'crypto' ? 'Режим пароля' : 'Режим шифра';
    
    if (appMode === 'crypto') {
        opMode = 'encrypt';
        document.getElementById('btnLeft').innerText = 'Зашифровать';
        document.getElementById('btnRight').innerText = 'Дешифровать';
        document.getElementById('headerSubtitle').innerText = `Шифрование и дешифрование с использованием ${currentCrypto}`;
        document.getElementById('actionBtn').innerText = 'Зашифровать';
        
        document.getElementById('cryptoSelector').classList.remove('d-none');
        document.getElementById('passAutoSelector').classList.add('d-none');
        document.getElementById('passManualSelector').classList.add('d-none');
        document.getElementById('cryptoInputGroup').classList.remove('d-none');
        document.getElementById('cryptoDynamicInputs').classList.remove('d-none');
        document.getElementById('passwordOutputGroup').classList.add('d-none');
        document.getElementById('manualGrid').classList.add('d-none');
        document.getElementById('infoBox').classList.remove('d-none');
        
        document.getElementById('infoDesc').innerText = `• ${cipherInfo[currentCrypto]}`;
    } else {
        opMode = 'auto';
        document.getElementById('btnLeft').innerText = 'Авто';
        document.getElementById('btnRight').innerText = 'Ручное';
        document.getElementById('actionBtn').innerText = 'Сгенерировать пароль';
        
        document.getElementById('cryptoSelector').classList.add('d-none');
        document.getElementById('cryptoInputGroup').classList.add('d-none');
        document.getElementById('cryptoDynamicInputs').classList.add('d-none');
        document.getElementById('passwordOutputGroup').classList.remove('d-none');
        
        updatePasswordModeUI();
    }
    setOpMode(appMode === 'crypto' ? 'left' : 'left', true); 
}

function setOpMode(side, isInternal = false) {
    if(!isInternal) clearAllFields();

    if (appMode === 'crypto') {
        opMode = side === 'left' ? 'encrypt' : 'decrypt';
        document.getElementById('btnLeft').classList.toggle('active', side === 'left');
        document.getElementById('btnRight').classList.toggle('active', side === 'right');
        document.getElementById('actionBtn').innerText = opMode === 'encrypt' ? 'Зашифровать' : 'Дешифровать';
        buildDynamicInputs();
    } else {
        opMode = side === 'left' ? 'auto' : 'manual';
        document.getElementById('btnLeft').classList.toggle('active', side === 'left');
        document.getElementById('btnRight').classList.toggle('active', side === 'right');
        updatePasswordModeUI();
    }
}

function updatePasswordModeUI() {
    document.getElementById('infoBox').classList.remove('d-none');
    if (opMode === 'auto') {
        document.getElementById('headerSubtitle').innerText = 'Используется автоматическое создание пароля';
        document.getElementById('passAutoSelector').classList.remove('d-none');
        document.getElementById('passManualSelector').classList.add('d-none');
        document.getElementById('manualGrid').classList.add('d-none');
        document.getElementById('infoDesc').innerText = `• ${passInfo[currentPassProto]}`;
    } else {
        document.getElementById('headerSubtitle').innerText = 'Используется ручное создание пароля';
        document.getElementById('passAutoSelector').classList.add('d-none');
        document.getElementById('passManualSelector').classList.remove('d-none');
        document.getElementById('manualGrid').classList.remove('d-none');
        document.getElementById('infoDesc').innerText = '• Порядок выбранных элементов и стиль текста не влияет на конечный результат; \n\n• Рекомендуется от 3-х элементов (для длинных слов допускается меньше)';
        buildManualGrid();
    }
}

function toggleDropdown(e, id) {
    e.stopPropagation();
    document.getElementById(id).classList.toggle('show');
}

function closeDropdowns(e) {
    if(!e.target.closest('.cipher-select-wrapper')) {
        document.querySelectorAll('.cipher-dropdown').forEach(el => el.classList.remove('show'));
    }
    if(!e.target.closest('.floating-menu-btn') && !e.target.closest('.settings-menu') && e.target.id !== 'infoMenuBtn') {
        document.getElementById('menuBtn').classList.remove('open');
        document.getElementById('settingsMenu').classList.remove('open');
    }
}

function setSelection(type, val) {
    clearAllFields();
    
    if (type === 'crypto') {
        currentCrypto = val;
        document.getElementById('cipherMainBtn').innerText = val;
        document.getElementById('headerSubtitle').innerText = `Шифрование и дешифрование с использованием ${val}`;
        document.getElementById('infoDesc').innerText = `• ${cipherInfo[val]}`;
        document.querySelectorAll('#cipherDropdown .cipher-option').forEach(el => {
            el.classList.toggle('active', el.innerText === val);
        });
        buildDynamicInputs();
    } else {
        currentPassProto = val;
        document.getElementById('passMainBtn').innerText = val;
        document.getElementById('infoDesc').innerText = `• ${passInfo[val]}`;
        document.querySelectorAll('#passDropdown .cipher-option').forEach(el => {
            el.classList.toggle('active', el.innerText === val);
        });
    }
    document.querySelectorAll('.cipher-dropdown').forEach(el => el.classList.remove('show'));
}

function toggleSettingsMenu(e) {
    e.stopPropagation();
    document.getElementById('menuBtn').classList.toggle('open');
    document.getElementById('settingsMenu').classList.toggle('open');
}

function setTheme(theme) {
    document.body.classList.toggle('light-mode', theme === 'light');
    document.getElementById('darkThemeBtn').classList.toggle('active-theme', theme === 'dark');
    document.getElementById('lightThemeBtn').classList.toggle('active-theme', theme === 'light');
}

function showError(msg) {
    const err = document.getElementById('errorBox');
    err.innerText = msg;
    err.style.display = 'block';
}

function hideError() {
    document.getElementById('errorBox').style.display = 'none';
}

function buildDynamicInputs() {
    const container = document.getElementById('cryptoDynamicInputs');
    container.innerHTML = '';

    if (currentCrypto === 'Цезарь') {
        container.innerHTML = `<div class="input-group"><label>Сдвиг (1-32):</label><input type="number" id="shiftInput" min="1" max="32" oninput="hideError()"></div>`;
    } else if (currentCrypto === 'Виженера') {
        container.innerHTML = `<div class="input-group"><label>Ключевое слово:</label><input type="text" id="keywordInput" oninput="hideError()"></div>`;
    } else if (currentCrypto === 'AES') {
        container.innerHTML = `
            <div class="input-group"><label>IV (Hex):</label><input type="text" id="ivInput" placeholder="24 символа" oninput="hideError()"></div>
            <div class="input-group"><label>Hex-ключ:</label><input type="text" id="keyInput" placeholder="64 символа" oninput="hideError()"></div>
            <button class="action-btn" id="genKeyBtn" onclick="genAES()" style="margin-top:5px; padding:10px;">Сгенерировать ключ</button>`;
    } else if (currentCrypto === 'DES') {
        container.innerHTML = `
            <div class="input-group"><label>Ключ (Hex):</label><input type="text" id="keyInput" placeholder="16 символов" oninput="hideError()"></div>
            <button class="action-btn" id="genKeyBtn" onclick="genDES()" style="margin-top:5px; padding:10px;">Сгенерировать ключ</button>`;
    }
    
    const genBtn = document.getElementById('genKeyBtn');
    if(genBtn) genBtn.style.display = opMode === 'encrypt' ? 'block' : 'none';
}

function buildManualGrid() {
    const input = document.getElementById('manualCount');
    if (input.value === '') return;
    
    let count = parseInt(input.value, 10);
    if (isNaN(count)) return;
    
    if (count < 1) { count = 1; input.value = 1; }
    if (count > 10) { count = 10; input.value = 10; }

    manualData = manualData.slice(0, count);
    while(manualData.length < count) manualData.push({ id: null, value: '' });

    const grid = document.getElementById('manualGrid');
    grid.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const isLastOdd = (i === count - 1) && (count % 2 !== 0);
        const item = document.createElement('div');
        item.className = 'manual-item' + (isLastOdd ? ' full-width' : '');
        
        const btn = document.createElement('div');
        btn.className = 'manual-select-btn';
        btn.innerText = manualData[i].id !== null ? manualCategories[manualData[i].id] : "Выбрать элемент";
        btn.onclick = () => openCatModal(i);

        item.appendChild(btn);

        if (manualData[i].id !== null) {
            const textInp = document.createElement('input');
            textInp.type = 'text';
            textInp.placeholder = 'Введите значение...';
            textInp.value = manualData[i].value;
            textInp.oninput = (e) => { manualData[i].value = e.target.value; hideError(); };
            item.appendChild(textInp);
        }

        grid.appendChild(item);
    }
}

function bytesToHex(bytes) {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
