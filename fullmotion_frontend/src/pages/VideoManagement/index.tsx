// src/pages/VideoManagement/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
  filePath: string;
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
}

const VideoManagementPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [videos, setVideos] = useState<Video[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedAccessStatus, setEditedAccessStatus] = useState<'Privado' | 'Público para Pacientes' | 'Pacientes Específicos'>('Privado');
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);

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

  const fetchPatients = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        return;
      }
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setPatients(response.data.filter((p: any) => p.role === UserRole.PATIENT));
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
    if (user?.role === UserRole.ADMIN) {
      fetchPatients();
    }
  }, [fetchVideos, fetchPatients, user]);

  const handleEditClick = (video: Video) => {
    setCurrentVideo(video);
    setEditedTitle(video.title);
    setEditedDescription(video.description || '');
    setEditedAccessStatus(video.accessStatus);
    setSelectedPatientIds(video.allowedPatientIds || []);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setCurrentVideo(null);
    setMessage(null);
  };

  const handleUpdateVideo = async () => {
    if (!currentVideo) return;

    setLoading(true);
    setMessage(null);

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
      fetchVideos();
      handleEditModalClose();
    } catch (error: any) {
      console.error('Erro ao atualizar vídeo:', error);
      const errorMessage = error.response?.data?.message || 'Falha ao atualizar vídeo.';
      setMessage({ type: 'error', text: `Falha na atualização: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!window.confirm('Tem certeza que deseja deletar este vídeo?')) {
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

      await axios.delete(`http://localhost:3000/api/videos/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setMessage({ type: 'success', text: 'Vídeo deletado com sucesso!' });
      fetchVideos();
    } catch (error: any) {
      console.error('Erro ao deletar vídeo:', error);
      const errorMessage = error.response?.data?.message || 'Falha ao deletar vídeo.';
      setMessage({ type: 'error', text: `Falha na exclusão: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, px: { xs: 1, sm: 2, md: 3 } }}> {/* Adicionado padding responsivo */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}> {/* Ajustado para empilhar em mobile */}
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' } }}>
          Gerenciamento de Vídeos
        </Typography>

        {user?.role === UserRole.ADMIN && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={() => navigate('/admin/upload-video')}
            sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, py: { xs: 1, sm: 1.5 } }} 
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
          {/* Box com overflow-x para rolagem horizontal da tabela */}
          <Box sx={{ overflowX: 'auto' }}>
            <TableContainer>
              <Table aria-label="tabela de vídeos" sx={{ minWidth: 650 }}> {/* minWidth para garantir a rolagem */}
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>Título</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>Descrição</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>Status de Acesso</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {videos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>{video.title}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>{video.description || 'N/A'}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>{video.accessStatus}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}> {/* Garante que os botões não quebrem linha */}
                        <IconButton color="primary" size="small" onClick={() => window.open(`http://localhost:3000${video.filePath}`, '_blank')}>
                          <PlayArrowIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                        </IconButton>
                        <IconButton color="primary" size="small" onClick={() => handleEditClick(video)}>
                          <EditIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                        </IconButton>
                        {user?.role === UserRole.ADMIN && (
                          <IconButton color="error" size="small" onClick={() => handleDeleteVideo(video.id)}>
                            <DeleteIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
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

      {/* Modal de Edição de Vídeo (ajustes de fonte e padding também) */}
      <Dialog open={editModalOpen} onClose={handleEditModalClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>Editar Vídeo</DialogTitle>
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
                sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
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
                sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="edit-access-status-label" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Status de Acesso</InputLabel>
                <Select
                  labelId="edit-access-status-label"
                  id="edit-access-status"
                  value={editedAccessStatus}
                  label="Status de Acesso"
                  onChange={(e) => setEditedAccessStatus(e.target.value as 'Privado' | 'Público para Pacientes' | 'Pacientes Específicos')}
                  sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
                >
                  <MenuItem value="Privado" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Privado</MenuItem>
                  <MenuItem value="Público para Pacientes" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Público para Pacientes</MenuItem>
                  <MenuItem value="Pacientes Específicos" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Pacientes Específicos</MenuItem>
                </Select>
              </FormControl>

              {editedAccessStatus === 'Pacientes Específicos' && (
                <FormControl fullWidth margin="normal">
                  <InputLabel id="select-patients-label" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Liberar para Pacientes</InputLabel>
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
                    sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
                  >
                    {patients.map((patient) => (
                      <MenuItem key={patient.id} value={patient.id} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
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
          <Button onClick={handleEditModalClose} color="secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
            Cancelar
          </Button>
          <Button onClick={handleUpdateVideo} color="primary" disabled={loading} sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar Alterações'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VideoManagementPage;


/**/ 