require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const meRoutes = require('./routes/me');
const roadmapRoutes = require('./routes/roadmap');
const visasRoutes = require('./routes/visas');
const servicesRoutes = require('./routes/services');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/me', meRoutes);
app.use('/roadmap', roadmapRoutes);
app.use('/visas', visasRoutes);
app.use('/services', servicesRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
