const contactSection = document.getElementById("contact-section");
const toggle = document.getElementById("guardianToggle");
const statusText = document.getElementById("status");

let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

let audioContext;
let analyser;
let dataArray;
let stream;

// =======================
// CONTACT SECTION
// =======================

function renderContacts() {

  if (contacts.length < 3) {
    contactSection.innerHTML = `
      <h2>Add Emergency Contact (${contacts.length}/3)</h2>
      <input id="name" placeholder="Name">
      <input id="phone" placeholder="Phone (+91...)">
      <button onclick="addContact()">Save</button>
    `;
  } else {

    let details = "";

    contacts.forEach((c, index) => {
      details += `
        <div class="contact-item">
          <p>${index + 1}. ${c.name} - ${c.phone}</p>
          <button onclick="editContact(${index})">Edit</button>
        </div>
      `;
    });

    contactSection.innerHTML = `
      <div class="contact-card">
        <strong>Your Contacts</strong>
        <div class="contact-details">
          ${details}
        </div>
      </div>
    `;
  }
}

function addContact() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !phone) {
    alert("Fill all fields");
    return;
  }

  contacts.push({ name, phone });
  localStorage.setItem("contacts", JSON.stringify(contacts));
  renderContacts();
}

// ✅ NEW — Edit Only Selected Contact
function editContact(index) {

  const newName = prompt("Edit Name:", contacts[index].name);
  if (!newName) return;

  const newPhone = prompt("Edit Phone:", contacts[index].phone);
  if (!newPhone) return;

  contacts[index] = {
    name: newName.trim(),
    phone: newPhone.trim()
  };

  localStorage.setItem("contacts", JSON.stringify(contacts));
  renderContacts();
}

renderContacts();


// =======================
// GUARDIAN MODE
// =======================

toggle.addEventListener("change", async () => {

  if (toggle.checked) {

    if (contacts.length < 3) {
      alert("Add 3 emergency contacts first");
      toggle.checked = false;
      return;
    }

    statusText.innerText = "Listening...";
    statusText.style.color = "#b9375e";

    await startListening();

  } else {

    stopListening();
    statusText.innerText = "Inactive";
    statusText.style.color = "black";
  }
});


// =======================
// AUDIO LISTENING
// =======================

async function startListening() {

  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);

    source.connect(analyser);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    detectSound();

  } catch (error) {
    alert("Microphone access denied");
    toggle.checked = false;
  }
}

function stopListening() {

  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  if (audioContext) {
    audioContext.close();
  }
}


// =======================
// SOUND DETECTION
// =======================

function detectSound() {

  function check() {

    analyser.getByteFrequencyData(dataArray);

    let volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

    // If loud scream detected
    if (volume > 80) {
      triggerEmergency();
      return;
    }

    if (toggle.checked) {
      requestAnimationFrame(check);
    }
  }

  check();
}


// =======================
// EMERGENCY TRIGGER
// =======================

function triggerEmergency() {

  stopListening();
  statusText.innerText = "Emergency Triggered!";
  statusText.style.color = "red";

  getLocationAndAlert();
}


// =======================
// LOCATION + ALERT
// =======================

function getLocationAndAlert() {

  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(position => {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const locationLink = `https://www.google.com/maps?q=${lat},${lon}`;

    console.log("Sending alert to contacts...");
    console.log("Location:", locationLink);

    alert("Emergency Alert Sent with Location!");

    // Later → send to backend API here

  }, () => {
    alert("Location access denied");
  });
}
