import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationKeyPaths } from 'src/config/configuration';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService<ConfigurationKeyPaths>) {
        let password = configService.get<string>('redis.password');
        let host = configService.get<string>('redis.host');
        let port = configService.get<string>('redis.port');
        let database = configService.get<number>('redis.db');
        const client = createClient({
          url: `redis://:${password}@${host}:${port}`,
          database,
        });
        client.on('connect', () => {
          console.log('redis 连接成功');
        });

        client.on('error', function (err) {
          console.log('redis 连接异常 ', err);
        });
        client.on('reconnecting', (stats) => {
          console.log('redis 重连', stats);
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
