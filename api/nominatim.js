// api/nominatim.js — Vercel Serverless Function
// Proxy para Nominatim para adicionar identificação (User-Agent) no servidor.

export default async function handler(req, res) {
  const { q, format, limit } = req.query;

  if (!q) {
    return res.status(400).json({ error: "O parâmetro 'q' é obrigatório." });
  }

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=${format || 'json'}&limit=${limit || 1}`;
  const userAgent = 'ReciclaConsciente/1.0 (https://reciclaconsciente.vercel.app/)';

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": userAgent,
        "Accept-Language": "pt-BR,pt;q=0.9"
      }
    });

    if (response.ok) {
      const data = await response.json();
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(200).json(data);
    }

    return res.status(response.status).json({ error: "Erro na API Nominatim" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
