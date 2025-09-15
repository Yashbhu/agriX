'use strict';

const { Contract } = require('fabric-contract-api');

class HarvestContract extends Contract {
    constructor() {
        super('HarvestContract');
    }

    async createHarvest(ctx, batchId, farmerName, cropType, quantity, qualityCertHash) {
        const exists = await ctx.stub.getState(batchId);
        if (exists && exists.length > 0) {
            throw new Error(`Batch ${batchId} already exists`);
        }
        const harvest = {
            batchId,
            farmerName,
            cropType,
            quantity,
            qualityCertHash,
            status: 'HARVESTED',
            createdAt: new Date().toISOString(),
        };
        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(harvest)));
        return JSON.stringify(harvest);
    }

    async readHarvest(ctx, batchId) {
        const harvestBytes = await ctx.stub.getState(batchId);
        if (!harvestBytes || harvestBytes.length === 0) {
            throw new Error(`Harvest batch ${batchId} does not exist`);
        }
        return harvestBytes.toString();
    }
}

module.exports = HarvestContract;
