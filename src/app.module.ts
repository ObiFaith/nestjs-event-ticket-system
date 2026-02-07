import configuration from './config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { TicketModule } from './ticket/ticket.module';
import { EventModule } from './event/event.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('databaseUrl'),
        autoLoadEntities: true,
        synchronize: false,
        migrations: ['dist/database/migrations/*.js'],
      }),
    }),
    HealthModule,
    UserModule,
    TicketModule,
    EventModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
