const contactSection = document.getElementById("contact-section");
const toggle = document.getElementById("guardianToggle");
const statusText = document.getElementById("status");

let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

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
    contacts.forEach(c => {
      details += `<p>${c.name} - ${c.phone}</p>`;
    });

    contactSection.innerHTML = `
      <div class="contact-card">
        <strong>Your Contacts</strong>
        <div class="contact-details">
          ${details}
          <button onclick="editContacts()">Edit</button>
        </div>
      </div>
    `;
  }
}

function addContact() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (!name || !phone) return alert("Fill all fields");

  contacts.push({name, phone});
  localStorage.setItem("contacts", JSON.stringify(contacts));
  renderContacts();
}

function editContacts() {
  contacts = [];
  localStorage.removeItem("contacts");
  renderContacts();
}

renderContacts();


// Guardian Mode Audio
let audioContext;
let analyser;
let dataArray;

toggle.addEventListener("change", async () => {
  if (toggle.checked) {
    if (contacts.length < 3) {
      alert("Add 3 emergency contacts first");
      toggle.checked = false;
      return;
    }

    statusText.innerText = "Listening...";
    startListening();
  } else {
    statusText.innerText = "Inactive";
  }
});

async function startListening() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  audioContext = new AudioContext();
  analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaStreamSource(stream);

  source.connect(analyser);
  analyser.fftSize = 256;

  const bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  const canvas = document.getElementById("visualizer");
  const ctx = canvas.getContext("2d");

  function draw() {
    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = "#602437";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      let barHeight = dataArray[i];
      ctx.fillStyle = "#ff7aa2";
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  }

  draw();
}
