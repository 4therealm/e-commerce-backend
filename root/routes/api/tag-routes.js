const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", (req, res) => {
  Tag.findAll({
    include: [
      {
        model: Product,
        through: {
          model: ProductTag,
          attributes: [],
        },
        attributes: ["id", "product_name"],
      },
    ],
  })
    .then((tags) => res.json(tags))
    .catch((err) => res.status(400).json({ error: err.message }));
});

router.get("/:id", (req, res) => {
  Tag.findByPk(req.params.id, {
    include: [
      {
        model: Product,
        through: { attributes: [] },
      },
    ],
  })
    .then((tag) => {
      if (!tag) {
        return res.status(404).send({ message: "Tag not found" });
      }
      res.send(tag);
    })
    .catch((error) => {
      res.status(400).send({ message: error.message });
    });
});

router.post("/", async (req, res) => {
  try {
    const newTag = await Tag.create({
      tag_name: req.body.tag_name,
    });
    res.status(201).json({
      message: "Tag created successfully",
      tag: newTag,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create tag",
      error: error,
    });
  }
});

router.put("/:id", (req, res) => {
  const { name } = req.body;

  Tag.update(
    { name },
    {
      where: { id: req.params.id },
    }
  )
    .then((numUpdated) => {
      if (numUpdated) {
        res.status(200).send(`Successfully updated tag name to "${name}"`);
      } else {
        res.status(404).send("Tag not found");
      }
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

router.delete("/:id", (req, res) => {
  // delete a single tag by its `id`
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

module.exports = router;
