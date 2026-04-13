async function downloadAppLocally() {
    try {
        const btn = document.getElementById('downloadActionBtn');
        const originalText = btn.innerText;
        btn.innerText = "Подготовка...";
        btn.style.opacity = "0.7";
        btn.disabled = true;

        let docClone = document.documentElement.cloneNode(true);

        docClone.querySelector('.fade-overlay').classList.remove('active');
        docClone.querySelector('#menuBtn').classList.remove('open');
        docClone.querySelector('#settingsMenu').classList.remove('open');
        docClone.querySelector('body').style.overflow = '';

        const downloadBtnClone = docClone.querySelector('button[onclick="openDownloadModal()"]');
        if (downloadBtnClone) downloadBtnClone.remove();

        const downloadModalClone = docClone.querySelector('#downloadModal');
        if (downloadModalClone) downloadModalClone.remove();

        const links = docClone.querySelectorAll('link[rel="stylesheet"]');
        for (let link of links) {
            if (link.href) {
                try {
                    const resp = await fetch(link.href);
                    if(resp.ok) {
                        const css = await resp.text();
                        const style = document.createElement('style');
                        style.textContent = css;
                        link.replaceWith(style);
                    }
                } catch(e) {}
            }
        }

        const scripts = docClone.querySelectorAll('script[src]');
        for (let script of scripts) {
            if (script.src) {
                try {
                    const resp = await fetch(script.src);
                    if(resp.ok) {
                        const js = await resp.text();
                        const newScript = document.createElement('script');
                        newScript.textContent = js;
                        script.replaceWith(newScript);
                    }
                } catch(e) {}
            }
        }

        const fullHTML = "<!DOCTYPE html>\n<html lang=\"ru\">\n" + docClone.innerHTML + "\n</html>";
        
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), fullHTML], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "ASL.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        btn.innerText = "Скачано!";
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.opacity = "1";
            btn.disabled = false;
        }, 2000);
    } catch(err) {
        alert("Ошибка: " + err.message);
        const btn = document.getElementById('downloadActionBtn');
        btn.innerText = "Ошибка";
        setTimeout(() => {
            btn.innerText = "Скачать";
            btn.style.opacity = "1";
            btn.disabled = false;
        }, 2000);
    }
}

function createFile() {
    let dataObj = {};
    dataObj["Пароль без спец. символов"] = document.getElementById('passNormal').value;
    dataObj["Пароль со спец. символами"] = document.getElementById('passSpecial').value;
    
    if (opMode === 'auto') {
        dataObj["Протокол"] = currentPassProto;
    } else {
        dataObj["Элементы"] = [];
        manualData.forEach(item => {
            if (item.id !== null) {
                dataObj["Элементы"].push({
                    "Название": manualCategories[item.id],
                    "Значение": item.value
                });
            }
        });
    }

    const jsonStr = JSON.stringify(dataObj, null, 4);
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ASL_Password_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
