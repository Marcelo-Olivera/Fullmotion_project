// src/pages/Dashboard/Dashboard.tsx
import { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import ScheduleTable from './ScheduleTable';

// Importe o UserRole, se ainda não estiver global ou em outro lugar
// import { UserRole } from '../../users/user.entity'; // Exemplo de importação do enum

function Dashboard() {
    const { isAuthenticated, user } = useAuth();
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user) {
            setUserEmail(user.email || 'Usuário');
            setUserRole(user.role || 'user');
        } else {
            setUserEmail('Usuário');
            setUserRole('user');
        }
    }, [isAuthenticated, user]);

    const handleManageVideosClick = () => {
        navigate('/admin/manage-videos');
    };

    // Função para navegar para a página de gerenciamento de usuários
    const handleManageUsersClick = () => {
        navigate('/admin/manage-users'); // Assumindo que você criará essa rota/página no futuro
    };

    // Função para navegar para a página de relatórios financeiros
    const handleFinancialReportsClick = () => {
        navigate('/admin/financial-reports'); // Assumindo que você criará essa rota/página no futuro
    };


    return (
        <div className={styles.dashboardContainer}>
            <h1>Bem-vindo, {userEmail || 'Usuário'}!</h1>
            <p>Seu perfil: **{userRole}**</p>

            <nav className={styles.dashboardNav}>
                {userRole === 'patient' && (
                    <>
                        <a href="/agendar" className={styles.navLink}>Agendar Nova Avaliação</a>
                        <button className={styles.navLink}>Meu Histórico de Agendamentos</button>
                        <button className={styles.navLink}>Meus Pagamentos</button>
                        <button className={styles.navLink}>Meus Vídeos</button> {/* Página de vídeos do paciente */}
                    </>
                )}
                {(userRole === 'physiotherapist' || userRole === 'admin') && (
                    <>
                        <a href="/dashboard/schedules" className={styles.navLink}>Planilha de Agendamentos</a>
                        
                        {/* BOTÕES VISÍVEIS SOMENTE PARA ADMIN */}
                        {userRole === 'admin' && ( // <--- NOVA CONDIÇÃO AQUI
                            <>
                                <button onClick={handleManageUsersClick} className={styles.navLink}>
                                    Gerenciar Usuários
                                </button>
                                <button onClick={handleFinancialReportsClick} className={styles.navLink}>
                                    Relatórios Financeiros
                                </button>
                            </>
                        )}

                        {/* BOTÃO GERENCIAR VÍDEOS (visível para Fisioterapeuta e Admin) */}
                        <button onClick={handleManageVideosClick} className={styles.navLink}>
                            Gerenciar Vídeos
                        </button>
                    </>
                )}
            </nav>

            {(userRole === 'physiotherapist' || userRole === 'admin') && (
                <div className={styles.dashboardContent}>
                    <ScheduleTable />
                </div>
            )}
        </div>
    );
}

export default Dashboard;