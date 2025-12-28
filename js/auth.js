const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyiVvi7Xl_Lxd5WW6XKy-AEldHZ3ExzcqHBzkSFePeLBfecikrbFOkDhoD4g6JBRzTbqQ/exec";

function requireLogin() {
  if (!localStorage.getItem("user") || !localStorage.getItem("pass")) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
