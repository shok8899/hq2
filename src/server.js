import express from 'express';
import { HTTP_PORT } from './config.js';
import { PriceService } from './services/priceService.js';
import { WebSocketService } from './services/websocketService.js';

const app = express();
const priceService = new PriceService();
const wsService = new WebSocketService(priceService);

// Update prices periodically
async function updatePrices() {
  const prices = await priceService.fetchPrices();
  wsService.broadcast(prices);
}
setInterval(updatePrices, 1000);

// HTTP endpoints
app.get('/prices', (req, res) => {
  res.json(priceService.getLatestPrices());
});

app.get('/status', (req, res) => {
  res.json({
    status: 'running',
    connections: wsService.getConnectedClients(),
    timestamp: new Date().toISOString()
  });
});

// Start HTTP server
app.listen(HTTP_PORT, () => {
  console.log(`Market data server running on port ${HTTP_PORT}`);
  console.log(`WebSocket server running on port ${WS_PORT}`);
  
  // Initial price fetch
  updatePrices();
});