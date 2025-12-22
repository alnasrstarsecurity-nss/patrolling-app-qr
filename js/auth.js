const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyOq9nOjEtE_6ywg5yAIlUf6y3aWYILYaDABhYBaUd55tivg5Df0N5O0cjvPI0TXNEJcw/exec";

function requireLogin() {
  if (!localStorage.getItem("user") || !localStorage.getItem("pass")) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
