const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzU-eJMV2uZwj46PjQHOW050Va_ZoJCUNkTZVUtoKqkhEh43b2yxrHDYf9J1vPOljHfvQ/exe";

function requireLogin() {
  if (!localStorage.getItem("user") || !localStorage.getItem("pass")) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
