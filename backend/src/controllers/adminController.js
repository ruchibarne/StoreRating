const bcrypt = require('bcryptjs');
const { Op, fn, col } = require('sequelize');
const { User, Store, Rating, sequelize } = require('../models');
const { isValidName, isValidAddress, isValidEmail, isValidPassword } = require('../utils/validators');
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
    ]);

    return res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return res.status(500).json({ message: 'Could not load dashboard stats' });
  }
};
const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const allowedRoles = ['ADMIN', 'USER', 'STORE_OWNER'];

    if (!isValidName(name)) {
      return res.status(400).json({ message: 'Name must be between 20 and 60 characters'});
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email id'});
    }
    if (!isValidAddress(address)) {
      return res.status(400).json({ message: 'Max 400 characters' });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: 'Password must be 8-16 characters with at least one uppercase letter and one special character',
      });
    }
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'A user with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      address,
      password: hashedPassword,
      role: role || 'USER',
    });

    return res.status(201).json({
      message: 'User created successfully',
      user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role },
    });
  } catch (err) {
    console.error('Create user error:', err);
    return res.status(500).json({ message: 'Something went wrong while creating the user' });
  }
};

const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!isValidName(name)) {
      return res.status(400).json({ message: 'Store name must be between 20 and 60 characters' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid store email' });
    }
    if (!isValidAddress(address)) {
      return res.status(400).json({ message: 'Address must not exceed 400 characters' });
    }

    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      if (!owner) {
        return res.status(404).json({ message: 'Specified store owner does not exist' });
      }
      if (owner.role !== 'STORE_OWNER') {
        return res.status(400).json({ message: 'Specified user is not a store owner' });
      }
    }

    const store = await Store.create({ name, email, address, ownerId: ownerId || null });

    return res.status(201).json({ message: 'Store created successfully', store });
  } catch (err) {
    console.error('Create store error:', err);
    return res.status(500).json({ message: 'Something went wrong while creating the store' });
  }
};

const listStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', order = 'ASC' } = req.query;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const allowedSortFields = ['name', 'email', 'address', 'createdAt'];
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

    return res.json({ stores });
  } catch (err) {
    console.error('List stores error:', err);
    return res.status(500).json({ message: 'Could not fetch stores' });
  }
};

const listUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const allowedSortFields = ['name', 'email', 'address', 'role', 'createdAt'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt'],
      order: [[sortField, sortOrder]],
    });

    return res.json({ users });
  } catch (err) {
    console.error('List users error:', err);
    return res.status(500).json({ message: 'Could not fetch users' });
  }
};

const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let responseData = user.toJSON();

    if (user.role === 'STORE_OWNER') {
      const store = await Store.findOne({
        where: { ownerId: user.id },
        attributes: {
          include: [[fn('AVG', col('ratings.rating')), 'averageRating']],
        },
        include: [{ model: Rating, as: 'ratings', attributes: [] }],
        group: ['Store.id'],
      });
      responseData.rating = store ? store.get('averageRating') : null;
      responseData.storeId = store ? store.id : null;
    }

    return res.json({ user: responseData });
  } catch (err) {
    console.error('Get user detail error:', err);
    return res.status(500).json({ message: 'Could not fetch user details' });
  }
};

module.exports = {
  getDashboardStats,
  createUser,
  createStore,
  listStores,
  listUsers,
  getUserDetail,
};
