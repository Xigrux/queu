//=============================== LOAD ALL LIBRARIES ===============================//
let express = require("express");
let multer = require("multer");
let cors = require("cors");
let MongoClient = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectID;
let admin = require("firebase-admin");
let serviceAccount = require("./firebase-service-key.json");
let firebase = require("firebase");
let nodemailer = require("nodemailer");

//=============================== INITIALIZE LIBRARIES ===============================//
let app = express();

let upload = multer();

app.use(cors({ origin: "http://localhost:8080" }));

let dbo;
let url =
  "mongodb+srv://lulul:123@cluster0-jjd2c.mongodb.net/test?retryWrites=true&w=majority";
app.use("/", express.static("build"));

MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
  dbo = db.db("Queu");
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://queu-d353d.firebaseio.com"
});

// Config Firebase
let firebaseConfig = {
  apiKey: "AIzaSyBNJzeM_W8mJUvTc8eXrL7CNq2EvLFOr60",
  authDomain: "queu-d353d.firebaseapp.com",
  databaseURL: "https://queu-d353d.firebaseio.com",
  projectId: "queu-d353d",
  storageBucket: "queu-d353d.appspot.com",
  messagingSenderId: "314527117650",
  appId: "1:314527117650:web:132f1a57fbf9c90b034a8b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "c5ba319b17cc67",
    pass: "a9be4eb156c304"
  }
});

var mailOptions = {
  from: '"Example Team" <from@example.com>',
  to: "user1@example.com, user2@example.com",
  subject: "Nice Nodemailer test",
  text: "Hey there, it’s our first message sent with Nodemailer ",
  html:
    '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br /><img src="cid:uniq-mailtrap.png" alt="mailtrap" />'
  // attachments: [
  //   {
  //     filename: "mailtrap.png",
  //     path: __dirname + "/mailtrap.png",
  //     cid: "uniq-mailtrap.png"
  //   }
  // ]
};

// transport.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     return console.log(error);
//   }
//   console.log("Message sent: %s", info.messageId);
// });

//=============================== ENDPOINTS ===============================//

app.post("/register", upload.none(), (req, res) => {
  console.log("in register");
  console.log(req.body);
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let messenger = req.body.messenger;
  let role = req.body.role;
  let stack = req.body.stack;
  let size = req.body.size;
  let roleAssoc = req.body.roleAssoc;
  let eventID = req.body.eventID;
  let participantID;

  admin
    .auth()
    .createUser({
      email,
      emailVerified: false,
      password
    })
    .then(function(userRecord) {
      participantID = userRecord.uid;

      dbo.collection("participants").insertOne(
        {
          eventID,
          username,
          email,
          messenger,
          role,
          stack,
          size,
          roleAssoc,
          participantID
        },
        (err, participant) => {
          if (err) {
            return res.send(JSON.stringify({ success: false }));
          } else {
            transport.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              console.log("Message sent: %s", info.messageId);
            });

            dbo
              .collection("participants")
              .findOne({ participantID }, (err, participant) => {
                res.send(JSON.stringify(participant));
              });
          }
        }
      );

      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully created new user:", userRecord.uid);
    })
    .catch(function(error) {
      console.log("Error creating new user:", error);
    });
});

app.post("/create-a-queu", upload.none(), (req, res) => {
  console.log(req.body);
  let event = req.body.event;
  let email = req.body.email;
  let password = req.body.password;
  let maxTeamSize = req.body.maxTeamSize;
  let eventID;
  admin
    .auth()
    .createUser({
      email,
      emailVerified: false,
      password
    })
    .then(function(userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      eventID = userRecord.uid;

      dbo.collection("organizers").insertOne(
        {
          eventID,
          event,
          email,
          maxTeamSize
        },
        (err, organizer) => {
          if (err) {
            return res.send(JSON.stringify({ success: false }));
          }
          res.send(JSON.stringify(eventID));
        }
      );

      console.log("Successfully created new user:", userRecord.uid);
    })
    .catch(function(error) {
      console.log("Error creating new user:", error);
    });
});

app.post("/get-event", upload.none(), (req, res) => {
  let eventID = req.body.eventID;

  dbo
    .collection("organizers")
    .findOne({ eventID: eventID }, (err, eventObj) => {
      if (err) {
        return res.send(JSON.stringify({ success: false }));
      }
      res.send(JSON.stringify(eventObj));
    });
});

app.post("/signin", upload.none(), (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let uid;
  console.log(req.body);

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(err => {
      return res.send(JSON.stringify({ success: false }));
    });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      uid = user.uid;
      console.log("UID", uid);

      dbo
        .collection("participants")
        .findOne({ participantID: uid }, (err, participant) => {
          if (participant) {
            console.log("participant", participant);
            res.send(JSON.stringify(participant));
          } else {
            dbo
              .collection("organizers")
              .findOne({ eventID: uid }, (err, organizer) => {
                console.log("OG", organizer);
                res.send(JSON.stringify(organizer));
              });
          }
        });
      // ...
    } else {
      // WTF?
      // return res.send(JSON.stringify({ success: false }));
      // ...
    }
  });
});
//=============================== LISTENER ===============================//
app.listen("4000", () => {
  console.log("Server up");
});
