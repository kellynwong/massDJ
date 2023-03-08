import React from "react";

function SpotifyLogin() {
  return (
    <div className="App">
      <header className="App-header">
        <a
          className="btn-spotify border-[13px] border-transparent font-bold text-green-400"
          href="/api/auth/login"
        >
          Login with Spotify
        </a>
      </header>
    </div>
  );
}

export default SpotifyLogin;
