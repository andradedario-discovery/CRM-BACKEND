import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CobranzasSnapshot } from './entities/cobranzas-snapshot.entity';
import { SaveCobranzasDto } from './dto/save-cobranzas.dto';

const SNAPSHOT_ID = 'main';

@Injectable()
export class CobranzasService {
  constructor(
    @InjectRepository(CobranzasSnapshot)
    private readonly snapshotRepository: Repository<CobranzasSnapshot>,
  ) {}

  async saveRows(dto: SaveCobranzasDto) {
    const existing = await this.snapshotRepository.findOne({
      where: { id: SNAPSHOT_ID },
    });

    const entity = this.snapshotRepository.create({
      id: SNAPSHOT_ID,
      rows: dto.rows,
      totalRows: dto.rows.length,
      createdAt: existing?.createdAt,
    });

    const saved = await this.snapshotRepository.save(entity);

    return {
      ok: true,
      totalRows: saved.totalRows,
      updatedAt: saved.updatedAt,
    };
  }

  async getCurrent() {
    const snapshot = await this.snapshotRepository.findOne({
      where: { id: SNAPSHOT_ID },
    });

    if (!snapshot) {
      return {
        ok: true,
        totalRows: 0,
        rows: [],
        updatedAt: null,
      };
    }

    return {
      ok: true,
      totalRows: snapshot.totalRows,
      rows: snapshot.rows ?? [],
      updatedAt: snapshot.updatedAt,
    };
  }

  async clear() {
    const snapshot = await this.snapshotRepository.findOne({
      where: { id: SNAPSHOT_ID },
    });

    if (!snapshot) {
      throw new NotFoundException('No existe una base de cobranzas cargada');
    }

    snapshot.rows = [];
    snapshot.totalRows = 0;

    const saved = await this.snapshotRepository.save(snapshot);

    return {
      ok: true,
      totalRows: saved.totalRows,
      updatedAt: saved.updatedAt,
    };
  }
}