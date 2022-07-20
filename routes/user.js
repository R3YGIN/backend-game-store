const Cart = require("../models/Cart");
const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");

const router = require("express").Router();

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  // if (req.body.password) {
  //   req.body.password = CryptoJS.AES.encrypt(
  //     req.body.password,
  //     process.env.PASS_SEC
  //   ).toString();
  // }

  try {
    //1
    if (!req.body.oldPassword) {
      res.status(401).json("Введите старый пароль!");
      return;
    }
    if (req.body.oldPassword) {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(401).json("Неверные данные!");
        return;
      }
      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SEC
      );
      const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
      const inputOldPassword = req.body.oldPassword;
      if (originalPassword !== inputOldPassword) {
        res.status(401).json("Неверные данные!");
        return;
      }
    }
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString();
    }
    const { oldPassword, ...rest } = req.body;
    //1
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: rest,
        // $set: req.body,
      },
      { new: true }
    );
    const { password, ...other } = updateUser._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id); //Удаление аккаунта
    await Cart.findOneAndDelete({ userId: req.params.id }); //Удаление корзины из базы
    res.status(200).json("Пользователь был удален");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5) //Новые пользователи(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER STATS

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
