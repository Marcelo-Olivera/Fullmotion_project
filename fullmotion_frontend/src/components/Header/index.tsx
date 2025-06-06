// src/components/Header.tsx
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { IoMenuOutline } from "react-icons/io5";
import { RiLoginCircleFill } from "react-icons/ri";
import { AiFillSchedule } from "react-icons/ai";
import { useAuth } from '../../context/AuthContext'; // Importe useAuth
import { useNavigate } from 'react-router-dom'; // Importe useNavigate para redirecionar no logout
import gsap from "gsap";

function Header() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  const { isAuthenticated, logout } = useAuth(); // Obtenha o estado de autenticação e a função logout
  const navigate = useNavigate(); // Para redirecionar no logout

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
    logout(); // Chama a função logout do contexto
    setDrawerOpen(false); // Fecha o drawer
    navigate('/login'); // Redireciona para a página de login
  };

  return (
    <>
      <header className={styles.header}>
        <div ref={logoRef} className={styles.logo}>
          <Link to='/'>
            <img src='/src/components/Header/Logo_Fullmotion.png' alt="Logo da empresa Fullmotion" />
          </Link>
        </div>
        <nav ref={navRef} className={styles.nav}>
          <a href='#sobreNos' className={styles.a}>Sobre Nós</a>
          <a href='#servicos' className={styles.a}>Serviços</a>
          <a href='#contatos' className={styles.a}>Contatos</a>
        </nav>
        <button className={styles.menu} onClick={() => setDrawerOpen(true)}>
          <IoMenuOutline size={40} />
        </button>
      </header>

      {/* Drawer lateral à DIREITA */}
      <div className={`${styles.drawer} ${drawerOpen ? styles.open : ""}`}>
        <button className={styles.closeButton} onClick={() => setDrawerOpen(false)}>✖</button>
        <nav className={styles.drawerNav}>
          {isAuthenticated ? (
            // Se estiver logado, mostra o botão Sair
            <button className={styles.link} onClick={handleLogout}> {/* Use button para o evento onClick */}
              <div className={styles.container}>
                <RiLoginCircleFill size={32} /> {/* Ícone pode ser diferente para 'Sair' se quiser */}
                <p>Sair</p>
              </div>
            </button>
          ) : (
            // Se não estiver logado, mostra o link de Login
            <Link className={styles.link} to="/login" onClick={() => setDrawerOpen(false)}>
              <div className={styles.container}>
                <RiLoginCircleFill size={32} />
                <p>Login</p>
              </div>
            </Link>
          )}

          {/* O link de Agendar Avaliação pode ser sempre visível ou condicional, dependendo da sua regra */}
          <Link className={styles.link} to="/agendar" onClick={() => setDrawerOpen(false)}>
            <div className={styles.container}>
              <AiFillSchedule size={32} />
              <p>Agendar Avaliação</p>
            </div>
          </Link>

          {/* NOVO: Link para o Dashboard se estiver logado */}
          {isAuthenticated && (
              <Link className={styles.link} to="/dashboard" onClick={() => setDrawerOpen(false)}>
                  <div className={styles.container}>
                      {/* Ícone para Dashboard, talvez algo como IoHome ou FaChartBar */}
                      <IoMenuOutline size={32} />
                      <p>Dashboard</p>
                  </div>
              </Link>
          )}
        </nav>
      </div>
    </>
  );
}

export default Header;