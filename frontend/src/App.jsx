import { useState } from 'react'
import { Link, Routes, Route, useParams } from 'react-router-dom'
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
  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <Leaf className="brand-icon" />
        <span>Krishi<span className="brand-green">Connect</span></span>
      </Link>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <a href="/#categories">Categories</a>
        <a href="/#marketplace">Marketplace</a>
        <a href="/#about">About</a>
      </nav>

      <div className="nav-actions">
        <Link className="login-btn" to="/login">Login</Link>
        <Link className="sell-btn" to="/sell">+ Sell Product</Link>
      </div>
    </header>
  )
}

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')

const filteredProducts = products.filter((product) =>
  `${product.name} ${product.type}`.toLowerCase().includes(searchTerm.toLowerCase())
)
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

        
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <Link
              className="product-card"
              to={`/product/${product.id}`}
              key={product.id}
            >
              <div className="product-art">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />
              </div>

              <div className="product-info">
                <span>{product.type}</span>
                <h3>{product.name}</h3>
                <strong>Explore listings <ArrowRight /></strong>
              </div>
            </Link>
          ))}
        </div>
        

        {filteredProducts.length === 0 && (
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


function CategoryPage({ details }) {
  const Icon = details.icon
  const [categorySearch, setCategorySearch] = useState('')

  const filteredItems = details.items.filter((item) =>
    item.toLowerCase().includes(categorySearch.toLowerCase())
  )

  return (
    <main className="section category-page">
      <Link to="/" className="back-link">← Back to Home</Link>

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

      <p className="coming-soon">
        Marketplace listings will be available here soon.
      </p>
    </main>
  )
}



function AuthPage({ mode }) {
  const isRegister = mode === 'register'

  return (
    <main className="auth-page">
      <section className="auth-card">

        <Link className="brand auth-brand" to="/">
          <Leaf className="brand-icon" />
          <span>Krishi<span className="brand-green">Connect</span></span>
        </Link>

        <div className="auth-heading">
          <span className="section-label">WELCOME TO KRISHICONNECT</span>
          <h1>{isRegister ? 'Create Your Account' : 'Welcome Back!'}</h1>
          <p>
            {isRegister
              ? 'Join our farming community today.'
              : 'Login to continue to your account.'}
          </p>
        </div>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>

          {isRegister && (
            <>
              <label htmlFor="fullName">Full Name</label>
              <input id="fullName" type="text" placeholder="Enter your full name" required />

              <label htmlFor="role">I am a</label>
              <select id="role" required defaultValue="">
                <option value="" disabled>Select your role</option>
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="vendor">Agro Vendor</option>
              </select>
            </>
          )}

          <label htmlFor="email">Email Address</label>
          <input id="email" type="email" placeholder="Enter your email" required />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Enter your password" required />

          {isRegister && (
            <>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required
              />
            </>
          )}

          <button type="submit" className="auth-submit">
            {isRegister ? 'Create Account' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
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
  return (
    <main className="sell-page">
      <div className="sell-container">

        <div className="sell-heading">
          <span className="section-label">KRISHICONNECT MARKETPLACE</span>
          <h1>Sell Your Product</h1>
          <p>Share your agricultural products with buyers in your community.</p>
        </div>

        <form
          className="sell-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="form-group">
            <label htmlFor="productName">Product Name</label>
            <input
              id="productName"
              type="text"
              placeholder="e.g. Mahindra Tractor"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="productCategory">Product Category</label>
              <select id="productCategory" defaultValue="" required>
                <option value="" disabled>Select category</option>
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
                type="number"
                min="0"
                placeholder="Enter price"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="productQuantity">Quantity</label>
              <input
                id="productQuantity"
                type="text"
                placeholder="e.g. 2 units"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="productLocation">Location</label>
              <input
                id="productLocation"
                type="text"
                placeholder="Village, District, State"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="productDescription">Product Description</label>
            <textarea
              id="productDescription"
              rows="5"
              placeholder="Describe your product..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="productImage">Upload Product Images</label>
            <input
              id="productImage"
              type="file"
              accept="image/*"
              multiple
            />
            <small>You can select multiple product images.</small>
          </div>

          <div className="form-group">
            <label htmlFor="sellerPhone">Contact Number</label>
            <input
              id="sellerPhone"
              type="tel"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <button type="submit" className="sell-submit">
            Submit Product
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

  const product = products.find((item) => item.id === productId)

  if (!product) {
    return (
      <main className="section">
        <h1>Product Not Found</h1>
        <Link to="/">Return to Home</Link>
      </main>
    )
  }

  return (
    <main className="product-details-page">
      <div className="product-details-container">

        <Link to={product.path} className="back-link">
          ← Back to Category
        </Link>

        <div className="product-details-layout">

          <div className="product-details-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-details-content">
            <span className="section-label">{product.type}</span>

            <h1>{product.name}</h1>

            <p>{productDescriptions[product.id]}</p>

            <div className="product-detail-info">
              <div>
                <span>Price</span>
                <strong>Contact seller for price</strong>
              </div>

              <div>
                <span>Availability</span>
                <strong>Check with seller</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>Seller location to be updated</strong>
              </div>
            </div>

          </div>
        </div>

        <section className="details-description">
          <h2>Product Description</h2>
          <p>{productDescriptions[product.id]}</p>
        </section>

      
        <section className="seller-information">
          <div className="seller-info-text">
            <h2>Seller Information</h2>
            <p>
              Contact the seller to know more about this product,
              its price and availability.
            </p>
          </div>

          
          <div className="seller-contact-actions">
            <button
              type="button"
              className="contact-btn call-btn"
              onClick={() => {
                alert('Seller phone number is not available yet.')
              }}
            >
              <Phone />
              Call Seller
            </button>

            <button
              type="button"
              className="contact-btn whatsapp-btn"
              onClick={() => {
                alert('Seller WhatsApp number is not available yet.')
              }}
            >
              <MessageCircle />
              WhatsApp Seller
            </button>
          </div>


          <p className="contact-note">
            Seller contact options will be activated when real
            seller details are connected.
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

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/sell" element={<SellProductPage />} />
        <Route
          path="/product/:productId"
          element={<ProductDetailsPage />}
        />
        {Object.entries(categoryDetails).map(([path, details]) => (
          <Route
            key={path}
            path={path}
            element={<CategoryPage details={details} />}
          />
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
