const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw5I4eQnpUrAmsQgqPjEfRL3IPzzu8IB2zlmuWFsBpAf0rcAG7OPa3Sx92JdLm3175NZA/exec";

let lat = "", lng = "";

/* GPS */
navigator.geolocation.getCurrentPosition(p => {
  lat = p.coords.latitude;
  lng = p.coords.longitude;
});

/* SIGNATURE */
const canvas = document.getElementById("sign");
const ctx = canvas.getContext("2d");
let draw = false;

canvas.onmousedown = () => draw = true;
canvas.onmouseup = () => { draw = false; ctx.beginPath(); };
canvas.onmousemove = e => {
  if (!draw) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
};

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

async function submitVisit() {

  const statusEl = document.getElementById("status");
  statusEl.style.color = "black";
  statusEl.innerText = "Submitting...";

  try {
    if (!location.value) {
      alert("Please select location");
      return;
    }

    if (photos.files.length > 5) {
      alert("Maximum 5 photos allowed");
      return;
    }

    const photos64 = [];
    for (let f of photos.files) {
      photos64.push(await toBase64(f));
    }

    const payload = {
      action: "submit",
      username: localStorage.getItem("user"),
      password: localStorage.getItem("pass"),
      location: location.value,
      checklist: [...document.querySelectorAll(".chk:checked")].map(c => c.value),
      remarks: remarks.value,
      lat: lat || "",
      lng: lng || "",
      photos: photos64,
      signature: canvas.toDataURL(),
      syncStatus: navigator.onLine ? "ONLINE" : "OFFLINE"
    };

    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status === "success") {
      statusEl.style.color = "green";
      statusEl.innerText = "✅ Submitted successfully";

      resetForm();

      // OPTIONAL: auto-clear message after 2 seconds
      setTimeout(() => {
        statusEl.innerText = "";
      }, 2000);

    } else {
      statusEl.style.color = "red";
      statusEl.innerText = "❌ Submission failed";
    }

  } catch (err) {
    console.error(err);
    statusEl.style.color = "red";
    statusEl.innerText = "❌ Network error";
  }
}


//reset form
function resetForm() {
  document.getElementById("location").selectedIndex = 0;
  document.getElementById("remarks").value = "";
  document.querySelectorAll(".chk").forEach(c => c.checked = false);
  document.getElementById("photos").value = "";
  clearSign();
}
