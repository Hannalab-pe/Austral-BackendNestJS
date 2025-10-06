import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesServiceController } from './activities-service.controller';
import { ActivitiesServiceService } from './activities-service.service';

describe('ActivitiesServiceController', () => {
  let activitiesServiceController: ActivitiesServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesServiceController],
      providers: [ActivitiesServiceService],
    }).compile();

    activitiesServiceController = app.get<ActivitiesServiceController>(ActivitiesServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(activitiesServiceController.getHello()).toBe('Hello World!');
    });
  });
});
