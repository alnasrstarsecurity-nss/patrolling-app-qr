const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx1tnN3ZuYYyvDpzpBoqFm2wMH-jYINynqUguP8KxhcmefuDoDaecOiyLcztfxvkYOP-Q/exec";

function requireLogin() {
  if (!localStorage.getItem("user") || !localStorage.getItem("pass")) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
