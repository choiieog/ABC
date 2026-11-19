import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { parseCreateOrder } from './orders.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  list() {
    return this.orders.list();
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.orders.find(id);
  }

  @Post()
  create(@Body() body: unknown) {
    return this.orders.create(parseCreateOrder(body));
  }
}
