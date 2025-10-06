import { Injectable } from '@nestjs/common';

@Injectable()
export class LeadsServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
