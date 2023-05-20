import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:5000/auth/profile", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setUserInfo(data);
      });
  }, [setUserInfo]);

  function logout() {
    fetch("http://localhost:5000/auth/logout", {
      credentials: "include",
      method: "POST",
    }).then(() => {
        setUserInfo(null);
      });
  }

  const username = userInfo?.nom;
  const isAdmin = userInfo?.role === "ADMIN";

  return (
    <header>
      <Link to="/" className="logo">
        Blog
      </Link>
      <nav>
        {username ? (
          <>
            {isAdmin ? (
              <>
              <Link to="/users">Utilisateurs</Link>
              </> 
             ) : (<></>) } 
            <Link to="/create">Créer un article</Link>
            <Link to="/"><a href=" " onClick={logout}>Logout</a></Link> 
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
