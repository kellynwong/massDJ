import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState("");
  const [users, setUsers] = useState([]);

  const handleSubmit = async (e) => {
    console.log(JSON.stringify({ email, password }));
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    };
    const url = "http://127.0.0.1:3001/users/login";
    const res = await fetch(url, requestOptions);
    const data = await res.json();
    setData(data);
    console.log(data);
  };

  const handleClick = async () => {
    const token = data.access;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "http://127.0.0.1:3001/users";
    const res = await fetch(url, requestOptions);
    const users = await res.json();
    setUsers(users);
    console.log(users);
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <h3 className="font-extrabold">User Log In</h3>

          <label>Email:</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="rounded-md border-2 mr-8"
          />
          <label>Password:</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="rounded-md border-2 mr-8"
          />
          <button className="rounded-md border-2">Log In</button>
        </form>

        <button type="submit" value="Update" onClick={handleClick}>
          For Testing User Log In: Get All Users
        </button>
        {/* <h5>{users[0].email}</h5> */}
      </div>

      <div className="mt-16 ">
        <form onSubmit={handleSubmit}>
          <h3 className="font-extrabold">Restaurant Admin Log In</h3>

          <label>Email:</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="rounded-md border-2 mr-8"
          />
          <label>Password:</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="rounded-md border-2 mr-8"
          />
          <button className="rounded-md border-2">Log In</button>
        </form>

        {/* <button type="submit" value="Update" onClick={handleClick}>
          For Testing User Log In: Get All Users
        </button>
        <h5>{users[0].email}</h5> */}
      </div>
    </>
  );
}

export default Login;
