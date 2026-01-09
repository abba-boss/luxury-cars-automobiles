const { Cart, CartItem, Vehicle } = require('../models');
const { validationResult } = require('express-validator');

// Get user's cart
const getUserCart = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    // Find or create user's cart
    let cart = await Cart.findOne({
      where: { user_id }
    });

    if (!cart) {
      cart = await Cart.create({ user_id });
    }

    // Get cart items with vehicle details
    const cartItems = await CartItem.findAll({
      where: { cart_id: cart.id },
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'make', 'model', 'year', 'price', 'images', 'status']
        }
      ],
      order: [['created_at', 'ASC']]
    });

    // Calculate totals
    let subtotal = 0;
    let itemCount = 0;
    
    cartItems.forEach(item => {
      subtotal += parseFloat(item.price) * item.quantity;
      itemCount += item.quantity;
    });

    res.json({
      success: true,
      data: {
        cart: {
          id: cart.id,
          user_id: cart.user_id,
          created_at: cart.created_at,
          updated_at: cart.updated_at
        },
        items: cartItems,
        totals: {
          subtotal: subtotal,
          itemCount: itemCount
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Add item to cart
const addItemToCart = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { vehicle_id, quantity = 1 } = req.body;
    const user_id = req.user.id;

    // Find or create user's cart
    let cart = await Cart.findOne({
      where: { user_id }
    });

    if (!cart) {
      cart = await Cart.create({ user_id });
    }

    // Check if vehicle exists and is available
    const vehicle = await Vehicle.findByPk(vehicle_id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    if (vehicle.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Vehicle is not available for purchase'
      });
    }

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: { cart_id: cart.id, vehicle_id }
    });

    if (cartItem) {
      // Update quantity if item exists
      cartItem = await cartItem.update({
        quantity: cartItem.quantity + quantity,
        price: vehicle.price
      });
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        cart_id: cart.id,
        vehicle_id,
        quantity,
        price: vehicle.price
      });
    }

    // Get updated cart with items
    const updatedCartItems = await CartItem.findAll({
      where: { cart_id: cart.id },
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'make', 'model', 'year', 'price', 'images', 'status']
        }
      ]
    });

    // Calculate totals
    let subtotal = 0;
    updatedCartItems.forEach(item => {
      subtotal += parseFloat(item.price) * item.quantity;
    });

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: {
        cart: {
          id: cart.id,
          user_id: cart.user_id
        },
        items: updatedCartItems,
        totals: {
          subtotal: subtotal,
          itemCount: updatedCartItems.reduce((sum, item) => sum + item.quantity, 0)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update cart item quantity
const updateCartItem = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params; // cart item id
    const { quantity } = req.body;
    const user_id = req.user.id;

    // Find the cart item
    const cartItem = await CartItem.findOne({
      where: { id },
      include: [
        {
          model: Cart,
          as: 'cart',
          where: { user_id }
        }
      ]
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found or unauthorized'
      });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await cartItem.destroy();
    } else {
      // Update quantity
      await cartItem.update({ quantity });
    }

    // Get updated cart with items
    const cart = await Cart.findOne({
      where: { user_id }
    });

    const updatedCartItems = await CartItem.findAll({
      where: { cart_id: cart.id },
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'make', 'model', 'year', 'price', 'images', 'status']
        }
      ]
    });

    // Calculate totals
    let subtotal = 0;
    updatedCartItems.forEach(item => {
      subtotal += parseFloat(item.price) * item.quantity;
    });

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: {
        cart: {
          id: cart.id,
          user_id: cart.user_id
        },
        items: updatedCartItems,
        totals: {
          subtotal: subtotal,
          itemCount: updatedCartItems.reduce((sum, item) => sum + item.quantity, 0)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Remove item from cart
const removeCartItem = async (req, res, next) => {
  try {
    const { id } = req.params; // cart item id
    const user_id = req.user.id;

    const cartItem = await CartItem.findOne({
      where: { id },
      include: [
        {
          model: Cart,
          as: 'cart',
          where: { user_id }
        }
      ]
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found or unauthorized'
      });
    }

    await cartItem.destroy();

    // Get updated cart with items
    const cart = await Cart.findOne({
      where: { user_id }
    });

    const updatedCartItems = await CartItem.findAll({
      where: { cart_id: cart.id },
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'make', 'model', 'year', 'price', 'images', 'status']
        }
      ]
    });

    // Calculate totals
    let subtotal = 0;
    updatedCartItems.forEach(item => {
      subtotal += parseFloat(item.price) * item.quantity;
    });

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: {
        cart: {
          id: cart.id,
          user_id: cart.user_id
        },
        items: updatedCartItems,
        totals: {
          subtotal: subtotal,
          itemCount: updatedCartItems.reduce((sum, item) => sum + item.quantity, 0)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Clear cart
const clearCart = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const cart = await Cart.findOne({
      where: { user_id }
    });

    if (!cart) {
      return res.json({
        success: true,
        message: 'Cart is already empty',
        data: {
          cart: null,
          items: [],
          totals: {
            subtotal: 0,
            itemCount: 0
          }
        }
      });
    }

    // Remove all items from cart
    await CartItem.destroy({
      where: { cart_id: cart.id }
    });

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        cart: {
          id: cart.id,
          user_id: cart.user_id
        },
        items: [],
        totals: {
          subtotal: 0,
          itemCount: 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};