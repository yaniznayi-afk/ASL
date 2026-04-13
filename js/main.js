async function processAction() {
    hideError();
    
    if (appMode === 'crypto') {
        const textEl = document.getElementById('mainText');
        let text = textEl.value;
        const isDecrypt = opMode === 'decrypt';

        if(!text) return showError("Введите текст");

        try {
            let result = '';
            switch(currentCrypto) {
                case 'Атбаш':
                    result = text.split('').map(char => {
                        const c = char.toUpperCase();
                        if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(c)) {
                            let res = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[25 - "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c)];
                            return char === c ? res : res.toLowerCase();
                        }
                        if ("АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".includes(c)) {
                            let res = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"[32 - "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".indexOf(c)];
                            return char === c ? res : res.toLowerCase();
                        }
                        return char;
                    }).join('');
                    break;
                case 'Цезарь':
                    let shift = parseInt(document.getElementById('shiftInput').value);
                    if(isNaN(shift)) throw new Error("Укажите сдвиг");
                    if(isDecrypt) shift = -shift;
                    result = text.split('').map(char => {
                        const c = char.toUpperCase();
                        if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(c)) {
                            let idx = ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c) + shift) % 26;
                            if(idx < 0) idx += 26;
                            let res = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[idx];
                            return char === c ? res : res.toLowerCase();
                        }
                        if ("АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".includes(c)) {
                            let idx = ("АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".indexOf(c) + shift) % 33;
                            if(idx < 0) idx += 33;
                            let res = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"[idx];
                            return char === c ? res : res.toLowerCase();
                        }
                        return char;
                    }).join('');
                    break;
                case 'Виженера':
                    const keyword = document.getElementById('keywordInput').value.toUpperCase();
                    if(!keyword) throw new Error("Укажите ключевое слово");
                    let kIdx = 0;
                    result = text.split('').map(char => {
                        const c = char.toUpperCase();
                        if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(c)) {
                            let shiftVal = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(keyword[kIdx % keyword.length] || 'A');
                            let idx = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c) + (isDecrypt ? -shiftVal : shiftVal);
                            idx = (idx % 26 + 26) % 26;
                            kIdx++;
                            let res = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[idx];
                            return char === c ? res : res.toLowerCase();
                        }
                        if ("АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".includes(c)) {
                            let shiftVal = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".indexOf(keyword[kIdx % keyword.length] || 'А');
                            let idx = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".indexOf(c) + (isDecrypt ? -shiftVal : shiftVal);
                            idx = (idx % 33 + 33) % 33;
                            kIdx++;
                            let res = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"[idx];
                            return char === c ? res : res.toLowerCase();
                        }
                        return char;
                    }).join('');
                    break;
                case 'Двоичный':
                    if(isDecrypt) {
                        try { result = new TextDecoder().decode(new Uint8Array(text.trim().split(/\s+/).map(b => parseInt(b, 2)))); } 
                        catch(e) { throw new Error("Неверный формат"); }
                    } else {
                        result = Array.from(new TextEncoder().encode(text)).map(b => b.toString(2).padStart(8, '0')).join(' ');
                    }
                    break;
                case 'Азбука Морзе':
                    const mc = {"A":".-","B":"-...","C":"-.-.","D":"-..","E":".","F":"..-.","G":"--.","H":"....","I":"..","J":".---","K":"-.-","L":".-..","M":"--","N":"-.","O":"---","P":".--.","Q":"--.-","R":".-.","S":"...","T":"-","U":"..-","V":"...-","W":".--","X":"-..-","Y":"-.--","Z":"--..","А":".-","Б":"-...","В":".--","Г":"--.","Д":"-..","Е":".","Ж":"...-","З":"--..","И":"..","Й":".---","К":"-.-","Л":".-..","М":"--","Н":"-.","О":"---","П":".--.","Р":".-.","С":"...","Т":"-","У":"..-","Ф":"..-.","Х":"....","Ц":"-.-.","Ч":"---.","Ш":"----","Щ":"--.-","Ъ":"--.--","Ы":"-.--","Ь":"-..-","Э":"..-..","Ю":"..--","Я":".-.-","0":"-----","1":".----","2":"..---","3":"...--","4":"....-","5":".....","6":"-....","7":"--...","8":"---..","9":"----."};
                    const rmc = Object.fromEntries(Object.entries(mc).map(([k, v]) => [v, k]));
                    if(isDecrypt) {
                        result = text.trim().split(/\s+/).map(m => rmc[m] || m).join('');
                    } else {
                        result = text.toUpperCase().split('').map(c => mc[c] || c).join(' ');
                    }
                    break;
                case 'AES':
                    const ivHex = document.getElementById('ivInput').value.trim();
                    const keyHex = document.getElementById('keyInput').value.trim();
                    if(ivHex.length !== 24 || keyHex.length !== 64) throw new Error("Неверная длина IV или Ключа");
                    const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
                    const key = new Uint8Array(keyHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
                    const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
                    
                    if(!isDecrypt) {
                        const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, cryptoKey, new TextEncoder().encode(text));
                        result = Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('');
                    } else {
                        const decData = new Uint8Array(text.trim().match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
                        result = new TextDecoder().decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, cryptoKey, decData));
                    }
                    break;
                case 'DES':
                    const desKey = document.getElementById('keyInput').value.trim();
                    if(desKey.length !== 16) throw new Error("Ключ должен быть 16 Hex-символов");
                    const kH = CryptoJS.enc.Hex.parse(desKey);
                    if(!isDecrypt) {
                        result = CryptoJS.DES.encrypt(text, kH, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).ciphertext.toString(CryptoJS.enc.Hex);
                    } else {
                        const cp = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Hex.parse(text.trim()) });
                        result = CryptoJS.DES.decrypt(cp, kH, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8);
                        if(!result) throw new Error("Ошибка дешифровки");
                    }
                    break;
            }
            textEl.value = result;
            document.getElementById('copyBtn').style.display = 'block';

        } catch (err) {
            showError(err.message || "Ошибка обработки");
        }

    } else {
        if (opMode === 'manual') {
            for(let i=0; i<manualData.length; i++) {
                if (manualData[i].id === null || manualData[i].value.trim() === '') {
                    return showError("Заполните все выбранные элементы");
                }
            }
            document.getElementById('passNormal').value = generateManualPassword(false);
            document.getElementById('passSpecial').value = generateManualPassword(true);
        } else {
            document.getElementById('passNormal').value = generateAutoPassword(false);
            document.getElementById('passSpecial').value = generateAutoPassword(true);
        }
        
        document.getElementById('copyBtn').style.display = 'block';
        document.getElementById('fileBtn').style.display = 'block';
    }
}

function copyResults() {
    let res = "";
    if (appMode === 'crypto') {
        res += `Текст: "${document.getElementById('mainText').value}"\n`;
        if(currentCrypto === 'Цезарь') res += `Сдвиг: "${document.getElementById('shiftInput').value}"\n`;
        if(currentCrypto === 'Виженера') res += `Ключевое слово: "${document.getElementById('keywordInput').value}"\n`;
        if(currentCrypto === 'AES') {
            res += `IV: "${document.getElementById('ivInput').value}"\n`;
            res += `Ключ: "${document.getElementById('keyInput').value}"\n`;
        }
        if(currentCrypto === 'DES') res += `Ключ: "${document.getElementById('keyInput').value}"\n`;
    } else {
        res += `Пароль: "${document.getElementById('passNormal').value}"\n`;
        res += `Пароль(спец): "${document.getElementById('passSpecial').value}"\n`;
    }

    const btn = document.getElementById('copyBtn');
    navigator.clipboard.writeText(res.trim()).then(() => {
        btn.innerText = "Скопировано!";
        btn.style.backgroundColor = "#333333";
        setTimeout(() => { btn.innerText = "Скопировать"; }, 2000);
    }).catch(() => {
        let t = document.createElement("textarea");
        t.value = res.trim(); document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
        btn.innerText = "Скопировано!";
        btn.style.backgroundColor = "#333333";
        setTimeout(() => { btn.innerText = "Скопировать"; }, 2000);
    });
}

document.getElementById('infoModalContent').addEventListener('scroll', function() {
    const btn = document.getElementById('scrollTopBtn');
    if (this.scrollTop > 150) {
        btn.classList.add('show');
    } else {
        btn.classList.remove('show');
    }
});

buildDynamicInputs();
