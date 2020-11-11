import React, { createContext } from "react";
import { useStickyState } from "../helpers/fetch";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [user, setUser] = useStickyState(null, "user");
  return (
    <UserContext.Provider value={[user, setUser]}>
      {props.children}
    </UserContext.Provider>
  );
};
