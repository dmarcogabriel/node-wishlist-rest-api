const service = require('../services/products');
const validator = require('../utils/validator');
const repository = require('../repository/products');
const { favoriteProduct } = require('../policies/favoriteProduct');

exports.get = async (_, res) => {
  try {
    const { page, products } = await service.find();
    res.json({
      message: 'Products loaded successfully',
      data: {
        page,
        products,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const invalidParams = validator.validatePresence(req.params, ['id']);
    if (invalidParams) {
      res.status(400).json({
        error: invalidParams,
      });
    } else {
      const product = await service.findById(req.params.id);
      res.status(200).json({
        message: 'Product loaded successfully',
        data: product,
      });
    }
  } catch (error) {
    if (error.response) {
      const { response } = error;
      res.status(response.status || 404).json({
        error: response.data.error_message || 'Product not found',
      });
    } else {
      res.status(500).json({
        error: error.message,
      });
    }
  }
};

exports.getByUserId = async (req, res) => {
  try {
    const invalidParams = validator.validatePresence(req.params, ['userId']);
    if (invalidParams) {
      res.status(400).json({
        error: invalidParams,
      });
    } else {
      const product = await service.findById(req.params.id);
      res.status(200).json({
        message: 'Product loaded successfully',
        data: product,
      });
    }
  } catch (error) {
    if (error.response) {
      const { response } = error;
      res.status(response.status || 404).json({
        error: response.data.error_message || 'Product not found',
      });
    } else {
      res.status(500).json({
        error: error.message,
      });
    }
  }
};

exports.post = async (req, res) => {
  try {
    const params = ['title', 'image', 'price', 'userId', 'sku'];
    const invalidBody = validator.validatePresence(req.body, params);
    if (invalidBody) {
      res.status(400).json({
        error: invalidBody,
      });
    } else {
      const favoritedProducts = await repository.findByUserId(req.body.userId);
      const errorMessage = favoriteProduct(req.body.sku, favoritedProducts);
      if (errorMessage) {
        res.status(400).json({
          error: errorMessage,
        });
      } else {
        const product = await repository.create(req.body);
        res.status(201).json({
          message: 'Product created successfully',
          data: product,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
