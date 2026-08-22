require('dotenv').config();
const { app, prisma } = require('./app');

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`GlobeTrotter API live on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use by an active server process.`);
    console.error(`👉 To free the port, run: lsof -ti :${PORT} | xargs kill -9\n`);
    process.exit(1);
  } else {
    throw err;
  }
});

const shutdown = async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
