/* ===============================
   🔐 PAGE PROTECTION
================================ */


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
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzuRPXYnpKeL4IpdSVeUugvB4DPec_shsw0dQLuPHopo882l6AFUG6ZAqwWpNjWw-INUw/exec";

const form = document.getElementById("aqclForm");
const status = document.getElementById("status");

/* ===============================
   RADIO HELPER
================================ */
function radio(name) {
  const r = document.querySelector(`input[name="${name}"]:checked`);
  return r ? r.value : "";
}

function resizeCanvasToDisplaySize(canvas) {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
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



/* NEW SIGNATURE CODE*/
function initSignaturePad(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
   
//disable sibmit button
   const submitBtn = document.getElementById("submitBtn");
   let signed = false;
//disable sibmit button
   
  // Match internal canvas size to CSS size (only once)
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000000";

  let drawing = false;
   // disabled initially
   submitBtn.disabled = true; 
   // disabled initially
   
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
     //focus issue
    if (document.activeElement) {
    document.activeElement.blur();
      //focus issue
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
  return () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  signed = false;
  submitBtn.disabled = true;};
}

// Initialize ONE signature pad
const clearAqclSignature = initSignaturePad("sign");

// Expose clear button function if you have one
window.clearAqclSignature = clearAqclSignature;


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

    signature: document.getElementById("sign").toDataURL(),
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
        clearAqclSignature();
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
