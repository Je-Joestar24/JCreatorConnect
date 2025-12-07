import express from 'express';
import { body } from 'express-validator';
import {
  getPublicProfile,
  getMyProfile,
  updateProfile,
  uploadProfilePicture,
  uploadBanner,
  updateBio,
  updateSocialLinks,
  setRecommendedSupportAmounts,
  setThankYouMessage,
} from '../controllers/creatorprofile.controller.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

/**
 * Validation rules for updating profile bio
 */
const updateBioValidation = [
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Bio cannot exceed 1000 characters'),
];

/**
 * Validation rules for updating social links
 */
const updateSocialLinksValidation = [
  body('socials.instagram')
    .optional()
    .trim()
    .isURL()
    .withMessage('Instagram must be a valid URL')
    .matches(/instagram\.com/)
    .withMessage('Please provide a valid Instagram URL'),
  body('socials.youtube')
    .optional()
    .trim()
    .isURL()
    .withMessage('YouTube must be a valid URL')
    .matches(/youtube\.com|youtu\.be/)
    .withMessage('Please provide a valid YouTube URL'),
  body('socials.twitter')
    .optional()
    .trim()
    .isURL()
    .withMessage('Twitter must be a valid URL')
    .matches(/twitter\.com|x\.com/)
    .withMessage('Please provide a valid Twitter/X URL'),
  body('socials.website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Website must be a valid URL'),
];

/**
 * Validation rules for setting recommended support amounts
 */
const setSupportAmountsValidation = [
  body('recommendedAmounts')
    .optional()
    .isArray()
    .withMessage('Recommended amounts must be an array')
    .custom((amounts) => {
      if (amounts.length > 5) {
        throw new Error('Maximum 5 recommended amounts allowed');
      }
      return amounts.every(
        (amount) => typeof amount === 'number' && amount > 0
      );
    })
    .withMessage('All amounts must be positive numbers'),
];

/**
 * Validation rules for thank you message
 */
const setThankYouMessageValidation = [
  body('thankYouMessage')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Thank you message cannot exceed 500 characters'),
];

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * @route   GET /api/creator-profile/:id
 * @desc    Get public creator profile by user ID
 * @access  Public
 * @param   {string} id - Creator's user ID (MongoDB ObjectId)
 * @returns {object} Creator profile with public information
 */
router.get('/:id', getPublicProfile);

// ============================================
// PROTECTED ROUTES (Creator Only)
// ============================================

/**
 * @route   GET /api/creator-profile/me
 * @desc    Get current creator's own profile (with private data)
 * @access  Private (Creator only)
 * @returns {object} Full creator profile including private settings
 */
router.get('/own/me', protect, authorize('creator'), getMyProfile);

/**
 * @route   PUT /api/creator-profile/me
 * @desc    Update creator profile (general update)
 * @access  Private (Creator only)
 * @body    {object} Profile data to update (bio, categories, etc.)
 * @returns {object} Updated creator profile
 */
router.put(
  '/own/me',
  protect,
  authorize('creator'),
  updateBioValidation,
  handleValidationErrors,
  updateProfile
);

/**
 * @route   POST /api/creator-profile/me/profile-picture
 * @desc    Upload or update profile picture
 * @access  Private (Creator only)
 * @body    {file} image - Image file (multipart/form-data)
 * @returns {object} Updated profile with new profile picture URL
 */
router.post(
  '/me/profile-picture',
  protect,
  authorize('creator'),
  uploadSingle,
  uploadProfilePicture
);

/**
 * @route   POST /api/creator-profile/me/banner
 * @desc    Upload or update banner image
 * @access  Private (Creator only)
 * @body    {file} image - Banner image file (multipart/form-data)
 * @returns {object} Updated profile with new banner URL
 */
router.post(
  '/me/banner',
  protect,
  authorize('creator'),
  uploadSingle,
  uploadBanner
);

/**
 * @route   PUT /api/creator-profile/me/bio
 * @desc    Update creator bio
 * @access  Private (Creator only)
 * @body    {string} bio - New bio text (max 1000 characters)
 * @returns {object} Updated creator profile
 */
router.put(
  '/me/bio',
  protect,
  authorize('creator'),
  updateBioValidation,
  handleValidationErrors,
  updateBio
);

/**
 * @route   PUT /api/creator-profile/me/social-links
 * @desc    Update social media links
 * @access  Private (Creator only)
 * @body    {object} socials - Object containing social media URLs
 * @body    {string} socials.instagram - Instagram URL (optional)
 * @body    {string} socials.youtube - YouTube URL (optional)
 * @body    {string} socials.twitter - Twitter/X URL (optional)
 * @body    {string} socials.website - Website URL (optional)
 * @returns {object} Updated creator profile with social links
 */
router.put(
  '/me/social-links',
  protect,
  authorize('creator'),
  updateSocialLinksValidation,
  handleValidationErrors,
  updateSocialLinks
);

/**
 * @route   PUT /api/creator-profile/me/support-amounts
 * @desc    Set recommended support amounts (e.g., $5, $10, custom)
 * @access  Private (Creator only)
 * @body    {array} recommendedAmounts - Array of recommended support amounts
 * @returns {object} Updated creator profile with support amounts
 * @note    This field may need to be added to CreatorProfile model
 */
router.put(
  '/me/support-amounts',
  protect,
  authorize('creator'),
  setSupportAmountsValidation,
  handleValidationErrors,
  setRecommendedSupportAmounts
);

/**
 * @route   PUT /api/creator-profile/me/thank-you-message
 * @desc    Set custom thank you message for supporters
 * @access  Private (Creator only)
 * @body    {string} thankYouMessage - Custom thank you message (max 500 characters)
 * @returns {object} Updated creator profile with thank you message
 * @note    This field may need to be added to CreatorProfile model
 */
router.put(
  '/me/thank-you-message',
  protect,
  authorize('creator'),
  setThankYouMessageValidation,
  handleValidationErrors,
  setThankYouMessage
);

export default router;

