import { NestFactory } from '@nestjs/core'
import { DontPanicApp } from './app/newapp.module'

async function bootstrap() {
    const app = await NestFactory.create(DontPanicApp)

    await app.listen(3000)
}
bootstrap()
