const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwgx3cnrPwDuIcrqwr-y-QINtlD4ZpE1v0CeOAdsYUPcfL6kZXVaocgZC0FVfE39pxJ6Q/exec";

function requireLogin() {
  if (!localStorage.getItem("user") || !localStorage.getItem("pass")) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
