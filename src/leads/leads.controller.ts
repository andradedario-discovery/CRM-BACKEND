import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { AssignLeadDto } from './dto/assign-lead.dto';
import { ChangeLeadStatusDto } from './dto/change-lead-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { Permission } from '../common/enums/permission.enum';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('leads')
// @UseGuards(JwtAuthGuard, PermissionsGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @Permissions(Permission.LEAD_CREATE)
  create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }
@Post('import')
@Permissions(Permission.LEAD_CREATE)
@UseInterceptors(FileInterceptor('file'))
importLeads(@UploadedFile() file: Express.Multer.File) {
  if (!file) {
    throw new BadRequestException('Archivo no enviado');
  }

  return this.leadsService.importCsv(file);
}
  @Get()
  @Permissions(Permission.LEAD_READ)
  findAll() {
    return this.leadsService.findAll();
  }

  @Get(':id')
  @Permissions(Permission.LEAD_READ)
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  @Permissions(Permission.LEAD_UPDATE)
  update(@Param('id') id: string, @Body() dto: UpdateLeadDto) {
    return this.leadsService.update(id, dto);
  }

  @Patch(':id/assign')
  @Permissions(Permission.LEAD_ASSIGN)
  assign(@Param('id') id: string, @Body() dto: AssignLeadDto) {
    return this.leadsService.assign(id, dto);
  }

  @Patch(':id/status')
  @Permissions(Permission.LEAD_STATUS)
  changeStatus(@Param('id') id: string, @Body() dto: ChangeLeadStatusDto) {
    return this.leadsService.changeStatus(id, dto);
  }

  @Delete(':id')
  @Permissions(Permission.LEAD_DELETE)
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }
}
