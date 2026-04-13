function genAES() {
    document.getElementById('ivInput').value = bytesToHex(crypto.getRandomValues(new Uint8Array(12)));
    document.getElementById('keyInput').value = bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
    hideError();
}

function genDES() {
    document.getElementById('keyInput').value = bytesToHex(crypto.getRandomValues(new Uint8Array(8)));
    hideError();
}
