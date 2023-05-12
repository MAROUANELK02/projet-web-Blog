import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [redirect, setRedirect] = useState(false);

        async function login(ev) {
            ev.preventDefault();
            const response = await fetch('http://localhost:5000/auth/login',{
                method: 'POST',
                body: JSON.stringify({email,password}),
                headers: {'Content-Type':'application/json'},
                credentials: 'include',
            });
            if(response.ok) {
                setRedirect(true);
            } else {
                alert('wrong credentials');
            }
        }

        if(redirect) {
            return <Navigate to={'/'} />
        }

    return (
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            <input type="email" 
            placeholder="email"
            value={email} onChange={ev => setEmail(ev.target.value)} />
            
            <input type="password" 
            placeholder="password"
            value={password} onChange={ev => setPassword(ev.target.value)}/>

            <button>Login</button>
        </form>
    )
}
