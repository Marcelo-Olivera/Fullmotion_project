// src/pages/Dashboard/ScheduleTable.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Para obter o token JWT
import styles from './ScheduleTable.module.css'; // Para estilização

interface Appointment {
  id: string;
  fullName: string;
  cpf: string;
  email: string;
  phone: string;
  cep: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'Pendente' | 'Confirmado' | 'Realizado' | 'Cancelado' | 'Aguardando Pagamento'; // Tipagem do status
  createdAt: string;
  updatedAt: string;
}

// Opcional: Enum para os status em PT-BR para facilitar o display
const AppointmentStatusDisplay = {
  Pendente: 'Pendente',
  Confirmado: 'Confirmado',
  Realizado: 'Realizado',
  Cancelado: 'Cancelado',
  'Aguardando Pagamento': 'Aguardando Pagamento',
};

function ScheduleTable() {
  const { isAuthenticated } = useAuth(); // Assume que isAuthenticated está true
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para filtros
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState<Appointment['status'] | ''>('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments();
    }
  }, [isAuthenticated, filterDate, filterStatus]); // Re-fetch ao mudar filtros ou autenticação

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Token de autenticação não encontrado. Faça login novamente.');
        setLoading(false);
        return;
      }

      let url = 'http://localhost:3000/api/appointments';
      const params = new URLSearchParams();

      if (filterDate) {
        params.append('date', filterDate);
      }
      if (filterStatus) {
        params.append('status', filterStatus);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get<Appointment[]>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data);
    } catch (err: any) {
      console.error('Erro ao buscar agendamentos:', err.response?.data || err.message);
      setError('Falha ao carregar agendamentos. Verifique sua conexão ou tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: Appointment['status']) => {
    const confirmUpdate = window.confirm(`Deseja realmente alterar o status para "${newStatus}"?`);
    if (!confirmUpdate) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token de autenticação não encontrado.');

      const response = await axios.put(`http://localhost:3000/api/appointments/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Status atualizado:', response.data);
      // Atualiza o agendamento na lista localmente para refletir a mudança
      setAppointments(prev => prev.map(app => app.id === id ? response.data : app));
      alert('Status do agendamento atualizado com sucesso!');
    } catch (err: any) {
      console.error('Erro ao atualizar status:', err.response?.data || err.message);
      alert(`Falha ao atualizar status: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <div className={styles.loading}>Carregando agendamentos...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.scheduleTableContainer}>
      <h2>Planilha de Agendamentos</h2>

      <div className={styles.filters}>
        <label htmlFor="filterDate">Data:</label>
        <input
          type="date"
          id="filterDate"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className={styles.filterInput}
        />

        <label htmlFor="filterStatus">Status:</label>
        <select
          id="filterStatus"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as Appointment['status'])}
          className={styles.filterSelect}
        >
          <option value="">Todos</option>
          {Object.values(AppointmentStatusDisplay).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {appointments.length === 0 ? (
        <p className={styles.noAppointments}>Nenhum agendamento encontrado.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Hora</th>
              <th>Paciente</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app.id}>
                <td>{app.appointmentDate}</td>
                <td>{app.appointmentTime}</td>
                <td>{app.fullName}</td>
                <td>{app.cpf}</td>
                <td>{app.phone}</td>
                <td>{app.status}</td>
                <td>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusUpdate(app.id, e.target.value as Appointment['status'])}
                    className={styles.statusSelect}
                  >
                    {Object.values(AppointmentStatusDisplay).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ScheduleTable;