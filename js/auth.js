const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyBgEFoZzBP39VKtMEoQk7_DWihW2N37dREQGnx2bSFIj-77AlnR4K6QWIYYbrg-Ao3qw/exec";

function requireLogin() {
  if (!localStorage.getItem("user") || !localStorage.getItem("pass")) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
