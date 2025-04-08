import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('products')
  getPosts(): {} {
    return this.appService.getWooCommerceProducts();
  }

  @Post('recommend')
  getSimilarProductIds(@Body() body: { productIds: number[] }): {} {
    return this.appService.getSimilarProductIds(body.productIds);
  }
}
