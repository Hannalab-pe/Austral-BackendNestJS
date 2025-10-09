import { Controller, All, Req, Res, Param, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from '../services/proxy.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @UseGuards(JwtAuthGuard)
  @All('auth/*')
  async proxyAuth(@Req() req: Request, @Res() res: Response) {
    const path = req.path.replace('/auth', '');
    const result = await this.proxyService.forwardRequest(
      'auth',
      req.method,
      path,
      req.body,
      req.headers,
      req.query,
    );
    res.json(result);
  }

  @UseGuards(JwtAuthGuard)
  @All('leads/*')
  async proxyLeads(@Req() req: Request, @Res() res: Response) {
    const path = req.path.replace('/leads', '');
    const result = await this.proxyService.forwardRequest(
      'leads',
      req.method,
      path,
      req.body,
      req.headers,
      req.query,
    );
    res.json(result);
  }

  @UseGuards(JwtAuthGuard)
  @All('clients/*')
  async proxyClients(@Req() req: Request, @Res() res: Response) {
    const path = req.path.replace('/clients', '');
    const result = await this.proxyService.forwardRequest(
      'clients',
      req.method,
      path,
      req.body,
      req.headers,
      req.query,
    );
    res.json(result);
  }

  @UseGuards(JwtAuthGuard)
  @All('products/*')
  async proxyProducts(@Req() req: Request, @Res() res: Response) {
    const path = req.path.replace('/products', '');
    const result = await this.proxyService.forwardRequest(
      'products',
      req.method,
      path,
      req.body,
      req.headers,
      req.query,
    );
    res.json(result);
  }

  @UseGuards(JwtAuthGuard)
  @All('activities/*')
  async proxyActivities(@Req() req: Request, @Res() res: Response) {
    const path = req.path.replace('/activities', '');
    const result = await this.proxyService.forwardRequest(
      'activities',
      req.method,
      path,
      req.body,
      req.headers,
      req.query,
    );
    res.json(result);
  }

  @UseGuards(JwtAuthGuard)
  @All('tasks/*')
  async proxyTasks(@Req() req: Request, @Res() res: Response) {
    const path = req.path.replace('/tasks', '');
    const result = await this.proxyService.forwardRequest(
      'tasks',
      req.method,
      path,
      req.body,
      req.headers,
      req.query,
    );
    res.json(result);
  }

  @UseGuards(JwtAuthGuard)
  @All('notifications/*')
  async proxyNotifications(@Req() req: Request, @Res() res: Response) {
    const path = req.path.replace('/notifications', '');
    const result = await this.proxyService.forwardRequest(
      'notifications',
      req.method,
      path,
      req.body,
      req.headers,
      req.query,
    );
    res.json(result);
  }
}
