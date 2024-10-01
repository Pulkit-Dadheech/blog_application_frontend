import { createContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import {URL} from "../url";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  },[]);

  const getUser = async () => {

    try {
      const res = await axios.get(URL + "/api/auth/refetch", {
        withCredentials: true
      });
      if(Cookies.get("token")) setUser(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
