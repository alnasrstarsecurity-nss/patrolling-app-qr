const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzuRPXYnpKeL4IpdSVeUugvB4DPec_shsw0dQLuPHopo882l6AFUG6ZAqwWpNjWw-INUw/exec";

function requireLogin() {
  if (!localStorage.getItem("user") || !localStorage.getItem("pass")) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
