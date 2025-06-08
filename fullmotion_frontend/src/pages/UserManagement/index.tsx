// src/pages/UserManagement/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../context/AuthContext';

// Enum para os papéis de usuário (devem espelhar seu backend)
enum UserRole {
  ADMIN = 'admin',
  PHYSIOTHERAPIST = 'physiotherapist',
  PATIENT = 'patient',
}

// Interfaces para os dados do usuário (devem espelhar seu backend, sem a senha)
interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

const UserManagementPage: React.FC = () => {
  const { user } = useAuth(); // O admin logado
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estados para o modal de criação de usuário
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>(UserRole.PATIENT); // Padrão para nova criação

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setMessage({ type: 'error', text: 'Você não está autenticado. Faça login como admin.' });
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
      const errorMessage = error.response?.data?.message || 'Falha ao carregar usuários.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Apenas admins podem acessar esta página, já garantido pelo AuthRoleRoute
    fetchUsers();
  }, [fetchUsers]);

  // Função para abrir o modal de criação
  const handleCreateClick = () => {
    setNewEmail('');
    setNewPassword('');
    setNewRole(UserRole.PATIENT); // Reseta para o padrão
    setCreateModalOpen(true);
  };

  // Função para fechar o modal de criação
  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
    setMessage(null); // Limpa mensagens do modal
  };

  // Função para lidar com a criação de um novo usuário
  const handleCreateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setMessage({ type: 'error', text: 'Você não está autenticado.' });
        setLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:3000/api/users', {
        email: newEmail,
        password: newPassword,
        role: newRole,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      setMessage({ type: 'success', text: `Usuário "${response.data.email}" criado com sucesso!` });
      fetchUsers(); // Recarregar a lista de usuários
      handleCreateModalClose();
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      const errorMessage = error.response?.data?.message || 'Falha ao criar usuário.';
      setMessage({ type: 'error', text: `Falha na criação: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com a exclusão de um usuário
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário? Esta ação é irreversível.')) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setMessage({ type: 'error', text: 'Você não está autenticado.' });
        setLoading(false);
        return;
      }

      await axios.delete(`http://localhost:3000/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setMessage({ type: 'success', text: 'Usuário deletado com sucesso!' });
      fetchUsers();
    } catch (error: any) {
      console.error('Erro ao deletar usuário:', error);
      const errorMessage = error.response?.data?.message || 'Falha ao deletar usuário.';
      setMessage({ type: 'error', text: `Falha na exclusão: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, px: { xs: 1, sm: 2, md: 3 } }}> {/* Adicionado padding responsivo */}
      {/* Box que organiza o título e o botão de "Criar Novo Usuário" */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}> {/* Ajustado para empilhar em mobile */}
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' } }}>
          Gerenciamento de Usuários
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
          sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, py: { xs: 1, sm: 1.5 } }} 
        >
          Criar Novo Usuário
        </Button>
      </Box>

      {message && (
        <Alert severity={message.type} sx={{ mt: 3, mb: 3 }}>
          {message.text}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 200 }}>
          <CircularProgress />
        </Box>
      ) : users.length === 0 ? (
        <Alert severity="info">Nenhum usuário encontrado.</Alert>
      ) : (
        <Paper elevation={3}>
          {/* Box com overflow-x para rolagem horizontal da tabela */}
          <Box sx={{ overflowX: 'auto' }}>
            <TableContainer>
              {/* minWidth garante que a tabela tenha uma largura mínima e force a rolagem se necessário */}
              <Table aria-label="tabela de usuários" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    {/* Ajuste de font-size responsivo para os cabeçalhos das células */}
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>Email</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>Role</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>ID</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>Criado Em</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((userItem) => (
                    <TableRow key={userItem.id}>
                      {/* Ajuste de font-size responsivo para o conteúdo das células */}
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>{userItem.email}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>{userItem.role}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>{userItem.id}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>{new Date(userItem.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}> {/* Garante que os botões não quebrem linha */}
                        {userItem.id !== user?.userId && (
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteUser(userItem.id)}
                          >
                            <DeleteIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} /> {/* Tamanho do ícone responsivo */}
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      )}

      {/* Modal de Criação de Usuário (ajustes de fonte e padding também) */}
      <Dialog open={createModalOpen} onClose={handleCreateModalClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>Criar Novo Usuário</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleCreateUser} sx={{ mt: 2 }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              // Estilos para o TextField interno (input, label, borda)
              sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
            />
            <TextField
              label="Senha"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="new-user-role-label" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Role</InputLabel>
              <Select
                labelId="new-user-role-label"
                id="new-user-role"
                value={newRole}
                label="Role"
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
              >
                {Object.values(UserRole).map((role) => (
                  <MenuItem key={role} value={role} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateModalClose} color="secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleCreateUser} color="primary" disabled={loading} sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Criar Usuário'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagementPage;

/*enum UserRole {
  ADMIN = 'admin',
  PHYSIOTHERAPIST = 'physiotherapist',
  PATIENT = 'patient',
}*/