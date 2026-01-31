const { body, query } = require('express-validator');

// Validation for staff vehicle creation
const staffVehicleValidation = [
  body('make')
    .notEmpty().withMessage('Make is required')
    .isLength({ min: 2, max: 100 }).withMessage('Make must be between 2 and 100 characters'),
  
  body('model')
    .notEmpty().withMessage('Model is required')
    .isLength({ min: 1, max: 100 }).withMessage('Model must be between 1 and 100 characters'),
  
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Valid year is required'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Valid price is required'),
  
  body('condition')
    .isIn(['Tokunbo', 'Nigerian Used', 'Brand New'])
    .withMessage('Valid condition is required'),
  
  body('mileage').optional().isInt({ min: 0 }).withMessage('Mileage must be a non-negative integer'),
  
  body('fuel_type').optional().isIn(['Petrol', 'Diesel', 'Hybrid', 'Electric']).withMessage('Invalid fuel type'),
  
  body('transmission').optional().isIn(['Automatic', 'Manual']).withMessage('Invalid transmission type'),
  
  body('body_type').optional().isLength({ max: 50 }).withMessage('Body type must be less than 50 characters'),
  
  body('color').optional().isLength({ max: 50 }).withMessage('Color must be less than 50 characters'),
  
  body('description').optional().isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
  
  body('features').optional().isArray().withMessage('Features must be an array'),
  
  body('images').optional().isArray().withMessage('Images must be an array'),
  
  body('videos').optional().isArray().withMessage('Videos must be an array'),
  
  body('is_verified').optional().isBoolean().withMessage('is_verified must be a boolean'),
  
  body('is_featured').optional().isBoolean().withMessage('is_featured must be a boolean'),
  
  body('is_hot_deal').optional().isBoolean().withMessage('is_hot_deal must be a boolean'),
  
  body('brand_id').optional().isInt({ min: 1 }).withMessage('Brand ID must be a positive integer'),
  
  body('acceleration').optional().matches(/^\d+(\.\d+)?s?$/).withMessage('Invalid acceleration format (e.g., "5.8s")'),
  
  body('top_speed').optional().matches(/^\d+\s*(mph|km\/h)$/).withMessage('Invalid top speed format (e.g., "155 mph")'),
  
  body('power').optional().matches(/^\d+\s*(hp|PS|kW)$/).withMessage('Invalid power format (e.g., "335 hp")'),
  
  body('torque').optional().matches(/^\d+\s*(lb-ft|Nm)$/).withMessage('Invalid torque format (e.g., "368 lb-ft")')
];

// Validation for staff vehicle updates
const staffVehicleUpdateValidation = [
  body('make').optional()
    .isLength({ min: 2, max: 100 }).withMessage('Make must be between 2 and 100 characters'),
  
  body('model').optional()
    .isLength({ min: 1, max: 100 }).withMessage('Model must be between 1 and 100 characters'),
  
  body('year').optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Valid year is required'),
  
  body('price').optional()
    .isFloat({ min: 0 })
    .withMessage('Valid price is required'),
  
  body('condition').optional()
    .isIn(['Tokunbo', 'Nigerian Used', 'Brand New'])
    .withMessage('Valid condition is required'),
  
  body('mileage').optional().isInt({ min: 0 }).withMessage('Mileage must be a non-negative integer'),
  
  body('fuel_type').optional().isIn(['Petrol', 'Diesel', 'Hybrid', 'Electric']).withMessage('Invalid fuel type'),
  
  body('transmission').optional().isIn(['Automatic', 'Manual']).withMessage('Invalid transmission type'),
  
  body('body_type').optional().isLength({ max: 50 }).withMessage('Body type must be less than 50 characters'),
  
  body('color').optional().isLength({ max: 50 }).withMessage('Color must be less than 50 characters'),
  
  body('description').optional().isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
  
  body('features').optional().isArray().withMessage('Features must be an array'),
  
  body('images').optional().isArray().withMessage('Images must be an array'),
  
  body('videos').optional().isArray().withMessage('Videos must be an array'),
  
  body('is_verified').optional().isBoolean().withMessage('is_verified must be a boolean'),
  
  body('is_featured').optional().isBoolean().withMessage('is_featured must be a boolean'),
  
  body('is_hot_deal').optional().isBoolean().withMessage('is_hot_deal must be a boolean'),
  
  body('status').optional()
    .isIn(['available', 'sold', 'reserved', 'inactive', 'pending_approval'])
    .withMessage('Invalid status'),
  
  body('brand_id').optional().isInt({ min: 1 }).withMessage('Brand ID must be a positive integer'),
  
  body('acceleration').optional().matches(/^\d+(\.\d+)?s?$/).withMessage('Invalid acceleration format (e.g., "5.8s")'),
  
  body('top_speed').optional().matches(/^\d+\s*(mph|km\/h)$/).withMessage('Invalid top speed format (e.g., "155 mph")'),
  
  body('power').optional().matches(/^\d+\s*(hp|PS|kW)$/).withMessage('Invalid power format (e.g., "335 hp")'),
  
  body('torque').optional().matches(/^\d+\s*(lb-ft|Nm)$/).withMessage('Invalid torque format (e.g., "368 lb-ft")')
];

module.exports = {
  staffVehicleValidation,
  staffVehicleUpdateValidation
};