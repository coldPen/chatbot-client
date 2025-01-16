interface KeywordResponse {
  keywords: string[];
  responses: string[];
}

interface ChatbotConfig {
  defaultResponses: string[];
  keywordResponses: KeywordResponse[];
  greetings: string[];
  farewells: string[];
}

// Configuration du chatbot
const botConfig: ChatbotConfig = {
  defaultResponses: [
    "Je comprends. Pouvez-vous m'en dire plus ?",
    "C'est intéressant. Comment puis-je vous aider davantage ?",
    "Je vois. Que souhaitez-vous explorer ensuite ?",
    "Merci de partager cela. Que puis-je faire pour vous ?",
  ],

  keywordResponses: [
    {
      keywords: ["projet", "développement", "application"],
      responses: [
        "Je serais ravi d'en savoir plus sur votre projet.",
        "Parlons de vos besoins en développement.",
        "Quelles sont vos attentes pour ce projet ?",
      ],
    },
    {
      keywords: ["prix", "coût", "tarif", "budget"],
      responses: [
        "Les tarifs varient selon les spécificités du projet. Pouvez-vous me donner plus de détails ?",
        "Je peux vous aider à comprendre nos différentes options tarifaires.",
        "Parlons de votre budget et de vos besoins.",
      ],
    },
    {
      keywords: ["merci", "thanks"],
      responses: [
        "Je vous en prie ! N'hésitez pas si vous avez d'autres questions.",
        "Tout le plaisir est pour moi !",
        "C'est un plaisir de vous aider.",
      ],
    },
  ],

  greetings: [
    "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
    "Bonjour ! Je suis ravi de vous rencontrer.",
    "Bonjour ! Que puis-je faire pour vous ?",
  ],

  farewells: [
    "Au revoir ! Passez une excellente journée !",
    "À bientôt ! N'hésitez pas à revenir si vous avez d'autres questions.",
    "Au revoir et merci de votre visite !",
  ],
};

export const generateBotResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase().trim();

  // Vérifier les salutations
  if (/^(bonjour|salut|hey|hello|hi|coucou)/.test(message)) {
    return getRandomResponse(botConfig.greetings);
  }

  // Vérifier les au revoir
  if (/^(au revoir|bye|adieu|à bientôt)/.test(message)) {
    return getRandomResponse(botConfig.farewells);
  }

  // Chercher une réponse basée sur les mots-clés
  for (const kr of botConfig.keywordResponses) {
    if (kr.keywords.some((keyword) => message.includes(keyword))) {
      return getRandomResponse(kr.responses);
    }
  }

  // Si aucun mot-clé n'est trouvé, utiliser une réponse par défaut
  return getRandomResponse(botConfig.defaultResponses);
};

// Fonction utilitaire pour obtenir une réponse aléatoire
const getRandomResponse = (responses: string[]): string => {
  const index = Math.floor(Math.random() * responses.length);
  return responses[index];
};
