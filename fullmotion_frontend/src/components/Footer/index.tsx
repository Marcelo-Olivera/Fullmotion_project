// src/components/Footer.tsx
import styles from './Footer.module.css';
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useLocation } from 'react-router-dom'; // Importe useLocation
import { useAuth } from '../../context/AuthContext'; // Importe useAuth

function Footer() {
    const location = useLocation(); // Obtenha a rota atual
    const { isAuthenticated } = useAuth(); // Obtenha o estado de autenticação

    // Mesma lógica do Header: os links do rodapé institucional só aparecem
    // se a rota for a página inicial '/' E o usuário NÃO estiver autenticado.
    const showInstitutionalFooterLinks = location.pathname === '/' && !isAuthenticated;

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <img src="/src/components/Header/Logo_Fullmotion.png" alt="Logo Fullmotion" />
                </div>
                {/* Renderiza a navegação do rodapé APENAS se a condição for verdadeira */}
                {showInstitutionalFooterLinks && (
                    <nav className={styles.menu}>
                        <a href='#sobreNos' className={styles.menuLink}>Sobre Nós</a>
                        <a href='#servicos' className={styles.menuLink}>Serviços</a>
                        <a href='#contatos' className={styles.menuLink}>Contatos</a>
                    </nav>
                )}
                <div className={styles.social}>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <FaInstagram />
                    </a>
                    <a href="https://wa.me/SEUNUMERO" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                        <FaWhatsapp />
                    </a>
                </div>
            </div>
            <div className={styles.copy}>
                <p>© {new Date().getFullYear()} Fullmotion. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;