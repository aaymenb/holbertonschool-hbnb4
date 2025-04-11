const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Obtenir tous les utilisateurs
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc    Obtenir un seul utilisateur
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
        return next(
            new ErrorResponse(`Utilisateur non trouvé avec l'id ${req.params.id}`, 404)
        );
    }
    
    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Créer un utilisateur
// @route   POST /api/v1/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    
    res.status(201).json({
        success: true,
        data: user
    });
});

// @desc    Mettre à jour un utilisateur
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    
    if (!user) {
        return next(
            new ErrorResponse(`Utilisateur non trouvé avec l'id ${req.params.id}`, 404)
        );
    }
    
    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Supprimer un utilisateur
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
        return next(
            new ErrorResponse(`Utilisateur non trouvé avec l'id ${req.params.id}`, 404)
        );
    }
    
    await user.remove();
    
    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Obtenir le profil de l'utilisateur actuel
// @route   GET /api/v1/users/profile
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Mettre à jour les informations du profil
// @route   PUT /api/v1/users/profile
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        bio: req.body.bio,
        phoneNumber: req.body.phoneNumber
    };
    
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });
    
    res.status(200).json({
        success: true,
        data: user
    });
}); 
