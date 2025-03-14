import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

const Filters = ({ filters, setFilters, games, searchQuery, resetFilters }) => {
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const isDisabled = searchQuery.trim().length > 0 || games.length === 0;

  // 🔥 Lista fija de años (1995 - 2025)
  const years = Array.from({ length: 2025 - 1995 + 1 }, (_, i) => (2025 - i));

  // 🔥 Estado para almacenar opciones filtradas dinámicamente
  const [availableGenres, setAvailableGenres] = useState([]);
  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // 🔥 Actualizar opciones dinámicas en los filtros cuando cambian los juegos o los filtros seleccionados
  useEffect(() => {
    let filteredGames = [...games];

    if (filters.year) {
      filteredGames = filteredGames.filter(
        (game) => game.released && new Date(game.released).getFullYear().toString() === filters.year
      );
    }

    if (filters.genre) {
      filteredGames = filteredGames.filter((game) =>
        game.genres && game.genres.some((g) => g.name === filters.genre)
      );
    }

    if (filters.platform) {
      filteredGames = filteredGames.filter((game) =>
        game.platforms && game.platforms.some((p) => p.platform.name === filters.platform)
      );
    }

    if (filters.tag) {
      filteredGames = filteredGames.filter((game) =>
        game.tags && game.tags.some((t) => t.name === filters.tag)
      );
    }

    // 🔥 Generar opciones dinámicas basadas en los juegos filtrados
    setAvailableGenres([...new Set(filteredGames.flatMap((game) => game.genres.map((g) => g.name)))]);
    setAvailablePlatforms([...new Set(filteredGames.flatMap((game) => game.platforms.map((p) => p.platform.name)))]);
    setAvailableTags([...new Set(filteredGames.flatMap((game) => game.tags.map((t) => t.name)))]);

  }, [filters, games]); // 🔥 Se ejecuta cuando cambian los juegos o los filtros seleccionados

  return (
    <Form className="my-3">
      <Row>
        {/* 🔥 Año (ESTÁTICO, de 1995 a 2025) */}
        <Col md={3}>
          <Form.Group>
            <Form.Label>Año</Form.Label>
            <Form.Control as="select" name="year" onChange={handleFilterChange} disabled={isDisabled} value={filters.year}>
              <option value="">Todos</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        {/* 🔥 Géneros (DINÁMICO) */}
        <Col md={3}>
          <Form.Group>
            <Form.Label>Género</Form.Label>
            <Form.Control as="select" name="genre" onChange={handleFilterChange} disabled={isDisabled} value={filters.genre}>
              <option value="">Todos</option>
              {availableGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        {/* 🔥 Plataformas (DINÁMICO) */}
        <Col md={3}>
          <Form.Group>
            <Form.Label>Plataforma</Form.Label>
            <Form.Control as="select" name="platform" onChange={handleFilterChange} disabled={isDisabled} value={filters.platform}>
              <option value="">Todas</option>
              {availablePlatforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        {/* 🔥 Tags (DINÁMICO) */}
        <Col md={3}>
          <Form.Group>
            <Form.Label>Tags</Form.Label>
            <Form.Control as="select" name="tag" onChange={handleFilterChange} disabled={isDisabled} value={filters.tag}>
              <option value="">Todos</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      {/* 🔥 Botón para restablecer los filtros */}
      <div className="text-center mt-3">
        <Button variant="danger" onClick={resetFilters}>Restablecer Filtros y Búsqueda</Button>
      </div>
    </Form>
  );
};

export default Filters;
