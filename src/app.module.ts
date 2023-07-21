import { Module } from '@nestjs/common'
import { VerificationModule } from './verification/index.module'
import { HandlerModule } from './handler/index.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

@Module({
  imports: [
    VerificationModule,
    HandlerModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client')
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule { }
