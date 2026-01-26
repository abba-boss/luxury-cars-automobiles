const { body, param, query, validationResult } = require('express-validator');
const { User, Vehicle, Brand, Sale, Inquiry } = require('../models');

// Validation rules for user registration
const validateRegistration = [
  body('full_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
    .custom(async (value) => {
      const existingUser = await User.findOne({ where: { email: value } });
      if (existingUser) {
        throw new Error('Email already in use');
      }
      return true;
    }),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
];

// Validation rules for user login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Validation rules for vehicle creation/update
const validateVehicle = [
  body('make')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Make is required and must be less than 50 characters'),
  
  body('model')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Model is required and must be less than 50 characters'),
  
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage(`Year must be between 1900 and ${new Date().getFullYear() + 1}`),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('mileage')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Mileage must be a positive number'),
  
  body('condition')
    .isIn(['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Poor'])
    .withMessage('Condition must be one of: New, Like New, Excellent, Good, Fair, Poor'),
  
  body('transmission')
    .isIn(['Automatic', 'Manual'])
    .withMessage('Transmission must be either Automatic or Manual'),
  
  body('fuel_type')
    .isIn(['Gasoline', 'Diesel', 'Electric', 'Hybrid'])
    .withMessage('Fuel type must be Gasoline, Diesel, Electric, or Hybrid'),
  
  body('color')
    .trim()
    .isLength({ max: 30 })
    .withMessage('Color must be less than 30 characters'),
  
  body('vin')
    .optional()
    .trim()
    .isLength({ min: 17, max: 17 })
    .withMessage('VIN must be exactly 17 characters')
    .matches(/^[A-HJ-NPR-Z0-9]+$/i)
    .withMessage('VIN contains invalid characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
];

// Validation rules for brand management
const validateBrand = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Brand name must be between 2 and 100 characters')
    .custom(async (value, { req }) => {
      // Check for duplicates only on creation
      if (req.method === 'POST') {
        const existingBrand = await Brand.findOne({ where: { name: value } });
        if (existingBrand) {
          throw new Error('Brand name already exists');
        }
      }
      // On update, check if name is being changed and if it conflicts
      else if (req.method === 'PUT' && req.params.id) {
        const existingBrand = await Brand.findOne({
          where: { 
            name: value,
            id: { [require('sequelize').Op.ne]: req.params.id }
          }
        });
        if (existingBrand) {
          throw new Error('Brand name already exists');
        }
      }
      return true;
    }),
  
  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL'),
];

// Validation rules for sales/orders
const validateSale = [
  body('vehicle_id')
    .isInt({ min: 1 })
    .withMessage('Valid vehicle ID is required')
    .custom(async (value) => {
      const vehicle = await Vehicle.findByPk(value);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }
      if (vehicle.status !== 'available') {
        throw new Error('Vehicle is not available for purchase');
      }
      return true;
    }),
  
  body('customer_info')
    .isObject()
    .withMessage('Customer information is required'),
  
  body('customer_info.first_name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be less than 50 characters'),
  
  body('customer_info.last_name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be less than 50 characters'),
  
  body('customer_info.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('customer_info.phone')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('customer_info.address')
    .isObject()
    .withMessage('Address information is required'),
  
  body('customer_info.address.street')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Street address is required and must be between 5 and 200 characters'),
  
  body('customer_info.address.city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City is required and must be between 2 and 100 characters'),
  
  body('customer_info.address.state')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('State is required and must be between 2 and 100 characters'),
  
  body('customer_info.address.zip_code')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('ZIP code is required and must be between 3 and 10 characters'),
  
  body('payment_method')
    .isIn(['cash', 'finance', 'lease', 'credit_card'])
    .withMessage('Payment method must be cash, finance, lease, or credit_card'),
];

// Validation rules for inquiries
const validateInquiry = [
  body('vehicle_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Vehicle ID must be a valid integer'),

  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),

  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
];

// Validation rules for profile updates
const updateProfileValidation = [
  body('full_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),

  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
];

// Generic validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateVehicle,
  validateBrand,
  validateSale,
  validateInquiry,
  updateProfileValidation,
  handleValidationErrors
};