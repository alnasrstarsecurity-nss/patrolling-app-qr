const FIRE_SCRIPT_URL ="https://script.google.com/macros/s/AKfycbxeHJXd2SYdv1flfd2hD-dhyLD7q7z7xVQWB5KKx5UFGwx2GgG4HEkwkDSlyFgeAdGCEA/exec";

const form = document.getElementById("fireForm");
const status = document.getElementById("status");
const submitBtn = form.querySelector('button[type="submit"]');

/* ===============================
   ATTACHMENT CONFIG
================================ */
const MAX_IMAGES = 10;
const attach1Input = document.getElementById("attach1");
const attach1Error = document.getElementById("attach1Error");

/* Limit image selection */
attach1Input.addEventListener("change", function () {
  if (this.files.length > MAX_IMAGES) {
    attach1Error.textContent = `⚠️ Maximum ${MAX_IMAGES} images allowed`;
    this.value = "";
  } else {
    attach1Error.textContent = "";
  }
});

/* Single file → base64 */
function fileToBase64(fileInput) {
  const file = fileInput.files[0];
  return new Promise(resolve => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

/* Multiple images → base64 array */
async function filesToBase64(fileInput, maxFiles = 10) {
  const files = Array.from(fileInput.files || []).slice(0, maxFiles);
  const results = [];

  for (const file of files) {
    const base64 = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
    results.push(base64);
  }
  return results;
}


//specify damage
const damageRadios = document.querySelectorAll('input[name="Damage"]');
const specifyDamage = document.getElementById("SpecifyDamage");

specifyDamage.style.display = "none";
specifyDamage.required = false;

damageRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "Yes" && radio.checked) {
      specifyDamage.required = true;
       specifyDamage.style.display = "block";
    } else if (radio.value === "No" && radio.checked) {
       specifyDamage.style.display = "none";
      specifyDamage.required = false;
      specifyDamage.value = ""; // optional: clear field
    }
  });
});
//specify damage

/* ===============================
  limit the input number and text
================================ */
document.addEventListener("input", function (e) {
  const el = e.target;

  /* 🔹 NUMBER inputs → digit limit */
  if (el.tagName === "INPUT" && el.type === "number" && el.dataset.maxdigits) {
    let value = el.value.replace(/\D/g, "");
    el.value = value.slice(0, el.dataset.maxdigits);
  }

  /* 🔹 TEXT inputs + TEXTAREA → character limit */
  if (
    (el.tagName === "INPUT" && el.type === "text") ||
    el.tagName === "TEXTAREA"
  ) {
    if (el.dataset.maxchars) {
      el.value = el.value.slice(0, el.dataset.maxchars);
    }
  }
});
/* ===============================
  alarm acctivated Other area hidden/show
================================ */

const otherAreaCheckbox = document.querySelector(
  'input[name="AlarmActivated"][value="Other Area"]'
);
const otherAreaWrapper = document.getElementById("otherAreaWrapper");
const areaInput = document.getElementById("Area");

otherAreaCheckbox.addEventListener("change", () => {
  if (otherAreaCheckbox.checked) {
    otherAreaWrapper.style.display = "block";
    areaInput.required = true;
    areaInput.focus();
  } else {
    otherAreaWrapper.style.display = "none";
    areaInput.required = false;
    areaInput.value = "";
  }
});
/* ===============================
   Cause → Others mandatory logic
================================ */

const causeSelect = document.getElementById("Cause");
const otherCause = document.getElementById("OtherCause");

// Ensure hidden on load
otherCause.style.display = "none";
otherCause.required = false;

causeSelect.addEventListener("change", () => {
  if (causeSelect.value === "Others") {
    otherCause.style.display = "block";
    otherCause.required = true;
  } else {
    otherCause.style.display = "none";
    otherCause.required = false;
    otherCause.value = ""; // clear when not needed
  }
});

//alarm activated mandatory
// ✅ Alarm Activated – at least one required
const alarmChecks = document.querySelectorAll('input[name="AlarmActivated"]');
const alarmError = document.getElementById("alarmError");

/*form.addEventListener("submit", function (e) {
  e.preventDefault(); // ✅ ALWAYS STOP native submit

  const checked = Array.from(alarmChecks).some(cb => cb.checked);

  if (!checked) {
    alarmError.style.display = "block";
    alarmChecks[0].focus();
    return;
  } else {
    alarmError.style.display = "none";
  }
});*/
//alarm activated mandatory

function radio(name) {
  const r = document.querySelector(`input[name="${name}"]:checked`);
  return r ? r.value : "";
}

function getCheckedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)]
    .map(c => c.value)
    .join(", ");
}

/* ===============================
   FIRE FORM SUBMISSION
================================ */
form.addEventListener("submit", async e => {
  e.preventDefault();
  submitBtn.disabled = true;

  status.innerText = "Submitting...";
  status.style.color = "blue";

  // ✅ Alarm Activated validation (at least one required)
  const checked = Array.from(alarmChecks).some(cb => cb.checked);
  if (!checked) {
    alarmError.style.display = "block";
    alarmChecks[0].focus();
    submitBtn.disabled = false;
    return;
  } else {
    alarmError.style.display = "none";
  }

  // ---- Prepare attachments ----
  const attach1 = await filesToBase64(form.attach1, 10);
  const attach2 = await fileToBase64(form.attach2);
  const attach3 = await fileToBase64(form.attach3);
  const attach4 = await fileToBase64(form.attach4);

  /* ---- PAYLOAD (camelCase + DD/MM/YYYY) ---- */
  const payload = {
    action: "submitfire",

    buildingName: BuildingName.value,
    typeOfIncident: radio("TypeofInciden"),
    evacuated: radio("guardPosition"),
    dateOfIncident: toDDMMYYYY(Incidentdate.value),
    incidentTime: Incidenttime.value,
    panelResetTime: paneltime.value,

    alarmActivatedIn: getCheckedValues("AlarmActivated"),
    otherArea: Area.value,

    occupantName: OccupantName.value,
    occupantNationality: OccupantNationality.value,
    floorNo: FloorNo.value,
    flatNo: FlatNo.value,
    staffNumber: StaffNumber.value,
    department: Department.value,
    roomNo: RoomNo.value,

    occupantWasIn: getCheckedValues("OccupantWasIn"),

    exhaustFan: radio("ExhaustFan"),
    kitchenCookingHood: radio("KitchenCookingHood"),
    kitchenDoor: radio("KitchenDoor"),
    fireBlanketUsed: radio("FireBlanket"),
    fireExtinguisherUsed: radio("FireExtinguisher"),

    typeOfFireExtinguisher: getCheckedValues("TypeFireExtinguisher"),

    civilDefensePresent: radio("Civil Defense"),
    camsActivated: radio("CAMS"),
    injuryReported: radio("Injury"),

    descriptionOfIncident: DescriptionIncident.value,
    causeOfIncident: Cause.value,
    otherCause: OtherCause.value,

    propertyDamage: radio("Damage"),
    propertyDamageSpecify: SpecifyDamage.value,
    actionTaken: Actiontaken.value,

    attach1: attach1,
    attach2: attach2,
    attach3: attach3,
    attach4: attach4,

    guardName: GuardName.value,
    guardStaffNo: StaffNo.value,
    companyName: radio("Company"),

    informQRStaff: radio("InformQR"),
    staffName: QRStafName.value,
    meetOccupantDuringIncident: radio("MeetOccupant"),

    informCabinCrew: radio("informCabinCrew"),
    housingOfficerVisit: radio("housingofficerVisit"),
    housingOfficerName: HousingOfficerName.value
  };

  // ---- SEND TO GOOGLE SCRIPT ----
  fetch(FIRE_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(r => r.json())
  .then(res => {
    if (res.status === "success") {
      status.innerText = "✅ Submitted Successfully";
      status.style.color = "green";

      // ---- Background PDF generation ----
      fetch(FIRE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generatepdf",
          row: res.row
        })
      }).catch(err => console.log("PDF generation error:", err));

      // ---- Reset form ----
      form.reset();
      submitBtn.disabled = false;
      specifyDamage.style.display = "none";
      specifyDamage.required = false;
      otherCause.style.display = "none";
      otherCause.required = false;
      setTimeout(() => status.innerText = "", 3000);

    } else {
      status.innerText = "❌ Submission Failed";
      status.style.color = "red";
      submitBtn.disabled = false;
    }
  })
  .catch(err => {
    console.error("REAL ERROR:", err);
    status.innerText = "❌ Server Error";
    status.style.color = "red";
    submitBtn.disabled = false;
  });
});

