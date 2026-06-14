import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { nanoid } from 'nanoid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file = path.join(__dirname, 'data', 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

await db.read();
db.data ||= {
  users: [
    {
      id: 'user-1',
      name: 'Priya Sharma',
      email: 'priya@xenoreach.ai',
      password: 'test1234'
    }
  ],
  customers: [
    {
      id: 'customer-1',
      name: 'Sophie Turner',
      company: 'Nova Retail',
      email: 'sophie@novaretail.com',
      status: 'active',
      value: 32000,
      region: 'North America'
    }
  ],
  campaigns: [
    {
      id: 'campaign-1',
      name: 'Summer AI Boost',
      status: 'running',
      budget: 8600,
      startDate: '2026-06-01',
      endDate: '2026-06-30'
    }
  ],
  segments: [
    {
      id: 'segment-1',
      name: 'High-Value Shoppers',
      size: 2500,
      filters: ['repeat buyers', 'high spend']
    }
  ]
};
await db.write();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', service: 'XenoReach AI Backend' });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  await db.read();
  const existingUser = db.data.users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered.' });
  }

  const newUser = {
    id: nanoid(),
    name,
    email,
    password
  };

  db.data.users.push(newUser);
  await db.write();

  res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  await db.read();
  const user = db.data.users.find((item) => item.email === email && item.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  res.json({ id: user.id, name: user.name, email: user.email });
});

app.get('/api/customers', async (req, res) => {
  await db.read();
  res.json(db.data.customers);
});

app.get('/api/campaigns', async (req, res) => {
  await db.read();
  res.json(db.data.campaigns);
});

app.get('/api/segments', async (req, res) => {
  await db.read();
  res.json(db.data.segments);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`XenoReach AI backend running at http://localhost:${port}`);
});
