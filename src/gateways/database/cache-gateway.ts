import Redis, { Redis as RedisClient } from 'ioredis';

import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.ENVFILE || '.env.local' });

const redisUrl = process.env.REDIS_URL;

const cacheConfig = {
  redis: {
    host: 'localhost',
    port: 6379,
  },
};

export class RedisCacheProvider {
  private client: RedisClient;

  constructor() {
    if (redisUrl) {
      this.client = new Redis(redisUrl);
    } else {
      this.client = new Redis(cacheConfig.redis);
    }
  }

  public async save({ key, value }): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  public async saveArray({ key, value }): Promise<void> {
    await this.client.rpush(key, JSON.stringify(value));
  }

  public async getArrayValue({ key, index }) {
    const value = await this.client.lindex(key, index);

    if (value) return JSON.parse(value);

    return null;
  }

  public async removeFirstItemOfArray(key: string) {
    await this.client.lpop(key);
  }

  public async removeArrayItem({ key, value }) {
    const itemsRemoved = await this.client.lrem(key, 1, JSON.stringify(value));

    if (itemsRemoved !== 1) throw new Error('Somehting went wrong removing item from array');

    return true;
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}

export const cacheGateway = [
  {
    provide: 'RedisCacheProvider',
    useClass: RedisCacheProvider,
  },
];
