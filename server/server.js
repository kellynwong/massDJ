require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");
const router = express.Router();

const {
  login,
  refresh,
  getUsers,
  getUser,
  createUser,
  deleteUser,
} = require("./controllers/users");
const { getPlaylist, updatePlaylist } = require("./controllers/playlist");
const { getAccountHistory } = require("./controllers/accountHistory");
const auth = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB();

app.use("/", router);

router.post("/users", createUser);
router.post("/users/login", login);
router.post("/users/refresh", refresh);
router.get("/users", auth, getUsers);
router.get("/users/profile", auth, getUser);
router.delete("/users", auth, deleteUser);
//router.post("/playlist", createPlaylistFromSpotify); // for "seeding" songs from restaurant's playlist
router.get("/playlist", getPlaylist); // for gettings songs for customers
router.put("/playlist", updatePlaylist); // for voting now, but will remove if i add model for votes
// router.post("/playlist/vote", addVote);
router.get("/accounthistory", auth, getAccountHistory);

app.listen(3001);
