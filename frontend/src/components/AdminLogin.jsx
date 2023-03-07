import React, { useState, useContext } from "react";
import DataContext from "../context/DataContext";
import { RxCross2 } from "react-icons/rx";
import { ErrorResponse } from "@remix-run/router";
function AdminLogin() {
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
    const url = "http://127.0.0.1:4000/admin";
    const res = await fetch(url, requestOptions);
    const data = await res.json();
    setData(data);
    console.log(data);
    dataContext.setAdminIsLoggedIn(true);
    dataContext.setAdminFormIsOpen(false);
    if (
      data.message === "duplicate admin" ||
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
    const url = "http://127.0.0.1:4000/admin/login";
    const res = await fetch(url, requestOptions);
    const data = await res.json();
    setData(data);
    dataContext.setAdminIsLoggedIn(true);
    if (data.message === "login failed" || data.message === "not authorised") {
      setLoginError(true);
    } else {
      setLoginSuccess(true);
    }
  };

  // const handleClick = () => {
  //   dataContext.setAdminFormIsOpen(false);
  // };

  return (
    <div className="motion-safe:animate-fadeIn bg-[#FDFBF9] border-[1px] border-white rounded-2xl p-6 fixed top-[170px] right-3.5">
      {/* <RxCross2
        className="hover:border-darkOrange hover:bg-buttonHoverOrange hover:border-1 rounded-full text-[1.3rem] inline drop-shadow-3xl fixed right-10"
        onClick={handleClick}
      /> */}
      <div className="text-[#25272C] font-poppins border-[13px] border-transparent">
        <form
          onSubmit={(e) => {
            // console.log e.NativeEvent to see
            const buttonName = e.nativeEvent.submitter.name;
            e.preventDefault();
            if (buttonName === "signup") handleSubmitSignup();
            if (buttonName === "login") handleSubmitLogin();
          }}
        >
          <h3 className="font-extrabold text-lg">WELCOME RESTAURANT ADMIN</h3>
          <div>
            <br />
            <br />
            <label className="font-bold text-sm">EMAIL ADDRESS </label>
          </div>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="block pt-2.5 pb-1.5 px-0 w-full text-sm text-[#25272C] bg-transparent border-0 border-b-2 border-[#25272C] appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder="email@email.com"
            required="true"
          />{" "}
          <br />
          <br />
          <div>
            <label className="font-bold text-sm">PASSWORD </label>
          </div>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="block pt-2.5 pb-1.5 px-0 w-full text-sm text-[#25272C] bg-transparent border-0 border-b-2 border-[#25272C] appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder="at least 8 characters"
            required="true"
            minLength="8"
          />
          <div className="text-black">
            <br />
            <br />
            <button
              className="text-white bg-[#25272C] font-medium  text-sm px-5 py-2.5 text-center w-full"
              name="signup"
            >
              Create an account
            </button>
            <div>
              <br />

              <button
                className="text-white bg-[#25272C] font-medium  text-sm px-5 py-2.5 text-center w-full"
                name="login"
              >
                Login
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
    </div>
  );
}

export default AdminLogin;
