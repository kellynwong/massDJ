import React, { useContext } from "react";
import DataContext from "../context/DataContext";
import Login from "./Login";

const Headers = () => {
  const dataContext = useContext(DataContext);

  const handleLoginSignup = () => {
    dataContext.formIsOpen
      ? dataContext.setFormIsOpen(false)
      : dataContext.setFormIsOpen(true);
  };

  return (
    <>
      <div className="inline-flex">
        {/* massDJ logo */}
        <div>
          <img className="w-28 h-28 " src="src/assets/massDJ.png" />
        </div>

        {/* Login logo*/}
        <div className="mt-1 ml-48">
          {dataContext.isLoggedIn ? (
            <img className="w-16 h-16" src="src/assets/login.png" />
          ) : (
            <img
              className="w-16 h-16"
              src="src/assets/notLogin.png"
              onClick={handleLoginSignup}
            />
          )}
        </div>
      </div>
      {dataContext.formIsOpen && <Login />}
    </>
  );
};

export default Headers;
