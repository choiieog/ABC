import { Injectable } from '@nestjs/common';
import type { Role } from './roles.entity';

@Injectable()
export class RolesService {
  list(): Role[] {
    return [
      {
        "id": "admin",
        "name": "Quản trị viên"
      },
      {
        "id": "staff",
        "name": "Nhân viên"
      }
    ];
  }
}
