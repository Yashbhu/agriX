'use strict';

const { Contract } = require('fabric-contract-api');

class ConsumerContract extends Contract {
    constructor() {
        super('ConsumerContract');
    }

    async verifyProduct(ctx, batchId) {
        const batchBytes = await ctx.stub.getState(batchId);
        if (!batchBytes || batchBytes.length === 0) {
            throw new Error(`Batch ${batchId} not found`);
        }
        const batch = JSON.parse(batchBytes.toString());
        return JSON.stringify({
            batchId: batch.batchId,
            farmerName: batch.farmerName,
            cropType: batch.cropType,
            status: batch.status,
            qualityCertHash: batch.qualityCertHash,
            lastUpdated: batch.soldAt || batch.deliveredAt || batch.shippedAt || batch.createdAt,
        });
    }
}

module.exports = ConsumerContract;
