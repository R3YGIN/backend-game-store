const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Продукт был удален");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT
router.get("/find/:productSlug", async (req, res) => {
  try {
    const product = await Product.findOne({
      productSlug: req.params.productSlug,
    });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  // const qCategory = req.query.category;
  const qGenre = req.query.genre;
  const qSearch = req.query.search;
  const qSearchNav = req.query.searchNav;
  const qPrice = req.query.price;
  const qSale = req.query.sale;
  const qFree = req.query.free;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(7); //Последние добавленные игры
    } else if (qGenre && qPrice && qSearch && qSale) {
      products = await Product.find({
        genre: {
          $in: [qGenre],
        },
        sale: { $gte: 1 },
        price: { $lte: qPrice },
        title: new RegExp(qSearch, "i"),
      });
    } else if (qGenre && qPrice && qSearch) {
      products = await Product.find({
        genre: {
          $in: [qGenre],
        },
        price: { $lte: qPrice },
        title: new RegExp(qSearch, "i"),
      });
    } else if (qSale && qPrice && qSearch) {
      products = await Product.find({
        sale: { $gte: 1 },
        price: { $lte: qPrice },
        title: new RegExp(qSearch, "i"),
      });
    } else if (qGenre && qSale && qSearch) {
      products = await Product.find({
        genre: {
          $in: [qGenre],
        },
        sale: { $gte: 1 },
        title: new RegExp(qSearch, "i"),
      });
    } else if (qGenre && qPrice && qSale) {
      products = await Product.find({
        genre: {
          $in: [qGenre],
        },
        price: { $lte: qPrice },
        sale: { $gte: 1 },
      });
    } else if (qGenre && qSearch) {
      products = await Product.find({
        genre: {
          $in: [qGenre],
        },
        title: new RegExp(qSearch, "i"),
      });
    } else if (qPrice && qSearch) {
      products = await Product.find({
        price: { $lte: qPrice },
        title: new RegExp(qSearch, "i"),
      });
    } else if (qSale && qSearch) {
      products = await Product.find({
        sale: { $gte: 1 },
        title: new RegExp(qSearch, "i"),
      });
    } else if (qPrice && qGenre) {
      products = await Product.find({
        price: { $lte: qPrice },
        genre: {
          $in: [qGenre],
        },
      });
    } else if (qSale && qGenre) {
      products = await Product.find({
        sale: { $gte: 1 },
        genre: {
          $in: [qGenre],
        },
      });
    } else if (qSale && qPrice) {
      products = await Product.find({
        price: { $lte: qPrice },
        sale: { $gte: 1 },
      });
    } else if (qGenre) {
      products = await Product.find({
        genre: {
          $in: [qGenre],
        },
      });
    } else if (qSearch) {
      products = await Product.find({ title: new RegExp(qSearch, "i") }); //Поиск по названию
    } else if (qSearchNav) {
      products = await Product.find({
        title: new RegExp(qSearchNav, "i"),
      }).limit(4); //Поиск по названию в навигации
    } else if (qPrice) {
      products = await Product.find({ price: { $lte: qPrice } }); //Фильтр цены
    } else if (qSale) {
      products = await Product.find({ sale: { $gte: 1 } }); //Фильтр игры со скидками
    } else if (qFree) {
      products = await Product.findOne({ sale: 100 }); //Бесплатная игра (скидка 100%)
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
