import { Test, TestingModule } from '@nestjs/testing';
import { ClientsServiceController } from './clients-service.controller';
import { ClientsServiceService } from './clients-service.service';

describe('ClientsServiceController', () => {
  let clientsServiceController: ClientsServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ClientsServiceController],
      providers: [ClientsServiceService],
    }).compile();

    clientsServiceController = app.get<ClientsServiceController>(ClientsServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(clientsServiceController.getHello()).toBe('Hello World!');
    });
  });
});
