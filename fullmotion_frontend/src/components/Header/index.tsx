// src/components/Header.tsx
import styles from './Header.module.css';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { IoMenuOutline } from "react-icons/io5";
import { RiLoginCircleFill } from "react-icons/ri";
import { AiFillSchedule } from "react-icons/ai";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import gsap from "gsap";

function Header() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    gsap.fromTo(
      logoRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    );

    gsap.fromTo(
      navRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.5 }
    );
  }, []);

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    navigate('/login');
  };

  // Esta condição controla a visibilidade dos links 'Sobre Nós', 'Serviços', 'Contatos'
  // Eles só aparecerão no HEADER principal se a rota for '/' E o usuário NÃO estiver autenticado.
  const showInstitutionalNavLinksInHeader = location.pathname === '/' && !isAuthenticated;

  return (
    <>
      <header className={styles.header}>
        <div ref={logoRef} className={styles.logo}>
          <Link to='/'>
            <img src='/src/components/Header/Logo_Fullmotion.png' alt="Logo da empresa Fullmotion" />
          </Link>
        </div>
        {/* Renderiza a navegação principal APENAS se a condição for verdadeira */}
        {showInstitutionalNavLinksInHeader && (
          <nav ref={navRef} className={styles.nav}>
            <a href='#sobreNos' className={styles.a}>Sobre Nós</a>
            <a href='#servicos' className={styles.a}>Serviços</a>
            <a href='#contatos' className={styles.a}>Contatos</a>
          </nav>
        )}
        <button className={styles.menu} onClick={() => setDrawerOpen(true)}>
          <IoMenuOutline size={40} />
        </button>
      </header>

      {/* Drawer lateral à DIREITA */}
      <div className={`${styles.drawer} ${drawerOpen ? styles.open : ""}`}>
        <button className={styles.closeButton} onClick={() => setDrawerOpen(false)}>✖</button>
        <nav className={styles.drawerNav}>
          {isAuthenticated ? (
            <button className={styles.link} onClick={handleLogout}>
              <div className={styles.container}>
                <RiLoginCircleFill size={32} />
                <p>Sair</p>
              </div>
            </button>
          ) : (
            <Link className={styles.link} to="/login" onClick={() => setDrawerOpen(false)}>
              <div className={styles.container}>
                <RiLoginCircleFill size={32} />
                <p>Login</p>
              </div>
            </Link>
          )}

          <Link className={styles.link} to="/agendar" onClick={() => setDrawerOpen(false)}>
            <div className={styles.container}>
              <AiFillSchedule size={32} />
              <p>Agendar Avaliação</p>
            </div>
          </Link>

          {isAuthenticated && (
              <Link className={styles.link} to="/dashboard" onClick={() => setDrawerOpen(false)}>
                  <div className={styles.container}>
                      <IoMenuOutline size={32} /> {/* Considere um ícone diferente para Dashboard, ex: IoHome, FaChartBar */}
                      <p>Dashboard</p>
                  </div>
              </Link>
          )}

          {/* Os links "Sobre Nós", "Serviços" e "Contatos" foram REMOVIDOS daqui
              para que nunca apareçam no drawer, conforme sua solicitação. */}
        </nav>
      </div>
    </>
  );
}

export default Header;