import { Module } from '@nestjs/common';
import { ValidationController } from './validation.controller';
import { ValidationService } from './validation.service';
import { ValidationStateService } from '../state/validation-state.service';

@Module({
  controllers: [ValidationController],
  providers: [ValidationService, ValidationStateService],
  exports: [ValidationService, ValidationStateService],
})
export class ValidationModule {}
