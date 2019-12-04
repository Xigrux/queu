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
let TESTUSERS = require("./testusers.js");

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

//=============================== CLEAR ALL USERS ===============================//
let PTCat = {
  mean: { design: [], frontend: [], backend: [] },
  mern: { design: [], frontend: [], backend: [] },
  python: { design: [], frontend: [], backend: [] },
  lamp: { design: [], frontend: [], backend: [] },
  net: { design: [], frontend: [], backend: [] },
  ruby: { design: [], frontend: [], backend: [] }
};
let potentialTeams = {};
algo = () => {
  // let mean,mern,python,lamp,net,ruby;
  dbo
    .collection("participants")
    .find({ team: undefined })
    .toArray((err, PTArr) => {
      PTArr.forEach(PT => {
        PT.stack.forEach(tech => {
          PT.role.forEach(position => {
            PTCat[tech][position].push(PT);
          });
        });
      });

      let allStacks = Object.keys(PTCat);
      allStacks.forEach(stack => {
        let allRoles = Object.keys(PTCat[stack]);
        allRoles.forEach(role => {
          PTCat[stack][role].forEach(PT => {
            PT.roleAssoc.forEach(desiredRole => {
              PTCat[stack][desiredRole].forEach(potentialTeammate => {
                potentialTeammate.roleAssoc.forEach(potentialRole => {
                  if (
                    desiredRole === potentialRole && // role criteria
                    PT.size === potentialTeammate.size && // size criteria
                    PT.participantID !== potentialTeammate.participantID && // not the same person
                    potentialTeammate.potentialTeam === undefined // at least one person doesn't have a team yet
                  ) {
                    // potentialTeams[PT.potentialTeam]={}
                    // PT.participantID,

                    if (PT.potentialTeam) {
                      let allPTs = Object.keys(potentialTeams);
                      let dupes = 0;
                      allPTs.forEach(PPT => {
                        // console.log(potentialTeams[PPT]);
                        if (potentialTeams[PPT] === PT.potentialTeam) {
                          dupes++;
                        } else {
                          return;
                        }
                      });
                      if (PT.size >= dupes) {
                        potentialTeams[potentialTeammate.participantID] =
                          PT.potentialTeam;
                      }
                    } else if (PT.potentialTeam === undefined) {
                      let potentialTeamID = Math.random()
                        .toString(36)
                        .slice(-8);
                      PT.potentialTeam = potentialTeamID;
                      potentialTeammate.potentialTeam = potentialTeamID;
                      potentialTeams[PT.participantID] = potentialTeamID;

                      potentialTeams[
                        potentialTeammate.participantID
                      ] = potentialTeamID;
                    }

                    // console.log([
                    //   // PT.participantID,
                    //   // PT.potentialTeam,
                    //   // // PT.role,
                    //   // // PT.size,
                    //   // "match",
                    //   // potentialTeammate.participantID,
                    //   // potentialTeammate.potentialTeam
                    //   // // potentialTeammate.role,
                    //   // // potentialTeammate.size
                    // ]);
                  }
                });
              });
            });
          });
        });
      });

      // console.log(potentialTeams);

      let allPTs = Object.keys(potentialTeams);
      let potentialTeamsArr = [];

      allPTs.forEach(PT => {
        let teamID = potentialTeams[PT];

        if (potentialTeamsArr.length === 0) {
          potentialTeamsArr.push({ teamID: [PT] });
        } else {
          potentialTeamsArr.forEach(team => {
            if (teamID in team) {
              // console.log(PT);
              team[teamID].push(PT);
            } else {
              potentialTeamsArr.push({ teamID: [PT] });
            }
          });
        }
      });

      console.log(potentialTeamsArr);
    });
};

setTimeout(algo, 5000);

//=============================== CLEAR ALL USERS ===============================//
// let list = [];
// function deleteAllUsers(nextPageToken) {
//   admin
//     .auth()
//     .listUsers(1000, nextPageToken)
//     .then(listUsersResult => {
//       listUsersResult.users.forEach(userRecord => {
//         // console.log(userRecord.uid)
//         list.push(userRecord.uid);
//       });
//     })
//     .then(() => {
//       let i = 0;
//       setInterval(() => {
//         i++;
//         console.log(list[i]);
//         admin
//           .auth()
//           .deleteUser(list[i])
//           .then(() => {
//             console.log("success");
//           })
//           .catch(err => console.log(err));
//       }, 1000);
//     });
// }
// deleteAllUsers();

// //=============================== INJECT USERS===============================//

// TESTUSERS.forEach(user => {
//   let username = user.username;
//   let email = user.email;
//   let password = user.password;
//   let messenger = user.messenger;
//   let role = user.role;
//   let stack = user.stack;
//   let size = user.size;
//   let roleAssoc = user.roleAssoc;
//   let eventID = user.eventID;
//   let participantID;

//   admin
//     .auth()
//     .createUser({
//       email,
//       emailVerified: false,
//       password
//     })
//     .then(function(userRecord) {
//       participantID = userRecord.uid;

//       dbo.collection("participants").insertOne({
//         eventID,
//         username,
//         email,
//         messenger,
//         role,
//         stack,
//         size,
//         roleAssoc,
//         team: undefined,
//         participantID
//       });
//       // See the UserRecord reference doc for the contents of userRecord.
//       console.log("Successfully created new user:", userRecord.uid);
//     })
//     .catch(function(error) {
//       console.log("Error creating new user:", error);
//     });
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
          team: undefined,
          participantID
        },
        (err, participant) => {
          if (err) {
            return res.send(JSON.stringify({ success: false }));
          } else {
            // // send email
            // var mailOptions = {
            //   from: '"Example Team" <from@example.com>',
            //   to: email,
            //   subject: "Nice Nodemailer test",
            //   // text:
            //   //   "Hey , it’s our first message sent with Nodemailer ",
            //   html:
            //     "<b>Hey " +
            //     username +
            //     " </b><br> This is our first message sent with Nodemailer<br />"
            //   // <img src="cid:uniq-mailtrap.png" alt="mailtrap" />
            //   // attachments: [
            //   //   {
            //   //     filename: "mailtrap.png",
            //   //     path: __dirname + "/mailtrap.png",
            //   //     cid: "uniq-mailtrap.png"
            //   //   }
            //   // ]
            // };
            // transport.sendMail(mailOptions, (error, info) => {
            //   if (error) {
            //     return console.log(error);
            //   }
            //   console.log("Message sent: %s", info.messageId);
            // });

            // send back the userObj to the frontend
            res.send(JSON.stringify(participant.ops));
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
  let eventObject;
  let eventParticipants;
  let participantsTotal;

  dbo
    .collection("organizers")
    .findOne({ eventID: eventID }, (err, eventObj) => {
      if (err) {
        return res.send(JSON.stringify({ success: false }));
      }
      eventObject = eventObj;

      dbo
        .collection("participants")
        .find({ eventID: eventObject.eventID })
        .toArray((err, PTArr) => {
          eventParticipants = PTArr;
          participantsTotal = eventParticipants.length;

          resObj = { eventObject, participantsTotal };
          res.send(JSON.stringify(resObj));
        });
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
