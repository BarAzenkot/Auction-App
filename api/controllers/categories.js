module.exports = {
  getCategory: (req, res, next) => {
    const categoryID = req.params.categoryID;
    res.status(200).json({
      message: `Category - ${categoryID}`,
    });
  },
};
