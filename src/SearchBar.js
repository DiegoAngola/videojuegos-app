import React from "react";
import { Form } from "react-bootstrap";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <Form className="mb-3">
      <Form.Control
        type="text"
        placeholder="Buscar videojuegos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // 🔥 Ahora busca en la API
      />
    </Form>
  );
};

export default SearchBar;
