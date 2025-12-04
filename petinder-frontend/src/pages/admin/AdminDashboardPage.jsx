import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <div className="admin-dashboard">
      <h2>Panel de Administración</h2>
      <p>Bienvenido, administrador. Desde aquí puedes gestionar la aplicación.</p>
      <nav>
        <ul>
          <li>
            <Link to="/admin/users">Gestionar Usuarios</Link>
          </li>
          {/* Próximamente:
          <li>
            <Link to="/admin/pets">Gestionar Mascotas</Link>
          </li>
          */}
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboardPage;
