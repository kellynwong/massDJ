import React, { useState } from "react";
import Playlist from "./Playlist";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState("");
  const [users, setUsers] = useState([]);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupError, setSignupError] = useState(false);

  const handleSubmitSignup = async (e) => {
    setSignupSuccess(false);
    setSignupError(false);
    setLoginSuccess(false);
    setLoginError(false);
    console.log(JSON.stringify({ email, password }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    };
    const url = "http://127.0.0.1:4000/users";
    const res = await fetch(url, requestOptions);
    const data = await res.json();
    setData(data);
    console.log(data);
    if (
      data.message === "duplicate username" ||
      data.message === "an error has occurred"
    ) {
      setSignupError(true);
    } else {
      setSignupSuccess(true);
    }
  };

  const handleSubmitLogin = async (e) => {
    setSignupSuccess(false);
    setSignupError(false);
    setLoginSuccess(false);
    setLoginError(false);
    console.log(JSON.stringify({ email, password }));
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
    if (data.message === "login failed" || data.message === "not authorised") {
      setLoginError(true);
    } else {
      setLoginSuccess(true);
    }
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
        <form
          onSubmit={(e) => {
            const buttonName = e.nativeEvent.submitter.name;
            e.preventDefault();
            console.log(buttonName);
            if (buttonName === "signup") handleSubmitSignup();
            if (buttonName === "login") handleSubmitLogin();
          }}
        >
          <h3 className="font-extrabold">New Sign Up / User Log In</h3>

          <label>Email: </label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="rounded-md border-2 mr-8"
          />
          <label>Password: </label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="rounded-md border-2 mr-8"
          />
          <div>
            <button
              className="rounded-md border-2 mt-2 pl-2 pr-2 w-40 bg-zinc-300"
              name="signup"
            >
              Sign Up
            </button>
            <div>
              <button
                className="rounded-md border-2 mt-2 pl-2 pr-2 w-40 bg-zinc-300"
                name="login"
              >
                Log In
              </button>
            </div>
          </div>
        </form>
        <div className="font-extrabold mt-4 mb-4 text-green-400">
          {loginSuccess && "Successfully Logged In!"}
          <span className="text-red-400">
            {loginError && "Login Failed, Please Try Again!"}
          </span>
        </div>
        <div className="font-extrabold mt-4 mb-4 text-green-400">
          {signupSuccess && "Successfully Signed Up!"}
          <span className="text-red-400">
            {signupError && "Signup Failed, Please Try Again!"}
          </span>
        </div>
        <button
          className="rounded-md border-2 mt-4 w-80"
          type="submit"
          value="Update"
          onClick={handleClick}
        >
          For Testing User Log In: Get All Users
        </button>
        {users.map((user, index) => {
          return (
            <table className="border-2 w-80 flex justify-center items-center">
              <tbody>
                <tr>
                  <td key={index}>{user.email}</td>
                </tr>
              </tbody>
            </table>
          );
        })}
      </div>
      <Playlist />
    </>
  );
}

export default Login;
