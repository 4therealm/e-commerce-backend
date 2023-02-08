const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  const catData = await Category.findAll({
    include:
    {
      model: Product
    },
  }).catch((err) => {
    res.json(err);
  });
  res.json(catData);
});

router.get("/:id", async (req, res) => {
  const catData = await Category.findByPk(req.params.id,{
    include: {
      model: Product
    },
  })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
});

router.post("/", async (req, res) => {
  try {
    //need to add an object destructre
    const catData = await Category.create(req.body);
    res.status(200).json(catData);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put("/:id", async (req, res) => {
  //destructure object
  try {
    await Category.update(
      { category_name: req.body.category_name },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json(req.body);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const removed = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(req);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
