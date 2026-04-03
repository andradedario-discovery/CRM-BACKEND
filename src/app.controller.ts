import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('seed-admin')
  async seedAdmin() {
    try {
      const existing = await this.usersService.findByEmail('admin@crm.com');

      if (existing) {
        return {
          ok: true,
          message: 'admin ya existe',
          email: existing.email,
        };
      }

      const user = await this.usersService.create({
        firstName: 'Admin',
        lastName: 'CRM',
        email: 'admin@crm.com',
        password: '123456',
        role: 'admin' as any,
      });

      return {
        ok: true,
        message: 'admin creado',
        email: user.email,
      };
    } catch (error: any) {
      return {
        ok: false,
        message: error?.message || 'error creando admin',
      };
    }
  }
}