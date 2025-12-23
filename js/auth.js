const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyIAAPSRFzd6BuIioh1LloqI1xSGCwiFC4EH6M1StbCpshrHqUGKhXK_xophA61Zg9b/exec";

function requireLogin() {
  if (!localStorage.getItem("user") || !localStorage.getItem("pass")) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
