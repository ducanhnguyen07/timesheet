import { Injectable, Scope } from "@nestjs/common";
import * as Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis.Redis;
  
  constructor() {
    this.client = new Redis.Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    });
    this.client.on('connect', () => console.log('redis connect successfully'));
    this.client.on('ready', () => console.log('redis client is ready'));
    
    this.client.on('error', (err) => console.error('redis client error', err));
  }

  async setHash(key: string, field: string, value: string): Promise<void> {
    await this.client.hset(key, field, JSON.stringify(value));
  }

  async getHash(key: string, field: string): Promise<string> {
    const value = await this.client.hget(key, field);
    return value;
  }

  async getAllHash(key: string): Promise<any> {
    const values = await this.client.hgetall(key);
    const reponseTokenList = [];
    
    for (const item in values) {
      const [field, value] = item.split(':');
      reponseTokenList.push(field);
    }

    return reponseTokenList;
  }

  async removeHashField(key: string, field: string): Promise<void> {
    await this.client.hdel(key, field);
  }
}