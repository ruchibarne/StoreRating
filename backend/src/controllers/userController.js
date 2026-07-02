const { Op, fn, col } = require('sequelize');
const { Store, Rating } = require('../models');
const { isValidRating } = require('../utils/validators');

const browseStores = async (req, res) => {
  try {
    const { name, address, sortBy = 'name', order = 'ASC' } = req.query;
    const userId = req.user.id;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const allowedSortFields = ['name', 'address', 'createdAt'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const stores = await Store.findAll({
      where,
      attributes: {
        include: [[fn('AVG', col('ratings.rating')), 'averageRating']],
      },
      include: [{ model: Rating, as: 'ratings', attributes: [] }],
      group: ['Store.id'],
      order: [[sortField, sortOrder]],
      subQuery: false,
    });

    const userRatings = await Rating.findAll({ where: { userId } });
    const ratingMap = {};
    userRatings.forEach((r) => { ratingMap[r.storeId] = r.rating; });

    const result = stores.map((store) => {
      const storeData = store.toJSON();
      storeData.userRating = ratingMap[store.id] || null;
      return storeData;
    });

    return res.json({ stores: result });
  } catch (err) {
    console.error('Browse stores error:', err);
    return res.status(500).json({ message: 'Could not fetch stores' });
  }
};
const submitRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    if (!isValidRating(rating)) {
      return res.status(400).json({ message: 'Rating must be a whole number between 1 and 5' });
    }

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const existingRating = await Rating.findOne({ where: { userId, storeId } });
    if (existingRating) {
      return res.status(409).json({ message: 'You have already rated this store. Use update instead.' });
    }

    const newRating = await Rating.create({ userId, storeId, rating });

    return res.status(201).json({ message: 'Rating submitted successfully', rating: newRating });
  } catch (err) {
    console.error('Submit rating error:', err);
    return res.status(500).json({ message: 'Could not submit rating' });
  }
};

const updateRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    if (!isValidRating(rating)) {
      return res.status(400).json({ message: 'Rating must be a whole number between 1 and 5' });
    }

    const existingRating = await Rating.findOne({ where: { userId, storeId } });
    if (!existingRating) {
      return res.status(404).json({ message: 'You have not rated this store yet' });
    }

    existingRating.rating = rating;
    await existingRating.save();

    return res.json({ message: 'Rating updated successfully', rating: existingRating });
  } catch (err) {
    console.error('Update rating error:', err);
    return res.status(500).json({ message: 'Could not update rating' });
  }
};

module.exports = { browseStores, submitRating, updateRating };
