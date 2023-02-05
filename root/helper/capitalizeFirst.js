const {Model}=require("sequelize/types")

function capitalizeFirstLetter(obj) {
  let newObj = {};
  Object.entries(obj).forEach(([key, value]) => {
    let newKey = key.charAt(0).toUpperCase() + key.slice(1);
    if (typeof value === 'string') {
      newObj[newKey] = value.charAt(0).toUpperCase() + value.slice(1);
    } else if (typeof value === 'object' && value !== null) {
      newObj[newKey] = capitalizeFirstLetter(value);
    } else {
      newObj[newKey] = value;
    }
  });
  return newObj;
}
// res.json(capitalizeFirstLetter(products));

module.exports = capitalizeFirstLetter()