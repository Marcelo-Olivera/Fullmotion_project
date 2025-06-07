// src/pages/ResetPassword/index.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  // Não precisamos de InputGroup, Label, etc. do Material-UI para este layout
} from '@mui/material';

// Não precisamos mais importar o CSS Module se usarmos apenas Material-UI para layout/estilo
// import styles from './ResetPassword.module.css';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      setMessage({ type: 'error', text: 'Token de redefinição de senha não encontrado na URL.' });
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    setMessage(null);

    if (!token) {
      setMessage({ type: 'error', text: 'Token inválido ou ausente. Por favor, solicite uma nova redefinição.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/reset-password', {
        token: token,
        newPassword: newPassword,
      });

      setMessage({ type: 'success', text: response.data.message || 'Sua senha foi redefinida com sucesso! Você pode fazer login agora.' });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      const errorMessage = error.response?.data?.message || 'Erro desconhecido ao redefinir a senha.';
      setMessage({ type: 'error', text: `Falha ao redefinir senha: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    // Container principal que centraliza o conteúdo
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 120px)', // Exemplo: 100vh menos altura do header e footer
        color: '#f0f0f0',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      {/* Box que simula o 'formBox' com fundo, sombra e padding */}
      <Box
        sx={{
          backgroundColor: '#2a2c33', // Fundo do formulário
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
          textAlign: 'center',
          maxWidth: '450px',
          width: '90%',
          mb: '20px', // margin-bottom
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" sx={{ mb: 4 }}>
          Redefinir Sua Senha
        </Typography>

        {message && (
          <Alert
            severity={message.type}
            sx={{ mt: 3, mb: 3 }}
          >
            {message.text}
          </Alert>
        )}

        {!token ? (
          <Alert severity="error" sx={{ mt: 3, mb: 3 }}>
            O token de redefinição de senha está faltando ou é inválido. Por favor, use o link completo do e-mail.
            <Button onClick={() => navigate('/forgot-password')} variant="text" sx={{ mt: 1, display: 'block', margin: 'auto' }}>
              Solicitar Nova Redefinição
            </Button>
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              label="Nova Senha"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              sx={{
                '& .MuiInputBase-input': { color: '#f0f0f0' }, // Cor do texto digitado
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' }, // Cor da borda
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#49c5b6' }, // Cor da borda no hover
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#49c5b6' }, // Cor da borda no focus
                '& .MuiInputLabel-root': { color: '#49c5b6' }, // Cor da label
                '& .MuiInputLabel-root.Mui-focused': { color: '#49c5b6' }, // Cor da label no focus
                backgroundColor: '#1c1e22', // Fundo do input
                borderRadius: '8px',
              }}
            />
            <TextField
              label="Confirmar Nova Senha"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              sx={{
                '& .MuiInputBase-input': { color: '#f0f0f0' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#49c5b6' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#49c5b6' },
                '& .MuiInputLabel-root': { color: '#49c5b6' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#49c5b6' },
                backgroundColor: '#1c1e22',
                borderRadius: '8px',
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5, mt: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Redefinir Senha'}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;