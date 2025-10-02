import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

// Aux: parse NDJSON -> array
function parseNdjsonToArray(text) {
  if (!text) return [];
  const lines = text.split("\n").map(l => l.trim()).filter(l => l !== "");
  const data = [];
  for (const line of lines) {
    try {
      data.push(JSON.parse(line));
    } catch (e) {
      console.error("❌ Error parseando línea (se ignora):", line.slice(0,200));
    }
  }
  return data;
}

app.get("/", (req, res) => {
  res.send("Backend Torre proxy — usa /search?name=Ana");
});

app.get("/search", async (req, res) => {
  const name = req.query.name || "Ana";
  const url = "https://torre.ai/api/entities/_searchStream";
  const headers = {
    "accept": "application/json",
    "Content-Type": "application/json"
  };
  const body = {
    query: name,
    identityType: "person",
    limit: 10
  };

  console.log(`🔎 Buscando: "${name}" -> llamando ${url}`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      
    });

    // debug: show status
    console.log("Status de Torre API:", response.status);

    // 1) leer texto crudo (NDJSON)
    const text = await response.text();
    console.log("Respuesta cruda (primeros 400 chars):", text.slice(0,400));

    // 2) parsear NDJSON
    const items = parseNdjsonToArray(text);

    // 3) limpiar campos para el frontend y devolver
    const clean = items.map(d => ({
      name: d.name ?? null,
      username: d.username ?? null,
      professionalHeadline: d.professionalHeadline ?? null,
      imageUrl: d.imageUrl ?? null,
      ardaId: d.ardaId ?? null
    }));

    return res.json({ count: clean.length, results: clean });

  } catch (err) {
    console.error("ERROR EN /search:", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
