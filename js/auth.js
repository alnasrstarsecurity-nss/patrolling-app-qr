const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwckTjNKdNU3PNKbAL3qkWYvdhVGtjMv5nWcCkfTkN-4KrEh8RhR3L361l-3XwPo9HZcw/exec";

function requireLogin() {
  if (!localStorage.getItem("user") || !localStorage.getItem("pass")) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
