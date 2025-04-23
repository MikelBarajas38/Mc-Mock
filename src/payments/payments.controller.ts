import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Headers,
  UnauthorizedException
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentEventDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  executePayment(
    @Headers('x-mcd-api-key') apiKey: string,
    @Body() paymentEventDto: PaymentEventDto
  ) {
    if (!this.authService.validateApiKey(apiKey)) {
      throw new UnauthorizedException('Invalid API key');
    }
    return this.paymentsService.executePayment(paymentEventDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getPaymentStatus(@Param('id') paymentOrderId: string) {
    return this.paymentsService.getPaymentStatus(paymentOrderId);
  }

  // For testing purposes, get a token
  @Post('auth/token')
  getMockToken(
    @Headers('x-mcd-api-key') apiKey: string,
    @Body('client_id') clientId: string,
  ) {
    if (!this.authService.validateApiKey(apiKey)) {
      throw new UnauthorizedException('Invalid API key');
    }
    return this.authService.generateMockToken(clientId);
  }
}
