import React, { useState, useEffect } from "react";
import UserLogin from "./components/UserLogin";
import AdminLogin from "./components/AdminLogin";
import SpotifyLogin from "./components/SpotifyLogin";
import SpotifyPlayer from "./components/SpotifyPlayer";

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    async function getToken() {
      const response = await fetch("/auth/token");
      const json = await response.json();
      setToken(json.access_token);
    }

    getToken();
  }, []);

  return (
    <div>
      <div className="mt-16 p-2">
        <UserLogin />
      </div>
      <div className="mt-16 p-2">
        <AdminLogin />
      </div>
      <div className="font-extrabold mt-16 rounded-md border-2 w-40 bg-[#44c767] text-[#ffffff] p-2 ml-40">
        <div>
          {token === "" ? <SpotifyLogin /> : <SpotifyPlayer token={token} />}
        </div>
      </div>
    </div>
  );
}

export default App;
