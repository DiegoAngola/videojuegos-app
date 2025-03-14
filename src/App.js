import React, { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import GameList from "./GameList";
import Filters from "./Filters";
import SearchBar from "./SearchBar";
import GameDetail from "./GameDetail";

const App = () => {
  const [games, setGames] = useState([]); // Lista total de juegos cargados
  const [filteredGames, setFilteredGames] = useState([]); // Juegos filtrados/buscados
  const [searchQuery, setSearchQuery] = useState(""); // Estado de búsqueda
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    platform: "",
    tag: "",
  });
  const [page, setPage] = useState(1); // Estado de paginación
  const [loading, setLoading] = useState(false); // Estado de carga
  const [hasMore, setHasMore] = useState(true); // Controla si hay más juegos para cargar
  const [noResults, setNoResults] = useState(false); // Controla si hay resultados
  const isFetching = useRef(false); // 🔥 Controla si ya se está buscando para evitar duplicados

  // 🔥 Estado para modo claro/oscuro
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.className = darkMode ? "dark-theme" : "light-theme";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // 🔥 1. Cargar juegos desde la API solo cuando cambia `page`
  useEffect(() => {
    const fetchGames = async () => {
      if (!hasMore || isFetching.current) return;
      isFetching.current = true;
      setLoading(true);

      try {
        console.log(`🔄 Cargando página ${page}...`);
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
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    };

    fetchGames();
  }, [page, hasMore]); // 🔥 Agregamos `hasMore` sin generar loops

  // 🔥 2. Aplicar filtros sin loops infinitos
  useEffect(() => {
    let filtered = [...games];

    if (filters.genre) {
      filtered = filtered.filter((game) =>
        game.genres && game.genres.some((g) => g.name === filters.genre)
      );
    }

    if (filters.year) {
      filtered = filtered.filter(
        (game) => game.released && new Date(game.released).getFullYear().toString() === filters.year
      );
    }

    if (filters.platform) {
      filtered = filtered.filter((game) =>
        game.platforms && game.platforms.some((p) => p.platform.name === filters.platform)
      );
    }

    if (filters.tag) {
      filtered = filtered.filter((game) =>
        game.tags && game.tags.some((t) => t.name === filters.tag)
      );
    }

    setFilteredGames(filtered);
    setNoResults(filtered.length === 0);
  }, [filters, games]); // 🔥 Evita dependencias innecesarias

  // 🔥 3. Buscar juegos en la API sin afectar los filtros
  const handleSearch = async (query) => {
    setSearchQuery(query);
    setNoResults(false);

    if (query.length === 0) {
      return;
    }

    try {
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${process.env.REACT_APP_RAWG_API_KEY}&search=${query}&page_size=20`
      );
      const data = await response.json();

      setFilteredGames(data.results || []);
      setNoResults((data.results || []).length === 0);
    } catch (error) {
      console.error("❌ Error al buscar juegos:", error);
    }
  };

  // 🔥 4. Restablecer filtros y búsqueda
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
      {/* 🔥 Botón para cambiar tema */}
      <div className="text-end my-3">
        <Button variant={darkMode ? "light" : "dark"} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Modo Claro ☀️" : "Modo Oscuro 🌙"}
        </Button>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1 className="text-center my-4">Lista de Videojuegos</h1>
              <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearch} />
              <Filters filters={filters} setFilters={setFilters} games={games} searchQuery={searchQuery || ""} resetFilters={resetFilters} />

              {noResults && (
                <p className="text-center text-muted">No se encontraron juegos con los filtros seleccionados.</p>
              )}

              <GameList games={filteredGames} />

              <div className="text-center mt-3">
                {hasMore ? (
                  <Button onClick={() => setPage((prevPage) => (hasMore ? prevPage + 1 : prevPage))} disabled={loading}>
                    {loading ? "Cargando..." : "Cargar más juegos"}
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
