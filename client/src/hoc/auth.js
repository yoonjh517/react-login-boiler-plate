import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";

// eslint-disable-next-line import/no-anonymous-default-export
export default function (SpecificComponent, option, adminRoute = null) {
  // option null: for anyone
  // option true: for logged in users, such as profile page
  // option false: for not logged in users, such as login page, register page

  function AuthenticationCheck(props) {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);

        // if not logged in
        if (!response.payload.isAuth) {
          if (option) {
            props.history.push("/login");
          }
        } else {
          // logged in
          // if no admin users want to access adminRoute, send them to the landing page
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push("/");
          } else {
            // if logged in users want to access pages for not logged users
            // such as login page, register page, send them to the landing page
            if (option === false) {
              props.history.push("/");
            }
          }
        }
      });
    }, []);
    return <SpecificComponent />;
  }

  return AuthenticationCheck;
}
