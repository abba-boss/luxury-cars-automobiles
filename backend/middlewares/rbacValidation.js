const { body, param } = require('express-validator');

const updateUserRoleValidation = [
  param('userId')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  
  body('role')
    .isIn(['user', 'admin'])
    .withMessage('Role must be either "user" or "admin"')
];

module.exports = {
  updateUserRoleValidation
};
