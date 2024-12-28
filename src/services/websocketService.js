import { WebSocketServer } from 'ws';
import { WS_PORT } from '../config.js';

export class WebSocketService {
  constructor(priceService) {
    this.priceService = priceService;
    this.wss = new WebSocketServer({ port: WS_PORT });
    this.setupWebSocket();
  }

  setupWebSocket() {
    this.wss.on('connection', (ws) => {
      console.log('Client connected');
      
      // Send initial prices
      ws.send(JSON.stringify({
        type: 'prices',
        data: this.priceService.getLatestPrices()
      }));

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  }

  broadcast(data) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocketServer.OPEN) {
        client.send(JSON.stringify({
          type: 'prices',
          data
        }));
      }
    });
  }

  getConnectedClients() {
    return this.wss.clients.size;
  }
}