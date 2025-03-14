import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import GameList from "./GameList";
import Filters from "./Filters";
import SearchBar from "./SearchBar";
import GameDetail from "./GameDetail";

const App = () => {
  const [games, setGames] = useState([]); 
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ genre: "", year: "", platform: "", tag: "" });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [noResults, setNoResults] = useState(false);

  // ✅ 1️⃣ Función para obtener los juegos sin usar `loading`
  const fetchGames = useCallback(async () => {
    if (!hasMore) return; // ⛔ Evita que siga cargando si ya no hay más juegos

    console.log(`🔄 Cargando juegos... Página: ${page}`);
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${process.env.REACT_APP_RAWG_API_KEY}&page=${page}&page_size=20&ordering=-metacritic`
      );
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        setHasMore(false);
      } else {
        setGames((prevGames) => {
          const uniqueGames = [...prevGames, ...data.results].reduce((acc, game) => {
            acc.set(game.id, game);
            return acc;
          }, new Map());
          return Array.from(uniqueGames.values());
        });
      }
    } catch (error) {
      console.error("❌ Error al obtener los juegos:", error);
      setHasMore(false);
    }
  }, [page, hasMore]);

  // ✅ 2️⃣ `useEffect` solo ejecuta `fetchGames` cuando cambia la página
  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // ✅ 3️⃣ Aplicar filtros correctamente
  useEffect(() => {
    if (searchQuery.trim().length > 0) return;

    let filtered = games;
    if (filters.genre) {
      filtered = filtered.filter((game) =>
        game.genres.some((g) => g.name === filters.genre)
      );
    }
    if (filters.year) {
      filtered = filtered.filter(
        (game) => new Date(game.released).getFullYear().toString() === filters.year
      );
    }
    if (filters.platform) {
      filtered = filtered.filter((game) =>
        game.platforms.some((p) => p.platform.name === filters.platform)
      );
    }
    if (filters.tag) {
      filtered = filtered.filter((game) =>
        game.tags && game.tags.some((t) => t.name === filters.tag)
      );
    }

    setFilteredGames(filtered);
    setNoResults(filtered.length === 0);
  }, [games, filters, searchQuery]);

  // ✅ 4️⃣ Manejo de búsqueda sin afectar los filtros
  const handleSearch = async (query) => {
    setSearchQuery(query);
    setNoResults(false);

    if (query.length === 0) {
      setFilteredGames(games);
      return;
    }

    try {
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${process.env.REACT_APP_RAWG_API_KEY}&search=${query}&page_size=20`
      );
      const data = await response.json();

      setFilteredGames(data.results);
      setNoResults(data.results.length === 0);
    } catch (error) {
      console.error("❌ Error al buscar juegos:", error);
    }
  };

  // ✅ 5️⃣ Restablecer filtros y búsqueda
  const resetFilters = () => {
    setFilters({ genre: "", year: "", platform: "", tag: "" });
    setSearchQuery("");
    setFilteredGames(games);
    setPage(1);
    setHasMore(true);
    setNoResults(false);
  };

  return (
    <Container>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1 className="text-center my-4">Lista de Videojuegos</h1>
              <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearch} />
              <Filters filters={filters} setFilters={setFilters} games={games} searchQuery={searchQuery} resetFilters={resetFilters} />
              
              {noResults && <p className="text-center text-muted">No se encontraron juegos con los filtros seleccionados.</p>}

              <GameList games={filteredGames} />

              <div className="text-center mt-3">
                {hasMore ? (
                  <Button onClick={() => setPage((prevPage) => prevPage + 1)}>
                    Cargar más juegos
                  </Button>
                ) : (
                  <p className="text-muted">No hay más juegos disponibles.</p>
                )}
              </div>
            </>
          }
        />
        <Route path="/game/:id" element={<GameDetail />} />
      </Routes>
    </Container>
  );
};

export default App;
