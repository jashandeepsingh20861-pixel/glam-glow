import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client on the server
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Salon Catalog Context for AI Concierge
const SALON_CONTEXT = `
Glow & Glam Salon is a luxury salon and bridal studio based in Gurdaspur, Punjab, India.
Services available:
1. Haircut & Styling: Signature Luxury Blowout (₹1,499, 45m), Master Precision Haircut & Styling (₹1,850, 60m), Keratin Smooth Protein Infusion (₹6,500, 150m)
2. Hair Spa & Color: Royal Botanical Scalp & Hair Spa (₹2,800, 75m), French Balayage & Glossing (₹7,200, 180m), Ammonia-Free Root Touch-up (₹2,200, 60m)
3. Facial & Skincare: 24K Gold Radiance Facial (₹4,500, 75m), Hydra-Infusion Deep Cleansing (₹3,800, 60m), Brightening Vitamin C Peel & Glow (₹3,200, 60m)
4. Makeup: Signature Party Glam Makeup (₹4,500, 90m), HD Editorial & Cocktail Makeover (₹6,500, 90m)
5. Bridal Packages: Royal Maharani Bridal Extravaganza (₹24,999, 240m), Sangeet & Cocktail Twilight Package (₹14,500, 180m), Pre-Bridal Glow Ritual (₹11,999, 210m)
6. Nails & Hands: Champagne & Rose Luxury Pedicure (₹1,850, 60m), Gel Art & Sculpting Manicure (₹2,200, 75m)
7. Body & Spa: Aromatherapy Stress-Relief Full Body Massage (₹3,500, 75m), Ayurvedic Herbal Body Polish (₹3,200, 60m)

Rules for your responses:
- Always be warm, respectful, and articulate.
- Always provide pricing in INR (₹).
- Explicitly emphasize prep and aftercare recommendations for hair, skin, and makeup.
- Medical disclaimer: never diagnose medical conditions or promise clinical cures for acne/dermatitis/alopecia; recommend consulting certified dermatologists when appropriate.
- Suggest 1-2 exact matching services with estimated cost and time.
- If asked in Hindi or Punjabi, respond politely in that language or bilingual Hindi/Punjabi script.
`;

// AI Beauty Assistant Endpoint
app.post('/api/assistant', async (req, res) => {
  const { message, language = 'en' } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // If Gemini API is configured and available
  if (ai) {
    try {
      const langInstruction = language === 'hi' 
        ? 'Please reply in polite conversational Hindi (Devanagari script).' 
        : language === 'pb' 
        ? 'Please reply in warm conversational Punjabi (Gurmukhi script).' 
        : 'Please reply in English.';

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${SALON_CONTEXT}\n\nClient Language Preference: ${langInstruction}\n\nClient Query: "${message}"`,
        config: {
          systemInstruction: 'You are an elite beauty, haircare, and bridal consultant at Glow & Glam Salon in India. Suggest salon services accurately with prices in INR, give prep/aftercare tips, and keep recommendations concise and chic.',
          temperature: 0.7,
        },
      });

      const reply = response.text || 'Thank you for reaching out to Glow & Glam Salon. How may I assist with your beauty appointment today?';
      return res.json({ reply, isAiLive: true });
    } catch (error: any) {
      console.warn('Gemini API call failed, falling back to smart concierge response:', error?.message);
    }
  }

  // Fallback smart concierge if API key is not configured or fails
  let fallbackReply = '';
  const lower = message.toLowerCase();

  if (language === 'hi') {
    if (lower.includes('bridal') || lower.includes('shaadi') || lower.includes('दोधन') || lower.includes('शादी')) {
      fallbackReply = 'ग्लो एंड ग्लैम ब्राइडल स्टूडियो में आपका स्वागत है! हमारा "रॉयल महारानी ब्राइडल पैकेज" (₹24,999) और "प्री-ब्राइडल ग्लो" (₹11,999) शादियों के लिए सबसे लोकप्रिय हैं। इसमें एचडी मेकअप, हेयर स्टाइलिंग और प्री-ब्राइडल स्किन केयर शामिल हैं। क्या आप ब्राइडल कंसल्टेशन बुक करना चाहते हैं?';
    } else if (lower.includes('hair') || lower.includes('बाल') || lower.includes('कटा')) {
      fallbackReply = 'हेयर केयर के लिए हमारा "रॉयल बॉटनिकल स्कैल्प स्पा" (₹2,800) और "सिग्नेचर हेयरकट" (₹1,850) सबसे बेहतरीन विकल्प हैं। यह बालों को गहराई से पोषण और चमक देते हैं।';
    } else {
      fallbackReply = 'ग्लो एंड ग्लैम सैलून में आपका स्वागत है! हम हेयर, स्किनकेयर, ब्राइडल और स्पा सेवाओं में विशेषज्ञ हैं। आप किस सेवा के बारे में जानना चाहते हैं?';
    }
  } else if (language === 'pb') {
    if (lower.includes('bridal') || lower.includes('ਵਿਆਹ') || lower.includes('wedding')) {
      fallbackReply = 'ਗਲੋ ਐਂਡ ਗਲੈਮ ਬਿਊਟੀ ਸਟੂਡੀਓ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ! ਸਾਡਾ "ਰੌਇਲ ਮਹਾਰਾਣੀ ਬ੍ਰਾਈਡਲ ਪੈਕੇਜ" (₹24,999) ਵਿਆਹਾਂ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਹੈ। ਇਸ ਵਿੱਚ ਐਚਡੀ ਮੇਕਅੱਪ, ਹੇਅਰ ਸਟਾਈਲ ਅਤੇ ਸਕਿਨਕੇਅਰ ਸ਼ਾਮਲ ਹਨ।';
    } else {
      fallbackReply = 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ! ਗਲੋ ਐਂਡ ਗਲੈਮ ਸੈਲੂਨ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਤੁਸੀਂ ਹੇਅਰ, ਸਕਿਨਕੇਅਰ, ਜਾਂ ਬ੍ਰਾਈਡਲ ਮੇਕਅੱਪ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।';
    }
  } else {
    if (lower.includes('bridal') || lower.includes('wedding') || lower.includes('bride')) {
      fallbackReply = 'Congratulations on your special day! For brides, we highly recommend our "Royal Maharani Bridal Extravaganza" (₹24,999 / 240 mins) which includes full HD airbrush makeup, couture dupatta draping, floral hairstyling, and pre-bridal skin radiance. For pre-wedding events, our "Sangeet & Cocktail Twilight Package" (₹14,500) is a client favorite.\n\n💡 Pro tip: We recommend booking your bridal consultation at least 4-6 weeks prior to the wedding date.';
    } else if (lower.includes('hair') || lower.includes('color') || lower.includes('keratin') || lower.includes('spa') || lower.includes('frizz')) {
      fallbackReply = 'For hair restoration and styling, we recommend our "Royal Botanical Scalp & Hair Spa" (₹2,800 / 75m) for deep nourishment, or our "Keratin Smooth Protein Infusion" (₹6,500 / 150m) for long-lasting frizz control and glossy shine. Our Master Colorists also offer bespoke "French Balayage & Glossing" (₹7,200).\n\n💡 Aftercare tip: Always use sulfate-free shampoo and avoid hot water washes for 48 hours after coloring.';
    } else if (lower.includes('skin') || lower.includes('facial') || lower.includes('glow') || lower.includes('acne')) {
      fallbackReply = 'For luminous, refreshed skin, our "24K Gold Radiance Facial" (₹4,500 / 75m) and "Hydra-Infusion Deep Cleansing" (₹3,800 / 60m) deliver immediate radiance with gentle lymphatic stimulation.\n\n*Disclaimer: For persistent clinical acne or eczema, we advise consulting a licensed dermatologist before active peel treatments.*';
    } else {
      fallbackReply = 'Welcome to Glow & Glam Salon! I can help you discover customized treatments for hair, skincare, bridal makeovers, and wellness spa rituals within your desired budget. Which service or upcoming occasion can I assist you with today?';
    }
  }

  return res.json({
    reply: fallbackReply,
    isAiLive: false,
    note: apiKey && apiKey !== 'MY_GEMINI_API_KEY' ? 'Running in fallback mode.' : 'Demo mode (API key not provided).'
  });
});

// App configuration and status endpoint
app.get('/api/salon-info', (_req, res) => {
  res.json({
    name: 'Glow & Glam Salon',
    city: 'Gurdaspur, Punjab',
    currency: 'INR',
    symbol: '₹',
    gstRate: 0.18,
    cancellationBufferHours: 4,
    openingHour: 9,
    closingHour: 20,
    slotIntervalMinutes: 30,
    phone: '+91 98765 43210',
    email: 'concierge@glowglamsalon.in',
    upiId: 'glowglam@okhdfcbank',
  });
});

// Full-stack Vite middleware configuration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Glow & Glam Salon server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
