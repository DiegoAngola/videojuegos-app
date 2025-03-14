import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";

const GameList = ({ games }) => {
  return (
    <Row className="mt-4">
      {games.length === 0 ? (
        <Col>
          <p className="text-center">No hay juegos disponibles con los filtros aplicados.</p>
        </Col>
      ) : (
        games.map((game) => (
          <Col key={game.id} xs={12} md={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm"> {/* 🔥 Hace que todas las cards tengan la misma altura */}
              <Card.Img
                variant="top"
                src={game.background_image || "https://img.freepik.com/vector-premium/no-hay-foto-disponible-icono-vector-simbolo-imagen-predeterminado-imagen-proximamente-sitio-web-o-aplicacion-movil_87543-10615.jpg"}
                alt={game.name}
                style={{ height: "180px", objectFit: "cover" }} // 🔥 Mantiene imágenes uniformes
              />
              <Card.Body style={{ minHeight: "200px", display: "flex", flexDirection: "column" }}>
                <Card.Title className="text-truncate">{game.name}</Card.Title>
                <Card.Text style={{ flexGrow: 1 }}>
                  <strong>Metacritic:</strong> {game.metacritic || "N/A"} <br />
                  <strong>Géneros:</strong> {game.genres.map((g) => g.name).join(", ")}
                </Card.Text>
                <Button variant="primary" href={`/game/${game.id}`} className="mt-auto">
                  Ver Detalles
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))
      )}
    </Row>
  );
};

export default GameList;
