const News = require("../models/News");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const router = require("express").Router();

//CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newNews = new News(req.body);

  try {
    const savedNews = await newNews.save();
    res.status(200).json(savedNews);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateNews = await News.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateNews);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.status(200).json("Новость была удалена");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET NEWS
router.get("/find/:newsSlug", async (req, res) => {
  try {
    const news = await News.findOne({
      newsSlug: req.params.newsSlug,
    });
    res.status(200).json(news);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL NEWS
router.get("/", async (req, res) => {
  try {
    const allNews = await News.find();
    res.status(200).json(allNews);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
