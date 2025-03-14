import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, Spinner, Row, Col } from "react-bootstrap";

const placeholderImage = "https://img.freepik.com/vector-premium/no-hay-foto-disponible-icono-vector-simbolo-imagen-predeterminado-imagen-proximamente-sitio-web-o-aplicacion-movil_87543-10615.jpg";

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [trailer, setTrailer] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameDetail = async () => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games/${id}?key=${process.env.REACT_APP_RAWG_API_KEY}`
        );
        const data = await response.json();
        setGame(data);

        const screenshotsResponse = await fetch(
          `https://api.rawg.io/api/games/${id}/screenshots?key=${process.env.REACT_APP_RAWG_API_KEY}`
        );
        const screenshotsData = await screenshotsResponse.json();
        setScreenshots(screenshotsData.results);

        const trailerResponse = await fetch(
          `https://api.rawg.io/api/games/${id}/movies?key=${process.env.REACT_APP_RAWG_API_KEY}`
        );
        const trailerData = await trailerResponse.json();
        if (trailerData.results.length > 0) {
          setTrailer(trailerData.results[0].data.max);
        }
      } catch (error) {
        console.error("❌ Error al obtener detalles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGameDetail();
  }, [id]);

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (!game) return <p className="text-center">No se encontraron detalles del juego.</p>;

  return (
    <Container className="mt-4 d-flex justify-content-center">
      <Card style={{ width: "50rem" }} className="shadow-lg p-3">
        <Button 
          variant="secondary" 
          onClick={() => navigate("/")} 
          className="position-absolute m-3"
          style={{ zIndex: 10 }}
        >
          ⬅ Volver a Inicio
        </Button>

        <Card.Img 
          variant="top" 
          src={game.background_image || placeholderImage} 
          alt={game.name} 
          style={{ maxHeight: "300px", objectFit: "cover" }} 
        />

        <Card.Body>
          <Card.Title className="text-center">{game.name}</Card.Title>

          <Card.Text>
            <strong>Descripción:</strong> {game.description_raw || "No hay descripción disponible."}
          </Card.Text>

          <Row>
            <Col md={6}>
              <Card.Text><strong>Fecha de Lanzamiento:</strong> {game.released || "Desconocido"}</Card.Text>
              <Card.Text><strong>Metacritic:</strong> {game.metacritic || "N/A"}</Card.Text>
              <Card.Text><strong>Plataformas:</strong> {game.platforms.map(p => p.platform.name).join(", ")}</Card.Text>
            </Col>
            <Col md={6}>
              <Card.Text><strong>Desarrolladores:</strong> {game.developers.map(d => d.name).join(", ") || "N/A"}</Card.Text>
              <Card.Text><strong>Editor:</strong> {game.publishers.map(p => p.name).join(", ") || "N/A"}</Card.Text>
              <Card.Text><strong>Tiempo de Juego:</strong> {game.playtime ? `${game.playtime} horas` : "Desconocido"}</Card.Text>
            </Col>
          </Row>

          {trailer && (
            <div className="mt-4">
              <h5>🎬 Tráiler</h5>
              <video controls width="100%">
                <source src={trailer} type="video/mp4" />
                Tu navegador no soporta videos.
              </video>
            </div>
          )}

          {screenshots.length > 0 && (
            <div className="mt-4">
              <h5>📸 Capturas de Pantalla</h5>
              <Row>
                {screenshots.slice(0, 3).map((screenshot) => (
                  <Col key={screenshot.id} md={4} className="mb-3">
                    <img src={screenshot.image} alt="Screenshot" className="img-fluid rounded" />
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GameDetail;
