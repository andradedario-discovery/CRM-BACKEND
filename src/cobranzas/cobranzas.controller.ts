import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { CobranzasService } from './cobranzas.service';
import { SaveCobranzasDto } from './dto/save-cobranzas.dto';

@Controller('cobranzas')
export class CobranzasController {
  constructor(private readonly cobranzasService: CobranzasService) {}

  @Get('current')
  getCurrent() {
    return this.cobranzasService.getCurrent();
  }

  @Post('import')
  importRows(@Body() dto: SaveCobranzasDto) {
    return this.cobranzasService.saveRows(dto);
  }

  @Delete('current')
  clearCurrent() {
    return this.cobranzasService.clear();
  }
}