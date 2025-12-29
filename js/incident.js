

/* ===============================
   🔐 PAGE PROTECTION
================================ */
function requireLogin() {
  if ((localStorage.getItem("LOGGED_IN") || "").toUpperCase() !== "YES") {
    window.location.replace("index.html");
  }
}

requireLogin();

document.addEventListener("DOMContentLoaded", () => {
  const loginState = localStorage.getItem("LOGGED_IN");
  console.log("AQCL LOGIN STATE =", loginState);

  if ((loginState || "").toUpperCase() !== "YES") {
    window.location.replace("index.html");
  }
});

/* ===============================
   CONFIG
================================ */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxkGuDpLARWufW1NKPSOYzBqyEy3Yf5NdvhgIczb_pGIXIL03UZ-Kqg-PxafT3U4hVc8A/exec";

const form = document.getElementById("incidentform");
const status = document.getElementById("status");

/* ===============================
   RADIO HELPER
================================ */
function radio(name) {
  const r = document.querySelector(`input[name="${name}"]:checked`);
  return r ? r.value : "";
}

/* ===============================
   date format
================================ */
function toDDMMYYYY(dateValue) {
  if (!dateValue) return "";

  // normalize separator ( / or - )
  const parts = dateValue.includes("/")
    ? dateValue.split("/")
    : dateValue.split("-");

  // parts = [yyyy, mm, dd]
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];

  return `${d}/${m}/${y}`;
}



/* ===============================
   SIGNATURE PAD (MOUSE + TOUCH)
================================ */
function initSignaturePad(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");

   const submitBtn = document.getElementById("submitBtn");
let signed = false;

// disable submit initially (safety)
submitBtn.disabled = true;

ctx.lineWidth = 2.5;
ctx.lineCap = "round";

let drawing = false;

  // Make canvas internal size match CSS
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000000"; // black color

  let drawing = false;

  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - r.left,
        y: e.touches[0].clientY - r.top
      };
    }
    return {
      x: e.clientX - r.left,
      y: e.clientY - r.top
    };
  }

  function startDraw(e) {
    e.preventDefault();
    drawing = true;

     signed = true;
  submitBtn.disabled = false;
     
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }

  function draw(e) {
    if (!drawing) return;
    e.preventDefault();
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  function endDraw(e) {
    if (!drawing) return;
    e.preventDefault();
    drawing = false;
  }

  // Mouse events
  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", endDraw);
  canvas.addEventListener("mouseleave", endDraw);

  // Touch events
  canvas.addEventListener("touchstart", startDraw, { passive: false });
  canvas.addEventListener("touchmove", draw, { passive: false });
  canvas.addEventListener("touchend", endDraw);

  // Clear function
  return () => ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Initialize both pads
const clearWitnessSignature = initSignaturePad("witnessSignPad");
const clearSupSignature = initSignaturePad("supSignPad");

// Attach clear buttons
window.clearWitnessSignature = clearWitnessSignature;
window.clearSupSignature = clearSupSignature;


/* ===============================
   FORM SUBMISSION
================================ */
form.addEventListener("submit", e => {
  e.preventDefault();

  status.innerText = "Submitting...";
  status.style.color = "blue";

 const attachmentTypes = Array.from(form.querySelectorAll('input[name="attachmentType"]:checked'))
  .map(cb => cb.value)
  .join(", "); 

  /* ---- PAYLOAD (MATCHES APPS SCRIPT 100%) ---- */
  const payload = {
    action: "submitIncident",

      // Main info
      name: form.name.value,
      designation: form.designation.value,
      empno: form.empno.value,
      location: form.location.value,
      contact: form.contact.value,
      shift: form.shift.value,
      exactLocation: form.exactLocation.value,
      date: form.date.value,
      time: form.time.value,
      blueplate: form.blueplate.value,
      incidentType: form.incidentType.value,
      otherIncident: form.otherIncident.value,

      // Witness info
      witnessName: form.witnessName.value,
      witnessContact: form.witnessContact.value,
      witnessSign: form.witnessSign.value,
      briefIncident: form.briefIncident.value,
     
      // Attachments
      attachmentType: form.attachmentType.value,
      attach1: form.attach1.value,
      attach2: form.attach2.value,
      attach3: form.attach3.value,
      attach4: form.attach4.value,

      // Reporting info
      reportedBy: form.reportedBy.value,
      supSign: form.supSign.value,
      reportText: form.reportText.value,

  };

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  })
    .then(r => r.json())
    .then(res => {
      if (res.status === "success") {
        status.innerText = "✅ Submitted Successfully";
        status.style.color = "green";
        form.reset();
        clearSignature();
        setTimeout(() => status.innerText = "", 3000);
      } else {
        status.innerText = "❌ Submission Failed";
        status.style.color = "red";
      }
    })
    .catch(() => {
      status.innerText = "❌ Network Error";
      status.style.color = "red";
    });
});

/* ===============================
   LOGOUT
================================ */
function logout() {
  localStorage.clear();
  location.href = "index.html";
}
