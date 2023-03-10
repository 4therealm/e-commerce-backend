const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: {
        exclude: ['category_id']
      },
      include: [
        {
          model: Category,
          attributes: ["category_name"],
          as: "category",
          required: true,
        },
        {
          model: Tag,
          attributes: ["tag_name"],
          through: {
            model: ProductTag,
            attributes: ["tag_id"],
          },
          required: false,
        },
      ],
    });

    // handle the retrieved products data
    res.json(products);
  } catch (err) {
    // handle the error
    res.status(500).json({ error: err.message });
  }
});

// get one product
router.get("/:id", (req, res) => {
  Product.findByPk(req.params.id, {
    attributes: {
      exclude: ['category_id']
    },
    include: [
      {
        model: Category,
        attributes: ["category_name"],
        as: "category",
        required: true,
      },
      {
        model: Tag,
        attributes: ["tag_name"],
        through: {
          model: ProductTag,
          attributes: ["tag_id"],
        },
        required: false,
      },
    ],
  })
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.json(product);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: "Error retrieving product" });
    });
});

// create new product
router.post("/", (req, res) => {
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => {
      res.status(200).json(productTagIds);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put("/:id", (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// Delete endpoint
router.delete("/:id", async (req, res) => {
  try {
    // Find the targeted product using its ID
    const product = await Product.findByPk(req.params.id);

    // If the product doesn't exist, return a 404 error
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Otherwise, destroy the product
    await product.destroy();

    // Return a success response
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    // Return an error response
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
