'use strict';

const { Contract } = require('fabric-contract-api');

class DistributionContract extends Contract {
    constructor() {
        super('DistributionContract');
    }

    async shipProduct(ctx, batchId, distributorName) {
        const harvestBytes = await ctx.stub.getState(batchId);
        if (!harvestBytes || harvestBytes.length === 0) {
            throw new Error(`Batch ${batchId} does not exist`);
        }
        const harvest = JSON.parse(harvestBytes.toString());
        harvest.status = 'SHIPPED';
        harvest.distributor = distributorName;
        harvest.shippedAt = new Date().toISOString();
        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(harvest)));
        return JSON.stringify(harvest);
    }

    async deliverProduct(ctx, batchId, receiverName) {
        const harvestBytes = await ctx.stub.getState(batchId);
        if (!harvestBytes || harvestBytes.length === 0) {
            throw new Error(`Batch ${batchId} does not exist`);
        }
        const harvest = JSON.parse(harvestBytes.toString());
        harvest.status = 'DELIVERED';
        harvest.receiver = receiverName;
        harvest.deliveredAt = new Date().toISOString();
        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(harvest)));
        return JSON.stringify(harvest);
    }
}

module.exports = DistributionContract;
