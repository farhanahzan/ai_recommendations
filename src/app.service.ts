import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async getWooCommerceProducts() {
    // Replace 'wpet_posts' with your actual table prefix
    return this.dataSource.query(`
      SELECT p.ID, p.post_type, p.post_status, p.post_title, pm1.meta_value AS price, pm2.meta_value AS sku
      FROM wpet_posts p
      JOIN wpet_postmeta pm1 ON p.ID = pm1.post_id AND pm1.meta_key = '_price'
      JOIN wpet_postmeta pm2 ON p.ID = pm2.post_id AND pm2.meta_key = '_sku'
      WHERE p.post_type = 'product' AND p.post_status = 'publish'
      LIMIT 10

    `);
  }
  async getSimilarProductIds(productIds: number[]): Promise<number[]> {
    if (!productIds.length) return [];

    const idsStr = [...new Set(productIds)].join(',');

    // Step 1: Get category/tag term_taxonomy_ids of these products
    const termIdsResult = await this.dataSource.query(`
      SELECT term_taxonomy_id
      FROM wpet_term_relationships
      WHERE object_id IN (${idsStr})
    `);

    const termIds = termIdsResult.map((row: any) => row.term_taxonomy_id);
    if (!termIds.length) return [];

    const termStr = termIds.join(',');

    // Step 2: Get other product IDs with same terms (exclude input products)
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

    return similarProducts.map((p: any) => p.object_id);
  }
}
