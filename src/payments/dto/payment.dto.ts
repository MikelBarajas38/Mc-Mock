import { IsNotEmpty, IsString, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PaymentOrderDto {
  @IsNotEmpty()
  @IsString()
  payment_order_id: string;

  @IsNotEmpty()
  @IsString()
  client_id: string;

  @IsNotEmpty()
  @IsString()
  location_id: string;

  @IsNotEmpty()
  @IsObject()fails
  order_info: Record<string, any>;

  @IsNotEmpty()
  @IsString()
  amount: string;

  @IsNotEmpty()
  @IsString()
  currency: string;
}

export class PaymentEventDto {
  @IsNotEmpty()
  @IsString()
  checkout_id: string;

  @IsNotEmpty()
  @IsObject()
  buyer_info: Record<string, any>;

  @IsNotEmpty()
  @IsString()
  psp: string;

  @IsNotEmpty()
  @IsObject()
  psp_info: Record<string, any>;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentOrderDto)
  payment_orders: PaymentOrderDto[];
}
