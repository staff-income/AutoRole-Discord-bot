const express = require('express');
const cors = require('cors');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Discord client for management via API
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
const GUILD_ID = process.env.GUILD_ID;
const ROLE_IDS = process.env.ROLE_IDS ? process.env.ROLE_IDS.split(',') : [];

let targets = [];
let logs = [];

function addLog(msg) {
  const ts = new Date().toISOString();
  logs.unshift(`[${ts}] ${msg}`);
  if (logs.length > 200) logs.pop();
}

client.on('ready', () => {
  console.log('Discord client ready', client.user.tag);
  addLog('Discord client ready: ' + client.user.tag);
});

client.login(process.env.TOKEN).catch(e => {
  console.error('Login failed', e);
  addLog('Login failed: ' + e.message);
});

// REST API
app.get('/api/status', async (req, res) => {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    res.json({ ok: true, guild: { id: guild.id, name: guild.name }, targets, logs });
  } catch (e) {
    res.json({ ok: false, error: e.message, logs });
  }
});

app.post('/api/add', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ ok: false, error: 'userId required' });
  if (!targets.includes(userId)) targets.push(userId);
  addLog(`Added target ${userId}`);
  res.json({ ok: true, targets });
});

app.post('/api/remove', async (req, res) => {
  const { userId } = req.body;
  targets = targets.filter(u => u !== userId);
  addLog(`Removed target ${userId}`);
  res.json({ ok: true, targets });
});

app.get('/api/roles', (req, res) => {
  res.json({ ok: true, roles: ROLE_IDS });
});

// Serve frontend build when deployed
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
