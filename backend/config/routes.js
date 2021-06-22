const express = require('express');
const auth = require('./auth');

module.exports = function (server) {
  /**
   * Open routes
   */
  const openApi = express.Router();
  server.use('/oapi', openApi);

  const AuthService = require('../api/user/auth-service');
  openApi.post('/login', AuthService.login);
  openApi.post('/signup', AuthService.signup);
  openApi.post('/validate-token', AuthService.validateToken);

  /**
   * Protected routes
   */
  const protectedApi = express.Router();
  server.use('/api', protectedApi);

  protectedApi.use(auth);

  const billingCycleService = require('../api/billing-cycle/billing-cycle-service');
  billingCycleService.register(protectedApi, '/billing-cycles')

  const billingSummaryService = require('../api/billing-summary/billing-summary');
  protectedApi.route('/billing-summary').get(billingSummaryService.getSummary);
}