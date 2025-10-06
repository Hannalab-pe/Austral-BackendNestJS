import { Test, TestingModule } from '@nestjs/testing';
import { LeadsServiceController } from './leads-service.controller';
import { LeadsServiceService } from './leads-service.service';

describe('LeadsServiceController', () => {
  let leadsServiceController: LeadsServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LeadsServiceController],
      providers: [LeadsServiceService],
    }).compile();

    leadsServiceController = app.get<LeadsServiceController>(LeadsServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(leadsServiceController.getHello()).toBe('Hello World!');
    });
  });
});
