import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import userContext from "./context/userContext";

import {
  Home,
  Forms,
  Form,
  Responses,
  Signup,
  Login,
  Profile,
  Settings,
  NotFound,
} from "./pages";

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenResponse = await axios.post(
        "http://localhost:5000/api/auth/tokenIsValid",
        null,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      if (tokenResponse.data) {
        const userRes = await axios.get("http://localhost:5000/api/user", {
          headers: {
            "x-auth-token": token,
          },
        });
        setUserData({ token, user: userRes.data });
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <Router>
      <userContext.Provider
        value={{
          userData,
          setUserData,
        }}
      >
        <Switch>
          <Route path="/" exact={true} component={Home} />
          <Route path="/sign-up" exact={true} component={Signup} />
          <Route path="/login" exact={true} component={Login} />
          <Route path="/froms" exact={true} component={Forms} />
          <Route path="/form/:formID" exact={true} component={Form} />
          <Route path="/responses" exact={true} component={Responses} />
          <Route path="/profile" exact={true} component={Profile} />
          <Route path="/settings" exact={true} component={Settings} />
          <Route path="*" exact={true} component={NotFound} />
        </Switch>
      </userContext.Provider>
    </Router>
  );
}

export default App;
