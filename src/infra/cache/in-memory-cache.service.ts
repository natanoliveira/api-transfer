import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CacheService } from './cache.service';

@Injectable()
export class InMemoryCacheService implements CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.cache.get<T>(key);
    return value ?? null;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.cache.set(key, value, ttlSeconds ? { ttl: ttlSeconds } : undefined);
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }
}
