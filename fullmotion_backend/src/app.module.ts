// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Importe ConfigService
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer'; // Importe MailerModule e HandlebarsAdapter (ou PugAdapter)
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter'; // Usando PugAdapter

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({ // Usar forRootAsync para injetar ConfigService
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: parseInt(configService.get<string>('DB_PORT') || '5432'),
        username: configService.get<string>('DB_USERNAME') || 'fullmotion_usr',
        password: configService.get<string>('DB_PASSWORD') || 'sua_senha_postgres',
        database: configService.get<string>('DB_DATABASE') || 'fullmotion_db',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    // NOVO: Configuração do MailerModule
    MailerModule.forRootAsync({
      imports: [ConfigModule], // Para injetar ConfigService
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: configService.get<number>('MAIL_PORT') === 465, // Use 'true' para 465 (SSL/TLS), 'false' para outros
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"Fullmotion App" <${configService.get<string>('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, '..', 'src', 'mail-templates'), // Pasta onde os templates de e-mail estarão
          adapter: new PugAdapter(), // Usa Pug como motor de templates
          options: {
            strict: true,
          },
        },
      }),
    }),
    // ServeStaticModule para a pasta 'uploads'
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
      exclude: ['/api/(.*)', '/frontend/(.*)'],
    }),
    // ServeStaticModule EXISTENTE para o frontend React
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'build'),
      exclude: ['/api/(.*)', '/uploads/(.*)'],
    }),
    UsersModule,
    AuthModule,
    VideosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}