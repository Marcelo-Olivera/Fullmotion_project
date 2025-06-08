// src/components/FooterPro/index.tsx
import styles from './Footer.module.css';
import { FaInstagram, FaWhatsapp, FaLinkedin, FaFacebook } from "react-icons/fa"; // Adicionado LinkedIn e Facebook
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md"; // Ícones de contato
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Footer() {
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    // Lógica para mostrar links institucionais apenas na página inicial e se não logado
    const showInstitutionalLinks = location.pathname === '/' && !isAuthenticated;

    return (
        <footer className={styles.footer}>
            <div className={styles.mainContent}>
                {/* Coluna 1: Logo e Descrição Curta */}
                <div className={styles.column}>
                    <div className={styles.logo}>
                        <img src="/src/components/Header/Logo_Fullmotion.png" alt="Logo Fullmotion" />
                    </div>
                    <p className={styles.description}>
                        Sua saúde e bem-estar em movimento. Fisioterapia e massoterapia personalizadas para uma vida sem dor.
                    </p>
                    <div className={styles.socialIcons}>
                        <a href="https://instagram.com/fullmotion" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FaInstagram />
                        </a>
                        <a href="https://wa.me/5521999999999" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                            <FaWhatsapp />
                        </a>
                        <a href="https://linkedin.com/company/fullmotion" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <FaLinkedin />
                        </a>
                        <a href="https://facebook.com/fullmotion" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <FaFacebook />
                        </a>
                    </div>
                </div>

                {/* Coluna 2: Navegação (Links Institucionais ou Genéricos) */}
                <div className={styles.column}>
                    <h3 className={styles.columnTitle}>Navegação</h3>
                    <nav className={styles.footerNav}>
                        {showInstitutionalLinks ? (
                            <>
                                <a href='#sobreNos' className={styles.footerLink}>Sobre Nós</a>
                                <a href='#servicos' className={styles.footerLink}>Serviços</a>
                                <a href='#contatos' className={styles.footerLink}>Contatos</a>
                            </>
                        ) : (
                            // Se logado, pode mostrar links relevantes do dashboard, por exemplo
                            <>
                                <Link to="/dashboard" className={styles.footerLink}>Dashboard</Link>
                                {isAuthenticated && <Link to="/login" className={styles.footerLink} onClick={() => { /* lógica de logout */}}>Sair</Link>}
                                {!isAuthenticated && <Link to="/login" className={styles.footerLink}>Login</Link>}
                            </>
                        )}
                        {/* Exemplo de outros links que podem ser adicionados aqui */}
                        {/* <Link to="/privacy-policy" className={styles.footerLink}>Política de Privacidade</Link> */}
                        {/* <Link to="/terms-of-service" className={styles.footerLink}>Termos de Serviço</Link> */}
                    </nav>
                </div>

                {/* Coluna 3: Contato Rápido */}
                <div className={styles.column}>
                    <h3 className={styles.columnTitle}>Contato Rápido</h3>
                    <ul className={styles.contactList}>
                        <li><MdLocationOn size={20} /><p>Rua Exemplo, 123 - Centro, Rio de Janeiro</p></li>
                        <li><MdPhone size={20} /><p>(21) 99999-9999</p></li>
                        <li><MdEmail size={20} /><p>contato@fullmotion.com</p></li>
                    </ul>
                </div>
            </div>

            {/* Seção de Copyright */}
            <div className={styles.copyright}>
                <p>© {new Date().getFullYear()} Fullmotion. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;