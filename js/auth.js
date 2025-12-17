const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz5-JEXsv5dbpgttB5T_l3PH_2qRcDtrRsBfb1ioyZoThVrCtNYjAgEw0XMVwFC_W3Ikw/exec";

function requireLogin() {
  if (!localStorage.getItem("user") || !localStorage.getItem("pass")) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
