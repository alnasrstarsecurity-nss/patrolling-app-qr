const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyj2zkMImhOo0YhWb3aQlsUSJOwBcymHYaAQfIXfNKR1VQxSbdgiN-u8RXIxnIxePoUwA/exec";

function requireLogin() {
  if (!localStorage.getItem("user") || !localStorage.getItem("pass")) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
