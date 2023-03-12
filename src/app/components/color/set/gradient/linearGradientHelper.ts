const WIDTH = 101 // 0 to 100
const HEIGHT = 1

class LinearGradientHelper {
    
  context: any = null
  
  constructor(gradientColors: any[]) { // [ [color, % ie 0, 0.5, 1], [ ... ], ... ]
    // Canvas
    const canvasElement: any = document.createElement("CANVAS");
    canvasElement.width = WIDTH;
    canvasElement.height = HEIGHT;
  
    this.context = canvasElement.getContext("2d");
    
    // Gradient
    const gradient =this.context.createLinearGradient(0, 0, WIDTH, 0); // x0, y0, x1, y1
    
    gradientColors.forEach(val => {
      gradient.addColorStop(val[1], val[0]);
    });
  
    // Fill with gradient
    this.context.fillStyle = gradient;
    this.context.fillRect(0, 0, WIDTH, HEIGHT); // x, y, width, height
  }
  
  getColor(percent: number) // percent [0..100]
  {
    const color = this.context.getImageData(percent, 0, 1, 1); // x, y, width, height
    const rgba = color.data;
    
    return `${ rgba[0] }, ${ rgba[1] }, ${ rgba[2] }`;
  }
}

export {
  LinearGradientHelper
}