const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2:3b";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/*
  Demo data. Replace these with a real database/API later.
*/
const products = [
  { id: "P1001", name: "AeroFlex Running Shoes", category: "Footwear", price: 2499, stock: 18, rating: 4.6 },
  { id: "P1002", name: "UrbanPulse Smart Watch", category: "Wearables", price: 3999, stock: 7, rating: 4.4 },
  { id: "P1003", name: "SoundWave Pro Headphones", category: "Audio", price: 2999, stock: 24, rating: 4.7 },
  { id: "P1004", name: "NovaFit Backpack", category: "Bags", price: 1599, stock: 11, rating: 4.5 },
  { id: "P1005", name: "Lumina Desk Lamp", category: "Home", price: 1299, stock: 32, rating: 4.3 },
  { id: "P1006", name: "TrailMark Everyday Sneakers", category: "Footwear", price: 2199, stock: 14, rating: 4.5 },
  { id: "P1007", name: "CloudStep Recovery Slides", category: "Footwear", price: 899, stock: 29, rating: 4.2 },
  { id: "P1008", name: "PulseBand Activity Tracker", category: "Wearables", price: 1899, stock: 16, rating: 4.3 },
  { id: "P1009", name: "EchoBud Wireless Earbuds", category: "Audio", price: 1799, stock: 21, rating: 4.4 },
  { id: "P1010", name: "QuietTone Desk Speakers", category: "Audio", price: 2499, stock: 9, rating: 4.6 },
  { id: "P1011", name: "MetroCrossbody Bag", category: "Bags", price: 1199, stock: 20, rating: 4.1 },
  { id: "P1012", name: "Atlas Travel Duffel", category: "Bags", price: 2799, stock: 8, rating: 4.5 },
  { id: "P1013", name: "Hearth & Home Candle", category: "Home", price: 699, stock: 40, rating: 4.6 },
  { id: "P1014", name: "Sora Ceramic Mug Set", category: "Home", price: 999, stock: 26, rating: 4.4 },
  { id: "P1015", name: "FocusFlow Mechanical Keyboard", category: "Tech", price: 3499, stock: 12, rating: 4.7 },
  { id: "P1016", name: "GlowMini Portable Charger", category: "Tech", price: 1499, stock: 33, rating: 4.3 }
];

const catalogSeeds = [
  ["Footwear", ["Harbor Knit Trainers", "StrideLite Court Shoes", "Peakline Walking Shoes", "Motive Trail Runners", "Everyday Canvas Sneakers", "Northstar Slip-On Shoes", "FlexForm Training Shoes", "Wayfarer Casual Loafers", "CloudRun Mesh Trainers", "RidgeWalk Hiking Shoes"], 1299],
  ["Wearables", ["HaloSleep Ring", "MoveMate Smart Band", "CoreTrack Fitness Watch", "Tempo Heart Monitor", "LoopLink Smart Ring", "Daylight Health Watch", "MotionPulse Band", "Orbit Mini Watch", "Balance Activity Band", "Venture GPS Watch"], 1599],
  ["Audio", ["StudioBloom Headphones", "PocketBeat Earbuds", "RoomTone Bluetooth Speaker", "WaveNest Over-Ear Headphones", "ClearCall Conference Buds", "Bassline Mini Speaker", "Drift Noise-Canceling Buds", "SoundArc Portable Speaker", "FocusPod Headphones", "Chime Wireless Earphones"], 999],
  ["Bags", ["Canvas Day Tote", "Summit Laptop Bag", "Daybreak Sling Bag", "Fieldwork Messenger", "CarryOn Weekender", "Willow Mini Backpack", "Transit Laptop Sleeve", "Coastline Beach Tote", "Rover Gym Bag", "Lumen Travel Organizer"], 799],
  ["Home", ["CalmGlow Table Lamp", "Woven Throw Blanket", "Cedar Room Diffuser", "Mellow Stone Vase", "Morning Brew Kettle", "Softline Cushion Set", "Arc Wall Clock", "Linen Storage Basket", "Stillwater Water Bottle", "Kindred Photo Frame"], 599],
  ["Tech", ["KeyNest Wireless Keyboard", "BrightPoint USB Hub", "PocketPixel Webcam", "SwiftCharge Wall Adapter", "DeskDock Laptop Stand", "LinkLoop USB-C Cable", "AeroNote Tablet Sleeve", "BeamLite Monitor Light", "GridPad Desk Mat", "Signal Bluetooth Adapter"], 699],
  ["Beauty", ["Dewdrop Face Mist", "Velvet Tint Lip Balm", "CloudSilk Hand Cream", "GlowKind Body Lotion", "FreshStart Cleansing Gel", "Moonlit Hair Serum", "PetalSoft Bath Salts", "BareBloom Face Mask", "Citrus Grove Hand Wash", "QuietMorning Eye Gel"], 399],
  ["Stationery", ["Everyday Hardcover Journal", "Studio Grid Notebook", "SoftMark Gel Pen Set", "Desk Day Planner", "Archive Document Folder", "ColorStory Marker Set", "Pocket Notes Pack", "FineLine Drawing Pencils", "Weekly Focus Pad", "PaperCraft Card Set"], 249],
  ["Kitchen", ["Oakridge Cutting Board", "Savor Glass Storage Set", "Daily Pour Water Jug", "Moss Ceramic Plate Set", "BrewBar Coffee Press", "Gather Serving Bowl", "SpiceTrail Jar Set", "EasyPrep Measuring Cups", "Harvest Cotton Apron", "Stoneware Snack Tray"], 449],
  ["Fitness", ["CoreGrip Yoga Mat", "LiftLoop Resistance Bands", "Stride Foam Roller", "Balance Cork Block Set", "Pulse Jump Rope", "TrainWell Water Bottle", "FlexFit Ankle Weights", "Recovery Massage Ball", "MoveDaily Exercise Towel", "FormFit Training Gloves"], 499]
];

let generatedProductNumber = 1017;
for (const [category, names, basePrice] of catalogSeeds) {
  names.forEach((name, index) => {
    products.push({
      id: `P${generatedProductNumber++}`,
      name,
      category,
      price: basePrice + (index % 5) * 200,
      stock: 6 + ((index * 7) % 35),
      rating: Number((4.1 + ((index * 3) % 8) / 10).toFixed(1))
    });
  });
}

const orders = {
  "ORD1001": { id: "ORD1001", customer: "Demo Customer", item: "AeroFlex Running Shoes", status: "Out for delivery", eta: "Today, 7 PM", amount: 2499 },
  "ORD1002": { id: "ORD1002", customer: "Demo Customer", item: "SoundWave Pro Headphones", status: "Shipped", eta: "Tomorrow", amount: 2999 },
  "ORD1003": { id: "ORD1003", customer: "Demo Customer", item: "NovaFit Backpack", status: "Delivered", eta: "Delivered yesterday", amount: 1599 }
};

const memory = new Map();

function searchProducts(query = "") {
  const q = query.toLowerCase().trim();
  const budget = q.match(/(?:under|below|less than)\s*(?:₹|rs\.?\s*)?(\d[\d,]*)/i);
  const maxPrice = budget ? Number(budget[1].replaceAll(",", "")) : null;
  if (!q) return products.slice(0, 5);
  const searchText = q
    .replace(/(?:under|below|less than)\s*(?:₹|rs\.?\s*)?\d[\d,]*/i, "")
    .replace(/\b(find|show|search|product|products|please|me|a|for)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return products.filter(p =>
    `${p.name} ${p.category}`.toLowerCase().includes(searchText)
  ).filter(p => maxPrice === null || p.price <= maxPrice).slice(0, 5);
}

function getOrder(orderId) {
  return orders[String(orderId || "").toUpperCase()] || null;
}

function recommendProducts(preferences = "") {
  const q = preferences.toLowerCase();
  let list = [...products];
  const budget = q.match(/(?:under|below|less than)\s*(?:₹|rs\.?\s*)?(\d[\d,]*)/i);
  if (budget) list = list.filter(p => p.price <= Number(budget[1].replaceAll(",", "")));

  if (q.includes("shoe") || q.includes("run")) list = list.filter(p => p.category === "Footwear");
  else if (q.includes("watch") || q.includes("fitness")) list = list.filter(p => p.category === "Wearables");
  else if (q.includes("music") || q.includes("audio") || q.includes("headphone")) list = list.filter(p => p.category === "Audio");
  else if (q.includes("travel") || q.includes("commute")) list = list.filter(p => ["Bags", "Audio", "Tech"].includes(p.category));
  else if (q.includes("home") || q.includes("desk")) list = list.filter(p => ["Home", "Tech"].includes(p.category));

  return list.sort((a,b) => b.rating - a.rating).slice(0, 3);
}

function formatProduct(product) {
  return `${product.name} (${product.category}) - ₹${product.price.toLocaleString("en-IN")} - ${product.rating}/5 rating, ${product.stock} in stock`;
}

function offlineReply(message) {
  const text = message.toLowerCase();
  const orderId = message.match(/ord\d+/i)?.[0];
  if (orderId || text.includes("track") || text.includes("order status")) {
    const order = getOrder(orderId || "");
    return order ? `${order.id} is ${order.status}. Estimated arrival: ${order.eta}.` : "I can track ORD1001, ORD1002, or ORD1003. Which order should I check?";
  }
  if (text.includes("return") || text.includes("refund")) return "Our demo return policy allows unused items to be returned within 30 days. I can guide you through the next step, but a refund is not processed by this demo.";
  if (text.includes("recommend") || text.includes("suggest") || text.includes("best for")) return `Here are a few good matches: ${recommendProducts(message).map(formatProduct).join("; ")}.`;
  if (text.includes("price") || text.includes("find") || text.includes("show") || text.includes("product") || text.includes("shoe") || text.includes("headphone")) {
    const results = searchProducts(message);
    return results.length ? `I found: ${results.map(formatProduct).join("; ")}.` : "I couldn't find a close match. Try shoes, audio, bags, home, or tech.";
  }
  return "I can help you find products, compare prices, recommend something, track ORD1001-ORD1003, or explain returns. What are you shopping for?";
}

function saveMemory(sessionId, message) {
  if (!memory.has(sessionId)) memory.set(sessionId, []);
  const arr = memory.get(sessionId);
  arr.push(message);
  if (arr.length > 12) arr.shift();
}

function getMemory(sessionId) {
  return memory.get(sessionId) || [];
}

const tools = {
  search_products: async ({ query }) => ({
    tool: "search_products",
    results: searchProducts(query)
  }),
  track_order: async ({ order_id }) => ({
    tool: "track_order",
    order: getOrder(order_id)
  }),
  recommend_products: async ({ preferences }) => ({
    tool: "recommend_products",
    results: recommendProducts(preferences)
  }),
  return_policy: async () => ({
    tool: "return_policy",
    policy: { window_days: 30, condition: "Items should be unused", refund_note: "This demo does not process refunds" }
  })
};

function extractJson(text) {
  try { return JSON.parse(text); } catch {}
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

async function ollamaChat(messages) {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
      options: { temperature: 0.2 }
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Ollama error ${response.status}: ${body}`);
  }
  const data = await response.json();
  return data.message?.content || "";
}

app.get("/api/config", (req, res) => {
  res.json({ model: OLLAMA_MODEL, ollamaUrl: OLLAMA_URL });
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/chat", async (req, res) => {
  const sessionId = String(req.body.sessionId || "default");
  const userMessage = String(req.body.message || "").trim();

  if (!userMessage) return res.status(400).json({ error: "Message is required." });

  saveMemory(sessionId, { role: "user", content: userMessage });

  const recentMemory = getMemory(sessionId);

  const systemPrompt = `
You are ShopMate AI, a helpful e-commerce customer support agent.
You can answer product questions, track orders, handle return/refund guidance, and recommend products.

  CATALOG:
  ${products.map(formatProduct).join("\n")}

IMPORTANT:
- Be concise, friendly and practical.
- Never invent order status, prices, stock or product facts.
- When a real tool is needed, output ONLY a JSON object in this exact form:
  {"action":"search_products|track_order|recommend_products|return_policy","args":{...}}
- For product search use {"action":"search_products","args":{"query":"..."}}
- For order tracking use {"action":"track_order","args":{"order_id":"ORD1001"}}
- For recommendations use {"action":"recommend_products","args":{"preferences":"..."}}
- For returns use {"action":"return_policy","args":{}}
- If no tool is needed, answer normally.
- For returns, explain that this demo uses a 30-day return window and items should be unused unless the customer asks about an exception.
- Do not claim a refund was actually processed. Explain the next step instead.
`;

  try {
    let draft = await ollamaChat([
      { role: "system", content: systemPrompt },
      ...recentMemory.slice(-8)
    ]);

    const action = extractJson(draft);
    let toolResult = null;

    if (action && action.action && tools[action.action]) {
      toolResult = await tools[action.action](action.args || {});

      const final = await ollamaChat([
        { role: "system", content: systemPrompt },
        ...recentMemory.slice(-8),
        { role: "assistant", content: JSON.stringify(action) },
        { role: "user", content: `Tool result: ${JSON.stringify(toolResult)}. Now give the customer a direct, friendly answer. Do not mention internal tools.` }
      ]);

      saveMemory(sessionId, { role: "assistant", content: final });
      return res.json({ reply: final, tool: toolResult.tool, data: toolResult });
    }

    saveMemory(sessionId, { role: "assistant", content: draft });
    res.json({ reply: draft });
  } catch (err) {
    console.error(err);
    const reply = offlineReply(userMessage);
    saveMemory(sessionId, { role: "assistant", content: reply });
    res.json({ reply, mode: "offline", hint: `Ollama is unavailable. Start Ollama and install '${OLLAMA_MODEL}' for richer answers.` });
  }
});

app.post("/api/reset", (req, res) => {
  const sessionId = String(req.body.sessionId || "default");
  memory.delete(sessionId);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`ShopMate AI running at http://localhost:${PORT}`);
  console.log(`Ollama: ${OLLAMA_URL} | Model: ${OLLAMA_MODEL}`);
});