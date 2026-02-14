const contactSection = document.getElementById("contact-section");
const toggle = document.getElementById("guardianToggle");
const statusText = document.getElementById("status");

let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

// 🔥 NEW — USER NAME (asked once & stored)
let userName = localStorage.getItem("userName");

if (!userName) {
  userName = prompt("Enter your name for emergency alerts:");
  if (userName && userName.trim() !== "") {
    localStorage.setItem("userName", userName.trim());
  } else {
    userName = "Vigilix User";
  }
}

let audioContext;
let analyser;
let dataArray;
let stream;
let recognition;
let emergencyTriggered = false;


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

    emergencyTriggered = false;
    statusText.innerText = "Listening...";
    statusText.style.color = "#b9375e";

    await startListening();
    startKeywordDetection();

  } else {
    stopListening();
    stopKeywordDetection();
    statusText.innerText = "Inactive";
    statusText.style.color = "black";
  }
});


// =======================
// AUDIO LISTENING
// =======================

/*async function startListening() {
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
}*/ 

async function startListening() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // 🔥 THIS LINE FIXES MOBILE + NETLIFY ISSUE
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

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
  let loudCount = 0;

  function check() {
    if (!toggle.checked || emergencyTriggered) return;

    analyser.getByteFrequencyData(dataArray);
    let volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

    if (volume > 25) {
      loudCount++;
      if (loudCount > 15) {
        triggerEmergency();
        return;
      }
    } else {
      loudCount = 0;
    }

    requestAnimationFrame(check);
  }

  check();
}


// =======================
// KEYWORD DETECTION
// =======================

function startKeywordDetection() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.log("Speech Recognition not supported");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "en-US";

  recognition.onresult = function (event) {
    if (emergencyTriggered) return;

    const transcript =
      event.results[event.results.length - 1][0].transcript.toLowerCase();

    if (
      transcript.includes("help") ||
      transcript.includes("emergency") ||
      transcript.includes("save me") ||
      transcript.includes("stop")
    ) {
      triggerEmergency();
    }
  };

  recognition.start();
}

function stopKeywordDetection() {
  if (recognition) {
    recognition.stop();
  }
}


// =======================
// EMERGENCY TRIGGER
// =======================

function triggerEmergency() {
  if (emergencyTriggered) return;
  emergencyTriggered = true;

  stopListening();
  stopKeywordDetection();

  statusText.innerText = "🚨 Emergency Triggered!";
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

    fetch("https://vigilix-backend.onrender.com/send-alert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contacts: contacts,
        locationLink: locationLink,
        userName: userName   // 🔥 NEW FIELD
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Vigilix Emergency Alert Sent Successfully!");
      } else {
        alert("Failed to send alert");
      }
    })
    .catch(err => {
      alert("Server error");
    });

  }, () => {
    alert("Location access denied");
  });
}