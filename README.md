# ShopMate AI — E-Commerce Customer Support Agent

A final-project-ready demo for **Use Case 3: AI E-Commerce Customer Support Agent**.

### Features

- Product search
- Order-status lookup
- Product recommendations
- Return/refund guidance
- Ollama-powered natural-language responses
- Tool calling / agent workflow
- Short-term session memory
- Responsive customer-support UI
- Easy replacement of demo tools with MySQL/MongoDB/Firebase APIs

## 1. Requirements

Install:

- Node.js 18+
- Ollama

## 2. Install an Ollama model

```bash
ollama pull llama3.2:3b
```

If you have a stronger machine, you can use another chat model:

```bash
ollama pull llama3.1:8b
```

Then set:

Windows PowerShell:
```powershell
$env:OLLAMA_MODEL="llama3.1:8b"
```

Linux/macOS:
```bash
export OLLAMA_MODEL=llama3.1:8b
```

## 3. Start Ollama

```bash
ollama serve
```

If Ollama is already running as a desktop service, you can skip this.

## 4. Start the website

Open this project folder in a terminal:

```bash
npm install
npm start
```

Open:

http://localhost:3000

## Optional Python backend

The same storefront can run with the included FastAPI backend. Install Python 3.11+ first, then run:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Open http://localhost:8000. The Python API includes the product catalog, order tracking, Ollama chat, session memory, and offline fallback responses.

## How the agent works

1. Customer sends a message.
2. Ollama decides whether a tool is needed.
3. The server executes a real local tool:
   - `search_products`
   - `track_order`
   - `recommend_products`
4. Tool output is sent back to Ollama.
5. Ollama produces the customer-facing answer.
6. Conversation messages are stored in short-term session memory.

## Demo order IDs

- ORD1001 — Out for delivery
- ORD1002 — Shipped
- ORD1003 — Delivered

## Important

The included product and order data are demo data. For a real project, replace the tool functions in `server.js` with database/API calls.

## Suggested final-year project upgrades

- Login and customer profiles
- MySQL/MongoDB product and order database
- Admin dashboard
- Real payment/refund integration
- WhatsApp/email support
- RAG over store policies and FAQs
- Voice support
- Analytics dashboard
- Human-agent escalation
- Persistent Redis/PostgreSQL conversation memory
