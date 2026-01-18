import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { InMemoryCacheService } from './in-memory-cache.service';

@Global()
@Module({
  imports: [NestCacheModule.register()],
  providers: [InMemoryCacheService, { provide: 'CacheService', useExisting: InMemoryCacheService }],
  exports: [{ provide: 'CacheService', useExisting: InMemoryCacheService }],
})
export class CacheModule {}
