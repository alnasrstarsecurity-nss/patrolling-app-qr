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
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxELF7oYmYblpYiW_-TH0ZKoZo6krCqhzOxh3aGl-I8eN_xQOnLlSWsaxSsJSyrJRg4zw/exec";

const form = document.getElementById("aqclForm");
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
const canvas = document.getElementById("sign");
const ctx = canvas.getContext("2d");

ctx.lineWidth = 2.5;
ctx.lineCap = "round";

let drawing = false;

function resizeCanvas() {
  const r = canvas.getBoundingClientRect();
  canvas.width = r.width;
  canvas.height = r.height;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function getPos(e) {
  const r = canvas.getBoundingClientRect();
  if (e.touches) {
    return {
      x: e.touches[0].clientX - r.left,
      y: e.touches[0].clientY - r.top
    };
  }
  return {
    x: e.offsetX,
    y: e.offsetY
  };
}

function startDraw(e) {
  e.preventDefault();
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

function clearSignature() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* ===============================
   FORM SUBMISSION
================================ */
form.addEventListener("submit", e => {
  e.preventDefault();

  status.innerText = "Submitting...";
  status.style.color = "blue";

  /* ---- GUARD CAG COMBINATION ---- */
  const guard1CAG = [
    radio("g1_comm"),
    radio("g1_awar"),
    radio("g1_groom")
  ].filter(Boolean).join(" ");

  const guard2CAG = [
    radio("g2_comm"),
    radio("g2_awar"),
    radio("g2_groom")
  ].filter(Boolean).join(" ");

  /* ---- PAYLOAD (MATCHES APPS SCRIPT 100%) ---- */
  const payload = {
    action: "submitAQCL",

    accName: accName.value,
    guardPosition: radio("guardPosition"),
    numGuards: numGuards.value,
    guardAppearance: guardAppearance.value,
    deskAppearance: deskAppearance.value,
    guardContact: guardContact.value,
    walkPatrol: radio("walkPatrol"),
    patrolEffective: radio("patrolEffective"),
    changesMade: changesMade.value,
    qrCheck: radio("qrCheck"),
    supervisorLastVisit: toDDMMYYYY(supervisorLastVisit.value),
    //supervisorLastVisit: supervisorLastVisit.value,
    supervisorName: supervisorName.value,
    supervisors7Days: supervisors7Days.value,
    keyCabinet: radio("keyCabinet"),
    keyLog: radio("keyLog"),
    keysAudited: keysAudited.value,
    camerasWorking: radio("camerasWorking"),
    numCameras: numCameras.value,
    acsFunctional: acsFunctional.value,
    perimeterSecure: perimeterSecure.value,
    apartmentInspection: apartmentInspection.value,
    apartmentRemark: apartmentRemark.value,
    actionsTaken: actionsTaken.value,

    guard1CAG: guard1CAG,
    guard2CAG: guard2CAG,

    patrollingSupervisor: patrollingSupervisor.value,
    serialNumber: serialNumber.value,
    buildingSecurityName: buildingSecurityName.value,
    securityStaffNumber: securityStaffNumber.value,

    signature: canvas.toDataURL(),
    buildingLandline: buildingLandline.value,
    securityDutyMobile: securityDutyMobile.value
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
