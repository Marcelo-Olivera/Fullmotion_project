import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material'; // Importando componentes do Material-UI

import styles from './UploadVideo.module.css'; // Importando o CSS Module

// Enum para o status de acesso do vídeo - DEVE ESPELHAR SEU BACKEND
enum VideoAccessStatus {
  PRIVATE = 'Privado',
  PUBLIC_FOR_PATIENTS = 'Público para Pacientes',
  SPECIFIC_PATIENTS = 'Pacientes Específicos',
}

const UploadVideoPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [accessStatus, setAccessStatus] = useState<VideoAccessStatus>(VideoAccessStatus.PRIVATE);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Função para lidar com a seleção do arquivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (!title || !selectedFile) {
      setMessage({ type: 'error', text: 'Título e arquivo de vídeo são obrigatórios.' });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    if (description) {
      formData.append('description', description);
    }
    formData.append('file', selectedFile);
    formData.append('accessStatus', accessStatus);

    try {
      // **IMPORTANTE**: Obtenha o token JWT do admin logado.
      // Ajuste esta linha conforme onde você armazena seu token (ex: localStorage, Context API, Redux).
      const token = localStorage.getItem('access_token');
      if (!token) {
        setMessage({ type: 'error', text: 'Você não está autenticado. Faça login como admin.' });
        setLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:3000/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      setMessage({ type: 'success', text: `Vídeo "${response.data.title}" enviado com sucesso!` });
      // Limpar formulário após o sucesso
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setAccessStatus(VideoAccessStatus.PRIVATE);
      // Para limpar o input de arquivo, você pode precisar de um ref ou redefinir o valor:
      const fileInput = document.getElementById('video-upload-button') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      const errorMessage = error.response?.data?.message || 'Erro desconhecido ao fazer upload.';
      setMessage({ type: 'error', text: `Falha no upload: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }} className={styles.uploadContainer}>
      <Typography variant="h4" component="h1" gutterBottom align="center" className={styles.pageTitle}>
        Upload de Novo Vídeo
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          label="Título do Vídeo"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Descrição (Opcional)"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="access-status-label">Status de Acesso</InputLabel>
          <Select
            labelId="access-status-label"
            id="access-status"
            value={accessStatus}
            label="Status de Acesso"
            onChange={(e) => setAccessStatus(e.target.value as VideoAccessStatus)}
          >
            <MenuItem value={VideoAccessStatus.PRIVATE}>Privado</MenuItem>
            <MenuItem value={VideoAccessStatus.PUBLIC_FOR_PATIENTS}>Público para Pacientes</MenuItem>
            <MenuItem value={VideoAccessStatus.SPECIFIC_PATIENTS}>Pacientes Específicos</MenuItem>
          </Select>
        </FormControl>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="video-upload-button"
        />
        <label htmlFor="video-upload-button">
          <Button variant="outlined" component="span" fullWidth sx={{ mt: 2, mb: 2 }}>
            {selectedFile ? `Arquivo Selecionado: ${selectedFile.name}` : 'Selecionar Arquivo de Vídeo'}
          </Button>
        </label>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ py: 1.5 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Fazer Upload'}
        </Button>
      </Box>
      {message && (
        <Alert severity={message.type} sx={{ mt: 3 }}>
          {message.text}
        </Alert>
      )}
    </Container>
  );
};

export default UploadVideoPage;