const DARKEN = color => {
  // Test input is hex value
  if (color[0] !== '#' || color.length !== 7) {
    console.error('DARKEN requires a 7 char hex value as input');
  }

  const rInput = color.substr(1, 2);
  const gInput = color.substr(3, 2);
  const bInput = color.substr(5, 2);

  const addedBlackOpacity = 0.2;

  const darkenHex = primaryColor => {
    const intInput = parseInt(primaryColor, 16);
    const intOutput = Math.floor(intInput * (1 - addedBlackOpacity));
    const hexOutput = intOutput.toString(16);
    return String(hexOutput);
  };

  return '#' + darkenHex(rInput) + darkenHex(gInput) + darkenHex(bInput);
};

export default DARKEN;
