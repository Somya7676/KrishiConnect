
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      maxlength: 128,
      select: false,
    },

    role: {
      type: String,
      required: [true, 'User role is required'],
      enum: ['farmer', 'buyer', 'seller', 'vendor'],
      default: 'farmer',
    },
  },
  {
    timestamps: true,
  }
)

// Hash password before saving the user
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return

  this.password = await bcrypt.hash(this.password, 12)
})

// Verify password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
