import { Link } from 'react-router-dom'
import ProductSlider from '../components/ProductSlider'
import products from '../data/products.json'

export default function Home() {
  // Show limited products on homepage
  const featured = products.slice(0, 6)
  
  return (
    <div className="fade-in">
      <section className="hero">
        <div className="container">
          <h1>Trải nghiệm trang phục truyền thống với Virtual Try‑On</h1>
          <p>Kết nối 54 dân tộc, bảo tồn văn hoá, mua trực tiếp từ nghệ nhân.</p>
          <div className="row hero-buttons">
            <Link to="/try-on" className="btn primary">✨ Trải nghiệm ngay</Link>
            <Link to="/shop" className="btn ghost">🛍️ Khám phá trang phục</Link>
          </div>
        </div>
      </section>
      
      <section className="container">
        <ProductSlider 
          products={featured} 
          title="🌟 Sản phẩm nổi bật"
          autoPlay={true}
          autoPlayInterval={3000}
          itemsPerView={3}
        />
        
        {/* View More Button */}
        <div className="view-more-section">
          <p className="view-more-text">
            Khám phá thêm {products.length - featured.length} sản phẩm khác từ các dân tộc Việt Nam
          </p>
          <Link to="/shop" className="btn primary view-more-btn">
            👁️ Xem tất cả sản phẩm
          </Link>
        </div>
      </section>
      
      {/* Stats section */}
      <section className="container">
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-item fade-in">
              <div className="stat-number">54</div>
              <div className="stat-label">Dân tộc</div>
            </div>
            <div className="stat-item fade-in" style={{animationDelay: '0.1s'}}>
              <div className="stat-number">{products.length}</div>
              <div className="stat-label">Sản phẩm</div>
            </div>
            <div className="stat-item fade-in" style={{animationDelay: '0.2s'}}>
              <div className="stat-number">100+</div>
              <div className="stat-label">Nghệ nhân</div>
            </div>
            <div className="stat-item fade-in" style={{animationDelay: '0.3s'}}>
              <div className="stat-number">AR</div>
              <div className="stat-label">Công nghệ</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}