const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbydAeCCsW7MGoa0zur8Uawu3ivJG-jpB4Le6HDaGEqxzLEEL1znrEhIpmT-4_EGIRpqRA/exec";

document.getElementById("aqclForm").addEventListener("submit", submitAQCL);

function radio(name) {
  const r = document.querySelector(`input[name="${name}"]:checked`);
  return r ? r.value : "";
}

function yn(id) {
  return document.getElementById(id).checked ? "YES" : "NO";
}

function resizeCanvas();
window.addEventListener("resize", resizeCanvas);

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
