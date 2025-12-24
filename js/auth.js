const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwraS8MX9sL2C_pHKD1Qhjj5VDEcxtp5zHyAqq1zeavLYR6aHzNt2wDFKjqMmouPXQbJg/exec";

function requireLogin() {
  if (!localStorage.getItem("user") || !localStorage.getItem("pass")) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
