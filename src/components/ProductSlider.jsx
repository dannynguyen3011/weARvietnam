import { useState, useEffect, useRef } from 'react'
import ProductCard from './ProductCard'

export default function ProductSlider({ 
  products, 
  title = "Sản phẩm nổi bật", 
  autoPlay = true, 
  autoPlayInterval = 3000,
  itemsPerView = 3 
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay)
  const intervalRef = useRef(null)
  
  const maxIndex = Math.max(0, products.length - itemsPerView)
  
  // Enhanced Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay || maxIndex === 0) return
    
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = prev >= maxIndex ? 0 : prev + 1
        return nextIndex
      })
    }, autoPlayInterval)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlay, maxIndex, autoPlayInterval])
  
  // Clear interval when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
  
  const goToSlide = (index) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)))
  }
  
  const nextSlide = () => {
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1)
  }
  
  const prevSlide = () => {
    setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1)
  }
  
  const toggleAutoPlay = () => {
    setIsAutoPlay(prev => !prev)
  }
  
  if (products.length === 0) {
    console.log('ProductSlider: No products provided')
    return null
  }
  
  console.log('ProductSlider:', { 
    productsLength: products.length, 
    itemsPerView, 
    maxIndex, 
    currentIndex 
  })
  
  return (
    <div className="product-slider-container">
      <div className="slider-header">
        <h2 className="section-title">{title}</h2>
        <div className="slider-controls">
          <button 
            className={`slider-btn auto-play ${isAutoPlay ? 'active' : ''}`}
            onClick={toggleAutoPlay}
            aria-label={isAutoPlay ? "Pause autoplay" : "Start autoplay"}
            title={isAutoPlay ? "Tạm dừng tự động" : "Bật tự động"}
          >
            {isAutoPlay ? '⏸️' : '▶️'}
          </button>
          <button 
            className="slider-btn prev" 
            onClick={prevSlide}
            aria-label="Previous slide"
            title="Slide trước"
          >
            ←
          </button>
          <button 
            className="slider-btn next" 
            onClick={nextSlide}
            aria-label="Next slide"
            title="Slide tiếp theo"
          >
            →
          </button>
        </div>
      </div>
      
      <div className="product-slider">
        {/* Fallback grid if slider fails */}
        {products.length <= itemsPerView ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(products.length, itemsPerView)}, 1fr)`,
            gap: '24px',
            padding: '12px'
          }}>
            {products.map((product) => (
              <ProductCard key={product.id} p={product} />
            ))}
          </div>
        ) : (
          <div 
            className="slider-track"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              width: `${(products.length * 100) / itemsPerView}%`
            }}
          >
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="slider-item"
                style={{ width: `${100 / products.length}%` }}
              >
                <ProductCard p={product} />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Dots indicator - only show if we have slides */}
      {products.length > itemsPerView && (
        <div className="slider-dots">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
