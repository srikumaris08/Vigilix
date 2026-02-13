// 1️⃣ Import dependencies
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const twilio = require("twilio");
require("dotenv").config();

// 2️⃣ Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// 3️⃣ Initialize Twilio client
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

// 4️⃣ Define a test route (optional)
app.get("/", (req, res) => {
  res.send("Vigilix Backend Running");
});

// 5️⃣ Send Alert Route
app.post("/send-alert", async (req, res) => {
  try {
    const { contacts, locationLink, userName } = req.body;

    // Send SMS to all contacts
    for (let contact of contacts) {
      await client.messages.create({
        body: `🚨 VIGILIX EMERGENCY ALERT!\n${userName} may be in danger.\nLive Location: ${locationLink}`,
        from: process.env.TWILIO_PHONE,
        to: contact.phone,
      });
    }

    // Call first contact with name announcement
    if (contacts.length > 0) {
      await client.calls.create({
        twiml: `<Response>
                  <Say voice="alice">
                    Emergency Alert from Vigilix. ${userName} may be in danger. Please check immediately.
                  </Say>
                </Response>`,
        to: contacts[0].phone,
        from: process.env.TWILIO_PHONE,
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error sending alert:", error);
    res.status(500).json({ success: false });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Vigilix backend running on port ${PORT}`);
});
