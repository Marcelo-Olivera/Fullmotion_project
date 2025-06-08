import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

interface ActionAreaCardProps {
  title: string;
  description: string;
  image?: string;
  className?: string; // Adicionando a propriedade className
}

export default function ActionAreaCard({ title, description, image, className }: ActionAreaCardProps) {
  return (
    <Card sx={{ maxWidth: 345 }} className={className}>
      <CardActionArea>
        {image && (
          <CardMedia
            component="img"
            height="140"
            image={image}
            alt={title}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
