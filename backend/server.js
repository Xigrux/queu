//=============================== LOAD ALL LIBRARIES ===============================//
let express = require("express");
let multer = require("multer");
let cors = require("cors");
let MongoClient = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectID;
let admin = require("firebase-admin");
let serviceAccount = require("./firebase-service-key.json");

//=============================== INITIALIZE LIBRARIES ===============================//
let app = express();

let upload = multer();

app.use(cors({ origin: "http://localhost:3000" }));

let dbo;
let url =
  "mongodb+srv://lulu:123@cluster0-jjd2c.mongodb.net/test?retryWrites=true&w=majority";
app.use("/", express.static("build"));

MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
  dbo = db.db("Queu");
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://queu-d353d.firebaseio.com"
});

//=============================== ENDPOINTS ===============================//

app.post("/register", upload.none(), (req, res) => {
  console.log("in register");
  console.log(req.body);
  let email = req.body.email;
  let password = req.body.password;
  admin
    .auth()
    .createUser({
      email,
      emailVerified: false,
      password
    })
    .then(function(userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully created new user:", userRecord.uid);
    })
    .catch(function(error) {
      console.log("Error creating new user:", error);
    });
});

//=============================== LISTENER ===============================//
app.listen("4000", () => {
  console.log("Server up");
});
