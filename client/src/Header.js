import { Link } from "react-router-dom"
import { useEffect, useState } from "react";


export default function Header() {
  const [username, setUsername] = useState(null);
  useEffect(() => {
    fetch('http://localhost:5000/auth/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUsername(userInfo.nom);
      });
    });
  }, []);  

  function logout() {
      fetch('http://localhost:5000/auth/logout',{
        credentials:'include',
        method: 'POST',
      });
      setUsername(null);
  };


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