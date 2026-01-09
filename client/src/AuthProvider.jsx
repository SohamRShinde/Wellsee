import { useState, useEffect } from "react"
import axios from "axios";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    axios.get("/api/auth/me")
      .then(res => setUser(res.data.user))
      .catch((err) => {setUser(null); console.log(err.response?.data?.message);}
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
