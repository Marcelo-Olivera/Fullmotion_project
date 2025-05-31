import styles from './Login.module.css';
import { useState, useEffect } from 'react'; // Adicione useEffect aqui
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Importe useAuth

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth(); // Obtenha 'isAuthenticated' também do contexto

    // NOVO: useEffect para observar a mudança de estado de autenticação
    // Este efeito será disparado sempre que 'isAuthenticated' mudar
    useEffect(() => {
        console.log('Login.tsx useEffect: isAuthenticated mudou para', isAuthenticated);
        // Se isAuthenticated se tornar true APÓS o login bem-sucedido, redireciona
        if (isAuthenticated) {
            console.log('Login.tsx useEffect: Autenticado. Redirecionando para /dashboard...');
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]); // Dependências: re-executa quando isAuthenticated ou navigate mudam

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email,
                password: senha,
            });

            console.log('Login bem-sucedido. Token:', response.data.access_token);
            // Chama a função 'login' do contexto, que irá:
            // 1. Salvar o token no localStorage
            // 2. Mudar o estado 'isAuthenticated' para true no AuthContext
            login(response.data.access_token);

            // IMPORTANTE: Removemos a chamada direta 'navigate("/dashboard")' daqui.
            // O redirecionamento será tratado pelo 'useEffect' acima quando 'isAuthenticated' for atualizado.
            // Isso resolve potenciais problemas de timing.

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
                    <a href="#">Esqueceu a senha?</a>
                </div>
            </form>
        </div>
    );
}

export default Login;