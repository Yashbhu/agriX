'use strict';

const HarvestContract = require('./contracts/harvest');
const DistributionContract = require('./contracts/distribution');
const RetailContract = require('./contracts/retail');
const ConsumerContract = require('./contracts/consumer');

module.exports.contracts = [
  HarvestContract,
  DistributionContract,
  RetailContract,
  ConsumerContract
];
