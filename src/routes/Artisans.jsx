import { useState } from 'react'
import InteractiveMap from '../components/InteractiveMap'
import products from '../data/products.json'
import ProductCard from '../components/ProductCard'

// Helper function to get ethnic icon
const getEthnicIcon = (ethnic) => {
  switch(ethnic) {
    case 'Kinh': return '🏮'
    case 'H\'Mông': return '🌸'
    case 'Tày': return '🎋'
    case 'Thái': return '🎍'
    case 'Êđê': return '🌺'
    case 'Nùng': return '🌾'
    case 'Chăm': return '🕌'
    case 'Dao': return '🔴'
    case 'Cơ Tu': return '🌿'
    case 'Thuần': return '🌻'
    case 'Ba Na': return '🏔️'
    default: return '🎨'
  }
}

export default function Artisans() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)
  
  // Filter products by selected region if any
  const filteredProducts = selectedRegion 
    ? products.filter(p => p.province.includes(selectedRegion.name))
    : products
  
  const handleProductSelect = (product) => {
    setSelectedProduct(product)
    setSelectedRegion(null)
  }
  
  const handleLocationSelect = (region) => {
    setSelectedRegion(region)
    setSelectedProduct(null)
  }
  
  // Group products by province for better organization
  const productsByProvince = products.reduce((acc, product) => {
    if (!acc[product.province]) {
      acc[product.province] = []
    }
    acc[product.province].push(product)
    return acc
  }, {})
  
  return (
    <div className="fade-in">
      <div className="section-title">🏛️ Nghệ nhân & Làng nghề Việt Nam</div>
      <p style={{color: 'var(--text-light)', marginBottom: '32px', fontSize: '18px'}}>
        Khám phá các làng nghề truyền thống và sản phẩm thủ công từ 54 dân tộc
      </p>
      
      <div className="artisans-layout">
        {/* Interactive Map */}
        <div className="map-section">
          <InteractiveMap 
            selectedProduct={selectedProduct}
            onLocationSelect={handleLocationSelect}
          />
        </div>
        
        {/* Product Selection */}
        <div className="products-section">
          <div className="section-header">
            <h3>🛍️ Chọn sản phẩm để xem vị trí</h3>
            {selectedRegion && (
              <div className="region-filter">
                📍 Đang xem: {selectedRegion.name} 
                <button 
                  className="btn ghost small"
                  onClick={() => handleLocationSelect(null)}
                  style={{marginLeft: '8px'}}
                >
                  ✕ Bỏ lọc
                </button>
              </div>
            )}
          </div>
          
          <div className="product-grid-artisans">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className={`product-item-artisan ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                onClick={() => handleProductSelect(product)}
                style={{animationDelay: `${index * 0.05}s`}}
              >
                <div className="product-preview">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="product-thumb"
                  />
                  <div className="product-info-artisan">
                    <div className="product-name-artisan">{product.name}</div>
                    <div className="product-details-artisan">
                      <div className="product-location">
                        📍 {product.village}
                      </div>
                      <div className="product-province">
                        {product.province}
                      </div>
                      <div className="product-ethnic">
                        {getEthnicIcon(product.ethnic)} {product.ethnic}
                      </div>
                      <div className="product-price-artisan">
                        ${product.price}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && selectedRegion && (
            <div className="no-products">
              <p>Không có sản phẩm nào từ khu vực {selectedRegion.name}</p>
            </div>
          )}
        </div>
        
        {/* Province Summary */}
        <div className="province-summary">
          <h3>📊 Thống kê theo tỉnh thành</h3>
          <div className="province-stats">
            {Object.entries(productsByProvince).map(([province, provinceProducts]) => (
              <div key={province} className="province-stat">
                <div className="province-name">{province}</div>
                <div className="province-count">{provinceProducts.length} sản phẩm</div>
                <div className="province-ethnics">
                  {[...new Set(provinceProducts.map(p => p.ethnic))].map(ethnic => (
                    <span key={ethnic} className="ethnic-tag">
                      {getEthnicIcon(ethnic)} {ethnic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}