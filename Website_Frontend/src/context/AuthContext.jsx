import { createContext,useContext,useState } from "react";


export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
}

export const AuthContextProvider = ({children}) => {
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("loggedin_user")) || null);
  const [authToken, setAuthToken] = useState(JSON.parse(localStorage.getItem("Hacks25-jwt")) || null);
  
  console.log('authUser', authUser);
  console.log('authToken', authToken);
  
  return <AuthContext.Provider value={{authUser,setAuthUser,authToken,setAuthToken}}>
    {children}
    </AuthContext.Provider>;
}