import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { AssignLeadDto } from './dto/assign-lead.dto';
import { ChangeLeadStatusDto } from './dto/change-lead-status.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createLeadDto: CreateLeadDto) {
    const existingLead = await this.leadRepository.findOne({
      where: { email: createLeadDto.email },
    });

    if (existingLead) {
      throw new ConflictException('Ya existe un lead con ese email');
    }

    const lead = this.leadRepository.create(createLeadDto);
    return await this.leadRepository.save(lead);
  }

  async findAll() {
    return await this.leadRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const lead = await this.leadRepository.findOne({
      where: { id },
    });

    if (!lead) {
      throw new NotFoundException('Lead no encontrado');
    }

    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {
    const lead = await this.findOne(id);

    if (updateLeadDto.email && updateLeadDto.email !== lead.email) {
      const existingLead = await this.leadRepository.findOne({
        where: { email: updateLeadDto.email },
      });

      if (existingLead) {
        throw new ConflictException('Ya existe un lead con ese email');
      }
    }

    Object.assign(lead, updateLeadDto);
    return await this.leadRepository.save(lead);
  }

  async assign(id: string, assignLeadDto: AssignLeadDto) {
    const lead = await this.findOne(id);

    const user = await this.userRepository.findOne({
      where: { id: assignLeadDto.assignedToUserId },
    });

    if (!user) {
      throw new NotFoundException('Usuario asignado no encontrado');
    }

    lead.assignedTo = user;
    return await this.leadRepository.save(lead);
  }

  async changeStatus(id: string, changeLeadStatusDto: ChangeLeadStatusDto) {
    const lead = await this.findOne(id);

    lead.status = changeLeadStatusDto.status;

    return await this.leadRepository.save(lead);
  }

  async remove(id: string) {
    const lead = await this.findOne(id);

    await this.leadRepository.remove(lead);

    return { message: 'Lead eliminado' };
  }

  async importCsv(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Archivo CSV no enviado');
    }

    const content = file.buffer.toString('utf-8');
    const lines = content
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      throw new BadRequestException('El CSV está vacío o no tiene registros');
    }

    const headers = lines[0].split(',').map((h) => h.trim());
    const imported: Lead[] = [];
    const errors: { row: number; error: string }[] = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map((v) => v.trim());

        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        const firstName = row.firstName || '';
        const lastName = row.lastName || '';
        const email = row.email || '';
        const phone = row.phone || '';
        const company = row.company || '';
        const source = row.source || 'csv';

        if (!firstName || !phone) {
          errors.push({
            row: i + 1,
            error: 'Faltan campos obligatorios: firstName o phone',
          });
          continue;
        }

        const existingLead = await this.leadRepository.findOne({
          where: email ? [{ email }, { phone }] : [{ phone }],
        });

        if (existingLead) {
          errors.push({
            row: i + 1,
            error: 'Lead duplicado por email o teléfono',
          });
          continue;
        }

        const lead = this.leadRepository.create({
  firstName,
  lastName,
  email: email || '',
  phone,
  company,
  source,
});

await this.leadRepository.save(lead);
imported.push(lead);
      } catch (error) {
        errors.push({
          row: i + 1,
          error: 'Error al procesar fila',
        });
      }
    }

    return {
      message: 'Importación finalizada',
      totalRows: lines.length - 1,
      imported: imported.length,
      failed: errors.length,
      errors,
    };
  }
}