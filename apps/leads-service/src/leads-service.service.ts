import { Injectable } from '@nestjs/common';

@Injectable()
export class LeadsServiceService {
  getHello(): string {
    return 'Leads Service is running! Use /api for Swagger documentation.';
  }
}
