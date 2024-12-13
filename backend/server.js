const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");

const serviceAccount = require("./firebase-config.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
});

const db = admin.database();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;

app.get("/notes", async (req, res) => {
  const ref = db.ref("notes");
  ref.once("value", (snapshot) => {
    res.status(200).json(snapshot.val());
  });
});


app.post("/notes", async (req, res) => {
  const ref = db.ref("notes");
  const newNote = ref.push();
  await newNote.set(req.body);
  res.status(201).send({ id: newNote.key, ...req.body });
});


app.put("/notes/:id", async (req, res) => {
  const ref = db.ref(`notes/${req.params.id}`);
  await ref.update(req.body);
  res.status(200).send({ id: req.params.id, ...req.body });
});


app.delete("/notes/:id", async (req, res) => {
  const ref = db.ref(`notes/${req.params.id}`);
  await ref.remove();
  res.status(200).send({ message: "Note deleted" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
