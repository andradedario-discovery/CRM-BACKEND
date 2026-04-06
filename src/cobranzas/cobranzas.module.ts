import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CobranzasController } from './cobranzas.controller';
import { CobranzasService } from './cobranzas.service';
import { CobranzasSnapshot } from './entities/cobranzas-snapshot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CobranzasSnapshot])],
  controllers: [CobranzasController],
  providers: [CobranzasService],
  exports: [CobranzasService],
})
export class CobranzasModule {}