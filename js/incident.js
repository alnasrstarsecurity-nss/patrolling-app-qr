

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
// CANVASES & CONTEXTS
const witnessCanvas = document.getElementById("witnessSignPad");
const witnessCtx = witnessCanvas.getContext("2d");

const supCanvas = document.getElementById("supSignPad");
const supCtx = supCanvas.getContext("2d");

// Set line style
witnessCtx.lineWidth = 2.5;
witnessCtx.lineCap = "round";

supCtx.lineWidth = 2.5;
supCtx.lineCap = "round";

// Resize canvases
function resizeCanvas(canvas) {
  const r = canvas.getBoundingClientRect();
  canvas.width = r.width;
  canvas.height = r.height;
}

resizeCanvas(witnessCanvas);
resizeCanvas(supCanvas);

window.addEventListener("resize", () => {
  resizeCanvas(witnessCanvas);
  resizeCanvas(supCanvas);
});

// Initialize signature pad
function initSignaturePad(canvas, ctx) {
  let drawing = false;

  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - r.left,
        y: e.touches[0].clientY - r.top
      };
    }
    return { x: e.offsetX, y: e.offsetY };
  }

  function startDraw(e) {
    e.preventDefault();
    if (document.activeElement) document.activeElement.blur();
    drawing = true;
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
    e.preventDefault();
    drawing = false;
  }

  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", endDraw);
  canvas.addEventListener("mouseleave", endDraw);

  canvas.addEventListener("touchstart", startDraw, { passive: false });
  canvas.addEventListener("touchmove", draw, { passive: false });
  canvas.addEventListener("touchend", endDraw);
}

// Initialize both pads
initSignaturePad(witnessCanvas, witnessCtx);
initSignaturePad(supCanvas, supCtx);

// Clear buttons
window.clearWitnessSignature = () => {
  witnessCtx.clearRect(0, 0, witnessCanvas.width, witnessCanvas.height);
};
window.clearSupSignature = () => {
  supCtx.clearRect(0, 0, supCanvas.width, supCanvas.height);
};

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
