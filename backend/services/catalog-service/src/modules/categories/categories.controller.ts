import { Controller, Get } from '@nestjs/common';
import type { CategoryDto } from './categories.dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  list(): CategoryDto[] {
    return this.service.list();
  }
}
