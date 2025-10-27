import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrador } from './entities/admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Administrador])],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [TypeOrmModule, AdminService], 
})
export class AdminModule { }
