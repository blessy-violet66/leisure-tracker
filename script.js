
const chatArea = document.getElementById("chatArea");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const welcome = document.getElementById("welcome");

const activities = [
  {
    name: "Read a few pages",
    category: "indoor",
    minutes: 15,
    description: "Enjoy a novel, short story, or an interesting article."
  },
  {
    name: "Listen to music",
    category: "relax",
    minutes: 15,
    description: "Create a playlist of your favourite songs."
  },
  {
    name: "Try a quick sketch",
    category: "creative",
    minutes: 15,
    description: "Draw an object around you or try simple doodles."
  },
  {
    name: "Take a mindful break",
    category: "relax",
    minutes: 15,
    description: "Sit comfortably, breathe slowly, and unwind."
  },
  {
    name: "Watch a short video",
    category: "indoor",
    minutes: 15,
    description: "Explore an interesting educational or comedy video."
  },
  {
    name: "Learn a new recipe",
    category: "creative",
    minutes: 30,
    description: "Explore a simple recipe and plan how to make it."
  },
  {
    name: "Start journaling",
    category: "creative",
    minutes: 30,
    description: "Write about your day, goals, or things you enjoy."
  },
  {
    name: "Try a new dance",
    category: "active",
    minutes: 30,
    description: "Play a favourite song and learn a few dance steps."
  },
  {
    name: "Go for a walk",
    category: "outdoor",
    minutes: 30,
    description: "Explore a safe nearby area and enjoy some fresh air."
  },
  {
    name: "Learn a language",
    category: "learning",
    minutes: 30,
    description: "Practise new words and everyday phrases."
  },
  {
    name: "Try photography",
    category: "outdoor",
    minutes: 30,
    description: "Capture interesting colours, objects, or nature."
  },
  {
    name: "Explore a DIY project",
    category: "creative",
    minutes: 60,
    description: "Make a handmade card, paper craft, or room decoration."
  },
  {
    name: "Play a puzzle game",
    category: "indoor",
    minutes: 30,
    description: "Try sudoku, a word puzzle, or a brain teaser."
  },
  {
    name: "Explore a new hobby",
    category: "learning",
    minutes: 60,
    description: "Try gardening, calligraphy, coding, or a musical instrument."
  },
  {
    name: "Plan a mini adventure",
    category: "outdoor",
    minutes: 60,
    description: "Discover a safe nearby park or a place you haven't visited."
  },
  {
    name: "Have a movie night",
    category: "entertainment",
    minutes: 120,
    description: "Choose a comedy or feel-good film and get comfortable."
  },
  {
    name: "Spend time with friends",
    category: "social",
    minutes: 60,
    description: "Call a friend, play a game together, or catch up."
  },
  {
    name: "Try a home workout",
    category: "active",
    minutes: 30,
    description: "Follow a beginner-friendly movement routine at your pace."
  }
];

const categoryKeywords = {
  indoor: ["indoor", "inside", "home", "room"],
  outdoor: ["outdoor", "outside", "nature", "fresh air", "park"],
  relax: ["relax", "stress", "tired", "calm", "peace", "rest"],
  creative: ["creative", "art", "draw", "paint", "craft", "create"],
  learning: ["learn", "skill", "study", "educational", "language"],
  active: ["active", "dance", "exercise", "workout", "movement"],
  entertainment: ["movie", "film", "watch", "series"],
  social: ["friend", "friends", "social", "people", "together"]
};

function addMessage(text, sender) {
  const intro = chatArea.querySelector(".welcome");
if (intro) {
  intro.remove();
}

  const message = document.createElement("div");
  message.className = `message ${sender}`;

  if (sender === "bot") {
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = "✦";
    message.appendChild(avatar);
  }

  const content = document.createElement("div");
  content.className = "message-content";

  const name = document.createElement("div");
  name.className = "message-name";
  name.textContent = sender === "user" ? "You" : "Leisure Assistant";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  content.append(name, bubble);
  message.appendChild(content);
  chatArea.appendChild(message);

  chatArea.scrollTop = chatArea.scrollHeight;

  return { content, bubble };
}

function getTimeLimit(message) {
  const text = message.toLowerCase();

  if (text.includes("weekend") || text.includes("whole day")) {
    return 120;
  }

  if (text.includes("15 minute") || text.includes("15 min")) return 15;
  if (text.includes("30 minute") || text.includes("30 min")) return 30;
  if (text.includes("one hour") || text.includes("1 hour")) return 60;
  if (text.includes("two hour") || text.includes("2 hour")) return 120;

  const match = text.match(/(\d+)\s*(minutes?|mins?|hours?|hrs?)/);

  if (match) {
    const amount = Number(match[1]);
    return /hour|hr/.test(match[2]) ? amount * 60 : amount;
  }

  return null;
}

function getMatchingCategory(message) {
  const text = message.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }

  return null;
}

function getRecommendations(message) {
  const timeLimit = getTimeLimit(message);
  const category = getMatchingCategory(message);

  let results = activities.filter(activity => {
    const fitsTime = timeLimit === null || activity.minutes <= timeLimit;
    const fitsCategory = category === null || activity.category === category;

    return fitsTime && fitsCategory;
  });

  // If both filters are too restrictive, prioritize the user's category.
  if (results.length === 0 && category) {
    results = activities.filter(activity => activity.category === category);
  }

  // If no activities fit the time limit, suggest short alternatives.
  if (results.length === 0 && timeLimit !== null) {
    results = activities.filter(activity => activity.minutes <= timeLimit);
  }

  // Keep recommendations manageable.
  return results.slice(0, 4);
}

function formatDuration(minutes) {
  if (minutes >= 60 && minutes % 60 === 0) {
    return `${minutes / 60} hour${minutes > 60 ? "s" : ""}`;
  }

  return `${minutes} minutes`;
}

function showRecommendations(results) {
  const { content } = addMessage(
    "Here are a few ideas you could try. Pick whichever sounds enjoyable to you!",
    "bot"
  );

  const list = document.createElement("div");
  list.className = "activity-list";

  results.forEach(activity => {
    const item = document.createElement("div");
    item.className = "activity-item";

    const title = document.createElement("strong");
    title.textContent = `✧ ${activity.name}`;

    const description = document.createElement("div");
    description.textContent = activity.description;

    const duration = document.createElement("small");
    duration.textContent = `Suggested time: ${formatDuration(activity.minutes)}`;

    item.append(title, description, duration);
    list.appendChild(item);
  });

  content.appendChild(list);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function getBotResponse(message) {
  const text = message.toLowerCase().trim();

  if (/\b(hi|hello|hey|hii|hiii)\b/.test(text)) {
    return {
      text: "Hey there! 😊 I'm your Leisure Assistant. Tell me how much free time you have or what kind of activity you enjoy."
    };
  }

  if (/\b(thank you|thanks|thank u|thx)\b/.test(text)) {
    return {
      text: "You're welcome! 💜 I hope you find something fun to do. Want more ideas? Tell me your interests or available time."
    };
  }

  if (/\b(who are you|what are you|your name)\b/.test(text)) {
    return {
      text: "I'm Leisure Tracker, a rule-based chatbot designed to suggest leisure activities based on your interests and available time."
    };
  }

  if (/\b(bored|boring|nothing to do|no idea)\b/.test(text)) {
    return {
      text: "Let's fix that! You could listen to music, try a puzzle, sketch something, or take a short walk. Here are some ideas:"
    };
  }

  if (/\b(bye|goodbye|see you)\b/.test(text)) {
    return {
      text: "See you soon! 💜 Make some time for yourself and enjoy your day."
    };
  }

  if (/\b(help|what can you do|options)\b/.test(text)) {
    return {
      text: "I can suggest indoor and outdoor activities, creative hobbies, relaxation ideas, learning activities, and things to do with friends. Try asking: 'I have 30 minutes' or 'Suggest indoor activities.'"
    };
  }

  if (/\b(suggest|recommend|activities|activity|hobby|hobbies|do|free time|leisure|bored|relax|stress|tired|learn|indoor|outdoor|weekend|minutes|mins|hour|hours|home|friends|creative|dance|exercise|workout|movie|watch|nature|art|draw|paint|game|games|music|reading|read|walk|fun|calm|rest|study|language)\b/.test(text)) {
    const results = getRecommendations(text);

    if (results.length > 0) {
      return { recommendations: results };
    }
  }

  return {
    text: "I'd love to help! 💜 Try asking me to suggest indoor activities, recommend a new hobby, help you relax, or find something fun to do in 15 or 30 minutes."
  };
}

function handleUserMessage(message) {
  const cleanedMessage = message.trim();

  if (!cleanedMessage) return;

  addMessage(cleanedMessage, "user");

  const response = getBotResponse(cleanedMessage);

  // A small delay makes the chat feel more natural.
  window.setTimeout(() => {
    if (response.recommendations) {
      showRecommendations(response.recommendations);
    } else {
      addMessage(response.text, "bot");
    }
  }, 350);
}

chatForm.addEventListener("submit", event => {
  event.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  userInput.value = "";
  handleUserMessage(message);
});

document.querySelectorAll("[data-prompt]").forEach(button => {
  button.addEventListener("click", () => {
    handleUserMessage(button.dataset.prompt);
  });
});

function resetChat() {
  chatArea.replaceChildren();

  const intro = document.createElement("div");
  intro.className = "welcome";
  intro.innerHTML = `
    <div class="welcome-icon">✦</div>
    <p class="eyebrow">YOUR PERSONAL LEISURE GUIDE</p>
    <h1>Make room for<br><span>what you love.</span></h1>
    <p class="welcome-text">
      Not sure what to do with your free time?
      Tell me how you're feeling or how much time you have.
      Let's find something enjoyable!
    </p>
    <div class="prompt-grid">
      <button class="prompt-card" data-prompt="I have 15 minutes. Suggest something fun.">
        <span>◷</span><strong>Quick break</strong><small>I have 15 minutes</small>
      </button>
      <button class="prompt-card" data-prompt="Suggest indoor activities">
        <span>⌂</span><strong>Stay indoors</strong><small>Fun from home</small>
      </button>
      <button class="prompt-card" data-prompt="I feel bored. Suggest something interesting.">
        <span>✧</span><strong>I'm bored</strong><small>Give me fresh ideas</small>
      </button>
      <button class="prompt-card" data-prompt="I want to learn a new hobby">
        <span>♡</span><strong>Try a hobby</strong><small>Discover something new</small>
      </button>
    </div>
  `;

  chatArea.appendChild(intro);

  // Reattach click handlers to the new prompt buttons.
  intro.querySelectorAll("[data-prompt]").forEach(button => {
    button.addEventListener("click", () => {
      handleUserMessage(button.dataset.prompt);
    });
  });

  userInput.focus();
}

document.getElementById("newChat").addEventListener("click", resetChat);
document.getElementById("clearChat").addEventListener("click", resetChat);
