import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import GameList from "./GameList";
import Filters from "./Filters";
import SearchBar from "./SearchBar";
import GameDetail from "./GameDetail";

const App = () => {
  const [games, setGames] = useState([]); // Lista total de juegos cargados
  const [filteredGames, setFilteredGames] = useState([]); // Juegos filtrados o buscados
  const [searchQuery, setSearchQuery] = useState(""); // Estado de la barra de búsqueda
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    platform: "",
    tag: "",
  });
  const [page, setPage] = useState(1); // Estado para la paginación
  const [loading, setLoading] = useState(false); // Estado de carga
  const [hasMore, setHasMore] = useState(true); // Saber si hay más juegos para cargar
  const [noResults, setNoResults] = useState(false); // Saber si hay resultados

  // 🔥 1. Función para obtener los juegos desde la API
  const fetchGames = useCallback(async () => {
    if (loading) return; // ⛔ Evita ejecutar si ya está cargando

    console.log("🔄 Iniciando carga de juegos... Página:", page);
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${process.env.REACT_APP_RAWG_API_KEY}&page=${page}&page_size=20&ordering=-metacritic`
      );
      const data = await response.json();

      console.log("📥 Datos recibidos:", data);

      if (!data.results || data.results.length === 0) {
        console.log("⚠️ No hay más juegos disponibles.");
        setHasMore(false);
      } else {
        setGames((prevGames) => {
          const uniqueGames = [...prevGames, ...data.results].reduce((acc, game) => {
            acc.set(game.id, game);
            return acc;
          }, new Map());

          const newGamesArray = Array.from(uniqueGames.values());

          console.log("✅ Juegos actualizados:", newGamesArray.length);

          if (data.next === null) {
            console.log("⛔ API ha indicado que no hay más páginas.");
            setHasMore(false);
          }

          return newGamesArray;
        });
      }
    } catch (error) {
      console.error("❌ Error al obtener los juegos:", error);
      setHasMore(false);
    } finally {
      console.log("✅ Finalizando carga de juegos.");
      setLoading(false);
    }
  }, [page]); // 🔥 Solo ejecuta cuando cambia `page`

  useEffect(() => {
    fetchGames();
  }, [page]); // 🔥 Solo ejecuta cuando cambia `page`

  // 🔥 2. Función para aplicar filtros a todos los juegos cargados
  const applyFilters = useCallback(() => {
    if (!games || games.length === 0) {
      setFilteredGames([]); 
      setNoResults(true);
      return;
    }
  
    let filtered = games;
  
    if (filters.genre) {
      filtered = filtered.filter((game) =>
        game.genres?.some((g) => g.name === filters.genre)
      );
    }
  
    if (filters.year) {
      filtered = filtered.filter(
        (game) => game.released && new Date(game.released).getFullYear().toString() === filters.year
      );
    }
  
    if (filters.platform) {
      filtered = filtered.filter((game) =>
        game.platforms?.some((p) => p.platform.name === filters.platform)
      );
    }
  
    if (filters.tag && filters.tag !== "Todos") {
      filtered = filtered.filter((game) =>
        game.tags?.some((t) => t.name === filters.tag)
      );
    }
  
    setFilteredGames(filtered);
    setNoResults(filtered.length === 0);
  
    // 🔥 Si no hay juegos con los filtros aplicados y hay más juegos para cargar, intentar cargar más
    if (filtered.length === 0 && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [filters, hasMore, games]);
  

  // 🔥 3. Aplicar filtros cuando cambian los juegos o los filtros
  useEffect(() => {
    if (searchQuery.trim().length > 0) return;
    applyFilters();
  }, [games, filters, applyFilters, searchQuery]);

  // 🔥 4. Función para buscar juegos en la API en tiempo real
  const handleSearch = async (query) => {
    setSearchQuery(query);
    setNoResults(false);
    
    if (query.length === 0) {
      applyFilters();
      return;
    }
    
    // 🔥 Cuando se escribe en la barra de búsqueda, restablecer los filtros
    setFilters({ genre: "", year: "", platform: "", tag: "" });
  
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${process.env.REACT_APP_RAWG_API_KEY}&search=${query}&page_size=20`
      );
      const data = await response.json();
  
      setFilteredGames(data.results || []);
      setNoResults(data.results.length === 0);
    } catch (error) {
      console.error("❌ Error al buscar juegos:", error);
    }
  };
  

  // 🔥 5. Función para restablecer filtros y búsqueda
  const resetFilters = () => {
    setFilters({ genre: "", year: "", platform: "", tag: "" });
    setSearchQuery("");
    setFilteredGames(games);
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
              <Filters filters={filters} setFilters={setFilters} games={games} searchQuery={searchQuery || ""} resetFilters={resetFilters} />

              {noResults && (
                <p className="text-center text-muted">No se encontraron juegos con los filtros seleccionados.</p>
              )}

              <GameList games={filteredGames} />

              <div className="text-center mt-3">
                {hasMore ? (
                  <Button onClick={() => setPage(page + 1)} disabled={loading}>
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
