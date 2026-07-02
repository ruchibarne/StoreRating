const { fn, col } = require('sequelize');
const { Store, Rating, User } = require('../models');

const getDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const store = await Store.findOne({ where: { ownerId } });
    if (!store) {
      return res.status(404).json({ message: 'No store is registered under this account yet' });
    }

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'address'] }],
      order: [['createdAt', 'DESC']],
    });

    const avgResult = await Rating.findOne({
      where: { storeId: store.id },
      attributes: [[fn('AVG', col('rating')), 'averageRating']],
      raw: true,
    });

    return res.json({
      store: { id: store.id, name: store.name, email: store.email, address: store.address },
      averageRating: avgResult.averageRating ? Number(avgResult.averageRating).toFixed(2) : null,
      raters: ratings.map((r) => ({
        userId: r.user.id,
        name: r.user.name,
        email: r.user.email,
        address: r.user.address,
        rating: r.rating,
        ratedAt: r.createdAt,
      })),
    });
  } catch (err) {
    console.error('Store owner dashboard error:', err);
    return res.status(500).json({ message: 'Could not load store owner dashboard' });
  }
};

module.exports = { getDashboard };
