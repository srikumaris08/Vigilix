# Vigilix - Silent Smart Protection

Vigilix is a Progressive Web Application (PWA) designed to improve personal safety by automatically detecting emergency situations through sound and voice triggers. The main idea behind this project is to reduce the need for manual interaction during emergencies, since in real-life situations a person may not be able to unlock their phone and press an SOS button

## Project Link
https://vigilix-sos.netlify.app/


## Project Purpose
In many emergency situations (especially related to women’s safety), the victim cannot manually call or send alerts. Existing safety apps mostly depend on pressing a button, which is not always practical in stressful or dangerous scenarios.

Vigilix focuses on:
- Hands-free emergency triggering
- Automatic alert system
- Real-time location sharing
- Minimal user interaction during danger


## Key Features
### Guardian Mode:
- Continuous background listening
- Detects loud sounds and emergency keywords.

 ###  Automatic Emergency Alerts
- Sends SMS alerts to saved emergency contacts
- Initiates phone calls to primary contact

 ###  Live Location Tracking
- Uses browser Geolocation API
- Sends real-time coordinates during emergency trigger

###  Sound-Based Detection
- Uses Web Audio API (AnalyserNode)
- Volume threshold logic to detect distress sounds


## Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Web Audio API
- Speech Recognition API
- Service Workers (PWA)

### Backend
- Node.js
- Express.js
- Twilio API (SMS & Calls)

### Deployment
- Frontend: Netlify (HTTPS)
- Backend: Render
- Version Control: GitHub



###  Progressive Web App (PWA)
- Installable on mobile home screen
- Works like a native app


## Installation Commands

### 1. Clone the Repository
git clone https://github.com/srikumaris08/Vigilix.git
cd vigilix
### 2. Install Backend Dependencies
cd backend
npm install
### 3. Create Environment File (.env)
TWILIO_SID=XXXXXXXXXXXXXXXXX
TWILIO_AUTH=XXXXXXXXXXXXXX
TWILIO_PHONE=XXXXXXXXXXX
PORT=XXXX


## Run Commands

### 1. Run backend
cd backend
node server.js
### 2. Run Frontend
Open index.html in VS Code,
Use Live Server extension


## Project Working

When the user opens Vigilix for the first time, they enter their name and add three emergency contacts, which are stored locally using LocalStorage. Before going out, the user enables Guardian Mode using the toggle switch.

Once Guardian Mode is turned on, the **application requests microphone and location permissions from the user**. After permission is granted, the app continuously listens to surrounding sounds using the Web Audio API and also checks for emergency keywords like “help” or “save me”.

If a loud distress sound or emergency keyword is detected, the system automatically triggers the emergency process. The app then fetches the user’s live location using the Geolocation API and generates a Google Maps link.

Finally, the frontend sends this data to the backend server, which uses the Twilio API to send SMS alerts and make an emergency call to the saved contacts, including the user’s name and live location. Since Vigilix is a Progressive Web App, it can also be installed on the mobile home screen and works like a native safety application.


![Home](https://github.com/user-attachments/assets/8751e333-0140-42d0-b811-0081214238a4)


![Lis](https://github.com/user-attachments/assets/84454354-f43b-4bb9-87b0-a4b603ff8113)

![emergency](https://github.com/user-attachments/assets/5ca2bf99-e30a-4866-a436-7045afcf5d13)

![phone1](https://github.com/user-attachments/assets/c2f36e62-3215-4510-9035-be9d281aefe3)

![phone24](https://github.com/user-attachments/assets/50ef6ce7-9cee-4ba5-955e-adb91bd4cba2)

![callsms](https://github.com/user-attachments/assets/63d93b3e-64dd-4db3-add1-65525b2d7c54)


[![Watch Demo](https://img.youtube.com/vi/1HvIuFiwr3Y/hqdefault.jpg)](https://youtu.be/1HvIuFiwr3Y)

## API Documentation
API Documentation

Request Body:
{
  "contacts": [
    { "name": "Contact1", "phone": "+91XXXXXXXXXX" }
  ],
  "locationLink": "https://maps.google.com/?q=lat,long",
  "userName": "User Name"
}

Response:

{
  "success": true
}


## Project Structure
Vigilix/
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   ├── manifest.json
│   └── service-worker.js
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├
|
└── README.md

## Team Name- Code Outlaws
### Team Members- Srikumari,Nandhana

## License
This project is developed for safety and hackathon purpose.

