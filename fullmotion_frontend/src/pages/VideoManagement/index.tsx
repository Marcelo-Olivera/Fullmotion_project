// src/pages/VideoManagement/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <--- Importe useNavigate aqui!
import { // Mantenha todas as importações existentes do Material-UI
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
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // <--- Importe o ícone de upload
import { useAuth } from '../../context/AuthContext';

// Definição do enum UserRole - MANTENHA AQUI se não for importado de outro lugar
enum UserRole {
  ADMIN = 'admin',
  PHYSIOTHERAPIST = 'physiotherapist',
  PATIENT = 'patient',
}

// Interfaces para os dados do vídeo e do paciente (devem espelhar seu backend)
interface Video {
  id: string;
  title: string;
  description?: string;
  filename: string;
  filePath: string; // Ex: /uploads/videos/nome-do-video.mp4
  mimeType: string;
  size: number;
  uploadedByUserId: string;
  accessStatus: 'Privado' | 'Público para Pacientes' | 'Pacientes Específicos';
  allowedPatientIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface Patient {
  id: string;
  email: string;
  // outras propriedades do paciente que você queira exibir (ex: name)
}

const VideoManagementPage: React.FC = () => {
  const { user } = useAuth(); // Obter o objeto do usuário logado
  const navigate = useNavigate(); // <--- Inicialize useNavigate aqui!

  const [videos, setVideos] = useState<Video[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]); // Para listar pacientes ao liberar vídeo
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estados para o modal de edição
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedAccessStatus, setEditedAccessStatus] = useState<'Privado' | 'Público para Pacientes' | 'Pacientes Específicos'>('Privado');
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);

  // Função para buscar vídeos
  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setMessage({ type: 'error', text: 'Você não está autenticado.' });
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3000/api/videos', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setVideos(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar vídeos:', error);
      const errorMessage = error.response?.data?.message || 'Falha ao carregar vídeos.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para buscar pacientes (apenas para Admin)
  const fetchPatients = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        return; // Ou lançar um erro, dependendo da robustez que você quer
      }
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setPatients(response.data.filter((p: any) => p.role === UserRole.PATIENT)); // Filtra apenas pacientes
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
    }
  }, []);

  // Efeito para carregar vídeos e pacientes (se for admin) ao montar o componente
  useEffect(() => {
    fetchVideos();
    if (user?.role === UserRole.ADMIN) {
      fetchPatients();
    }
  }, [fetchVideos, fetchPatients, user]);

  // Função para abrir o modal de edição
  const handleEditClick = (video: Video) => {
    setCurrentVideo(video);
    setEditedTitle(video.title);
    setEditedDescription(video.description || '');
    setEditedAccessStatus(video.accessStatus);
    setSelectedPatientIds(video.allowedPatientIds || []);
    setEditModalOpen(true);
  };

  // Função para fechar o modal de edição
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setCurrentVideo(null);
    setMessage(null); // Limpa mensagens anteriores no modal
  };

  // Função para lidar com a atualização do vídeo
  const handleUpdateVideo = async () => {
    if (!currentVideo) return;

    setLoading(true);
    setMessage(null); // Limpa mensagens da página principal

    const updateData = {
      title: editedTitle,
      description: editedDescription,
      accessStatus: editedAccessStatus,
      allowedPatientIds: editedAccessStatus === 'Pacientes Específicos' ? selectedPatientIds : [],
    };

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setMessage({ type: 'error', text: 'Você não está autenticado.' });
        setLoading(false);
        return;
      }

      const response = await axios.put(`http://localhost:3000/api/videos/${currentVideo.id}`, updateData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      setMessage({ type: 'success', text: `Vídeo "${response.data.title}" atualizado com sucesso!` });
      fetchVideos(); // Recarregar a lista de vídeos
      handleEditModalClose(); // Fechar o modal
    } catch (error: any) {
      console.error('Erro ao atualizar vídeo:', error);
      const errorMessage = error.response?.data?.message || 'Falha ao atualizar vídeo.';
      setMessage({ type: 'error', text: `Falha na atualização: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com a exclusão do vídeo
  const handleDeleteVideo = async (videoId: string) => {
    if (!window.confirm('Tem certeza que deseja deletar este vídeo?')) {
      return;
    }

    setLoading(true);
    setMessage(null); // Limpa mensagens da página principal

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setMessage({ type: 'error', text: 'Você não está autenticado.' });
        setLoading(false);
        return;
      }

      await axios.delete(`http://localhost:3000/api/videos/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setMessage({ type: 'success', text: 'Vídeo deletado com sucesso!' });
      fetchVideos(); // Recarregar a lista de vídeos
    } catch (error: any) {
      console.error('Erro ao deletar vídeo:', error);
      const errorMessage = error.response?.data?.message || 'Falha ao deletar vídeo.';
      setMessage({ type: 'error', text: `Falha na exclusão: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Box para organizar o título e o botão de upload */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gerenciamento de Vídeos
        </Typography>

        {/* Botão de Upload visível apenas para ADMIN */}
        {user?.role === UserRole.ADMIN && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />} // Ícone de upload
            onClick={() => navigate('/admin/upload-video')} // Redireciona para a página de upload
          >
            Upload Novo Vídeo
          </Button>
        )}
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
      ) : videos.length === 0 ? (
        <Alert severity="info">Nenhum vídeo encontrado. Faça upload de um vídeo primeiro.</Alert>
      ) : (
        <Paper elevation={3}>
          <TableContainer>
            <Table aria-label="tabela de vídeos">
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Status de Acesso</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>{video.title}</TableCell>
                    <TableCell>{video.description || 'N/A'}</TableCell>
                    <TableCell>{video.accessStatus}</TableCell>
                    <TableCell>
                      {/* Botão para reproduzir/abrir vídeo */}
                      <IconButton color="primary" onClick={() => window.open(`http://localhost:3000${video.filePath}`, '_blank')}>
                        <PlayArrowIcon />
                      </IconButton>
                      {/* Botão para editar vídeo */}
                      <IconButton color="primary" onClick={() => handleEditClick(video)}>
                        <EditIcon />
                      </IconButton>
                      {/* Botão de deletar visível apenas para Admin */}
                      {user?.role === UserRole.ADMIN && (
                        <IconButton color="error" onClick={() => handleDeleteVideo(video.id)}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Modal de Edição de Vídeo */}
      <Dialog open={editModalOpen} onClose={handleEditModalClose} fullWidth maxWidth="sm">
        <DialogTitle>Editar Vídeo</DialogTitle>
        <DialogContent>
          {currentVideo && (
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                label="Título do Vídeo"
                variant="outlined"
                fullWidth
                margin="normal"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
              <TextField
                label="Descrição"
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="edit-access-status-label">Status de Acesso</InputLabel>
                <Select
                  labelId="edit-access-status-label"
                  id="edit-access-status"
                  value={editedAccessStatus}
                  label="Status de Acesso"
                  onChange={(e) => setEditedAccessStatus(e.target.value as 'Privado' | 'Público para Pacientes' | 'Pacientes Específicos')}
                >
                  <MenuItem value="Privado">Privado</MenuItem>
                  <MenuItem value="Público para Pacientes">Público para Pacientes</MenuItem>
                  <MenuItem value="Pacientes Específicos">Pacientes Específicos</MenuItem>
                </Select>
              </FormControl>

              {editedAccessStatus === 'Pacientes Específicos' && (
                <FormControl fullWidth margin="normal">
                  <InputLabel id="select-patients-label">Liberar para Pacientes</InputLabel>
                  <Select
                    labelId="select-patients-label"
                    id="select-patients"
                    multiple
                    value={selectedPatientIds}
                    onChange={(e) => setSelectedPatientIds(e.target.value as string[])}
                    input={<OutlinedInput label="Liberar para Pacientes" />}
                    renderValue={(selected) => (selected as string[])
                      .map(id => patients.find(p => p.id === id)?.email || id)
                      .join(', ')
                    }
                  >
                    {patients.map((patient) => (
                      <MenuItem key={patient.id} value={patient.id}>
                        <Checkbox checked={selectedPatientIds.indexOf(patient.id) > -1} />
                        <ListItemText primary={patient.email} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditModalClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleUpdateVideo} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar Alterações'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VideoManagementPage;