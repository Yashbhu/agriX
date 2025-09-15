'use strict';

const { Contract } = require('fabric-contract-api');

class RetailContract extends Contract {
    constructor() {
        super('RetailContract');
    }

    async stockProduct(ctx, batchId, retailerName) {
        const batchBytes = await ctx.stub.getState(batchId);
        if (!batchBytes || batchBytes.length === 0) {
            throw new Error(`Batch ${batchId} does not exist`);
        }
        const batch = JSON.parse(batchBytes.toString());
        batch.status = 'IN_STORE';
        batch.retailer = retailerName;
        batch.stockedAt = new Date().toISOString();
        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)));
        return JSON.stringify(batch);
    }

    async sellProduct(ctx, batchId, consumerId) {
        const batchBytes = await ctx.stub.getState(batchId);
        if (!batchBytes || batchBytes.length === 0) {
            throw new Error(`Batch ${batchId} does not exist`);
        }
        const batch = JSON.parse(batchBytes.toString());
        batch.status = 'SOLD';
        batch.consumerId = consumerId;
        batch.soldAt = new Date().toISOString();
        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)));
        return JSON.stringify(batch);
    }
}

module.exports = RetailContract;
