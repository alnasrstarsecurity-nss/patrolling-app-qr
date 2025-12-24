const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzsCbdB_u06N2qu704xlNB5zmvXeO7u13kepjYx5TwM8qa3oRKTSAvQU40Szk9o3q3THQ/exec";

function requireLogin() {
  if (!localStorage.getItem("user") || !localStorage.getItem("pass")) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
