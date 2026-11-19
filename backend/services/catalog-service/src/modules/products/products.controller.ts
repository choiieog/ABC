import { Controller, Get } from '@nestjs/common';
import type { ProductDto } from './products.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  list(): ProductDto[] {
    return this.service.list();
  }
}
