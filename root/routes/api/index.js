const router = require('express').Router();
const categoryRoutes = require('./category-routes');
const productRoutes = require('./product-routes');
const tagRoutes = require('./tag-routes');

router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/tags', tagRoutes);

router.get('/', (req, res) => {
  res.json(`${req.method} request received to API`)
  console.info(req.rawHeaders);})
router.post('/', (req, res) => {
  res.json(`${req.method} request received to API`)
  console.info(req.rawHeaders);})

module.exports = router;
