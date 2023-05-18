import { useState } from "react";
import { Navigate, Link } from "react-router-dom";

export default function RegisterPage() {
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    
    async function register(ev) {
        ev.preventDefault();
        const response = await fetch('http://localhost:5000/auth/register',{
            method: 'POST',
            body: JSON.stringify({nom,email,password}),
            headers: {'Content-Type':'application/json'},
        });
        if(response.status === 200) {
            alert('registration successful');
            setRedirect(true);
        } else {
            alert('registration failed');
        };
    };
    
    if(redirect) {
       return <Navigate to={'/'} />
    }
    
    return (
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            
            <input type="text" 
            placeholder="nom" 
            value={nom} onChange={ev => setNom(ev.target.value)}/>
            
            <input type="email"
            placeholder="email" 
            value={email} onChange={ev => setEmail(ev.target.value)}/>
            
            <input type="password"
            placeholder="password"
            value={password} onChange={ev => setPassword(ev.target.value)}/>
            
            <button>Register</button>
            <span style={{ fontStyle: "italic" }}>Vous êtes déjà inscrit ? 
                <Link to="/login">Se connecter</Link>
            </span>
        </form>
    )
}