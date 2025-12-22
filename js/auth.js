const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzp5StdEZYl1UwkXSPYjuGFGZrIiMwZXtaKJ-xtouvbhyo1FrmE4aH8DUiP6SN9o7G4Ow/exec";

function requireLogin() {
  if (!localStorage.getItem("user") || !localStorage.getItem("pass")) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
