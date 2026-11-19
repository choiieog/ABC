import { Controller, Get } from '@nestjs/common';
import type { RoleDto } from './roles.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Get()
  list(): RoleDto[] {
    return this.service.list();
  }
}
