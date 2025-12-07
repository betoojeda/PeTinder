import React from 'react';
import { Link } from 'react-router-dom';
import PerroAdmin from '../../assets/PerroAdmin.png';
import '../../App.css';

const AdminDashboardPage = () => {
  return (
    <div className="admin-homepage" style={{ backgroundImage: `url(${PerroAdmin})` }}>
      <div className="admin-homepage-overlay">
        <div className="admin-homepage-content">
          <h1>Panel de Administración</h1>
          <p>Bienvenido. Desde aquí puedes gestionar usuarios y mascotas.</p>
          <nav className="admin-homepage-nav">
            <Link to="/admin/users" className="admin-nav-button">
              Gestionar Usuarios
            </Link>
            <Link to="/admin/pets" className="admin-nav-button">
              Gestionar Mascotas
            </Link>
            <Link to="/admin/stats" className="admin-nav-button">
              Ver Estadísticas
            </Link>
            <Link to="/admin/logs" className="admin-nav-button">
              Ver Log de Errores
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
