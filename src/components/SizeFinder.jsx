import { useState } from 'react'

export default function SizeFinder({ isOpen, onClose, product, onSizeSelect }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [userData, setUserData] = useState({
    gender: 'male',
    height: '',
    weight: '',
    age: '',
    shoulders: 'average',
    chest: 'average',
    waist: 'average',
    hips: 'average'
  })

  const [recommendedSize, setRecommendedSize] = useState(null)

  if (!isOpen) return null

  // Size calculation logic based on measurements
  const calculateSize = () => {
    const height = parseInt(userData.height)
    const weight = parseInt(userData.weight)
    const gender = userData.gender

    // Basic BMI calculation
    const heightInM = height / 100
    const bmi = weight / (heightInM * heightInM)

    // Adjust for body shape
    let sizeAdjustment = 0
    if (userData.chest === 'much-larger') sizeAdjustment += 1
    if (userData.chest === 'larger') sizeAdjustment += 0.5
    if (userData.waist === 'larger' || userData.waist === 'much-larger') sizeAdjustment += 0.5
    if (userData.shoulders === 'larger') sizeAdjustment += 0.5

    // Size mapping based on Vietnamese traditional clothing standards
    let baseSize
    if (gender === 'male') {
      if (height < 160) baseSize = 'S'
      else if (height < 170) baseSize = 'M'
      else if (height < 180) baseSize = 'L'
      else baseSize = 'XL'
    } else {
      if (height < 155) baseSize = 'S'
      else if (height < 165) baseSize = 'M'
      else if (height < 175) baseSize = 'L'
      else baseSize = 'XL'
    }

    // Adjust based on BMI and body shape
    if (bmi > 25 || sizeAdjustment >= 1) {
      const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      const currentIndex = sizes.indexOf(baseSize)
      const newIndex = Math.min(currentIndex + Math.ceil(sizeAdjustment), sizes.length - 1)
      baseSize = sizes[newIndex]
    }

    // Calculate fit quality
    const fitQuality = {
      shoulders: userData.shoulders === 'average' ? 'Perfect fit' : 
                 userData.shoulders === 'larger' ? 'Slightly tight' : 'Perfect fit',
      chest: userData.chest === 'average' ? 'Perfect fit' : 
             userData.chest === 'much-larger' ? 'Tight fit' : 'Perfect fit',
      waist: userData.waist === 'average' ? 'Perfect fit' : 
             userData.waist === 'larger' ? 'Slightly loose' : 'Perfect fit'
    }

    return {
      size: baseSize,
      confidence: 'strong',
      fitDetails: fitQuality
    }
  }

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2)
    } else if (currentStep === 2) {
      const result = calculateSize()
      setRecommendedSize(result)
      setCurrentStep(3)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStartOver = () => {
    setCurrentStep(1)
    setUserData({
      gender: 'male',
      height: '',
      weight: '',
      age: '',
      shoulders: 'average',
      chest: 'average',
      waist: 'average',
      hips: 'average'
    })
    setRecommendedSize(null)
  }

  const handleSelectSize = () => {
    if (onSizeSelect && recommendedSize) {
      onSizeSelect(recommendedSize.size)
    }
    onClose()
  }

  const updateUserData = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }))
  }

  const isStep1Valid = userData.height && userData.weight && userData.age
  const isStep2Valid = true // All shape fields have default values

  return (
    <div className="size-finder-overlay">
      <div className="size-finder-modal">
        <div className="size-finder-header">
          <div className="step-indicator">
            <span className="step-number">{currentStep} OF 3</span>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="size-finder-content">
          {/* Step 1: About You */}
          {currentStep === 1 && (
            <div className="step-content fade-in">
              <h2>About You</h2>
              <p className="step-description">
                Tell us about yourself, so we can recommend the right size for you
              </p>

              <div className="form-group">
                <label>Gender</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={userData.gender === 'male'}
                      onChange={(e) => updateUserData('gender', e.target.value)}
                    />
                    <span>Male</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={userData.gender === 'female'}
                      onChange={(e) => updateUserData('gender', e.target.value)}
                    />
                    <span>Female</span>
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Height</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      value={userData.height}
                      onChange={(e) => updateUserData('height', e.target.value)}
                      placeholder="170"
                    />
                    <span className="unit">cm</span>
                  </div>
                  <small>E.g. 170</small>
                </div>

                <div className="form-group">
                  <label>Weight</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      value={userData.weight}
                      onChange={(e) => updateUserData('weight', e.target.value)}
                      placeholder="62"
                    />
                    <span className="unit">kg</span>
                  </div>
                  <small>E.g. 70</small>
                </div>
              </div>

              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  value={userData.age}
                  onChange={(e) => updateUserData('age', e.target.value)}
                  placeholder="20"
                />
                <small>Age helps us understand your weight distribution better.</small>
              </div>
            </div>
          )}

          {/* Step 2: Your Shape */}
          {currentStep === 2 && (
            <div className="step-content fade-in">
              <h2>Your Shape</h2>
              <p className="step-description">
                How do you see yourself compared to people of a similar weight and height?
              </p>

              <div className="shape-form">
                <div className="body-avatar">
                  <div className="avatar-illustration">
                    <svg viewBox="0 0 200 400" className="body-svg">
                      {/* Head */}
                      <ellipse cx="100" cy="80" rx="35" ry="45" fill="#e5e5e5" />
                      
                      {/* Shoulders - adjust width based on shoulder setting */}
                      <rect 
                        x={userData.shoulders === 'smaller' ? 70 : userData.shoulders === 'larger' ? 60 : 65} 
                        y="120" 
                        width={userData.shoulders === 'smaller' ? 60 : userData.shoulders === 'larger' ? 80 : 70}
                        height="100" 
                        rx="10" 
                        fill="#d1d5db"
                        style={{transition: 'all 0.3s ease'}}
                      />
                      
                      {/* Chest/Torso - adjust width based on chest setting */}
                      <rect 
                        x={userData.chest === 'smaller' ? 75 : 
                          userData.chest === 'larger' ? 65 : 
                          userData.chest === 'much-larger' ? 60 : 70} 
                        y="160" 
                        width={userData.chest === 'smaller' ? 50 : 
                               userData.chest === 'larger' ? 70 : 
                               userData.chest === 'much-larger' ? 80 : 60}
                        height="80" 
                        rx="8" 
                        fill="#9ca3af"
                        style={{transition: 'all 0.3s ease'}}
                      />
                      
                      {/* Waist - adjust width based on waist setting */}
                      <rect 
                        x={userData.waist === 'smaller' ? 80 : userData.waist === 'larger' ? 65 : 70} 
                        y="240" 
                        width={userData.waist === 'smaller' ? 40 : userData.waist === 'larger' ? 70 : 60}
                        height="60" 
                        rx="8" 
                        fill="#6b7280"
                        style={{transition: 'all 0.3s ease'}}
                      />
                      
                      {/* Hips - adjust width based on hips setting */}
                      <rect 
                        x={userData.hips === 'smaller' ? 80 : userData.hips === 'larger' ? 65 : 75} 
                        y="300" 
                        width={userData.hips === 'smaller' ? 40 : userData.hips === 'larger' ? 70 : 50}
                        height="100" 
                        rx="6" 
                        fill="#4b5563"
                        style={{transition: 'all 0.3s ease'}}
                      />
                      
                      {/* Visual indicators for selected areas */}
                      {userData.shoulders !== 'average' && (
                        <rect 
                          x={userData.shoulders === 'smaller' ? 70 : 60} 
                          y="120" 
                          width={userData.shoulders === 'smaller' ? 60 : 80}
                          height="100" 
                          rx="10" 
                          fill="none"
                          stroke="var(--primary)"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          style={{animation: 'pulse 2s infinite'}}
                        />
                      )}
                      
                      {userData.chest !== 'average' && (
                        <rect 
                          x={userData.chest === 'smaller' ? 75 : 
                            userData.chest === 'larger' ? 65 : 
                            userData.chest === 'much-larger' ? 60 : 70} 
                          y="160" 
                          width={userData.chest === 'smaller' ? 50 : 
                                 userData.chest === 'larger' ? 70 : 
                                 userData.chest === 'much-larger' ? 80 : 60}
                          height="80" 
                          rx="8" 
                          fill="none"
                          stroke="var(--secondary)"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          style={{animation: 'pulse 2s infinite'}}
                        />
                      )}
                      
                      {userData.waist !== 'average' && (
                        <rect 
                          x={userData.waist === 'smaller' ? 80 : userData.waist === 'larger' ? 65 : 70} 
                          y="240" 
                          width={userData.waist === 'smaller' ? 40 : userData.waist === 'larger' ? 70 : 60}
                          height="60" 
                          rx="8" 
                          fill="none"
                          stroke="var(--accent)"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          style={{animation: 'pulse 2s infinite'}}
                        />
                      )}
                      
                      {userData.hips !== 'average' && (
                        <rect 
                          x={userData.hips === 'smaller' ? 80 : userData.hips === 'larger' ? 65 : 75} 
                          y="300" 
                          width={userData.hips === 'smaller' ? 40 : userData.hips === 'larger' ? 70 : 50}
                          height="100" 
                          rx="6" 
                          fill="none"
                          stroke="var(--primary)"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          style={{animation: 'pulse 2s infinite'}}
                        />
                      )}
                    </svg>
                  </div>
                </div>

                <div className="shape-controls">
                  <div className="shape-item">
                    <label>Shoulders: <strong>{userData.shoulders}</strong></label>
                    <div className="slider-container">
                      <button 
                        onClick={() => {
                          const options = ['smaller', 'average', 'larger']
                          const current = options.indexOf(userData.shoulders)
                          if (current > 0) updateUserData('shoulders', options[current - 1])
                        }}
                        className="slider-btn"
                      >−</button>
                      <div className="slider-track">
                        <div className="slider-marks">
                          <span></span><span></span><span></span><span></span><span></span>
                        </div>
                        <div 
                          className="slider-thumb"
                          style={{
                            left: userData.shoulders === 'smaller' ? '10%' : 
                                  userData.shoulders === 'average' ? '50%' : '90%'
                          }}
                        ></div>
                      </div>
                      <button 
                        onClick={() => {
                          const options = ['smaller', 'average', 'larger']
                          const current = options.indexOf(userData.shoulders)
                          if (current < options.length - 1) updateUserData('shoulders', options[current + 1])
                        }}
                        className="slider-btn"
                      >+</button>
                    </div>
                  </div>

                  <div className="shape-item">
                    <label>Chest: <strong>{userData.chest}</strong></label>
                    <div className="slider-container">
                      <button 
                        onClick={() => {
                          const options = ['smaller', 'average', 'larger', 'much-larger']
                          const current = options.indexOf(userData.chest)
                          if (current > 0) updateUserData('chest', options[current - 1])
                        }}
                        className="slider-btn"
                      >−</button>
                      <div className="slider-track">
                        <div className="slider-marks">
                          <span></span><span></span><span></span><span></span><span></span>
                        </div>
                        <div 
                          className="slider-thumb"
                          style={{
                            left: userData.chest === 'smaller' ? '10%' : 
                                  userData.chest === 'average' ? '40%' : 
                                  userData.chest === 'larger' ? '70%' : '90%'
                          }}
                        ></div>
                      </div>
                      <button 
                        onClick={() => {
                          const options = ['smaller', 'average', 'larger', 'much-larger']
                          const current = options.indexOf(userData.chest)
                          if (current < options.length - 1) updateUserData('chest', options[current + 1])
                        }}
                        className="slider-btn"
                      >+</button>
                    </div>
                  </div>

                  <div className="shape-item">
                    <label>Waist: <strong>{userData.waist}</strong></label>
                    <div className="slider-container">
                      <button 
                        onClick={() => {
                          const options = ['smaller', 'average', 'larger']
                          const current = options.indexOf(userData.waist)
                          if (current > 0) updateUserData('waist', options[current - 1])
                        }}
                        className="slider-btn"
                      >−</button>
                      <div className="slider-track">
                        <div className="slider-marks">
                          <span></span><span></span><span></span><span></span><span></span>
                        </div>
                        <div 
                          className="slider-thumb"
                          style={{
                            left: userData.waist === 'smaller' ? '10%' : 
                                  userData.waist === 'average' ? '50%' : '90%'
                          }}
                        ></div>
                      </div>
                      <button 
                        onClick={() => {
                          const options = ['smaller', 'average', 'larger']
                          const current = options.indexOf(userData.waist)
                          if (current < options.length - 1) updateUserData('waist', options[current + 1])
                        }}
                        className="slider-btn"
                      >+</button>
                    </div>
                  </div>

                  <div className="shape-item">
                    <label>Hips: <strong>{userData.hips}</strong></label>
                    <div className="slider-container">
                      <button 
                        onClick={() => {
                          const options = ['smaller', 'average', 'larger']
                          const current = options.indexOf(userData.hips)
                          if (current > 0) updateUserData('hips', options[current - 1])
                        }}
                        className="slider-btn"
                      >−</button>
                      <div className="slider-track">
                        <div className="slider-marks">
                          <span></span><span></span><span></span><span></span><span></span>
                        </div>
                        <div 
                          className="slider-thumb"
                          style={{
                            left: userData.hips === 'smaller' ? '10%' : 
                                  userData.hips === 'average' ? '50%' : '90%'
                          }}
                        ></div>
                      </div>
                      <button 
                        onClick={() => {
                          const options = ['smaller', 'average', 'larger']
                          const current = options.indexOf(userData.hips)
                          if (current < options.length - 1) updateUserData('hips', options[current + 1])
                        }}
                        className="slider-btn"
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Result */}
          {currentStep === 3 && recommendedSize && (
            <div className="step-content fade-in">
              <h2>Your recommended size is: {recommendedSize.size}</h2>
              <p className="confidence-text">
                There is a <strong>{recommendedSize.confidence}</strong> chance that this size will fit you perfectly
              </p>

              <div className="result-visualization">
                <div className="result-avatar">
                  <svg viewBox="0 0 200 400" className="body-svg result">
                    {/* Head */}
                    <ellipse cx="100" cy="80" rx="35" ry="45" fill="#f0f9ff" stroke="#0ea5e9" strokeWidth="2" />
                    
                    {/* Shoulders - show selected shape */}
                    <rect 
                      x={userData.shoulders === 'smaller' ? 70 : userData.shoulders === 'larger' ? 60 : 65} 
                      y="120" 
                      width={userData.shoulders === 'smaller' ? 60 : userData.shoulders === 'larger' ? 80 : 70}
                      height="100" 
                      rx="10" 
                      fill="#f0f9ff" 
                      stroke="#0ea5e9" 
                      strokeWidth="2"
                      style={{transition: 'all 0.3s ease'}}
                    />
                    
                    {/* Chest - show selected shape */}
                    <rect 
                      x={userData.chest === 'smaller' ? 75 : 
                        userData.chest === 'larger' ? 65 : 
                        userData.chest === 'much-larger' ? 60 : 70} 
                      y="160" 
                      width={userData.chest === 'smaller' ? 50 : 
                             userData.chest === 'larger' ? 70 : 
                             userData.chest === 'much-larger' ? 80 : 60}
                      height="80" 
                      rx="8" 
                      fill="#f0f9ff" 
                      stroke="#0ea5e9" 
                      strokeWidth="2"
                      style={{transition: 'all 0.3s ease'}}
                    />
                    
                    {/* Waist - show selected shape */}
                    <rect 
                      x={userData.waist === 'smaller' ? 80 : userData.waist === 'larger' ? 65 : 70} 
                      y="240" 
                      width={userData.waist === 'smaller' ? 40 : userData.waist === 'larger' ? 70 : 60}
                      height="60" 
                      rx="8" 
                      fill="#f0f9ff" 
                      stroke="#0ea5e9" 
                      strokeWidth="2"
                      style={{transition: 'all 0.3s ease'}}
                    />
                    
                    {/* Hips - show selected shape */}
                    <rect 
                      x={userData.hips === 'smaller' ? 80 : userData.hips === 'larger' ? 65 : 75} 
                      y="300" 
                      width={userData.hips === 'smaller' ? 40 : userData.hips === 'larger' ? 70 : 50}
                      height="100" 
                      rx="6" 
                      fill="#f0f9ff" 
                      stroke="#0ea5e9" 
                      strokeWidth="2"
                      style={{transition: 'all 0.3s ease'}}
                    />
                    
                    {/* Size indicator overlay */}
                    <text 
                      x="100" 
                      y="50" 
                      textAnchor="middle" 
                      fill="#0ea5e9" 
                      fontSize="14" 
                      fontWeight="bold"
                    >
                      Size {recommendedSize.size}
                    </text>
                  </svg>
                </div>

                <div className="fit-details">
                  <div className="fit-item">
                    <div className="fit-icon">ℹ️</div>
                    <div className="fit-info">
                      <span>Shoulders:</span>
                      <strong>{recommendedSize.fitDetails.shoulders}</strong>
                    </div>
                  </div>

                  <div className="fit-item">
                    <div className="fit-icon">ℹ️</div>
                    <div className="fit-info">
                      <span>Chest:</span>
                      <strong>{recommendedSize.fitDetails.chest}</strong>
                    </div>
                  </div>

                  <div className="fit-item">
                    <div className="fit-icon">ℹ️</div>
                    <div className="fit-info">
                      <span>Waist:</span>
                      <strong>{recommendedSize.fitDetails.waist}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {product && (
                <div className="product-info">
                  <h4>Size {recommendedSize.size} for {product.name}</h4>
                  <p>Traditional {product.ethnic} clothing from {product.village}, {product.province}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="size-finder-footer">
          {currentStep === 1 && (
            <button 
              className="btn primary full-width"
              onClick={handleNext}
              disabled={!isStep1Valid}
            >
              CONTINUE
            </button>
          )}

          {currentStep === 2 && (
            <div className="button-row">
              <button className="btn ghost" onClick={handlePrevious}>
                PREVIOUS
              </button>
              <button 
                className="btn primary"
                onClick={handleNext}
                disabled={!isStep2Valid}
              >
                CALCULATE
              </button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="button-row">
              <button className="btn ghost" onClick={handleStartOver}>
                START OVER
              </button>
              <button className="btn primary" onClick={handleSelectSize}>
                SELECT THIS SIZE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
