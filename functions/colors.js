const myColors = [
  '4AFF00',
  'E8A40C',
  'FF0000',
  '2F0CE8',
  '0DFFCF',
];

module.exports = {
  getColors: numColors => myColors.splice(0, numColors),
  getColorPosition: color => myColors.indexOf(color),
  nextColor: (color) => {
    if (color === '0DFFCF') {
      return myColors[0];
    }
    const indexOfColor = myColors.indexOf(color);
    if (indexOfColor > -1) {
      return myColors[indexOfColor + 1];
    }
    return new Error('color not found');
  },
};
