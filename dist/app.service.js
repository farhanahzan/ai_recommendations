"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AppService = class AppService {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async getWooCommerceProducts() {
        return this.dataSource.query(`
      SELECT p.ID, p.post_type, p.post_status, p.post_title, pm1.meta_value AS price, pm2.meta_value AS sku
      FROM wpet_posts p
      JOIN wpet_postmeta pm1 ON p.ID = pm1.post_id AND pm1.meta_key = '_price'
      JOIN wpet_postmeta pm2 ON p.ID = pm2.post_id AND pm2.meta_key = '_sku'
      WHERE p.post_type = 'product' AND p.post_status = 'publish'
      LIMIT 10

    `);
    }
    async getSimilarProductIds(productIds) {
        if (!productIds.length)
            return [];
        const idsStr = [...new Set(productIds)].join(',');
        const termIdsResult = await this.dataSource.query(`
      SELECT term_taxonomy_id
      FROM wpet_term_relationships
      WHERE object_id IN (${idsStr})
    `);
        const termIds = termIdsResult.map((row) => row.term_taxonomy_id);
        if (!termIds.length)
            return [];
        const termStr = termIds.join(',');
        const similarProducts = await this.dataSource.query(`
      SELECT tr.object_id
      FROM wpet_term_relationships tr
      JOIN wpet_posts p ON p.ID = tr.object_id
      WHERE tr.term_taxonomy_id IN (${termStr})
        AND tr.object_id NOT IN (${idsStr})
        AND p.post_type = 'product'
        AND p.post_status = 'publish'
      GROUP BY tr.object_id
      ORDER BY COUNT(*) DESC
      LIMIT 10
    `);
        return similarProducts.map((p) => p.object_id);
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AppService);
//# sourceMappingURL=app.service.js.map