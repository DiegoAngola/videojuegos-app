import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

const Filters = ({ filters, setFilters, games, searchQuery, resetFilters }) => {
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const isDisabled = searchQuery.trim().length > 0 || games.length === 0;

  const years = Array.from({ length: 2025 - 1995 + 1 }, (_, i) => (2025 - i));
  const genres = [...new Set(games.flatMap(game => game.genres.map(g => g.name)))];
  const platforms = [...new Set(games.flatMap(game => game.platforms.map(p => p.platform.name)))];
  const tags = [...new Set(games.flatMap(game => game.tags.map(t => t.name)))];

  return (
    <Form className="my-3">
      <Row>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Año</Form.Label>
            <Form.Control as="select" name="year" onChange={handleFilterChange} disabled={isDisabled} value={filters.year}>
              <option value="">Todos</option>
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>Género</Form.Label>
            <Form.Control as="select" name="genre" onChange={handleFilterChange} disabled={isDisabled} value={filters.genre}>
              <option value="">Todos</option>
              {genres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>Plataforma</Form.Label>
            <Form.Control as="select" name="platform" onChange={handleFilterChange} disabled={isDisabled} value={filters.platform}>
              <option value="">Todas</option>
              {platforms.map(platform => <option key={platform} value={platform}>{platform}</option>)}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>Tags</Form.Label>
            <Form.Control as="select" name="tag" onChange={handleFilterChange} disabled={isDisabled} value={filters.tag}>
              <option value="">Todos</option>
              {tags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      <div className="text-center mt-3">
        <Button variant="danger" onClick={resetFilters}>Restablecer Filtros y Búsqueda</Button>
      </div>
    </Form>
  );
};

export default Filters;
