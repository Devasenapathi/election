// generate random color mixed of light and dark colors.
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

//Generate dark colors only
function getDarkRandomColor() {
    const getRandomHexComponent = () => {
      // Generate a random number between 0 and 127 (hex: 00 to 7F)
      const randomHexComponent = Math.floor(Math.random() * 128).toString(16);
      return randomHexComponent.length === 1 ? '0' + randomHexComponent : randomHexComponent;
    };
  
    // Generate a dark color by ensuring all color components are low (00 to 7F)
    const color = `#${getRandomHexComponent()}${getRandomHexComponent()}${getRandomHexComponent()}`;
    return color;
  }
  
  // Create an array of random colors
  export function generateRandomColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(getDarkRandomColor());
    }
    return colors;
  }