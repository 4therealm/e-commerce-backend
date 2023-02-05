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
        res
          .status(200)
          .json({ message: `Tag id: ${req.params.id} updated to '${name}'` });
      } else {
        res.status(404).send({ message: "Tag not found" });
      }
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

router.delete("/:id", async (req, res) => {
  try {
    // Find the targeted product using its ID
    const tag = await Tag.findByPk(req.params.id);

    // If the tag doesn't exist, return a 404 error
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    // Otherwise, destroy the tag
    await tag.destroy();

    // Return a success response
    res.json({ message: `Tag id: ${req.params.id} successfully destroyed` });
  } catch (error) {
    // Return an error response
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
