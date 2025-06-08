// src/pages/UploadVideo/index.tsx
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
    // Ajustes de margin e padding para o Container principal
    <Container
      maxWidth="sm" // Mantém a largura máxima do formulário
      sx={{
        mt: { xs: 2, sm: 4 }, // Margem superior responsiva (menor em mobile)
        mb: { xs: 2, sm: 4 }, // Margem inferior responsiva (menor em mobile)
        px: { xs: 1, sm: 2, md: 3 }, // Padding lateral responsivo (menor em mobile)
      }}
      className={styles.uploadContainer} // Mantém a classe do CSS Module para outros estilos
    >
      {/* Ajuste de fonte para o título da página */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        className={styles.pageTitle} // Mantém a classe para cor e margem
        sx={{
          fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }, // Tamanho de fonte responsivo
          mb: { xs: 3, sm: 4 }, // Margem inferior responsiva (menor em mobile)
        }}
      >
        Upload de Novo Vídeo
      </Typography>
      {/* Ajustes de padding para o Box do formulário */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, p: { xs: 2, sm: 3 } }}> {/* Padding interno responsivo */}
        <TextField
          label="Título do Vídeo"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          // Ajuste de fonte para o input e label
          sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
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
          // Ajuste de fonte para o input e label
          sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
        />
        <FormControl fullWidth margin="normal">
          {/* Ajuste de fonte para o label do Select */}
          <InputLabel id="access-status-label" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Status de Acesso</InputLabel>
          <Select
            labelId="access-status-label"
            id="access-status"
            value={accessStatus}
            label="Status de Acesso"
            onChange={(e) => setAccessStatus(e.target.value as VideoAccessStatus)}
            // Ajuste de fonte para o input Select
            sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          >
            {/* Ajuste de fonte para os itens do Select */}
            <MenuItem value={VideoAccessStatus.PRIVATE} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Privado</MenuItem>
            <MenuItem value={VideoAccessStatus.PUBLIC_FOR_PATIENTS} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Público para Pacientes</MenuItem>
            <MenuItem value={VideoAccessStatus.SPECIFIC_PATIENTS} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Pacientes Específicos</MenuItem>
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
          <Button
            variant="outlined"
            component="span"
            fullWidth
            sx={{
              mt: { xs: 1.5, sm: 2 }, // Margem superior responsiva
              mb: { xs: 1.5, sm: 2 }, // Margem inferior responsiva
              fontSize: { xs: '0.85rem', sm: '1rem' }, // Tamanho da fonte do botão
              py: { xs: 1, sm: 1.5 } // Padding vertical do botão
            }}
          >
            {selectedFile ? `Arquivo Selecionado: ${selectedFile.name}` : 'Selecionar Arquivo de Vídeo'}
          </Button>
        </label>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          // Ajuste de padding e fonte para o botão de submit
          sx={{ py: { xs: 1.2, sm: 1.5 }, fontSize: { xs: '0.9rem', sm: '1.1rem' } }}
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

