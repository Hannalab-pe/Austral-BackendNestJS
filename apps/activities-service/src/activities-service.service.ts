import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivitiesServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
