const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyeheGbndfc9xDozvqXGHDr640asu58FvBSReThozS82vWFsNVbwGOveCld3eBa55NUTw/exec";

function requireLogin() {
  if (!localStorage.getItem("user") || !localStorage.getItem("pass")) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
