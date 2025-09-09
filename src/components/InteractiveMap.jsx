import { useState, useEffect } from 'react'
import * as topojson from 'topojson-client'
import vietnamTopoJSON from '../data/vietnam-topojson.json'

export default function InteractiveMap({ selectedProduct, onLocationSelect }) {
  const [geoData, setGeoData] = useState(null)
  const [selectedRegionId, setSelectedRegionId] = useState(null)
  const [bounds, setBounds] = useState(null)
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 600, height: 400, scale: 1 })
  const [isZoomed, setIsZoomed] = useState(false)
  
  // Convert TopoJSON to GeoJSON on component mount
  useEffect(() => {
    try {
      const geoJson = topojson.feature(vietnamTopoJSON, vietnamTopoJSON.objects.states)
      
      // Add Hoang Sa and Truong Sa islands as additional features
      const hoangSaFeature = {
        type: "Feature",
        properties: { name: "Hoàng Sa", iso: "VN-HS" },
        geometry: {
          type: "MultiPolygon",
          coordinates: [[[[112.0, 16.5], [112.2, 16.5], [112.2, 16.7], [112.0, 16.7], [112.0, 16.5]]]]
        }
      }
      
      const truongSaFeature = {
        type: "Feature", 
        properties: { name: "Trường Sa", iso: "VN-TS" },
        geometry: {
          type: "MultiPolygon",
          coordinates: [[[[114.0, 8.5], [114.3, 8.5], [114.3, 8.8], [114.0, 8.8], [114.0, 8.5]]]]
        }
      }
      
      // Add islands to the feature collection
      geoJson.features.push(hoangSaFeature, truongSaFeature)
      
      // Calculate bounds including islands
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      
      geoJson.features.forEach(feature => {
        const flattenCoords = (coords) => {
          if (typeof coords[0] === 'number') return [coords]
          return coords.flatMap(flattenCoords)
        }
        
        const allCoords = flattenCoords(feature.geometry.coordinates)
        allCoords.forEach(([lng, lat]) => {
          minX = Math.min(minX, lng)
          maxX = Math.max(maxX, lng)
          minY = Math.min(minY, lat)
          maxY = Math.max(maxY, lat)
        })
      })
      
      setBounds({ minX, minY, maxX, maxY })
      setGeoData(geoJson)
    } catch (error) {
      console.error('Error converting TopoJSON:', error)
    }
  }, [])

  // Helper function to match province names
  const findMatchingProvince = (provinceName) => {
    if (!geoData || !provinceName) return null
    
    // Direct match first
    let matchingFeature = geoData.features.find(feature => 
      feature.properties.name === provinceName
    )
    
    if (matchingFeature) return matchingFeature
    
    // Fuzzy matching for common variations
    const provinceVariations = {
      'Thừa Thiên Huế': ['Huế', 'Thua Thien Hue'],
      'Hồ Chí Minh': ['TP. Hồ Chí Minh', 'Ho Chi Minh', 'Sài Gòn'],
      'Hà Nội': ['Ha Noi', 'Hanoi'],
      'Đà Nẵng': ['Da Nang', 'Danang'],
      'Cần Thơ': ['Can Tho'],
      'Lào Cai': ['Lao Cai']
    }
    
    // Check variations
    for (const [standardName, variations] of Object.entries(provinceVariations)) {
      if (variations.includes(provinceName) || provinceName.includes(standardName)) {
        matchingFeature = geoData.features.find(feature => 
          feature.properties.name === standardName
        )
        if (matchingFeature) return matchingFeature
      }
    }
    
    // Partial match as fallback
    matchingFeature = geoData.features.find(feature => 
      feature.properties.name.includes(provinceName.split(' ')[0]) ||
      provinceName.includes(feature.properties.name.split(' ')[0])
    )
    
    return matchingFeature
  }

  // Handle product selection to highlight region
  useEffect(() => {
    if (selectedProduct && selectedProduct.province && geoData) {
      const matchingFeature = findMatchingProvince(selectedProduct.province)
      
      if (matchingFeature) {
        setSelectedRegionId(matchingFeature.properties.name)
      }
    } else {
      setSelectedRegionId(null)
    }
  }, [selectedProduct, geoData])

  // Convert geographic coordinates to SVG coordinates
  const projectCoordinates = (coordinates) => {
    if (!bounds) return [0, 0]
    
    const [lng, lat] = coordinates
    const width = 600
    const height = 400
    const padding = 20
    
    // Scale to fit within viewBox with padding
    const scaleX = (width - 2 * padding) / (bounds.maxX - bounds.minX)
    const scaleY = (height - 2 * padding) / (bounds.maxY - bounds.minY)
    const baseScale = Math.min(scaleX, scaleY)
    
    // Center the map
    const centerX = width / 2
    const centerY = height / 2
    const boundsWidth = (bounds.maxX - bounds.minX) * baseScale
    const boundsHeight = (bounds.maxY - bounds.minY) * baseScale
    
    const x = centerX - boundsWidth / 2 + (lng - bounds.minX) * baseScale
    const y = centerY + boundsHeight / 2 - (lat - bounds.minY) * baseScale // Flip Y axis
    
    return [x, y]
  }

  // Calculate feature centroid
  const getFeatureCentroid = (feature) => {
    const flattenCoords = (coords) => {
      if (typeof coords[0] === 'number') return [coords]
      return coords.flatMap(flattenCoords)
    }
    
    const allCoords = flattenCoords(feature.geometry.coordinates)
    const avgLng = allCoords.reduce((sum, [lng]) => sum + lng, 0) / allCoords.length
    const avgLat = allCoords.reduce((sum, [, lat]) => sum + lat, 0) / allCoords.length
    return [avgLng, avgLat]
  }

  // Zoom to feature
  const zoomToFeature = (feature) => {
    if (!bounds) return
    
    const flattenCoords = (coords) => {
      if (typeof coords[0] === 'number') return [coords]
      return coords.flatMap(flattenCoords)
    }
    
    const allCoords = flattenCoords(feature.geometry.coordinates)
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    
    allCoords.forEach(([lng, lat]) => {
      minX = Math.min(minX, lng)
      maxX = Math.max(maxX, lng)
      minY = Math.min(minY, lat)
      maxY = Math.max(maxY, lat)
    })
    
    // Add padding
    const padding = 0.1
    const featureWidth = maxX - minX || 0.1 // Prevent division by zero
    const featureHeight = maxY - minY || 0.1
    minX -= featureWidth * padding
    maxX += featureWidth * padding
    minY -= featureHeight * padding
    maxY += featureHeight * padding
    
    // Calculate zoom scale based on feature size relative to map bounds
    const mapWidth = bounds.maxX - bounds.minX
    const mapHeight = bounds.maxY - bounds.minY
    const featureWidthRatio = (maxX - minX) / mapWidth
    const featureHeightRatio = (maxY - minY) / mapHeight
    
    // Calculate zoom scale (inverse of size ratio, with limits)
    const zoomScale = Math.min(
      Math.max(1 / Math.max(featureWidthRatio, featureHeightRatio), 2), // Min 2x zoom
      8 // Max 8x zoom
    )
    
    // Calculate center in base coordinates (without current zoom)
    const centerLng = (minX + maxX) / 2
    const centerLat = (minY + maxY) / 2
    
    // Project using base scale (scale = 1)
    const baseViewBox = { x: 0, y: 0, width: 600, height: 400, scale: 1 }
    const width = baseViewBox.width
    const height = baseViewBox.height
    const basePadding = 20
    
    const scaleX = (width - 2 * basePadding) / (bounds.maxX - bounds.minX)
    const scaleY = (height - 2 * basePadding) / (bounds.maxY - bounds.minY)
    const baseScale = Math.min(scaleX, scaleY)
    
    const baseCenterX = width / 2
    const baseCenterY = height / 2
    const boundsWidth = (bounds.maxX - bounds.minX) * baseScale
    const boundsHeight = (bounds.maxY - bounds.minY) * baseScale
    
    const centerX = baseCenterX - boundsWidth / 2 + (centerLng - bounds.minX) * baseScale
    const centerY = baseCenterY + boundsHeight / 2 - (centerLat - bounds.minY) * baseScale
    
    // Set new viewBox to zoom to the feature
    setViewBox({
      x: -(centerX - width / 2),
      y: -(centerY - height / 2),
      width: width,
      height: height,
      scale: zoomScale
    })
    setIsZoomed(true)
  }

  // Reset zoom
  const resetZoom = () => {
    setViewBox({ x: 0, y: 0, width: 600, height: 400, scale: 1 })
    setIsZoomed(false)
    setSelectedRegionId(null)
    if (onLocationSelect) {
      onLocationSelect(null)
    }
  }

  // Convert GeoJSON coordinates to SVG path
  const coordinatesToPath = (coordinates, type) => {
    if (type === 'Polygon') {
      return coordinates.map(ring => 
        ring.map((coord, index) => {
          const [x, y] = projectCoordinates(coord)
          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
        }).join(' ') + ' Z'
      ).join(' ')
    } else if (type === 'MultiPolygon') {
      return coordinates.map(polygon =>
        polygon.map(ring => 
          ring.map((coord, index) => {
            const [x, y] = projectCoordinates(coord)
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
          }).join(' ') + ' Z'
        ).join(' ')
      ).join(' ')
    }
    return ''
  }

  // Handle region click
  const handleRegionClick = (feature) => {
    const regionName = feature.properties.name
    setSelectedRegionId(regionName)
    
    // Zoom to the clicked region
    zoomToFeature(feature)
    
    // Find products from this province
    if (onLocationSelect) {
      const centroid = getFeatureCentroid(feature)
      onLocationSelect({
        name: regionName,
        coordinates: centroid
      })
    }
  }

  // Auto-zoom to selected product's province
  useEffect(() => {
    if (selectedProduct && selectedProduct.province && geoData && bounds) {
      const matchingFeature = findMatchingProvince(selectedProduct.province)
      
      if (matchingFeature) {
        // Automatically zoom to the province when product is selected
        setTimeout(() => {
          zoomToFeature(matchingFeature)
        }, 200) // Small delay to ensure everything is rendered
      }
    } else if (!selectedProduct) {
      // Reset zoom when no product is selected
      setTimeout(() => {
        resetZoom()
      }, 200)
    }
  }, [selectedProduct, geoData, bounds])

  if (!geoData || !bounds) {
    return (
      <div className="interactive-map">
        <div className="map-header">
          <h3>🗺️ Đang tải bản đồ Việt Nam...</h3>
        </div>
        <div className="map-container" style={{ 
          height: '400px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'var(--bg-light)'
        }}>
          <div>📍 Đang xử lý dữ liệu TopoJSON...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="interactive-map">
      <div className="map-header">
        <h3>🗺️ Bản đồ hành chính Việt Nam {isZoomed && '(Đã zoom)'}</h3>
        <div className="map-controls">
          {selectedRegionId && (
            <span className="selected-location">
              📍 {selectedRegionId}
            </span>
          )}
          <button className="btn ghost small" onClick={resetZoom}>
            {isZoomed ? '🔍 Zoom Out' : '🔄 Reset'}
          </button>
        </div>
      </div>
      
      <div className="map-container">
        <svg 
          viewBox="0 0 600 400"
          className="vietnam-map"
          style={{ 
            width: '100%', 
            height: '500px', 
            background: 'var(--bg-light)',
            transition: 'all 0.8s ease-in-out'
          }}
        >
          <g transform={`translate(${-viewBox.x}, ${-viewBox.y}) scale(${viewBox.scale})`}>
            <g style={{ transition: 'transform 0.8s ease-in-out' }}>
              {/* Render all provinces */}
              {geoData.features.map((feature, index) => {
                const pathData = coordinatesToPath(
                  feature.geometry.coordinates, 
                  feature.geometry.type
                )
                const isSelected = selectedRegionId === feature.properties.name
                const isIsland = ['Hoàng Sa', 'Trường Sa'].includes(feature.properties.name)
                
                return (
                  <g key={feature.properties.name || index}>
                    <path
                      d={pathData}
                      fill={isSelected ? 'var(--accent)' : isIsland ? 'var(--secondary)' : 'var(--bg)'}
                      stroke={isIsland ? 'var(--accent)' : 'var(--primary)'}
                      strokeWidth={isSelected ? 3 : isIsland ? 2 : 1}
                      opacity={isSelected ? 0.9 : isIsland ? 0.9 : 0.7}
                      className="province-path"
                      onClick={() => handleRegionClick(feature)}
                      style={{ 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.target.style.fill = isIsland ? 'var(--accent)' : 'var(--secondary)'
                          e.target.style.opacity = '0.8'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.target.style.fill = isIsland ? 'var(--secondary)' : 'var(--bg)'
                          e.target.style.opacity = isIsland ? '0.9' : '0.7'
                        }
                      }}
                    />
                    
                    {/* Province label (for major provinces and islands) */}
                    {['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Huế', 'Cần Thơ', 'Hoàng Sa', 'Trường Sa'].includes(feature.properties.name) && (() => {
                      // Calculate simple centroid
                      const flattenCoords = (coords) => {
                        if (typeof coords[0] === 'number') return [coords]
                        return coords.flatMap(flattenCoords)
                      }
                      
                      const allCoords = flattenCoords(feature.geometry.coordinates)
                      const avgLng = allCoords.reduce((sum, [lng]) => sum + lng, 0) / allCoords.length
                      const avgLat = allCoords.reduce((sum, [, lat]) => sum + lat, 0) / allCoords.length
                      const [x, y] = projectCoordinates([avgLng, avgLat])
                      
                      return (
                        <text
                          x={x}
                          y={y}
                          fontSize="10"
                          fill="var(--text)"
                          textAnchor="middle"
                          pointerEvents="none"
                          style={{ fontWeight: '600', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}
                        >
                          {feature.properties.name}
                        </text>
                      )
                    })()}
                  </g>
                )
              })}
              
              {/* Selected product highlight */}
              {selectedProduct && selectedRegionId && (() => {
                const selectedFeature = geoData.features.find(f => f.properties.name === selectedRegionId)
                if (!selectedFeature) return null
                
                // Calculate centroid for highlight
                const flattenCoords = (coords) => {
                  if (typeof coords[0] === 'number') return [coords]
                  return coords.flatMap(flattenCoords)
                }
                
                const allCoords = flattenCoords(selectedFeature.geometry.coordinates)
                const avgLng = allCoords.reduce((sum, [lng]) => sum + lng, 0) / allCoords.length
                const avgLat = allCoords.reduce((sum, [, lat]) => sum + lat, 0) / allCoords.length
                const [x, y] = projectCoordinates([avgLng, avgLat])
                
                return (
                  <g>
                    <circle
                      cx={x}
                      cy={y}
                      r="10"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="3"
                      strokeDasharray="6,3"
                      opacity="0.8"
                    >
                      <animate 
                        attributeName="r" 
                        values="10;20;10" 
                        dur="2s" 
                        repeatCount="indefinite"
                      />
                      <animate 
                        attributeName="opacity" 
                        values="0.8;0.4;0.8" 
                        dur="2s" 
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                )
              })()}
            </g>
          </g>
        </svg>
        
        {/* Map legend */}
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-color" style={{background: 'var(--bg)'}}></div>
            <span>Tỉnh/Thành phố</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{background: 'var(--secondary)'}}></div>
            <span>Hoàng Sa & Trường Sa</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{background: 'var(--accent)'}}></div>
            <span>Được chọn</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{background: 'var(--primary)', opacity: 0.3}}></div>
            <span>Hover</span>
          </div>
        </div>
      </div>
      
      {/* Selected region info */}
      {selectedRegionId && (
        <div className="location-info">
          <h4>📍 {selectedRegionId}</h4>
          <p>Tỉnh/thành phố được chọn trên bản đồ</p>
        </div>
      )}
    </div>
  )
}