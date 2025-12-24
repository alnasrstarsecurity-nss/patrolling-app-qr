const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyzqcvWPeHEvIAMoITDnoNZZG_dYe1z1z3L9aDevRqWeQiORTc_vfL-Bo6VB3MNJ5aSFw/exec";

function requireLogin() {
  if (!localStorage.getItem("user") || !localStorage.getItem("pass")) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
