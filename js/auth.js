const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxsspM-9TgJm2W1IRpGH9gFpdS3IO58ByiZvXij0DjS2qX5yPpV-XLjGZi5tT5WEkSCyw/exec";

function requireLogin() {
  if (!localStorage.getItem("user") || !localStorage.getItem("pass")) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
