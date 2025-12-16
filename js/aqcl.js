const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbydAeCCsW7MGoa0zur8Uawu3ivJG-jpB4Le6HDaGEqxzLEEL1znrEhIpmT-4_EGIRpqRA/exec";

document.getElementById("aqclForm").addEventListener("submit", submitAQCL);

function radio(name) {
  const r = document.querySelector(`input[name="${name}"]:checked`);
  return r ? r.value : "";
}

function yn(id) {
  return document.getElementById(id).checked ? "YES" : "NO";
}

const canvas = document.getElementById("sign");
const ctx = canvas.getContext("2d");

ctx.lineWidth = 2;
ctx.lineCap = "round";

let drawing = false;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}

window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

function getPos(e) {
  const rect = canvas.getBoundingClientRect();

  if (e.touches) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  }
  return { x: e.offsetX, y: e.offsetY };
}

function startDraw(e) {
  e.preventDefault();
  drawing = true;
  const pos = getPos(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
  if (!drawing) return;
  e.preventDefault();
  const pos = getPos(e);
  ctx.lineTo(pos.x, pos.y);
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

function clearSign() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}



/* FILE → BASE64 */
function toBase64(file) {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.readAsDataURL(file);
  });
}


function submitAQCL(e) {
  e.preventDefault();

  document.getElementById("status").innerText = "Submitting...";

  const data = {
    action: "aqcl",
    username: localStorage.user,
    password: localStorage.pass,
    accommodation: accName.value,
    guardPosition: radio("guardPosition"),
    numGuards: numGuards.value,
    guardAppearance: guardAppearance.value,
    deskAppearance: deskAppearance.value,
    guardContact: guardContact.value,
    walkPatrol: radio("walkPatrol"),
    patrolEffective: radio("patrolEffective"),
    changesMade: changesMade.value,
    qrCheck: radio("qrCheck"),
    lastVisit: lastVisit.value,
    supervisorName: supervisorName.value,
    supervisors7: supervisors7.value,
    keyCabinet: yn("keyCabinet"),
    keyLog: yn("keyLog"),
    keysAudited: keysAudited.value,
    camerasWorking: yn("camerasWorking"),
    numCameras: numCameras.value,
    acs: acs.value,
    perimeter: perimeter.value,
    apartmentInspection: apartmentInspection.value,
    apartmentRemark: apartmentRemark.value,
    actionsTaken: actionsTaken.value,
    guard1cag: `Communication:${radio("g1_comm")} | Awareness:${radio("g1_aware")} | Grooming:${radio("g1_groom")}`,
    guard2cag: `Communication:${radio("g2_comm")} | Awareness:${radio("g2_aware")} | Grooming:${radio("g2_groom")}`,
    patrollingSupervisor: patrollingSupervisor.value,
    serial: serial.value,
    buildingSecurity: buildingSecurity.value,
    securityStaffNumber: securityStaffNumber.value,
    landline: landline.value,
    dutyMobile: dutyMobile.value,
    signature: sign.toDataURL()
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(r => r.json())
  .then(res => {
    if (res.status === "success") {
      status.innerText = "✅ Submitted Successfully";
      document.getElementById("aqclForm").reset();
      clearSign();
      setTimeout(() => status.innerText = "", 2000);
    } else {
      status.innerText = "❌ " + res.message;
    }
  })
  .catch(() => status.innerText = "❌ Network error");
}
