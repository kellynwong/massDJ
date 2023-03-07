require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./db/db");
const router = express.Router();
const dotenv = require("dotenv");
const request = require("request");
const port = 4000;

const {
  login,
  refresh,
  getUser,
  createUser,
  deleteUser,
  getUsersAdmin,
  updateUserAdmin,
} = require("./controllers/users");

const {
  spotifyLogin,
  spotifyCallback,
  spotifyToken,
  playSong,
  playSelectedSong,
  playNextSongAtEndOfCurrentSong,
} = require("./controllers/spotify");

const { getPlaylist, updatePlaylist } = require("./controllers/playlist");

const { getAccountHistory } = require("./controllers/accountHistory");
const { auth, authAdmin, authOptional } = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

connectDB();

app.use("/", router);

// users
router.post("/users", createUser);
router.post("/users/login", login);
router.post("/users/refresh", refresh);
router.get("/users/profile", auth, getUser);
router.delete("/users", auth, deleteUser);

// playlist
router.get("/playlist", authOptional, getPlaylist); // for gettings songs for customers
router.put("/playlist", authOptional, updatePlaylist); // for voting

// accounthistory
router.get("/accounthistory", auth, getAccountHistory);

// restaurant admin
router.get("/admin/users", authAdmin, getUsersAdmin);
router.put("/admin/users", authAdmin, updateUserAdmin);
router.delete("/admin/users", authAdmin, deleteUser);
router.get("/auth/login", spotifyLogin);
router.get("/auth/token", spotifyToken);
router.get("/auth/callback", spotifyCallback);

// spotifyplayer
router.get("/populate", playSong);
router.put("/song", playSelectedSong);
router.get("/pollqueue", playNextSongAtEndOfCurrentSong);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
