// TODO: Make a much better color handler.
// He can maybe generate random colors with different hue but the
// but with the same base color.
// see: https://stackoverflow.com/questions/17433015/change-the-hue-of-a-rgb-color-in-javascript
const myColors = [
  '#4AFF00',
  '#E8A40C',
  '#FF0000',
  '#2F0CE8',
  '#0DFFCF',
  '#4AFF00',
  '#E8A40C',
  '#FF0000',
  '#2F0CE8',
  '#4AFF00',
  '#E8A40C',
  '#FF0000',
  '#2F0CE8',
  '#4AFF00',
  '#E8A40C',
  '#FF0000',
  '#2F0CE8',
];

module.exports = {
  getAllColors: numColors => myColors,
  getColors: numColors => myColors.slice(0, numColors),
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
