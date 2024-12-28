import fetch from 'node-fetch';
import { COINGECKO_BASE_URL, SUPPORTED_CURRENCIES } from '../config.js';

export class PriceService {
  constructor() {
    this.latestPrices = {};
  }

  async fetchPrices() {
    try {
      const currencies = SUPPORTED_CURRENCIES.join(',');
      const response = await fetch(
        `${COINGECKO_BASE_URL}/simple/price?ids=${currencies}&vs_currencies=usd&include_24hr_change=true`
      );
      const data = await response.json();
      this.latestPrices = data;
      return data;
    } catch (error) {
      console.error('Error fetching prices:', error);
      return this.latestPrices;
    }
  }

  getLatestPrices() {
    return this.latestPrices;
  }
}