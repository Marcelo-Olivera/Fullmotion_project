import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { IoMenuOutline } from "react-icons/io5";
import { RiLoginCircleFill } from "react-icons/ri";
import { AiFillSchedule } from "react-icons/ai";
import gsap from "gsap";

function Header() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

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
          <Link className={styles.link} to="/login" onClick={() => setDrawerOpen(false)}>
            <div className={styles.container}>
              <RiLoginCircleFill size={32} /> 
              <p>Login</p>
            </div>
          </Link>
          <Link className={styles.link} to="/agendar" onClick={() => setDrawerOpen(false)}>
            <div className={styles.container}>
              <AiFillSchedule size={32} /> 
              <p>Agendar Avaliação</p>
            </div>
          </Link>
        </nav>
      </div>
    </>
  );
}

export default Header;
