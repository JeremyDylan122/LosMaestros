import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  X, 
  Save, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { chileLocations } from '../../data/chileLocations';

export const UserManager = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const initialFormState = {
    run: '',
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    rol: 'CLIENTE',
    region: 'Región de Coquimbo',
    comuna: 'La Serena',
    direccion: '',
    empresa: '',
    cuentaCorrienteActiva: false,
    creditoMaximo: 2000000,
    saldoPendiente: 0
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  const reloadUsers = () => {
    setUsers(userService.getUsers());
  };

  useEffect(() => {
    reloadUsers();
  }, []);

  const showFeedback = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData(initialFormState);
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setFormData({
      run: u.run,
      nombre: u.nombre,
      apellidos: u.apellidos || '',
      email: u.email,
      password: u.password || 'contra123',
      rol: u.rol,
      region: u.region || 'Región de Coquimbo',
      comuna: u.comuna || 'La Serena',
      direccion: u.direccion || '',
      empresa: u.empresa || '',
      cuentaCorrienteActiva: Boolean(u.cuentaCorrienteActiva),
      creditoMaximo: u.creditoMaximo || 2000000,
      saldoPendiente: u.saldoPendiente || 0
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleDelete = (id, nombre) => {
    if (Number(id) === Number(currentUser.id)) {
      alert('No puedes eliminar tu propia cuenta en sesión activa.');
      return;
    }

    if (window.confirm(`¿Deseas eliminar la cuenta de usuario "${nombre}"?`)) {
      const ok = userService.deleteUser(id);
      if (ok) {
        showFeedback(`Usuario "${nombre}" eliminado.`);
        reloadUsers();
      }
    }
  };

  const validateForm = () => {
    const errs = {};

    const runVal = userService.validateRun(formData.run);
    if (!runVal.isValid) errs.run = runVal.message;

    if (!formData.nombre.trim() || formData.nombre.trim().length > 50) {
      errs.nombre = 'El nombre es obligatorio (máx 50 caracteres).';
    }

    if (!userService.validateEmail(formData.email)) {
      errs.email = 'Correo inválido. Solo dominios permitidos: @duoc.cl, @profesor.duoc.cl y @gmail.com.';
    }

    if (!formData.password || formData.password.length < 4 || formData.password.length > 10) {
      errs.password = 'La contraseña debe tener entre 4 y 10 caracteres.';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingUser) {
        userService.updateUser(editingUser.id, {
          ...formData,
          creditoMaximo: Number(formData.creditoMaximo) || 0,
          saldoPendiente: Number(formData.saldoPendiente) || 0
        });
        showFeedback(`Usuario "${formData.nombre}" actualizado con éxito.`);
      } else {
        userService.createUser({
          ...formData,
          creditoMaximo: Number(formData.creditoMaximo) || 0,
          saldoPendiente: Number(formData.saldoPendiente) || 0
        });
        showFeedback(`Usuario "${formData.nombre}" creado exitosamente.`);
      }
      setModalOpen(false);
      reloadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const displayedUsers = users.filter(u => 
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.run.includes(searchTerm) ||
    u.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container page-container">
      {/* CABECERA */}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ marginBottom: '0.35rem' }}>
            <Link to="/admin" style={{ fontSize: '0.85rem', fontWeight: 800, textDecoration: 'underline' }}>
              &larr; Volver al Dashboard Administrativo
            </Link>
          </div>
          <h1 className="section-title">
            <Users size={28} /> Mantenedor de Usuarios del Sistema
          </h1>
          <p className="section-subtitle">
            Administración de perfiles RBAC (Administradores, Vendedores, Contratistas y Clientes).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn-tactile btn-tactile-primary"
        >
          <Plus size={18} /> Nuevo Usuario
        </button>
      </div>

      {feedback && (
        <div className={`alert-tactile alert-tactile-${feedback.type}`}>
          <CheckCircle2 size={18} />
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* BUSCADOR */}
      <div className="bento-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <input
            type="text"
            className="input-tactile"
            placeholder="Buscar por RUN, nombre, correo o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* TABLA CRUD USUARIOS */}
      <div className="table-container-tactile">
        <table className="table-tactile">
          <thead>
            <tr>
              <th>RUN</th>
              <th>Nombre Completo</th>
              <th>Correo Electrónico</th>
              <th style={{ textAlign: 'center' }}>Rol Asignado</th>
              <th>Comuna / Ubicación</th>
              <th style={{ textAlign: 'right' }}>Cuenta Corriente</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.map(u => (
              <tr key={u.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{u.run}</td>
                <td>
                  <strong>{u.nombre} {u.apellidos}</strong>
                  {u.empresa && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.empresa}</div>}
                </td>
                <td>{u.email}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`badge-tactile badge-role-${u.rol.toLowerCase()}`}>
                    {u.rol}
                  </span>
                </td>
                <td>{u.comuna || 'La Serena'}</td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                  {u.cuentaCorrienteActiva ? (
                    <div>
                      <strong style={{ color: 'var(--color-contractor)' }}>Activa</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Deuda: ${u.saldoPendiente?.toLocaleString('es-CL')}
                      </div>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>No habilitada</span>
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(u)}
                      className="btn-tactile btn-tactile-sm"
                      title="Editar Usuario"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(u.id, u.nombre)}
                      disabled={Number(u.id) === Number(currentUser.id)}
                      className="btn-tactile btn-tactile-sm btn-tactile-danger"
                      title="Eliminar Usuario"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL EDITAR / CREAR USUARIO */}
      {modalOpen && (
        <div className="modal-overlay-tactile" role="dialog" aria-modal="true">
          <div className="modal-box-tactile">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: 'var(--border-sm)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900 }}>
                {editingUser ? 'Editar Perfil de Usuario' : 'Crear Nuevo Usuario en el Sistema'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="btn-tactile btn-tactile-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="label-tactile">RUN * (7 a 9 caracteres)</label>
                  <input
                    type="text"
                    className={`input-tactile ${formErrors.run ? 'input-error' : ''}`}
                    placeholder="19011022K"
                    value={formData.run}
                    onChange={(e) => setFormData({ ...formData, run: e.target.value })}
                  />
                  {formErrors.run && <span className="error-text">{formErrors.run}</span>}
                </div>

                <div className="form-group">
                  <label className="label-tactile">Rol del Usuario *</label>
                  <select
                    className="select-tactile"
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  >
                    <option value="ADMIN">ADMINISTRADOR (Control Total)</option>
                    <option value="VENDEDOR">VENDEDOR (Inventario y Pedidos)</option>
                    <option value="CONTRATISTA">CONTRATISTA (Línea de Crédito)</option>
                    <option value="CLIENTE">CLIENTE (Tienda Regular)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="label-tactile">Nombre *</label>
                  <input
                    type="text"
                    className={`input-tactile ${formErrors.nombre ? 'input-error' : ''}`}
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    maxLength={50}
                  />
                  {formErrors.nombre && <span className="error-text">{formErrors.nombre}</span>}
                </div>

                <div className="form-group">
                  <label className="label-tactile">Apellidos</label>
                  <input
                    type="text"
                    className="input-tactile"
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    maxLength={100}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="label-tactile">Correo Electrónico *</label>
                  <input
                    type="email"
                    className={`input-tactile ${formErrors.email ? 'input-error' : ''}`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="label-tactile">Contraseña * (4 a 10 car.)</label>
                  <input
                    type="password"
                    className={`input-tactile ${formErrors.password ? 'input-error' : ''}`}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    maxLength={10}
                  />
                  {formErrors.password && <span className="error-text">{formErrors.password}</span>}
                </div>
              </div>

              {/* OPCIONES DE CUENTA CORRIENTE */}
              {formData.rol === 'CONTRATISTA' && (
                <div style={{ padding: '1rem', border: 'var(--border-sm)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-alt)', marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, cursor: 'pointer', marginBottom: '0.75rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.cuentaCorrienteActiva}
                      onChange={(e) => setFormData({ ...formData, cuentaCorrienteActiva: e.target.checked })}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span>Habilitar Línea de Cuenta Corriente (Pago a Fin de Mes)</span>
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="label-tactile">Línea de Crédito Máxima (CLP)</label>
                      <input
                        type="number"
                        className="input-tactile"
                        value={formData.creditoMaximo}
                        onChange={(e) => setFormData({ ...formData, creditoMaximo: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="label-tactile">Saldo Pendiente de Pago</label>
                      <input
                        type="number"
                        className="input-tactile"
                        value={formData.saldoPendiente}
                        onChange={(e) => setFormData({ ...formData, saldoPendiente: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: 'var(--border-sm)', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-tactile">
                  Cancelar
                </button>
                <button type="submit" className="btn-tactile btn-tactile-primary">
                  <Save size={16} /> Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
