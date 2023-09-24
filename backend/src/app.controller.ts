import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getOne() {
    return 'Bienvenido a Antel Ingeniería';
  }
}
