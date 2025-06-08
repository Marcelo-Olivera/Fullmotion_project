// src/pages/PatientVideos/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  // Paper, // Não é usado diretamente para o layout principal do grid
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useAuth } from '../../context/AuthContext'; // Importe seu hook de autenticação

// Interface para os dados do vídeo (deve espelhar seu backend)
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

const PatientVideosPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchReleasedVideos = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setMessage({ type: 'error', text: 'Você não está autenticado. Faça login.' });
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3000/api/videos/released', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setVideos(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar vídeos liberados:', error);
      const errorMessage = error.response?.data?.message || 'Falha ao carregar vídeos.';
      setMessage({ type: 'error', text: `Falha ao carregar seus vídeos: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReleasedVideos();
    } else if (isAuthenticated === false) {
      setMessage({ type: 'error', text: 'Você precisa estar logado para ver seus vídeos.' });
      setLoading(false);
    }
  }, [isAuthenticated, fetchReleasedVideos]);


  return (
    // Removido 'height: 70vh' do Container para que a altura seja fluida.
    // Adicionado padding responsivo.
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, px: { xs: 1, sm: 2, md: 3 } }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          color: '#49c5b6',
          marginBottom: { xs: 4, md: 8 }, // Margem inferior responsiva
          fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }, // Tamanho de fonte responsivo
        }}
      >
        Meus Vídeos de Exercícios
      </Typography>

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
        <Alert severity="info">Nenhum vídeo liberado para você ainda. Aguarde a liberação do seu fisioterapeuta.</Alert>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {videos.map((video) => (
            <Grid item xs={12} sm={6} md={4} key={video.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="video"
                  src={`http://localhost:3000${video.filePath}`}
                  title={video.title}
                  controls
                  // Ajustado a altura do player de vídeo para ser responsiva
                  sx={{
                    height: { xs: 180, sm: 200, md: 220 }, // Altura ajustada para mobile/tablet/desktop
                    width: '100%', // Garante que ocupe a largura total do card
                    objectFit: 'cover', // Para que o vídeo preencha o espaço sem distorcer
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' } }} // Tamanho do título do card responsivo
                  >
                    {video.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' } }} // Tamanho da descrição do card responsivo
                  >
                    {video.description || 'Sem descrição.'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => window.open(`http://localhost:3000${video.filePath}`, '_blank')}
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' } }} // Tamanho do texto do botão responsivo
                  >
                    <PlayArrowIcon sx={{ mr: 0.5, fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' } }} /> Assistir em Tela Cheia
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default PatientVideosPage;