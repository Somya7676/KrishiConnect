
import Product from '../models/Product.js'
import mongoose from 'mongoose'

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      price,
      quantity,
      location,
      sellerPhone,
    } = req.body

    const uploadedImages = (req.files || []).map(
  (file) => `/uploads/${file.filename}`
)


    // Validate required fields
    if (
      !name ||
      !category ||
      !description ||
      price === undefined ||
      !quantity ||
      !location ||
      !sellerPhone
    ) {
      return res.status(400).json({
        success: false,
        message: 'All required product fields must be provided.',
      })
    }

    const numericPrice = Number(price)

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid product price.',
      })
    }

   

    // Create product with authenticated seller ID
    const product = await Product.create({
      name,
      category,
      description,
      price: numericPrice,
      quantity,
      location,
      sellerPhone,
      images: uploadedImages,
      sellerId: req.user.id,
    })

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product,
    })
  } catch (error) {
    console.error('Create product error:', error.message)

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
      })
    }

    return res.status(500).json({
      success: false,
      message: 'Unable to create product.',
    })
  }
}

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      search,
      page = '1',
      limit = '12',
    } = req.query

    const filter = { status: 'active' }

    if (category) {
      const allowedCategories = [
        'equipment',
        'livestock',
        'seeds',
        'agro-shops',
      ]

      if (!allowedCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid product category.',
        })
      }

      filter.category = category
    }

    if (search && search.trim()) {
      const safeSearch = search.trim().replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      )

      filter.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
      ]
    }

    const pageNumber = Math.max(1, parseInt(page, 10) || 1)
    const limitNumber = Math.min(
      50,
      Math.max(1, parseInt(limit, 10) || 12)
    )

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('sellerId', 'fullName role')
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),

      Product.countDocuments(filter),
    ])

    return res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      products,
    })
  } catch (error) {
    console.error('Get products error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch products.',
    })
  }
}

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID.',
      })
    }

    const product = await Product.findById(id)
      .populate('sellerId', 'fullName role')

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      })
    }

    return res.status(200).json({
      success: true,
      product,
    })
  } catch (error) {
    console.error('Get product error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch product.',
    })
  }
}




 // UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID.',
      })
    }

    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      })
    }

    // Only the product owner can update it
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You cannot update another seller product.',
      })
    }

    const allowedFields = [
      'name',
      'category',
      'description',
      'price',
      'quantity',
      'location',
      'sellerPhone',
      'images',
      'status',
    ]

    for (const field of allowedFields) {
      if (Object.hasOwn(req.body, field)) {
        product[field] = req.body[field]
      }
    }

    await product.save()

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product,
    })
  } catch (error) {
    console.error('Update product error:', error.message)

    return res.status(
      error.name === 'ValidationError' ? 400 : 500
    ).json({
      success: false,
      message: 'Unable to update product.',
    })
  }
}

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID.',
      })
    }

    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      })
    }

    // Only the product owner can delete it
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You cannot delete another seller product.',
      })
    }

    await product.deleteOne()

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    })
  } catch (error) {
    console.error('Delete product error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete product.',
    })
  }
}



// GET LOGGED-IN SELLER'S PRODUCTS
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      sellerId: req.user.id,
    }).sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      total: products.length,
      products,
    })
  } catch (error) {
    console.error('Get my products error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch your products.',
    })
  }
}