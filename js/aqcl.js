const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwckTjNKdNU3PNKbAL3qkWYvdhVGtjMv5nWcCkfTkN-4KrEh8RhR3L361l-3XwPo9HZcw/exec";

const form = document.getElementById("aqclForm");
const status = document.getElementById("status");

/* ---------- RADIO HELPER ---------- */
function radio(name) {
  const r = document.querySelector(`input[name="${name}"]:checked`);
  return r ? r.value : "";
}

/* ---------- SIGNATURE ---------- */
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

function pos(e) {
  const r = canvas.getBoundingClientRect();
  if (e.touches) {
    return {
      x: e.touches[0].clientX - r.left,
      y: e.touches[0].clientY - r.top
    };
  }
  return { x: e.offsetX, y: e.offsetY };
}

function start(e) {
  e.preventDefault();
  drawing = true;
  const p = pos(e);
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
}
function move(e) {
  if (!drawing) return;
  e.preventDefault();
  const p = pos(e);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
}
function end(e) {
  e.preventDefault();
  drawing = false;
}

canvas.addEventListener("mousedown", start);
canvas.addEventListener("mousemove", move);
canvas.addEventListener("mouseup", end);
canvas.addEventListener("mouseleave", end);
canvas.addEventListener("touchstart", start, { passive: false });
canvas.addEventListener("touchmove", move, { passive: false });
canvas.addEventListener("touchend", end);

function clearSignature() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* ---------- SUBMIT ---------- */
form.addEventListener("submit", e => {
  e.preventDefault();

  status.innerText = "Submitting...";
  status.style.color = "blue";

  /* ---- BUILD GUARD CAG VALUES ---- */
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

  const payload = {
    action: "submitAQCL",   // ✅ FIXED

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
    supervisorLastVisit: supervisorLastVisit.value,
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

    guard1CAG: guard1CAG,   // ✅ CORRECT
    guard2CAG: guard2CAG,   // ✅ CORRECT

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
