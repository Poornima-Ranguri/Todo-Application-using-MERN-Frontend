import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, Navigate, Link } from "react-router-dom";
import "./index.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [apiStatus, setApistatus] = useState(true);

  const navigate = useNavigate();

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const onSubmitSuccess = (data) => {
    Cookies.set("jwt_token", data.jwtToken, {
      expires: 30,
    });

    Cookies.set("user_id", data.user_id, {
      expires: 30,
    });

    Cookies.set("username", data.username, {
      expires: 30,
    });

    navigate("/");
  };

  const onSubmitFailure = (errorMsg) => {
    setShowSubmitError(true);
    setErrorMsg(errorMsg);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const userDetails = { username, password };
    setApistatus(false);
    const url = "https://todo-application-backend-rk3h.onrender.com/login";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };

    try {
      const response = await fetch(url, options);

      console.log(response);
      const data = await response.json();

      if (response.ok) {
        setApistatus(true);
        onSubmitSuccess(data);
      } else {
        setApistatus(true);
        onSubmitFailure(data.error_msg);
      }
    } catch (error) {
      onSubmitFailure("Something went wrong. Please try again.");
    }
  };

  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken !== undefined) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-form-container">
      <img
        src="https://th.bing.com/th/id/OIP.5ie2BowOgJtZQLEDpwJuogHaHa?w=145&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
        className="login-image"
        alt="website login"
      />
      <form className="form-container" onSubmit={submitForm}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            fontWeight: "500",
          }}
        >
          <p style={{ fontSize: "18px" }}>SIGN IN</p>
          <img
            src="https://th.bing.com/th/id/OIP.5ie2BowOgJtZQLEDpwJuogHaHa?w=145&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            alt="website login"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "5px",
              marginRight: "5px",
            }}
          />
        </div>
        <div className="input-container">
          <label className="input-label" htmlFor="username">
            USERNAME
          </label>
          <input
            type="text"
            id="username"
            className="username-input-field"
            value={username}
            onChange={handleChangeUsername}
            placeholder="Username"
          />
        </div>
        <div className="input-container">
          <label className="input-label" htmlFor="password">
            PASSWORD
          </label>
          <input
            type="password"
            id="password"
            className="password-input-field"
            value={password}
            onChange={handleChangePassword}
            placeholder="Password"
          />
        </div>

        {!apiStatus ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "15px",
            }}
          >
            <div class="spinner-border text-warning" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <button type="submit" className="login-button">
            Login
          </button>
        )}
        {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        <Link
          to="/register"
          style={{ marginRight: "auto", fontSize: "14px", marginTop: "3px" }}
        >
          Sign Up
        </Link>
      </form>
    </div>
  );
};

export default LoginForm;
