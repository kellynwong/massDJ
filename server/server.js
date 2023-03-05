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
  getUsers,
  getUser,
  createUser,
  deleteUser,
} = require("./controllers/users");

const {
  adminLogin,
  adminRefresh,
  getAdmin,
  getAnAdmin,
  createAdmin,
  deleteAdmin,
} = require("./controllers/restaurantAdmin");

const {
  spotifyLogin,
  spotifyCallback,
  spotifyToken,
  playSong,
  playSelectedSong,
} = require("./controllers/spotify");

const { getPlaylist, updatePlaylist } = require("./controllers/playlist");

const { getAccountHistory } = require("./controllers/accountHistory");
const { auth, authOptional } = require("./middleware/auth");

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
router.get("/users", auth, getUsers);
router.get("/users/profile", auth, getUser);
router.delete("/users", auth, deleteUser);

// playlist
//router.post("/playlist", createPlaylistFromSpotify); // for "seeding" songs from restaurant's playlist
router.get("/playlist", authOptional, getPlaylist); // for gettings songs for customers
router.put("/playlist", authOptional, updatePlaylist); // for voting

// accounthistory
router.get("/accounthistory", auth, getAccountHistory);

// restaurantadmin
router.post("/admin", createAdmin);
router.post("/admin/login", adminLogin);
router.post("/admin/refresh", adminRefresh);
router.get("/admin", auth, getAdmin);
router.get("/admin/profile", auth, getAnAdmin);
router.delete("/admin", auth, deleteAdmin);

// spotifyplayer
router.get("/auth/login", spotifyLogin);
router.get("/auth/callback", spotifyCallback);
router.get("/auth/token", spotifyToken);
router.get("/populate", playSong);
router.put("/song", playSelectedSong); // play song upon clicking on song in homepage

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
