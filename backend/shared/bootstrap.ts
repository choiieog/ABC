import 'reflect-metadata';
import { Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

export async function bootstrap(module: Type<unknown>, name: string, defaultPort: number) {
  const app = await NestFactory.create(module);
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT ?? defaultPort), process.env.HOST ?? '127.0.0.1');
  console.log(`${name} listening at ${await app.getUrl()}`);
}
