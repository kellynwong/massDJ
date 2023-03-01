import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    console.log(JSON.stringify({ email, password }));
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    };
    const url = "http://127.0.0.1:4000/users/login";
    const res = await fetch(url, requestOptions);
    const data = await res.json();
    setData(data);
    console.log(data);
    setIsLoggedIn(true);
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
    const url = "http://127.0.0.1:4000/users";
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
        <div className="font-extrabold mt-4 mb-4">
          {isLoggedIn && "User Successfully Logged In!"}
        </div>
        <button
          className="rounded-md border-2 mt-4 w-80"
          type="submit"
          value="Update"
          onClick={handleClick}
        >
          For Testing User Log In: Get All Users
        </button>
        {/* <h5>{users[0].email}</h5> */}
      </div>
    </>
  );
}

export default Login;
