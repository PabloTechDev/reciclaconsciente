// api/overpass.js
// Vercel Serverless Function — proxy para o Overpass API
// Resolve o bloqueio de CORS fazendo a requisição no servidor, não no browser.

export default async function handler(req, res) {
  // Só aceita POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { query } = req.body;

  if (!query || typeof query !== "string") {
    return res
      .status(400)
      .json({ error: "Campo 'query' obrigatório no body." });
  }

  // Lista de endpoints do Overpass (fallback automático)
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
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(30_000), // 30s timeout
      });

      if (!response.ok) {
        console.warn(`[proxy] ${endpoint} retornou status ${response.status}`);
        continue;
      }

      const data = await response.json();

      // Repassa o resultado com headers CORS liberados para o seu domínio
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
      return res.status(200).json(data);
    } catch (err) {
      console.warn(`[proxy] Falha em ${endpoint}:`, err.message);
      lastError = err;
    }
  }

  // Todos os endpoints falharam
  console.error("[proxy] Todos os endpoints falharam:", lastError);
  return res
    .status(502)
    .json({ error: "Todos os servidores Overpass estão indisponíveis." });
}
