import styles from './Login.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Certifique-se de que 'Link' está importado
import { useAuth } from '../../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    useEffect(() => {
        console.log('Login.tsx useEffect: isAuthenticated mudou para', isAuthenticated);
        if (isAuthenticated) {
            console.log('Login.tsx useEffect: Autenticado. Redirecionando para /dashboard...');
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email,
                password: senha,
            });

            console.log('Login bem-sucedido. Token:', response.data.access_token);
            login(response.data.access_token);

        } catch (err: any) {
            console.error('Erro no login:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
        }
    };

    return (
        <div className={styles.loginBg}>
            <form className={styles.loginBox} onSubmit={handleSubmit}>
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
                {error && <p className={styles.errorMessage}>{error}</p>}
                <div className={styles.links}>
                    {/* ALTERAÇÃO AQUI: Use Link do react-router-dom */}
                    <Link to="/forgot-password">Esqueceu a senha?</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;