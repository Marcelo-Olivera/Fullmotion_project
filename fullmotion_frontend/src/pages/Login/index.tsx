import styles from './Login.module.css';
import { useState } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    return (
        <div className={styles.loginBg}>
            <form className={styles.loginBox}>
                <img
                    src="/src/components/Header/Logo_Fullmotion.png"
                    alt="Logo Fullmotion"
                    className={styles.logo}
                />
                <div className={styles.inputGroup}>
                    <fieldset className={styles.fieldset + ' ' + (email ? styles.filled : '')}>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className={styles.floatingInput}
                            autoComplete="username"
                        />
                        <legend className={styles.legend}>E-mail</legend>
                    </fieldset>
                </div>
                <div className={styles.inputGroup}>
                    <fieldset className={styles.fieldset + ' ' + (senha ? styles.filled : '')}>
                        <input
                            type="password"
                            id="senha"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                            required
                            className={styles.floatingInput}
                            autoComplete="current-password"
                        />
                        <legend className={styles.legend}>Senha</legend>
                    </fieldset>
                </div>
                <button type="submit" className={styles.loginBtn}>Entrar</button>
                <div className={styles.links}>
                    <a href="#">Esqueceu a senha?</a>
                </div>
            </form>
        </div>
    );
}

export default Login;