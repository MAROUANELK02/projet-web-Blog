import { useState, useEffect } from "react";

function UsersPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://localhost:5000/users');
                if (response.ok) {
                    const userInfo = await response.json();
                    setUsers(userInfo);
                } else {
                    alert('Une erreur est produite !');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }

        fetchData();
    }, []);

    return (
        <table className="Table" style={{ borderCollapse: 'collapse', margin: '0 auto', background: 'white' }}>
    <thead>
        <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>id</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Nom</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Email</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Rôle</th>
        </tr>
    </thead>
    <tbody>
        {users.map((user) => (
            <tr key={user.id}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{user.id}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{user.nom}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{user.email}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{user.role}</td>
            </tr>
        ))}
    </tbody>
</table>
    );
}

export default UsersPage;
