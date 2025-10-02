import React, { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/search?name=${query}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🔎 Torre Search</h1>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Escribe un nombre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "0.5rem", width: "250px" }}
        />
        <button onClick={handleSearch} style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}>
          Buscar
        </button>
      </div>

      {loading && <p>⏳ Buscando...</p>}
      
     
      <div>
        {results.length > 0 &&
          results.map((user, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.name}
                  style={{ borderRadius: "50%", width: "60px", height: "60px", marginRight: "1rem" }}
                />
              ) : (
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "#eee",
                    marginRight: "1rem",
                  }}
                />
              )}
              <div>
                <h3 style={{ margin: 0 }}>{user.name}</h3>
                <p style={{ margin: 0, color: "gray" }}>{user.professionalHeadline}</p>
                <a
                  href={`https://torre.ai/${user.username}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: "0.9rem", color: "#007bff" }}
                >
                  Ver perfil
                </a>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
