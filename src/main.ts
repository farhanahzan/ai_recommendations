import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://officestationery.lk', // ✅ Allow your frontend domain
    methods: ['GET', 'POST'],
    credentials: true, // Optional: if you're using cookies
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
