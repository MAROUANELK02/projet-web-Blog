import { Link } from "react-router-dom"
import { useContext, useEffect} from "react";
import { UserContext } from "./UserContext";


export default function Header() {
  const {setUserInfo,userInfo} = useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:5000/auth/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, [setUserInfo]);  

  function logout() {
      fetch('http://localhost:5000/auth/logout',{
        credentials:'include',
        method: 'POST',
      });
      setUserInfo(null);
  };

  const username = userInfo?.nom;

  return(
        <header>
        <Link to="/" className="logo">MyBlog</Link>
        <nav>
          {username && (
            <>
            <Link to="/create">Create new post</Link>
            <button onClick={logout}>Logout</button>
            </>
          )}
          {!username && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
    )
}