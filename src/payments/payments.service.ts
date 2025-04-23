import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentEventDto, PaymentOrderDto } from './dto/payment.dto';

const paymentOrders = new Map();

@Injectable()
export class PaymentsService {
  executePayment(paymentEventDto: PaymentEventDto) {
    const results: { payment_order_id: string; status: string; checkout_id: string }[] = [];

    for (const order of paymentEventDto.payment_orders) {

        const success = paymentEventDto.psp_info.sucess ?? true;

        const paymentOrderResult = {
            payment_order_id: order.payment_order_id,
            checkout_id: paymentEventDto.checkout_id,
            client_id: order.client_id,
            location_id: order.location_id,
            amount: order.amount,
            currency: order.currency,
            psp: paymentEventDto.psp,
            psp_reference: `psp_ref_${this.generateRandomString(8)}`,
            status: success ? 'COMPLETED' : 'FAILED',
            error: success ? null : {
                code: 'PAYMENT_DECLINED',
                message: 'The payment was declined by the issuing bank',
                details: {
                    decline_code: 'INSUFFICIENT_FUNDS',
                    recommendation: 'Try another payment method',
                },
            },
        };

        paymentOrders.set(order.payment_order_id, paymentOrderResult);

        results.push({
            payment_order_id: paymentOrderResult.payment_order_id,
            status: paymentOrderResult.status,
            checkout_id: paymentOrderResult.checkout_id
        });
    }

    return {
      checkout_id: paymentEventDto.checkout_id,
      psp: paymentEventDto.psp,
      payment_orders: results,
    };
  }

  getPaymentStatus(paymentOrderId: string) {
    const paymentOrder = paymentOrders.get(paymentOrderId);

    if (!paymentOrder) {
      throw new NotFoundException('Payment order not found');
    }

    const orderStatuses = ['PENDING', 'COMPLETED'];
    const randomStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];

    return {
      ...paymentOrder,
      order_status: randomStatus,
      pickup_code: randomStatus === 'COMPLETED' ?
        `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 100)}` :
        null
    };
  }

  private generateRandomString(length: number): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
