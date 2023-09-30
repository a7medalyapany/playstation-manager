import path from 'path';
import * as fs from 'fs';

export function handleHourlyPriceChange(PlayStationType: string): number {
  try {
    const dataPath = path.join(__dirname, '..', 'common', 'data.json');
    const pricesJson = fs.readFileSync(dataPath, 'utf-8');
    const prices = JSON.parse(pricesJson).prices;

    if (PlayStationType in prices) {
      return prices[PlayStationType].price;
    } else {
      throw new Error('PlayStationType not found in prices');
    }
  } catch (error) {
    console.error('Error reading or parsing data:', error);
    return 0;
  }
}

export function calculateHourlyPrice(PlayStationType: string, PlayersNumber: number): number {
  const basePrice = handleHourlyPriceChange(PlayStationType);

  switch (PlayersNumber) {
    case 1:
      return basePrice;
    case 2:
      return basePrice;
    case 3:
      return basePrice + 5.0;
    case 4:
      return basePrice + 10.0;
    default:
      return 0.0;
  }
}
