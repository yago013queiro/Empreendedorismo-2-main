export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const systemPrompt = `
Você é uma assistente educacional focada no aprendizado.
Explique tudo de forma clara, objetiva e voltada para um estudante.
Use exemplos simples quando necessário.
`;

    if (!GROQ_API_KEY) {
      console.error("GROQ_API_KEY NÃO CONFIGURADA");
      return res.status(500).json({
        error: "GROQ_API_KEY não configurada no Vercel"
      });
    }

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Campo 'prompt' é obrigatório" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro da Groq:", data);
      return res.status(500).json({ error: data.error?.message || "Erro desconhecido da Groq" });
    }

    const text = data.choices?.[0]?.message?.content || "Erro ao gerar resposta.";

    return res.status(200).json({ text });

  } catch (err) {
    console.error("ERRO NO SERVIDOR:", err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}