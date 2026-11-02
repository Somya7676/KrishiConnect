import { useState, useEffect } from 'react'

import {
  Link,
  Routes,
  Route,
  useParams,
  useNavigate,
    Navigate,
} from 'react-router-dom'

import {
  Leaf, Tractor, Beef, Sprout, Store, Search,
  ArrowRight, CheckCircle2, Phone, MessageCircle
} from 'lucide-react'

const categories = [
  { icon: Tractor, title: 'Farm Equipment', desc: 'Tractors, tools & machinery', path: '/equipment' },
  { icon: Beef, title: 'Livestock', desc: 'Cows, buffaloes & more', path: '/livestock' },
  { icon: Sprout, title: 'Seeds', desc: 'Quality seeds for every crop', path: '/seeds' },
  { icon: Store, title: 'Agro Shops', desc: 'Fertilizers & farming supplies', path: '/agro-shops' },
]



const products = [
  {
    id: 'tractor',
    image: '/images/tractor.jpg',
    name: 'Farm Tractors',
    type: 'Agricultural Equipment',
    path: '/equipment',
  },
  {
    id: 'harvester',
    image: '/images/harvester.jpg',
    name: 'Harvesters',
    type: 'Agricultural Machinery',
    path: '/equipment',
  },
  {
    id: 'cow',
    image: '/images/cow.jpg',
    name: 'Healthy Livestock',
    type: 'Cattle & Animals',
    path: '/livestock',
  },
  {
    id: 'buffalo',
    image: '/images/buffalo.jpg',
    name: 'Buffaloes',
    type: 'Livestock',
    path: '/livestock',
  },
  {
    id: 'seeds',
    image: '/images/seeds.jpg',
    name: 'Quality Seeds',
    type: 'Seeds & Crops',
    path: '/seeds',
  },
  {
    id: 'agro-supplies',
    image: '/images/agro-shop.jpg',
    name: 'Agro Supplies',
    type: 'Agricultural Products',
    path: '/agro-shops',
  },
]


const categoryDetails = {
  '/equipment': {
    title: 'Farm Equipment',
    description: 'Explore agricultural machinery, tools and equipment for your farming needs.',
    icon: Tractor,
    items: ['Tractors', 'Harvesters', 'Cultivators', 'Water Pumps', 'Sprayers', 'Hand Tools'],
  },
  '/livestock': {
    title: 'Livestock',
    description: 'Explore livestock categories for farmers and animal breeders.',
    icon: Beef,
    items: ['Cows', 'Buffaloes', 'Goats', 'Sheep', 'Bullocks', 'Poultry'],
  },
  '/seeds': {
    title: 'Seeds',
    description: 'Explore seeds for different crops and agricultural seasons.',
    icon: Sprout,
    items: ['Wheat Seeds', 'Rice Seeds', 'Maize Seeds', 'Vegetable Seeds', 'Pulses', 'Oil Seeds'],
  },
  '/agro-shops': {
    title: 'Agro Shops',
    description: 'Find agricultural supplies and products for your farm.',
    icon: Store,
    items: ['Fertilizers', 'Organic Manure', 'Farm Tools', 'Irrigation Supplies', 'Plant Care', 'Crop Supplies'],
  },
}


function Navbar() {
  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const token = sessionStorage.getItem('krishiconnect_token')

    if (!token) {
      setAuthChecked(true)
      return
    }

    let active = true

    const fetchUser = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/auth/me',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error('Session expired. Please login again.')
        }

        if (active) {
          setCurrentUser(data.user)
        }
      } catch (error) {
        sessionStorage.removeItem('krishiconnect_token')

        if (active) {
          setCurrentUser(null)
        }
      } finally {
        if (active) {
          setAuthChecked(true)
        }
      }
    }

    fetchUser()

    return () => {
      active = false
    }
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('krishiconnect_token')
    setCurrentUser(null)
    navigate('/login')
  }

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <Leaf className="brand-icon" />
        <span>
          Krishi<span className="brand-green">Connect</span>
        </span>
      </Link>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <a href="/#categories">Categories</a>
        <a href="/#marketplace">Marketplace</a>
        <a href="/#about">About</a>
      </nav>

      <div className="nav-actions">
        {authChecked && currentUser ? (
          <>

          <Link className="login-btn" to="/my-products">
  My Products
</Link>




            <span className="nav-user">
              Hi, {currentUser.fullName}
            </span>

            <button
              className="login-btn"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="login-btn" to="/login">
              Login
            </Link>

            <Link className="login-btn" to="/register">
              Register
            </Link>
          </>
        )}

        <Link className="sell-btn" to="/sell">
          + Sell Product
        </Link>
      </div>
    </header>
  )
}




<Route
  path="/my-products"
  element={
    <ProtectedRoute allowedRoles={['farmer', 'seller', 'vendor']}>
      <MyProductsPage />
    </ProtectedRoute>
  }
/>









function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [marketplaceProducts, setMarketplaceProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [productLoadError, setProductLoadError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadProducts = async () => {
      try {
        setIsLoadingProducts(true)
        setProductLoadError('')

        const response = await fetch(
          'http://localhost:5000/api/products',
          { signal: controller.signal }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Unable to fetch products.')
        }

        setMarketplaceProducts(
          Array.isArray(data.products) ? data.products : []
        )
      } catch (error) {
        if (error.name !== 'AbortError') {
          setProductLoadError(error.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingProducts(false)
        }
      }
    }

    loadProducts()

    return () => controller.abort()
  }, [])

  const categoryLabels = {
    equipment: 'Farm Equipment',
    livestock: 'Livestock',
    seeds: 'Seeds',
    'agro-shops': 'Agro Supplies',
  }

  const filteredProducts = marketplaceProducts
    .filter((product) =>
      `${product.name} ${categoryLabels[product.category] || product.category}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .map((product) => ({
      id: product._id,
      name: product.name,
      type: categoryLabels[product.category] || product.category,
      image: product.images?.[0]
        ? `http://localhost:5000${product.images[0]}`
        : null,
    }))






  return (
    <main>
      <section className="hero" id="home">
        <div className="hero-content">
          <span className="hero-label">YOUR FARM. YOUR MARKET. YOUR COMMUNITY.</span>
          <h1>Growing Together,<br /><span>Connecting Farmers.</span></h1>
          <p>
            Discover farming equipment, livestock, seeds and local
            agricultural services — all in one place.
          </p>

          <div className="search-box">
            <Search />
            
            <input
              type="text"
              placeholder="Search tractors, seeds, livestock..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' })}>
              Search
            </button>

          </div>

          <div className="hero-note">
            <CheckCircle2 /> Connecting farmers, buyers and local vendors
          </div>
        </div>

        <div className="hero-art">
          <div className="hero-circle"><Sprout /></div>
          <div className="floating-card">
            <Sprout />
            <div>
              <strong>Better Farming</strong>
              <small>Stronger Communities</small>
            </div>
          </div>
        </div>
      </section>

      <section className="categories section" id="categories">
        <div className="section-heading">
          <div>
            <span className="section-label">EXPLORE KRISHICONNECT</span>
            <h2>Everything Farmers Need</h2>
            <p>Find the right products and services for your farm.</p>
          </div>
          <a href="#marketplace">Explore all <ArrowRight /></a>
        </div>

        <div className="category-grid">
          {categories.map((item) => {
            const Icon = item.icon
            return (
              <Link className="category-card" to={item.path} key={item.title}>
                <Icon className="category-icon" />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <span className="card-arrow">Explore <ArrowRight /></span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="marketplace section" id="marketplace">
        <div className="section-heading">
          <div>
            <span className="section-label">DISCOVER MORE</span>
            <h2>Explore the Marketplace</h2>
            <p>One platform for your agricultural needs.</p>
          </div>
        </div>

        


{isLoadingProducts && (
  <p>Loading marketplace products...</p>
)}

{productLoadError && (
  <p className="auth-error">
    {productLoadError}
  </p>
)}






        <div className="product-grid">
          {filteredProducts.map((product) => (
            <Link
              className="product-card"
              to={`/product/${product.id}`}
              key={product.id}
            >
              <div className="product-art">
                {product.image ? (
  <img
    src={product.image}
    alt={product.name}
    loading="lazy"
  />
) : (
  <span>Image not available</span>
)}
              </div>

              <div className="product-info">
                <span>{product.type}</span>
                <h3>{product.name}</h3>
                <strong>Explore listings <ArrowRight /></strong>
              </div>
            </Link>
          ))}
        </div>
        
{!isLoadingProducts &&
  !productLoadError &&
  filteredProducts.length === 0 && (
  <p className="no-results">
    No products found. Try searching for something else.
  </p>
)}


      </section>


      <section className="about-section section" id="about">
        <div className="about-heading">
          <span className="section-label">ABOUT KRISHICONNECT</span>
          <h2>Growing Together, Empowering Farmers.</h2>
          <p>
            KrishiConnect is an agricultural marketplace concept designed
            to bring farmers, buyers and local vendors closer together.
            Our goal is to make it easier to explore farming products
            and connect with the agricultural community.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-card">
            <Tractor />
            <h3>Farm Equipment</h3>
            <p>
              Explore tractors, harvesters, farming tools and machinery.
            </p>
          </div>

          <div className="about-card">
            <Beef />
            <h3>Livestock Marketplace</h3>
            <p>
              Explore cattle, buffaloes, goats and other livestock categories.
            </p>
          </div>

          <div className="about-card">
            <Sprout />
            <h3>Seeds and Agro Supplies</h3>
            <p>
              Discover seeds, fertilizers and other agricultural supplies.
            </p>
          </div>
        </div>
      </section>

    </main>
  )
}


function CategoryPage({ details, category }) {
  const Icon = details.icon
  const [categorySearch, setCategorySearch] = useState('')
  const [marketplaceProducts, setMarketplaceProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const fetchCategoryProducts = async () => {
      try {
        setLoading(true)
        setErrorMessage('')

        const response = await fetch(
          `http://localhost:5000/api/products?category=${encodeURIComponent(category)}`,
          { signal: controller.signal }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load products.')
        }

        setMarketplaceProducts(
          Array.isArray(data.products) ? data.products : []
        )
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrorMessage(error.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchCategoryProducts()

    return () => controller.abort()
  }, [category])

  const filteredItems = details.items.filter((item) =>
    item.toLowerCase().includes(categorySearch.toLowerCase())
  )

  const filteredProducts = marketplaceProducts.filter((product) =>
    `${product.name} ${product.description}`
      .toLowerCase()
      .includes(categorySearch.toLowerCase())
  )

  return (
    <main className="section category-page">
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>

      <div className="category-page-heading">
        <Icon />
        <span className="section-label">KRISHICONNECT MARKETPLACE</span>
        <h1>{details.title}</h1>
        <p>{details.description}</p>
      </div>

      <h2>Explore {details.title} Categories</h2>

      <div className="category-search">
        <Search />
        <input
          type="text"
          placeholder={`Search ${details.title}...`}
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
        />
      </div>

      <div className="category-grid">
        {filteredItems.map((item) => (
          <article className="category-card" key={item}>
            <Icon className="category-icon" />
            <h3>{item}</h3>
            <p>Explore {item.toLowerCase()} listings and details.</p>
          </article>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="no-results">
          No categories found. Try another search.
        </p>
      )}

      <section className="marketplace section">
        <div className="section-heading">
          <div>
            <span className="section-label">REAL MARKETPLACE LISTINGS</span>
            <h2>Available {details.title}</h2>
            <p>Products listed by our registered sellers.</p>
          </div>
        </div>

        {loading && <p>Loading products...</p>}

        {errorMessage && (
          <p className="auth-error">{errorMessage}</p>
        )}

        {!loading && !errorMessage && (
          <>
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <Link
                  className="product-card"
                  to={`/product/${product._id}`}
                  key={product._id}
                >
                  <div className="product-art">
                    {product.images?.[0] ? (
                      <img
                        src={`http://localhost:5000${product.images[0]}`}
                        alt={product.name}
                        loading="lazy"
                      />
                    ) : (
                      <span>Image not available</span>
                    )}
                  </div>

                  <div className="product-info">
                    <span>{product.category}</span>
                    <h3>{product.name}</h3>
                    <p>₹{product.price}</p>
                    <strong>Explore listings →</strong>
                  </div>
                </Link>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <p className="no-results">
                No products found in this category.
              </p>
            )}
          </>
        )}
      </section>

    </main>
  )
}



function AuthPage({ mode }) {
  const isRegister = mode === 'register'
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    role: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setErrorMessage('')
    setSuccessMessage('')

    if (
      isRegister &&
      formData.password !== formData.confirmPassword
    ) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const endpoint = isRegister
        ? '/api/auth/register'
        : '/api/auth/login'

      const payload = isRegister
        ? formData
        : {
            email: formData.email,
            password: formData.password,
          }

      const response = await fetch(
        `http://localhost:5000${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong.')
      }

      if (isRegister) {
        setSuccessMessage(
          'Account created successfully! You can now login.'
        )

        setFormData({
          fullName: '',
          role: '',
          email: '',
          password: '',
          confirmPassword: '',
        })
      } else {
        if (!data.token) {
          throw new Error('Login token was not received.')
        }

        sessionStorage.setItem(
          'krishiconnect_token',
          data.token
        )

        window.location.assign('/')
      }
    } catch (error) {
      setErrorMessage(
        error.message || 'Unable to connect to the server.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">

        <Link className="brand auth-brand" to="/">
          <Leaf className="brand-icon" />
          <span>
            Krishi<span className="brand-green">Connect</span>
          </span>
        </Link>

        <div className="auth-heading">
          <span className="section-label">
            WELCOME TO KRISHICONNECT
          </span>

          <h1>
            {isRegister ? 'Create Your Account' : 'Welcome Back!'}
          </h1>

          <p>
            {isRegister
              ? 'Join our farming community today.'
              : 'Login to continue to your account.'}
          </p>
        </div>

        {errorMessage && (
          <p className="auth-error" role="alert">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p className="auth-success" role="status">
            {successMessage}
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>

          {isRegister && (
            <>
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                minLength={2}
                maxLength={80}
                required
              />

              <label htmlFor="role">I am a</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="vendor">Agro Vendor</option>
              </select>
            </>
          )}

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete={
              isRegister ? 'new-password' : 'current-password'
            }
            required
          />

          {isRegister && (
            <>
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : isRegister
                ? 'Create Account'
                : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister
            ? 'Already have an account?'
            : "Don't have an account?"}
          {' '}
          <Link to={isRegister ? '/login' : '/register'}>
            {isRegister ? 'Login' : 'Register'}
          </Link>
        </p>

        <p className="auth-note">
          Connecting farmers. Growing communities.
        </p>

      </section>
    </main>
  )
}




function SellProductPage() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

const handleSubmit = async (e) => {
  e.preventDefault()

  const formElement = e.currentTarget

    setErrorMessage('')
    setSuccessMessage('')

    const token = sessionStorage.getItem('krishiconnect_token')

    if (!token) {
      navigate('/login')
      return
    }

const formData = new FormData(formElement)

    const imageFiles = formData
      .getAll('images')
      .filter((file) => file instanceof File && file.size > 0)

    // Maximum 5 images
    if (imageFiles.length > 5) {
      setErrorMessage('You can upload a maximum of 5 images.')
      return
    }

    // Validate image types and sizes
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    for (const file of imageFiles) {
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage('Only JPG, PNG and WEBP images are allowed.')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Each image must be smaller than 5 MB.')
        return
      }
    }

    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:5000/api/products',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (response.status === 401) {
          sessionStorage.removeItem('krishiconnect_token')
          navigate('/login')
          return
        }

        throw new Error(
          data.message || 'Unable to submit product.'
        )
      }

      setSuccessMessage(
        `Product "${data.product.name}" created successfully!`
      )

formElement.reset()


    } catch (error) {
      setErrorMessage(
        error.message || 'Unable to connect to the server.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="sell-page">
      <div className="sell-container">

        <div className="sell-heading">
          <span className="section-label">
            KRISHICONNECT MARKETPLACE
          </span>

          <h1>Sell Your Product</h1>

          <p>
            Share your agricultural products with buyers
            in your community.
          </p>
        </div>

        {errorMessage && (
          <p className="auth-error" role="alert">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p className="auth-success" role="status">
            {successMessage}
          </p>
        )}

        <form
          className="sell-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label htmlFor="productName">Product Name</label>
            <input
              id="productName"
              name="name"
              type="text"
              placeholder="e.g. Mahindra Tractor"
              maxLength={120}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="productCategory">
                Product Category
              </label>

              <select
                id="productCategory"
                name="category"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select category
                </option>
                <option value="equipment">Farm Equipment</option>
                <option value="livestock">Livestock</option>
                <option value="seeds">Seeds</option>
                <option value="agro-shops">Agro Supplies</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="productPrice">Price (₹)</label>
              <input
                id="productPrice"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter price"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="productQuantity">
                Quantity
              </label>

              <input
                id="productQuantity"
                name="quantity"
                type="text"
                placeholder="e.g. 2 units"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="productLocation">
                Location
              </label>

              <input
                id="productLocation"
                name="location"
                type="text"
                placeholder="Village, District, State"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="productDescription">
              Product Description
            </label>

            <textarea
              id="productDescription"
              name="description"
              rows="5"
              maxLength={3000}
              placeholder="Describe your product..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="productImage">
              Upload Product Images
            </label>

            <input
              id="productImage"
              name="images"
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              multiple
            />

            <small>
              Maximum 5 images, up to 5 MB each.
              JPG, PNG and WEBP formats.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="sellerPhone">
              Contact Number
            </label>

            <input
              id="sellerPhone"
              name="sellerPhone"
              type="tel"
              placeholder="Enter your phone number"
              maxLength={20}
              required
            />
          </div>

          <button
            type="submit"
            className="sell-submit"
            disabled={loading}
          >
            {loading ? 'Uploading Product...' : 'Submit Product'}
          </button>

        </form>

      </div>
    </main>
  )
}





const productDescriptions = {
  tractor: 'Explore agricultural tractors suitable for different farming activities. Check specifications and availability with the seller.',
  harvester: 'Explore harvesting machinery designed to support crop harvesting. Contact the seller for machine specifications.',
  cow: 'Explore cattle listings and learn more about livestock availability and details from the seller.',
  buffalo: 'Explore buffalo livestock listings. Contact the seller for breed, age and availability information.',
  seeds: 'Explore seeds for different crops and farming seasons. Check variety and quantity details with the seller.',
  'agro-supplies': 'Explore agricultural supplies and farming essentials. Contact the seller for product details and availability.',
}

function ProductDetailsPage() {
  const { productId } = useParams()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setErrorMessage('')

        const response = await fetch(
          `http://localhost:5000/api/products/${encodeURIComponent(productId)}`,
          { signal: controller.signal }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load product.')
        }

        setProduct(data.product)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrorMessage(error.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchProduct()

    return () => controller.abort()
  }, [productId])

  if (loading) {
    return (
      <main className="section">
        <p>Loading product details...</p>
      </main>
    )
  }

  if (errorMessage || !product) {
    return (
      <main className="section">
        <h1>Product Not Found</h1>
        <p>{errorMessage || 'This product is unavailable.'}</p>
        <Link to="/">Return to Home</Link>
      </main>
    )
  }

  const categoryLabels = {
    equipment: 'Farm Equipment',
    livestock: 'Livestock',
    seeds: 'Seeds',
    'agro-shops': 'Agro Supplies',
  }

  const categoryPaths = {
    equipment: '/equipment',
    livestock: '/livestock',
    seeds: '/seeds',
    'agro-shops': '/agro-shops',
  }

  const sellerName = product.sellerId?.fullName || 'Registered Seller'

  const sellerPhone = product.sellerPhone || ''
  const phoneDigits = sellerPhone.replace(/\D/g, '')
  const validPhone =
    phoneDigits.length >= 10 && !/^0+$/.test(phoneDigits)

  const imageUrl = product.images?.[0]
    ? `http://localhost:5000${product.images[0]}`
    : null

  const categoryName =
    categoryLabels[product.category] || product.category

  return (
    <main className="product-details-page">
      <div className="product-details-container">

        <Link
          to={categoryPaths[product.category] || '/'}
          className="back-link"
        >
          ← Back to Category
        </Link>

        <div className="product-details-layout">

          <div className="product-details-image">
            {imageUrl ? (
              <img src={imageUrl} alt={product.name} />
            ) : (
              <p>Product image not available.</p>
            )}
          </div>

          <div className="product-details-content">

            <span className="section-label">
              {categoryName}
            </span>

            <h1>{product.name}</h1>

            <div className="product-detail-info">

              <div>
                <span>Price</span>
                <strong>
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </strong>
              </div>

              <div>
                <span>Availability</span>
                <strong>
                  {product.status === 'active'
                    ? product.quantity
                    : product.status}
                </strong>
              </div>

              <div>
                <span>Location</span>
                <strong>{product.location}</strong>
              </div>

            </div>

          </div>
        </div>

        <section className="details-description">
          <h2>Product Description</h2>
          <p>{product.description}</p>
        </section>

        <section className="seller-information">

          <div className="seller-info-text">
            <h2>Seller Information</h2>
            <p>
              Seller Name: <strong>{sellerName}</strong>
            </p>
            <p>
              Contact the seller for more information
              about this product.
            </p>
          </div>

          <div className="seller-contact-actions">

            {validPhone ? (
              <>
                <a
                  href={`tel:${sellerPhone}`}
                  className="contact-btn call-btn"
                >
                  <Phone />
                  Call Seller
                </a>

                <a
                  href={`https://wa.me/${phoneDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-btn whatsapp-btn"
                >
                  <MessageCircle />
                  WhatsApp Seller
                </a>
              </>
            ) : (
              <p className="contact-note">
                Seller contact number is not available.
              </p>
            )}

          </div>

          <p className="contact-note">
            Contact options are available when a valid seller
            phone number is provided. WhatsApp numbers should
            include the country code.
          </p>

        </section>

      </div>
    </main>
  )
}



function NotFound() {
  return (
    <main className="section">
      <h1>Page Not Found</h1>
      <Link to="/">Return to Home</Link>
    </main>
  )
}


function ProtectedRoute({ children, allowedRoles = [] }) {
  const [status, setStatus] = useState('checking')
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    let active = true

    const token = sessionStorage.getItem('krishiconnect_token')

    if (!token) {
      setStatus('unauthenticated')
      return () => {
        active = false
      }
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/auth/me',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          if (response.status === 401) {
            sessionStorage.removeItem('krishiconnect_token')

            if (active) setStatus('unauthenticated')
          } else {
            if (active) setStatus('error')
          }

          return
        }

        if (active) {
          setUserRole(data.user.role)
          setStatus('authenticated')
        }
      } catch {
        if (active) setStatus('error')
      }
    }

    verifyToken()

    return () => {
      active = false
    }
  }, [])

  if (status === 'checking') {
    return (
      <main className="section">
        <p>Verifying your account...</p>
      </main>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  if (status === 'error') {
    return (
      <main className="section">
        <h2>Unable to verify your account</h2>
        <p>Please check your internet and backend connection.</p>
        <Link to="/login">Go to Login</Link>
      </main>
    )
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(userRole)
  ) {
    return (
      <main className="section">
        <h2>Access Denied</h2>
        <p>You do not have permission to access this page.</p>
        <Link to="/">Return to Home</Link>
      </main>
    )
  }

  return children
}




function MyProductsPage() {
  const navigate = useNavigate()

  const [myProducts, setMyProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const fetchMyProducts = async () => {
      try {
        const token = sessionStorage.getItem('krishiconnect_token')

        if (!token) {
          navigate('/login')
          return
        }

        const response = await fetch(
          'http://localhost:5000/api/products/my/list',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        )

        const data = await response.json()

        if (!response.ok) {
          if (response.status === 401) {
            sessionStorage.removeItem('krishiconnect_token')
            navigate('/login')
            return
          }

          throw new Error(data.message || 'Unable to load products.')
        }

        setMyProducts(data.products || [])
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrorMessage(error.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchMyProducts()

    return () => controller.abort()
  }, [navigate])

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?'
    )

    if (!confirmed) return

    try {
      const token = sessionStorage.getItem('krishiconnect_token')

      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete product.')
      }

      setMyProducts((previous) =>
        previous.filter((product) => product._id !== productId)
      )

      setSuccessMessage('Product deleted successfully!')
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <main className="section">
      <div className="section-heading">
        <div>
          <span className="section-label">SELLER DASHBOARD</span>
          <h2>My Products</h2>
          <p>Manage your agricultural product listings.</p>
        </div>

        <Link className="sell-btn" to="/sell">
          + Add Product
        </Link>
      </div>

      {loading && <p>Loading your products...</p>}

      {errorMessage && (
        <p className="auth-error">{errorMessage}</p>
      )}

      {successMessage && (
        <p className="auth-success">{successMessage}</p>
      )}

      {!loading && myProducts.length > 0 && (
        <>
          <p>Total Products: {myProducts.length}</p>

          <div className="product-grid">
            {myProducts.map((product) => (
              <article className="product-card" key={product._id}>
                <div className="product-art">
                  {product.images?.[0] ? (
                    <img
                      src={`http://localhost:5000${product.images[0]}`}
                      alt={product.name}
                      loading="lazy"
                    />
                  ) : (
                    <span>Image not available</span>
                  )}
                </div>

                <div className="product-info">
                  <span>{product.category}</span>

                  <h3>{product.name}</h3>

                  <strong>
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </strong>

                  <p>{product.quantity}</p>
                  <p>{product.location}</p>
                  <p>Status: {product.status}</p>

                  <button
                    type="button"
                    className="auth-submit"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete Product
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {!loading && myProducts.length === 0 && (
        <p className="no-results">
          You have not listed any products yet.
        </p>
      )}
    </main>
  )
}










function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route
  path="/sell"
  element={
    <ProtectedRoute allowedRoles={['farmer', 'seller', 'vendor']}>
      <SellProductPage />
    </ProtectedRoute>
  }
/>




<Route
  path="/my-products"
  element={
    <ProtectedRoute allowedRoles={['farmer', 'seller', 'vendor']}>
      <MyProductsPage />
    </ProtectedRoute>
  }
/>








        <Route
          path="/product/:productId"
          element={<ProductDetailsPage />}
        />
        {Object.entries(categoryDetails).map(([path, details]) => (
          <Route
            key={path}
            path={path}
element={
  <CategoryPage
    details={details}
    category={path.replace(/^\//, '')}
  />
}          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>


      <footer className="footer">
        <div className="footer-main">

          <div className="footer-brand-col">
            <Link className="brand footer-brand" to="/">
              <Leaf className="brand-icon" />
              <span>
                Krishi<span className="brand-green">Connect</span>
              </span>
            </Link>

            <p>
              Connecting farmers, buyers and local vendors
              through one agricultural marketplace.
            </p>
          </div>

          <div className="footer-links-col">
            <h3>Explore</h3>
            <Link to="/">Home</Link>
            <Link to="/equipment">Farm Equipment</Link>
            <Link to="/livestock">Livestock</Link>
            <Link to="/seeds">Seeds</Link>
            <Link to="/agro-shops">Agro Shops</Link>
          </div>

          <div className="footer-links-col">
            <h3>My Account</h3>
            <Link to="/login">Login</Link>
            <Link to="/register">Create Account</Link>
            <Link to="/sell">Sell Product</Link>
          </div>

          <div className="footer-links-col">
            <h3>About Us</h3>
            <Link to="/#about">Our Mission</Link>
            <Link to="/#categories">Our Categories</Link>
            <Link to="/#marketplace">Marketplace</Link>
          </div>

        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} KrishiConnect. All rights reserved.
          </span>
          <Link to="/">Back to Home ↑</Link>
        </div>
      </footer>

    </>
  )
}

export default App
