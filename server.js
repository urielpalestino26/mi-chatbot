require('dotenv').config();
const openaiApiKey = process.env.OPENAI_API_KEY;

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Ruta para recibir mensajes de ManyChat
app.post('/manychat-webhook', async (req, res) => {
    try {
        const userMessage = req.body.message; // Mensaje del usuario desde ManyChat

        // Enviar el mensaje a la API de OpenAI
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo", // O el modelo que prefieras
            messages: [{ role: "user", content: userMessage }]
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const aiResponse = response.data.choices[0].message.content;

        // Responder a ManyChat con el mensaje de la IA
        res.json({ reply: aiResponse });
    } catch (error) {
        console.error("Error en la API de OpenAI:", error);
        res.status(500).json({ error: "Error procesando la respuesta" });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
