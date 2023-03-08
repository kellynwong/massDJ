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
  logout,
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
  populatePlaylist,
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
router.post("/api/users", createUser);
router.post("/api/users/login", login); // for admin to log in now (combined database now with a flag showing whether isAdmin (boolean))
router.post("/api/users/refresh", refresh);
router.get("/api/users/profile", auth, getUser);
router.delete("/api/users", auth, deleteUser);
router.post("/api/users/logout", auth, logout);

// admin
router.get("/api/admin/users", authAdmin, getUsersAdmin);
router.put("/api/admin/users", authAdmin, updateUserAdmin);
router.delete("/api/admin/users", authAdmin, deleteUser);
router.get("/api/auth/login", spotifyLogin); // need to add in authAdmin here later (Wednesday)
router.get("/api/auth/token", spotifyToken);
router.get("/api/auth/callback", spotifyCallback);
// spotify
router.get("/api/populate", populatePlaylist);
router.put("/api/song", authAdmin, playSelectedSong);
router.get("/api/pollqueue", authAdmin, playNextSongAtEndOfCurrentSong); // if authAdmin, the next track will not play

// playlist
router.get("/api/playlist", authOptional, getPlaylist); // get songs
router.put("/api/playlist", authOptional, updatePlaylist); // for voting

// accounthistory
router.get("/api/accounthistory", auth, getAccountHistory);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
