# 🇻🇳 weARvietnam

**AR Virtual Try-On Platform for Vietnamese Traditional Clothing**

A modern React web application showcasing Vietnamese traditional clothing from all 54 ethnic groups with AR virtual try-on capabilities, interactive map, and cultural preservation focus.

![weARvietnam](https://img.shields.io/badge/weARvietnam-AR%20Platform-red?style=for-the-badge&logo=react)
![Vietnam](https://img.shields.io/badge/Made%20in-Vietnam-yellow?style=for-the-badge)

## ✨ Features

### 🎯 Core Features
- **Virtual Try-On**: AR-powered clothing preview with camera mock
- **Interactive Vietnam Map**: Complete map with all 63 provinces + Hoang Sa & Truong Sa islands
- **Cultural Showcase**: Products from 54 ethnic groups with village details
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean design with Vietnam flag color scheme (red & yellow)

### 🗺️ Interactive Map
- **Zoom Functionality**: Click on products to automatically zoom to their province
- **TopoJSON Integration**: Official Vietnam administrative boundaries
- **Island Coverage**: Includes Hoang Sa (Paracel) and Truong Sa (Spratly) islands
- **Smooth Animations**: 0.8s transitions with cubic-bezier easing
- **Province Highlighting**: Visual feedback with hover and selection states

### 🛍️ E-commerce Features
- **Product Catalog**: 16+ traditional clothing items
- **Shopping Cart**: Zustand-powered state management
- **Product Slider**: Auto-playing carousel with manual controls
- **Artisan Profiles**: Direct connection to craft villages
- **Cultural Information**: Ethnic group details and traditions

## 🚀 Tech Stack

- **Frontend**: React 19.1.1 + Vite 7.1.5
- **Routing**: React Router DOM 7.8.2
- **State Management**: Zustand 5.0.8
- **Map Rendering**: TopoJSON + Custom SVG
- **Styling**: Modern CSS with CSS Variables
- **Build Tool**: Vite with React Fast Refresh

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/weARvietnam.git
cd weARvietnam

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 Usage

### Development
```bash
npm run dev
```
Visit `http://localhost:5173` (or alternative port if 5173 is busy)

### Available Pages
- **Home** (`/`): Hero section with featured products slider
- **Shop** (`/shop`): Complete product catalog with filters
- **Virtual Try-On** (`/try-on`): AR clothing preview with camera
- **Artisans** (`/artisans`): Interactive map with village details
- **Cart** (`/cart`): Shopping cart with checkout flow

## 🗺️ Map Features

### Interactive Vietnam Map
- **Complete Coverage**: All 63 provinces/cities + 2 island groups
- **Product Integration**: Click products → Auto-zoom to origin province
- **Manual Navigation**: Click provinces directly for exploration
- **Visual Feedback**: Hover effects and selection highlighting
- **Geographic Features**: Mekong Delta, Red River Delta, Central Highlands

### Technical Implementation
```javascript
// Auto-zoom when product selected
useEffect(() => {
  if (selectedProduct && selectedProduct.province) {
    const matchingFeature = findMatchingProvince(selectedProduct.province)
    if (matchingFeature) {
      setTimeout(() => zoomToFeature(matchingFeature), 200)
    }
  }
}, [selectedProduct])
```

## 🎨 Design System

### Color Palette (Vietnam Flag Theme)
```css
:root {
  --primary: #da251d;      /* Vietnam Red */
  --primary-dark: #b91c1c; /* Darker Red */
  --secondary: #fbbf24;    /* Vietnam Yellow */
  --accent: #f59e0b;       /* Golden Yellow */
  --text: #1f2937;         /* Dark Gray */
  --bg: #fefefe;           /* Off White */
}
```

### Typography
- **Font Family**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Responsive Scaling**: Fluid typography across devices
- **Cultural Icons**: Emoji integration for Vietnamese elements

## 📁 Project Structure

```
weARvietnam/
├── public/
│   └── overlay.png          # Product image placeholder
├── src/
│   ├── components/
│   │   ├── CameraMock.jsx   # AR camera simulation
│   │   ├── Filters.jsx      # Product filtering
│   │   ├── Header.jsx       # Navigation with cart
│   │   ├── Footer.jsx       # Site footer
│   │   ├── InteractiveMap.jsx # Vietnam map with zoom
│   │   ├── ProductCard.jsx  # Product display
│   │   └── ProductSlider.jsx # Auto-playing carousel
│   ├── data/
│   │   ├── products.json    # Product catalog with locations
│   │   ├── artisans.json    # Artisan profiles
│   │   └── vietnam-topojson.json # Official map data
│   ├── routes/
│   │   ├── Home.jsx         # Landing page
│   │   ├── Shop.jsx         # Product catalog
│   │   ├── TryOn.jsx        # Virtual try-on
│   │   ├── Artisans.jsx     # Interactive map page
│   │   ├── ProductDetail.jsx # Individual product
│   │   ├── Cart.jsx         # Shopping cart
│   │   └── Checkout.jsx     # Purchase flow
│   ├── store/
│   │   └── cart.js          # Zustand cart state
│   ├── index.css            # Global styles
│   ├── main.jsx            # App entry point
│   └── App.jsx             # Main app component
├── package.json
├── vite.config.js
└── README.md
```

## 🌟 Key Components

### InteractiveMap.jsx
- TopoJSON processing with bounds calculation
- SVG rendering with transform-based zooming
- Province matching with fuzzy logic
- Smooth animations and transitions

### ProductSlider.jsx
- Auto-playing carousel with pause/play controls
- Responsive design with configurable items per view
- Touch-friendly navigation with dot indicators
- Seamless infinite loop

### Cart Management (Zustand)
```javascript
export const useCart = create((set) => ({
  items: [],
  addItem: (product) => set((state) => ({
    items: [...state.items, { ...product, qty: 1 }]
  })),
  // ... more cart operations
}))
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Configure base path in vite.config.js
# Deploy dist/ folder to gh-pages branch
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Vietnam Administrative Data**: Official TopoJSON from Vietnam Department of Survey and Mapping
- **Cultural Consultants**: Vietnamese artisans and cultural experts
- **Design Inspiration**: Traditional Vietnamese art and modern web design
- **Technical Stack**: React, Vite, and the open-source community

## 📧 Contact

- **Project**: weARvietnam - AR Virtual Try-On Platform
- **Description**: Preserving Vietnamese culture through modern technology
- **Tech Stack**: React + Vite + TopoJSON + Zustand

---

**Made with ❤️ for Vietnamese cultural preservation**

🇻🇳 **weARvietnam** - Connecting 54 ethnic groups through AR technology