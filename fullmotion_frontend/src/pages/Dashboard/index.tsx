import { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Importe useNavigate para redirecionar após o logout

function Dashboard() {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const { logout } = useAuth(); // Obtenha a função logout do contexto
    const navigate = useNavigate(); // Hook para navegação programática

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                // Decodificar o token para obter o e-mail (NÃO SEGURO PARA PRODUÇÃO - APENAS PARA EXEMPLO)
                const payloadBase64 = token.split('.')[1];
                const decodedPayload = JSON.parse(atob(payloadBase64));
                setUserEmail(decodedPayload.email || 'Usuário');
            } catch (e) {
                console.error("Erro ao decodificar token JWT:", e);
                setUserEmail('Usuário');
            }
        } else {
            setUserEmail('Usuário'); // Caso o token não exista por algum motivo
        }
    }, []);

    // Função que será chamada ao clicar no botão de logout
    const handleLogout = () => {
        logout(); // Chama a função de logout do contexto (remove o token do localStorage e atualiza o estado)
        navigate('/login'); // Redireciona o usuário de volta para a página de login
    };

    return (
        <div className={styles.dashboardContainer}>
            <h1>Bem-vindo, {userEmail || 'Usuário'}!</h1>
            <p>Login realizado com sucesso. Esta é a página principal da Fullmotion.</p>

            <nav className={styles.dashboardNav}>
                <a href="/agendar" className={styles.navLink}>Agendar Avaliação</a>
                {/* Botão de Logout */}
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    Sair
                </button>
            </nav>
        </div>
    );
}

export default Dashboard;