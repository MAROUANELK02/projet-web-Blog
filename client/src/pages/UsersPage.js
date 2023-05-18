import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';

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
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>id</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.nom}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default UsersPage;
