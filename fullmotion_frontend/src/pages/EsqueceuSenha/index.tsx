import React, { useState } from 'react';
import styles from './EsqueceuSenha.module.css'; // Vamos criar este CSS
import { Link } from 'react-router-dom';

function EsqueceuSenha() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); // Limpa mensagens anteriores
    setIsError(false);
    setIsLoading(true);

    try {
      // Substitua por sua URL de API de backend
      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Um e-mail com instruções para redefinir sua senha foi enviado.');
        setIsError(false);
      } else {
        setMessage(data.message || 'Erro ao enviar o e-mail de recuperação. Por favor, tente novamente.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setMessage('Ocorreu um erro na conexão. Por favor, tente novamente mais tarde.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2>Esqueceu sua senha?</h2>
        <p>Informe o e-mail associado à sua conta e enviaremos um link com um código para redefinir sua senha.</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              required
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Redefinir Senha'}
          </button>
        </form>

        {message && (
          <p className={isError ? styles.errorMessage : styles.successMessage}>
            {message}
          </p>
        )}

        <div className={styles.backToLogin}>
          <Link to="/login">Voltar para o Login</Link>
        </div>
      </div>
    </div>
  );
}

export default EsqueceuSenha;