import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Trigger Vercel auto deploy test
app.get('/', (_req, res) => {
  res.send('Hello from Express + TypeScript + Vercel!');
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app; 