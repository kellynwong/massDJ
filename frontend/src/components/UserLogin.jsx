import React, { useState, useContext } from "react";
import DataContext from "../context/DataContext";

function Login() {
  const dataContext = useContext(DataContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState("");
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
    dataContext.setUserToken(data.access);
    dataContext.setUserIsLoggedIn(true);
    dataContext.setUserFormIsOpen(false);

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
    dataContext.setUserToken(data.access);
    dataContext.setUserIsLoggedIn(true);
    dataContext.setUserFormIsOpen(false);
    console.log("Logged in as " + data.access);
    if (data.message === "login failed" || data.message === "not authorised") {
      setLoginError(true);
    } else {
      setLoginSuccess(true);
    }
  };

  return (
    <>
      <div className="text-[#FEFEFE] font-barlow ">
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

          <div>
            <label>Email: </label>
          </div>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="rounded-md border-2 mr-8 text-black"
          />
          <div>
            <label>Password: </label>
          </div>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="rounded-md border-2 mr-8 text-black"
          />
          <div className="text-black">
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
      </div>
    </>
  );
}

export default Login;
