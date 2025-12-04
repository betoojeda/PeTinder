import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // En el futuro, este endpoint debería existir en tu backend y estar protegido para admins
        // const response = await fetch('/api/admin/users', {
        //   headers: { 'Authorization': `Bearer ${token}` },
        // });
        // const data = await response.json();
        // setUsers(data);

        // Por ahora, simulamos los datos
        const mockUsers = [
          { id: 1, name: 'Usuario de Prueba', email: 'user@example.com', role: 'USER' },
          { id: 2, name: 'Admin de Prueba', email: 'admin@example.com', role: 'ADMIN' },
        ];
        setUsers(mockUsers);

      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  return (
    <div className="users-list-container">
      <h2>Gestión de Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button>Editar</button>
                <button>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersListPage;
