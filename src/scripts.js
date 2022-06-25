const keys = {
    upperCase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowerCase: "abcdefghijklmnopqrstuvwxyz",
    number: "0123456789",
    symbol: "!@#$%^&*()_+~\\`|}{[]:;?,./-="
}

const getKey = [
    function upperCase() {
        return keys.upperCase[Math.floor(Math.random() * keys.upperCase.length)];
    },
    function lowerCase() {
        return keys.lowerCase[Math.floor(Math.random() * keys.lowerCase.length)];
    },
    function number() {
        return keys.number[Math.floor(Math.random() * keys.number.length)];
    },
    function symbol() {
        return keys.symbol[Math.floor(Math.random() * keys.symbol.length)];
    }
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const length = 20;
const passwordInput = document.getElementById("password-input");
const autoCopyCheckbox = document.getElementById("autocopy");
const storePasswordsCheckbox = document.getElementById("store");
const saveSettingsCheckbox = document.getElementById("savesettings");
const passwordListUl = document.getElementById("password-list");
const snackbar = document.getElementById("snackbar");
const storedPasswordsPanel = document.getElementById("storedpasswords");

function createPassword() {

    let password = "";
    while (password.length < length) {
        let keyToAdd = getKey[Math.floor(Math.random() * getKey.length)];
        password += keyToAdd();
    }

    if (storePasswordsCheckbox.checked == true)
        addPasswordToList(password);

    passwordInput.value = password;

    var autoCopyToClipboard = autoCopyCheckbox.checked;
    if (autoCopyToClipboard)
        copyToClipboard();
}

function addPasswordToList(password) {
    var ul = passwordListUl;
    var dateTime = getCurrentDateTimeSnapshot();
    var template = `${password}<br><small><strong>${dateTime}</strong></small>`;

    var li = document.createElement('li');
    li.innerHTML = template;
    li.addEventListener('click', () => handleLiClick(password));
    ul.appendChild(li);
}

function handleLiClick(text) {
    passwordInput.value = text;
    copyToClipboard(text);
}

function getCurrentDateTimeSnapshot() {
    const d = new Date();
    return `${d.getDay()}/${months[d.getMonth()]} at ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}

function copyToClipboard(text) {
    if (text === '' || text === undefined) {
        text = passwordInput.value;
    }

    navigator.clipboard.writeText(text);

    snackbar.className = "show";
    snackbar.innerHTML = `${text} copied to clipboard`;
    setTimeout(function () {
        snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
}

function loadSettings() {
    let autoCopy = localStorage.getItem('settings.autoCopy');
    let storePasswords = localStorage.getItem('settings.storePasswords');
    let saveSettings = localStorage.getItem('settings.saveSettings');

    autoCopyCheckbox.checked = (autoCopy === 'true');
    storePasswordsCheckbox.checked = (storePasswords === 'true');
    saveSettingsCheckbox.checked = (saveSettings === 'true');
}

function saveSettings() {
    if (saveSettingsCheckbox.checked) {
        localStorage.setItem('settings.autoCopy', autoCopyCheckbox.checked);
        localStorage.setItem('settings.storePasswords', storePasswordsCheckbox.checked);
        localStorage.setItem('settings.saveSettings', saveSettingsCheckbox.checked);
    }
}

const loaded = () => {
    createPassword();
    loadSettings();
};

document.addEventListener('DOMContentLoaded', loaded);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const reg = await navigator.serviceWorker.register('service-worker.js');
            console.log('Service worker registered! 😎', reg);
        } catch (err) {
            console.log('😥 Service worker registration failed: ', err);
        }
    });
}