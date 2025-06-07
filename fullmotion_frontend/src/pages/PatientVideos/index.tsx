// src/pages/PatientVideos/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, height: '70vh' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#49c5b6', marginBottom: 8 }}>
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

          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            {videos.map((video) => (
              <Grid item xs={12} sm={6} md={4} key={video.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="video"
                    src={`http://localhost:3000${video.filePath}`}
                    title={video.title}
                    controls
                    sx={{ height: 200 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {video.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {video.description || 'Sem descrição.'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" onClick={() => window.open(`http://localhost:3000${video.filePath}`, '_blank')}>
                      <PlayArrowIcon sx={{ mr: 0.5 }} /> Assistir em Tela Cheia
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        // </Paper> // <-- E a tag de fechamento aqui
      )}
    </Container>
  );
};

export default PatientVideosPage;