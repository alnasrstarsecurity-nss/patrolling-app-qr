const FIRE_SCRIPT_URL ="https://script.google.com/macros/s/AKfycbwQHsbbuqD-j9r_m1xzZ_Y0LMQnwy5vlp__YChV6AWCsfz0fhDwfuhUpOsdhwhwYSkFEQ/exec";

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
   Cause → Others mandatory logic
================================ */

const causeSelect = document.getElementById("Cause");
const otherIncident = document.getElementById("OtherIncident");

// Ensure hidden on load
otherIncident.style.display = "none";
otherIncident.required = false;

causeSelect.addEventListener("change", () => {
  if (causeSelect.value === "Others") {
    otherIncident.style.display = "block";
    otherIncident.required = true;
  } else {
    otherIncident.style.display = "none";
    otherIncident.required = false;
    otherIncident.value = ""; // clear when not needed
  }
});

//alarm activated mandatory
// ✅ Alarm Activated – at least one required
const alarmChecks = document.querySelectorAll('input[name="AlarmActivated"]');
const alarmError = document.getElementById("alarmError");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // ✅ ALWAYS STOP native submit

  const checked = Array.from(alarmChecks).some(cb => cb.checked);

  if (!checked) {
    alarmError.style.display = "block";
    alarmChecks[0].focus();
    return;
  } else {
    alarmError.style.display = "none";
  }
});
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

form.addEventListener("submit", async e => {
  e.preventDefault();

    submitBtn.disabled = true;

  status.innerText = "Submitting...";
  status.style.color = "blue";

  // Build payload using EXACT SHEET COLUMN NAMES
  const payload = {
    "Timestamp": new Date().toLocaleString(),
    "Building Name": BuildingName.value,
    "Type of Incident": radio("TypeofInciden"),
    "Evacuated": radio("guardPosition"),
    "Date of Incident": Incidentdate.value,
    "Incident Time": Incidenttime.value,
    "Panel Reset Time": paneltime.value,

    "Alarm Activated In": getCheckedValues("AlarmActivated"),
    "Other Area": Area.value,

    "Occupant Name": OccupantName.value,
    "Occupant Nationality": OccupantNationality.value,
    "Floor No": FloorNo.value,
    "Flat No": FlatNo.value,
    "Staff Number": StaffNumber.value,
    "Department": Department.value,
    "Room No": RoomNo.value,

    "Occupant Was In": getCheckedValues("OccupantWasIn"),

    "Exhaust Fan": radio("ExhaustFan"),
    "Kitchen Cooking Hood": radio("KitchenCookingHood"),
    "Kitchen Door": radio("KitchenDoor"),
    "Fire Blanket Used": radio("FireBlanket"),
    "Fire Extinguisher Used": radio("FireExtinguisher"),

    "Type of Fire Extinguisher": getCheckedValues("TypeFireExtinguisher"),

    "Civil Defense Present": radio("Civil Defense"),
    "CAMS Activated": radio("CAMS"),
    "Injury Reported by Occupant": radio("Injury"),

    "Description of the Incident": DescriptionIncident.value,
    "Cause of the Incident": Cause.value,
     "Other Incident":OtherIncident.value,

    "Property Damage": radio("Damage"),
    "Property Damage Specify": SpecifyDamage.value,

    "Action Taken": Actiontaken.value,
    "Other Information": "",

    "Attachment 1": await filesToBase64(form.attach1, 10),
    "Attachment 2": await fileToBase64(form.attach2),
    "Attachment 3": await fileToBase64(form.attach3),
    "Attachment 4": await fileToBase64(form.attach4),

    "Guard Name": GuardName.value,
    "Guard Staff No": StaffNo.value,
    "Company Name": radio("Company"),

    "Inform QR Facilities Staff": radio("InformQR"),
    "Staff Name": QRStafName.value,

    "Meet the Occupant During The Incident": radio("MeetOccupant"),

    "Inform Cabin Crew Housing officer": radio("informCabinCrew"),
    "Housing Officer Visit the Site": radio("housingofficerVisit"),
    "Housing officer Name": HousingOfficerName.value
  };

  fetch(FIRE_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  })
    .then(r => r.json())
    .then(res => {
      if (res.status === "success") {
        status.innerText = "✅ Submitted Successfully";
        status.style.color = "green";
        form.reset();
        submitBtn.disabled = false;
        setTimeout(() => status.innerText = "", 3000);
      } else {
        status.innerText = "❌ Submission Failed";
        status.style.color = "red";
      }
    })
    .catch(err => {
      status.innerText = "❌ Network Error";
      status.style.color = "red";
    });
});
