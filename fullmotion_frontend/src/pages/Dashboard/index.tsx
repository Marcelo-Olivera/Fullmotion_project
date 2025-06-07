import { useEffect, useState } from 'react';
import styles from './Dashboard.module.css'; // Mantenha o CSS Module
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom'; // Importe 'Link'

function Dashboard() {
    const { isAuthenticated, user } = useAuth();
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated && user) {
            setUserEmail(user.email || 'Usuário');
            setUserRole(user.role || 'user');
        } else {
            setUserEmail('Usuário');
            setUserRole('user');
        }
    }, [isAuthenticated, user]);

        // Funções de navegação para os botões
//    const handleManageVideosClick = () => {
//        navigate('/admin/manage-videos');
//    };
//
//    const handleManageUsersClick = () => {
//        navigate('/admin/manage-users');
//    };

    // A função handleFinancialReportsClick estava comentada no seu código, a manterei comentada aqui.
    // const handleFinancialReportsClick = () => {
    //     navigate('/admin/financial-reports');
    // };

    return (
        <div className={styles.dashboardContainer}>
            <h1>Bem-vindo, {userEmail || 'Usuário'}!</h1>
            <p>Seu perfil: **{userRole}**</p>

            <nav className={styles.dashboardNav}>
                {userRole === 'patient' && (
                    <>
                        {/* Opções originais do paciente (mantidas) */}
                        {/* <Link to="/agendar" className={styles.navLink}>Agendar Nova Avaliação</Link> */}
                        {/* <button className={styles.navLink}>Meu Histórico de Agendamentos</button> */}
                        {/* <button className={styles.navLink}>Meus Pagamentos</button> */}

                        {/* O card "Meus Vídeos" já no seu padrão */}
                        <div className={styles.dashboardGrid}>
                            <Link to="/patient/my-videos" className={styles.dashboardCard}>
                                <h3>Meus Vídeos</h3>
                                <p>Acesse todos os vídeos de seus exercícios.</p>
                            </Link>
                        </div>
                    </>
                )}
                {(userRole === 'physiotherapist' || userRole === 'admin') && (
                    <div className={styles.dashboardGrid}> {/* <--- NOVO: Aplica o grid aqui para os cards */}
                        {/* Opções compartilhadas entre fisioterapeuta e admin */}
                        {/* Planilha de Agendamentos (mantida como Link simples) */}
                        {/* <Link to="/dashboard/schedules" className={styles.navLink}>Planilha de Agendamentos</Link> */}
                        
                        {/* CARD: Gerenciar Vídeos (para Fisioterapeuta e Admin) */}
                        <Link to="/admin/manage-videos" className={styles.dashboardCard}> {/* <--- Usando o padrão dashboardCard */}
                            <h3>Gerenciar Vídeos</h3>
                            <p>Faça upload e gerencie vídeos de exercícios.</p>
                        </Link>

                        {/* CARDS EXCLUSIVOS para ADMIN */}
                        {userRole === 'admin' && ( 
                            <>
                                {/* CARD: Gerenciar Usuários (apenas para Admin) */}
                                <Link to="/admin/manage-users" className={styles.dashboardCard}> {/* <--- Usando o padrão dashboardCard */}
                                    <h3>Gerenciar Usuários</h3>
                                    <p>Crie, liste e delete contas de usuários.</p>
                                </Link>

                                {/* Relatórios Financeiros (mantido como botão simples ou Link, se quiser) */}
                                {/* <button onClick={handleFinancialReportsClick} className={styles.navLink}>
                                    Relatórios Financeiros
                                </button> */}
                                {/* Você pode converter este também para um dashboardCard se quiser */}
                            </>
                        )}
                    </div> 
                )}
            </nav>

            {/* Conteúdo adicional do dashboard, visível para fisioterapeuta e admin */}
            {/* {(userRole === 'physiotherapist' || userRole === 'admin') && (
                <div className={styles.dashboardContent}>
                    <ScheduleTable />
                </div>
            )} */}
        </div>
    );
}

export default Dashboard;