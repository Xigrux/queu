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
var cloudinary = require("cloudinary").v2;

//=============================== INITIALIZE LIBRARIES ===============================//
let app = express();

// SET STORAGE
let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  }
});

var upload = multer({ storage: storage });

let rootPath = "http://localhost:8080";

app.use(cors({ origin: rootPath }));

let dbo;
let url =
  "mongodb+srv://lulul:123@cluster0-jjd2c.mongodb.net/test?retryWrites=true&w=majority";
app.use("/", express.static("build"));

MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
  dbo = db.db("Queu");
  // inject();
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
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "michael.senger88@ethereal.email",
    pass: "dYyxrnptWEttVy8RK3"
  }
});

cloudinary.config({
  cloud_name: "digodfjca",
  api_key: "174129486649864",
  api_secret: "_SMZ7OP7SWGWViHahB2iB3LkUUE"
});

//=============================== ALGO ===============================//

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
// let inject = () => {
//   TESTUSERS.forEach(user => {
//     let username = user.username;
//     let email = user.email;
//     let password = user.password;
//     let messenger = user.messenger;
//     let role = user.role;
//     let stack = user.stack;
//     let size = user.size;
//     let roleAssoc = user.roleAssoc;
//     let eventID = user.eventID;
//     let participantID;

//     admin
//       .auth()
//       .createUser({
//         email,
//         emailVerified: false,
//         password
//       })
//       .then(function(userRecord) {
//         participantID = userRecord.uid;

//         dbo.collection("participants").insertOne({
//           eventID,
//           username,
//           email,
//           messenger,
//           role,
//           stack,
//           size,
//           roleAssoc,
//           team: undefined,
//           participantID
//         });
//         // See the UserRecord reference doc for the contents of userRecord.
//         console.log("Successfully created new user:", userRecord.uid);
//       })
//       .catch(function(error) {
//         console.log("Error creating new user:", error);
//       });
//   });
// };

//=============================== ENDPOINTS ===============================//

app.post("/getteam", upload.none(), (req, res) => {
  let participantID = req.body.participantID;
  let query = { ["team." + participantID]: { $exists: true } };
  let pendingTeams;

  dbo
    .collection("pendingTeams")
    .find(query)
    .toArray(async (err, teamObj) => {
      pendingTeams = { teamID: teamObj[0].teamID, members: teamObj[0].team };
      let teamMembers = Object.keys(pendingTeams.members);
      let teamMembersArr = await Promise.all(
        teamMembers.map(async member => {
          return new Promise((resolve, reject) => {
            dbo
              .collection("participants")
              .findOne({ participantID: member }, async (err, doc) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(doc);
              });
          });
        })
      );

      let retArr = teamMembersArr.map(member => {
        console.log(pendingTeams.members[member.participantID]);
        return {
          username: member.username,
          participantID: member.participantID,
          status: pendingTeams.members[member.participantID]
        };
      });

      return res.send(JSON.stringify(retArr));
    });
});

app.post("/register", upload.none(), (req, res) => {
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
            // send email
            var mailOptions = {
              from: '"Example Team" <from@example.com>',
              to: email,
              subject: "Nice Nodemailer test",
              // text:
              //   "Hey , it’s our first message sent with Nodemailer ",
              html:
                "<b>Hey " +
                username +
                " </b><br> This is our first message sent with Nodemailer<br />"
              // <img src="cid:uniq-mailtrap.png" alt="mailtrap" />
              // attachments: [
              //   {
              //     filename: "mailtrap.png",
              //     path: __dirname + "/mailtrap.png",
              //     cid: "uniq-mailtrap.png"
              //   }
              // ]
            };
            transport.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              console.log("Message sent: %s", info.messageId);
            });

            // send back the userObj to the frontend
            return res.send(JSON.stringify(participant.ops));
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
  let imagePath = req.body.imagePath;

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
          maxTeamSize,
          imagePath
        },
        (err, eventObj) => {
          if (err) {
            console.log("errored in CAQ", err);
            return res.send(JSON.stringify({ success: false }));
          }
          return res.send(JSON.stringify(eventObj.ops[0]));
        }
      );

      console.log("Successfully created new user:", userRecord.uid);
    })
    .catch(function(error) {
      console.log("Error creating new user:", error);
    });
});

app.post("/get-event", upload.none(), (req, res) => {
  console.log("in get event");
  let eventID = req.body.eventID;
  let eventObject;
  let eventParticipants;
  let participantsTotal;
  let teamedUpParticipants;
  let numberOfTeams;

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
          let teamedUpParticipants = PTArr.filter(participant => {
            return participant.team !== null;
          }).length;

          dbo
            .collection("confirmedTeams")
            .find({ eventID: eventObject.eventID })
            .toArray((err, teams) => {
              numberOfTeams = teams.length;

              console.log("teamed up", teamedUpParticipants);

              resObj = {
                eventObject,
                participantsTotal,
                teamedUpParticipants,
                numberOfTeams
              };
              console.log(resObj);
              return res.send(JSON.stringify(resObj));
            });
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
    .then(firebaseRes => {
      uid = firebaseRes.user.uid;
      dbo
        .collection("participants")
        .findOne({ participantID: uid }, (err, participant) => {
          if (participant) {
            console.log("participant", participant);
            return res.send(JSON.stringify(participant));
          } else {
            dbo
              .collection("organizers")
              .findOne({ eventID: uid }, (err, organizer) => {
                console.log("OG", organizer);
                return res.send(JSON.stringify(organizer));
              });
          }
        });
    })
    .catch(err => {
      console.log("Caught error");
      return res.send(JSON.stringify({ success: false }));
    });
});

app.get("/logout", (res, req) => {
  console.log("in logout");
  firebase
    .auth()
    .signOut()
    .then(
      function() {
        // Sign-out successful.
      },
      function(error) {
        // An error happened.
      }
    );
});

app.post("/updatecreds", upload.none(), async (req, res) => {
  let oldEmail = req.body.oldEmail;
  let newEmail = req.body.newEmail;
  let newPassword = req.body.newPassword;
  let userType = req.body.userType === "PT" ? "participants" : "organizers";

  let user = firebase.auth().currentUser;
  let retMessage = false;
  let updatePassword = false;
  let updateEmail = false;

  if (newPassword !== "undefined" && newPassword !== "") {
    passwordUpdated = await user
      .updatePassword(newPassword)
      .then(function() {
        // Update successful.
        retMessage = true;
        updatePassword = true;
        if (
          (newEmail === "undefined" || newEmail === "") &&
          updatePassword &&
          retMessage
        ) {
          return res.send(JSON.stringify({ success: "Password updated" }));
        }
      })
      .catch(function(error) {
        return res.send(JSON.stringify(error));
      });
  }

  if (newEmail !== "undefined" && newEmail !== "")
    user
      .updateEmail(newEmail)
      .then(async () => {
        // Update successful.
        emailUpdated = await dbo
          .collection(userType)
          .updateOne(
            { email: oldEmail },
            { $set: { email: newEmail } },
            (err, user) => {
              if (err || user === null) {
                return res.send(JSON.stringify(err));
              } else {
                retMessage = true;
                updateEmail = true;
                if (updatePassword && updateEmail && retMessage) {
                  return res.send(
                    JSON.stringify({ success: "Email and password updated" })
                  );
                } else if (
                  (newPassword === "undefined" ||
                    newPassword === "" ||
                    !newPassword) &&
                  updateEmail &&
                  retMessage
                ) {
                  return res.send(JSON.stringify({ success: "Email updated" }));
                }
              }
            }
          );
      })
      .catch(function(error) {
        return res.send(JSON.stringify(error));
      });

  return res.send(
    JSON.stringify({ success: "Please enter your new email and/or password" })
  );
});

app.post("/confirmation", upload.none(), (req, res) => {
  let PTresponse = JSON.parse(req.body.PTresponse);
  let participantID = req.body.participantID;

  console.log("in confirmation", PTresponse, participantID);

  dbo
    .collection("pendingTeams")
    .findOneAndUpdate(
      { ["team." + participantID]: { $exists: true } },
      { $set: { ["team." + participantID]: PTresponse } },
      { returnOriginal: false },
      (err, team) => {
        let memberStatus = team.value.team;
        let allConfirmed = Object.keys(memberStatus).every(member => {
          return memberStatus[member] === true;
        });
        if (allConfirmed) {
          dbo.collection("confirmedTeams").insertOne(
            {
              eventID: team.value.eventID,
              teamID: team.value.teamID,
              team: team.value.team
            },
            (err, fullTeam) => {
              if (err) {
                return res.send(JSON.stringify({ success: false }));
              }

              Object.keys(team.value.team).forEach(memberID => {
                dbo
                  .collection("participants")
                  .findOneAndUpdate(
                    { participantID: memberID },
                    { $set: { team: team.value.teamID } },
                    (err, team) => {
                      if (err) {
                        return res.send(JSON.stringify({ success: false }));
                      }
                    }
                  );
              });

              dbo
                .collection("participants")
                .find({
                  participantID: { $in: Object.keys(team.value.team) }
                })
                .toArray((err, memberList) => {
                  memberList.forEach(member => {
                    var mailOptions = {
                      from: '"Queu" <from@example.com>',
                      to: member.email,
                      subject: "Your team is ready",
                      html: "Your team is complete"
                    };
                    let sendIt = () => {
                      transport.sendMail(mailOptions, (error, info) => {
                        if (error) {
                          return console.log(error);
                        }
                        console.log("Message sent: %s", info.messageId);
                      });
                      console.log([mailOptions.html]);
                    };
                    setTimeout(sendIt, 2000);
                  });
                });

              dbo
                .collection("pendingTeams")
                .deleteOne({ teamID: team.value.teamID }, (err, response) => {
                  return res.send(
                    JSON.stringify({
                      success: true,
                      isTeamComplete: true
                    })
                  );
                });
            }
          );
        } else {
          return res.send(
            JSON.stringify({ success: true, isTeamComplete: false })
          );
        }
      }
    );
});

app.post("/maketeam", upload.none(), (req, res) => {
  let eventID = req.body.eventID;
  dbo.collection("pendingTeams").deleteMany({}, (err, success) => {
    if (err) {
      res.send(err);
    }
    console.log("cleared everything in pending teams", eventID);

    let PTCat = {
      mean: { design: [], frontend: [], backend: [] },
      mern: { design: [], frontend: [], backend: [] },
      python: { design: [], frontend: [], backend: [] },
      lamp: { design: [], frontend: [], backend: [] },
      net: { design: [], frontend: [], backend: [] },
      ruby: { design: [], frontend: [], backend: [] }
    };
    let potentialTeamsObj = {};

    dbo
      .collection("participants")
      .find({ team: undefined, eventID })
      .toArray((err, PTArr) => {
        PTArr.forEach(PT => {
          PT.stack.forEach(tech => {
            PT.role.forEach(position => {
              PTCat[tech][position].push(PT);
            });
          });
        });
        console.log(PTCat);

        // this chain pushes all potentials teams to potentialTeamsObj in [PTID]:teamID format
        let allStacks = Object.keys(PTCat);
        // navigate to a stack
        allStacks.forEach(stack => {
          let allRoles = Object.keys(PTCat[stack]);
          // navigate to a role array
          allRoles.forEach(role => {
            // pick a user at the a time
            PTCat[stack][role].forEach(PTchosen => {
              // check their desired teammate roles
              PTchosen.roleAssoc.forEach(desiredRole => {
                // got to the stack and role check through all the users in that role group
                PTCat[stack][desiredRole].forEach(potentialTeammate => {
                  // check each user in role group's roleAssoc preference
                  potentialTeammate.roleAssoc.forEach(potentialRole => {
                    // make sure they qualify by ...
                    if (
                      PTchosen.role.includes(potentialRole) && // ... role criteria
                      PTchosen.size === potentialTeammate.size && // ... size criteria
                      PTchosen.participantID !==
                        potentialTeammate.participantID && // ... not the same person
                      potentialTeammate.potentialTeam === undefined // ...incoming potential teammate has no team yet
                    ) {
                      // if control participant doesn't have team id, give them one
                      if (PTchosen.potentialTeam === undefined) {
                        let potentialTeamID = Math.random()
                          .toString(36)
                          .slice(-8);
                        PTchosen.potentialTeam = potentialTeamID;
                        potentialTeamsObj[
                          PTchosen.participantID
                        ] = potentialTeamID;
                      }
                      // check how many people are already tagged with the same teamID
                      let dupes = 0;
                      let allPTs = Object.keys(potentialTeamsObj);
                      allPTs.forEach(PPT => {
                        if (potentialTeamsObj[PPT] === PTchosen.potentialTeam) {
                          dupes++;
                        } else {
                          return;
                        }
                      });

                      // make sure dupes respect team size criteria
                      if (PTchosen.size + 1 > dupes) {
                        potentialTeammate.potentialTeam =
                          PTchosen.potentialTeam;
                        potentialTeamsObj[potentialTeammate.participantID] =
                          PTchosen.potentialTeam;
                      }
                    }
                  });
                });
              });
            });
          });
        });

        let allPTs = Object.keys(potentialTeamsObj);
        let potentialTeamsArr = [];

        // this chain reorganizes potentialTeamsObj to {[teamID]:[PT,PT,PT}} format
        allPTs.forEach(PTID => {
          let teamID = potentialTeamsObj[PTID];
          if (potentialTeamsArr.length === 0) {
            // if Arr is empty create first entry
            potentialTeamsArr.push({
              teamID,
              eventID,
              team: { [PTID]: undefined }
            });
          } else {
            // depending if someone was adde to a team cause ID's matched, push the PT or create new team
            let addMember = false;
            potentialTeamsArr.forEach(team => {
              if (teamID === team.teamID) {
                team.team[PTID] = undefined;
                addMember = true;
              }
            });
            if (!addMember) {
              potentialTeamsArr.push({
                teamID,
                eventID,
                team: { [PTID]: undefined }
              });
            }
          }
        });

        let pendingTeams = potentialTeamsArr.filter(potentialTeam => {
          let teamsize = Object.keys(potentialTeam.team);
          return teamsize.length > 1;
        });

        //pushing all the pending teams to pendingTeamss collections
        pendingTeams.forEach(team => {
          dbo.collection("pendingTeams").insertOne(team, (err, response) => {
            if (err) {
            }
            console.log("check you db");

            let teams = Object.keys(team.team);

            dbo
              .collection("participants")
              .find({ participantID: { $in: teams } })
              .toArray((err, pteam) => {
                console.log("========== TEAM", team.teamID, "==========");
                // console.log("participant is ", pteam);

                let teamInfos = pteam.map(ppt => {
                  let teammates = [];
                  pteam.forEach(teammate => {
                    if (teammate.username !== ppt.username) {
                      teammates.push(
                        "<li><b>" +
                          teammate.username +
                          "</b>: " +
                          teammate.email +
                          " or message them through <a target='_blank' href='https://m.me/" +
                          teammate.messenger +
                          "'>" +
                          " Facebook messenger </a></li>"
                      );
                    }
                  });

                  return [ppt.email, ppt.username, teammates.join("<br>")];
                });

                teamInfos.forEach(member => {
                  // send email
                  var mailOptions = {
                    from: '"Queu" <from@example.com>',
                    to: member[0],
                    subject: "We found a team for you!",
                    // text:
                    //   "Hey , it’s our first message sent with Nodemailer ",
                    html:
                      "<b>Hey " +
                      member[1] +
                      " </b><br> Here's are your suggested teammates<ul>" +
                      member[2] +
                      "</ul>Start chatting away and if you're happy with your team <a href='" +
                      rootPath +
                      "/user/signin/" +
                      member[0] +
                      "' target='_blank'>login</a> to confirm your spot"
                    // <img src="cid:uniq-mailtrap.png" alt="mailtrap" />
                    // attachments: [
                    //   {
                    //     filename: "mailtrap.png",
                    //     path: __dirname + "/mailtrap.png",
                    //     cid: "uniq-mailtrap.png"
                    //   }
                    // ]
                  };
                  let sendIt = () => {
                    transport.sendMail(mailOptions, (error, info) => {
                      if (error) {
                        return console.log(error);
                      }
                      console.log("Message sent: %s", info.messageId);
                    });
                  };
                  setTimeout(sendIt, 2000);
                });

                console.log("========================================");
                console.log("");
              });
          });
        });
      });
    res.send("done");
  });
});

app.post("/image-upload", upload.single("image"), (req, res) => {
  console.log(req.file);

  cloudinary.uploader.upload(req.file.path).then(image => res.json([image]));
});

//=============================== LISTENER ===============================//
app.listen("4000", () => {
  console.log("Server up");
});
