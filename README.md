# 3D Ribbon Cutting Animation

This project demonstrates a 3D ribbon cutting animation using Three.js and React. It's perfect for virtual ceremonies, celebratory interfaces, or any application that needs a visually appealing ribbon cutting effect.

## Features

- Interactive 3D ribbon that responds to user input
- Realistic cutting animation with physics
- Customizable ribbon colors and dimensions
- Camera controls to view the animation from different angles

## Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

## Usage

Import the `RibbonCutting` component into your React application:

```jsx
import RibbonCutting from './components/RibbonCutting';

function App() {
  return (
    <div className="App">
      <RibbonCutting 
        ribbonColor="#ff0000" 
        width={5} 
        onComplete={() => console.log('Ribbon cut!')} 
      />
    </div>
  );
}
```

### Props

- `ribbonColor`: HEX color code for the ribbon (default: "#ff0000")
- `width`: Width of the ribbon in units (default: 5)
- `onComplete`: Callback function to execute when the ribbon is cut
- `autoRotate`: Boolean to enable/disable automatic camera rotation (default: true)

## How It Works

The animation uses Three.js for 3D rendering and custom shaders to create realistic ribbon material. When the user clicks the scissors button, a physics-based cutting animation is triggered, causing the ribbon to fall realistically.

## License

MIT
