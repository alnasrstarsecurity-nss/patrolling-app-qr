const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwHVwHgL8Aed_KbSMsY1inr692SXI6bcjYzt_5803et6I7n9_PXMW3bB97NERSYXxYSJw/exec";

let lat="", lng="";

/* GPS */
navigator.geolocation.getCurrentPosition(p=>{
  lat=p.coords.latitude; lng=p.coords.longitude;
});

/* LOAD LOCATIONS */
fetch(SCRIPT_URL + "?action=locations")
  .then(r => r.json())
  .then(d => {
    const loc = document.getElementById("location");
    loc.innerHTML = "<option value=''>Select Location</option>";

    d.locations.forEach(l => {
      const o = document.createElement("option");
      o.textContent = l;
      o.value = l;
      loc.appendChild(o);
    });
  })
  .catch(() => {
    alert("Failed to load locations");
  });

/* SIGNATURE */
const canvas=document.getElementById("sign");
const ctx=canvas.getContext("2d");
let draw=false;

canvas.onmousedown=()=>draw=true;
canvas.onmouseup=()=>{draw=false;ctx.beginPath();}
canvas.onmousemove=e=>{
  if(!draw)return;
  ctx.lineTo(e.offsetX,e.offsetY);
  ctx.stroke();
};

function clearSign(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

/* FILE TO BASE64 */
const toBase64=f=>new Promise(r=>{
  const fr=new FileReader();
  fr.onload=()=>r(fr.result);
  fr.readAsDataURL(f);
});

/* SUBMIT */
async function submitVisit(){
  status.innerText="Submitting...";

  if(photos.files.length>5){
    alert("Max 5 photos"); return;
  }

  const photos64=[];
  for(let f of photos.files) photos64.push(await toBase64(f));

  fetch(SCRIPT_URL,{
    method:"POST",
    body:JSON.stringify({
      action:"submit",
      username:localStorage.getItem("user"),
      password:localStorage.getItem("pass"),
      location:location.value,
      checklist:[...document.querySelectorAll(".chk:checked")].map(c=>c.value),
      remarks:remarks.value,
      lat,lng,
      photos:photos64,
      signature:canvas.toDataURL(),
      syncStatus:navigator.onLine?"ONLINE":"OFFLINE"
    })
  })
  .then(r=>r.json())
  .then(res=>{
    if(res.status==="success"){
      status.innerText="✅ Submitted successfully";
      resetForm();
    }else{
      status.innerText="❌ Submit failed";
    }
  });
}

/* RESET FORM */
function resetForm(){
  location.selectedIndex=0;
  remarks.value="";
  document.querySelectorAll(".chk").forEach(c=>c.checked=false);
  photos.value="";
  clearSign();
}
