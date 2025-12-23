const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx8UY3MHF3WKbx6PLfx4MBD8Fy4BFb3V_cx0AOXm_8K9T1CgCxyQsPCRivLj9_CjlL5XA/exec";

function requireLogin() {
  if (!localStorage.getItem("user") || !localStorage.getItem("pass")) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
