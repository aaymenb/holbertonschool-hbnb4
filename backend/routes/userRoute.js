const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    updateUserProfile,
    getUserProfile
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Routes publiques pour les utilisateurs connectés
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

// Routes admin
router.use(authorize('admin'));
router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router; 
