
import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: 120,
    },

    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['equipment', 'livestock', 'seeds', 'agro-shops'],
    },

    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: 3000,
    },

    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0,
    },

    quantity: {
      type: String,
      required: [true, 'Product quantity is required'],
      trim: true,
    },

    location: {
      type: String,
      required: [true, 'Product location is required'],
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    sellerPhone: {
      type: String,
      required: [true, 'Seller phone is required'],
      trim: true,
    },

    status: {
      type: String,
      enum: ['active', 'sold', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
)

const Product =
  mongoose.models.Product ||
  mongoose.model('Product', productSchema)

export default Product
