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
  algo();
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

//=============================== ALGO ===============================//
let PTCat = {
  mean: { design: [], frontend: [], backend: [] },
  mern: { design: [], frontend: [], backend: [] },
  python: { design: [], frontend: [], backend: [] },
  lamp: { design: [], frontend: [], backend: [] },
  net: { design: [], frontend: [], backend: [] },
  ruby: { design: [], frontend: [], backend: [] }
};
let potentialTeamsObj = {};
algo = () => {
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

      // this chain pushes all potentials teams to potentialTeamsObj in [PTID]:teamID format
      let allStacks = Object.keys(PTCat);
      allStacks.forEach(stack => {
        let allRoles = Object.keys(PTCat[stack]);
        allRoles.forEach(role => {
          PTCat[stack][role].forEach(PT => {
            PT.roleAssoc.forEach(desiredRole => {
              PTCat[stack][desiredRole].forEach(potentialTeammate => {
                potentialTeammate.roleAssoc.forEach(potentialRole => {
                  if (
                    PT.role.includes(potentialRole) && // role criteria
                    PT.size === potentialTeammate.size && // size criteria
                    PT.participantID !== potentialTeammate.participantID && // not the same person
                    potentialTeammate.potentialTeam === undefined // at least one person doesn't have a team yet
                  ) {
                    if (PT.potentialTeam !== undefined) {
                      let allPTs = Object.keys(potentialTeamsObj);
                      let dupes = 0;
                      allPTs.forEach(PPT => {
                        if (potentialTeamsObj[PPT] === PT.potentialTeam) {
                          dupes++;
                        } else {
                          return;
                        }
                      });
                      if (PT.size >= dupes) {
                        potentialTeamsObj[potentialTeammate.participantID] =
                          PT.potentialTeam;
                      }
                    } else if (PT.potentialTeam === undefined) {
                      let potentialTeamID = Math.random()
                        .toString(36)
                        .slice(-8);
                      //assign the team ID to the PT
                      PT.potentialTeam = potentialTeamID;

                      potentialTeammate.potentialTeam = potentialTeamID;

                      potentialTeamsObj[PT.participantID] = potentialTeamID;

                      potentialTeamsObj[
                        potentialTeammate.participantID
                      ] = potentialTeamID;
                    }
                  }
                });
              });
            });
          });
        });
      });

      // console.log(potentialTeamsObj);
      let allPTs = Object.keys(potentialTeamsObj);
      let potentialTeamsArr = [];

      // this chain reorganizes potentialTeamsObj to {[teamID]:[PT,PT,PT}} format
      allPTs.forEach(PT => {
        let teamID = potentialTeamsObj[PT];
        if (potentialTeamsArr.length === 0) {
          // if Arr is empty create first entry
          potentialTeamsArr.push({ teamID: teamID, team: { [PT]: false } });
        } else {
          // depending if someone was adde to a team cause ID's matched, push the PT or create new team
          let addMember = false;
          potentialTeamsArr.forEach(team => {
            if (teamID === team.teamID) {
              team.team[PT] = false;
              addMember = true;
            }
          });
          if (!addMember) {
            potentialTeamsArr.push({ teamID: teamID, team: { [PT]: false } });
          }
        }
      });

      console.log(potentialTeamsArr);

      // //pushing all the pending teams to pendingTeams collections
      // potentialTeamsArr.forEach(team => {
      //   dbo.collection("pendingTeam").insertOne(team, (err, response) => {
      //     if (err) {
      //       console.log("errored");
      //     }
      //     console.log("check you db");
      //   });
      // });
    });
};

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
