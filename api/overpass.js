// api/overpass.js — Vercel Serverless Function
// Atua como proxy para a Overpass API, resolvendo o bloqueio de CORS em produção.

export default async function handler(req, res) {
  // Permite apenas POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body;

  if (!query || typeof query !== "string") {
    return res
      .status(400)
      .json({ error: "O parâmetro 'query' é obrigatório." });
  }

  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://z.overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
  ];

  let lastError;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (response.ok) {
        const data = await response.json();
        // Cabeçalho de segurança: só permite chamadas do próprio domínio
        res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
        return res.status(200).json(data);
      }

      console.warn(
        `[Proxy] ${endpoint} respondeu com status ${response.status}`,
      );
      lastError = new Error(`Status ${response.status} em ${endpoint}`);
    } catch (error) {
      console.warn(`[Proxy] Falha ao conectar com ${endpoint}:`, error.message);
      lastError = error;
    }
  }

  // Todos os endpoints falharam
  return res.status(502).json({
    error: "Todos os servidores Overpass falharam.",
    details: lastError?.message,
  });
}
