import { DataSource } from 'typeorm';
export declare class AppService {
    private dataSource;
    constructor(dataSource: DataSource);
    getWooCommerceProducts(): Promise<any>;
    getSimilarProductIds(productIds: number[]): Promise<number[]>;
}
