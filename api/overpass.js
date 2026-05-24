// api/overpass.js — Vercel Serverless Function
// Proxy para Overpass API para evitar CORS e adicionar identificação (User-Agent) no servidor.

export default async function handler(req, res) {
  // Captura a query do corpo (POST) ou da URL (GET)
  const query = req.body?.data || req.query?.data || req.body?.query || req.query?.query;

  if (!query) {
    return res.status(400).json({ error: "O parâmetro 'data' ou 'query' é obrigatório." });
  }

  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://z.overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
  ];

  const userAgent = 'ReciclaConsciente/1.0 (https://reciclaconsciente.vercel.app/)';

  for (const endpoint of endpoints) {
    try {
      const url = `${endpoint}?data=${encodeURIComponent(query)}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": userAgent,
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        // CORS headers para permitir o frontend chamar esta API
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        return res.status(200).json(data);
      }

      console.warn(`[Proxy] ${endpoint} falhou: ${response.status}`);
    } catch (error) {
      console.warn(`[Proxy] Erro em ${endpoint}:`, error.message);
    }
  }

  return res.status(502).json({ error: "Todos os servidores Overpass falharam." });
}
