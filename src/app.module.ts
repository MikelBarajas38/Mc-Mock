import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsService } from './payments/payments.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule
  ],
  controllers: [AppController, PaymentsController],
  providers: [AppService, PaymentsService],
})
export class AppModule {}
