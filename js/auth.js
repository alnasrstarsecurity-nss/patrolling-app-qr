const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzn7L0ArudpLD8cmzUOt-fYvUsAmUsGR50zyZSeb4zFKvN7Dsmmg3m9R1_pSABO49zxyg/exec";

function requireLogin() {
  if (!localStorage.getItem("user") || !localStorage.getItem("pass")) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
