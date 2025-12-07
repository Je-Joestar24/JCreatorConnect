import {
  getPublicCreatorProfile,
  getCreatorProfileByUserId,
  updateCreatorProfile,
  uploadProfileImage,
  uploadBannerImage,
  updateCreatorBio,
  updateCreatorSocialLinks,
  setCreatorSupportAmounts,
  setCreatorThankYouMessage,
} from '../services/creatorprofile.service.js';

/**
 * @route   GET /api/creator-profile/:id
 * @desc    Get public creator profile by user ID
 * @access  Public
 * 
 * Returns public creator profile information visible to everyone:
 * - Profile photo (from User.avatarUrl)
 * - Banner
 * - Display name (from User.name)
 * - Username (from User.email or username if exists)
 * - Bio
 * - Social links (YouTube, Instagram, Twitter, Website)
 * - Support buttons information
 * - Public posts feed (free + locked posts preview)
 * - Membership tiers (if any)
 * 
 * @param   {object} req - Express request object
 * @param   {string} req.params.id - Creator's user ID (MongoDB ObjectId)
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware
 */
export const getPublicProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get public profile data
    const profile = await getPublicCreatorProfile(id);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/creator-profile/me
 * @desc    Get current creator's own profile (with private data)
 * @access  Private (Creator only)
 * 
 * Returns full creator profile including:
 * - All public information
 * - Private settings
 * - Earnings statistics
 * - Supporters count
 * - Featured post
 * - All membership tiers
 * 
 * @param   {object} req - Express request object
 * @param   {object} req.user - Authenticated user (from protect middleware)
 * @param   {string} req.user._id - User ID
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware
 */
export const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get full profile with private data
    const profile = await getCreatorProfileByUserId(userId, true);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/creator-profile/me
 * @desc    Update creator profile (general update)
 * @access  Private (Creator only)
 * 
 * Allows updating multiple profile fields at once:
 * - Bio
 * - Categories
 * - Other profile settings
 * 
 * @param   {object} req - Express request object
 * @param   {object} req.user - Authenticated user (from protect middleware)
 * @param   {string} req.user._id - User ID
 * @param   {object} req.body - Profile data to update
 * @param   {string} req.body.bio - Bio text (optional)
 * @param   {array} req.body.categories - Categories array (optional)
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updateData = req.body;

    // Update profile with provided data
    const updatedProfile = await updateCreatorProfile(userId, updateData);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/creator-profile/me/profile-picture
 * @desc    Upload or update profile picture
 * @access  Private (Creator only)
 * 
 * Handles profile picture upload:
 * 1. Validates image file
 * 2. Uploads to Cloudinary
 * 3. Updates User.avatarUrl
 * 4. Returns updated profile
 * 
 * @param   {object} req - Express request object
 * @param   {object} req.user - Authenticated user (from protect middleware)
 * @param   {string} req.user._id - User ID
 * @param   {object} req.file - Uploaded file (from multer middleware)
 * @param   {Buffer} req.file.buffer - File buffer
 * @param   {string} req.file.mimetype - File MIME type
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware
 */
export const uploadProfilePicture = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    // Upload image to Cloudinary and update User.avatarUrl
    const updatedProfile = await uploadProfileImage(userId, req.file);

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/creator-profile/me/banner
 * @desc    Upload or update banner image
 * @access  Private (Creator only)
 * 
 * Handles banner image upload:
 * 1. Validates image file
 * 2. Uploads to Cloudinary
 * 3. Updates CreatorProfile.bannerUrl
 * 4. Returns updated profile
 * 
 * @param   {object} req - Express request object
 * @param   {object} req.user - Authenticated user (from protect middleware)
 * @param   {string} req.user._id - User ID
 * @param   {object} req.file - Uploaded file (from multer middleware)
 * @param   {Buffer} req.file.buffer - File buffer
 * @param   {string} req.file.mimetype - File MIME type
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware
 */
export const uploadBanner = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    // Upload banner to Cloudinary and update CreatorProfile.bannerUrl
    const updatedProfile = await uploadBannerImage(userId, req.file);

    res.status(200).json({
      success: true,
      message: 'Banner uploaded successfully',
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/creator-profile/me/bio
 * @desc    Update creator bio
 * @access  Private (Creator only)
 * 
 * Updates the creator's bio text (max 1000 characters).
 * 
 * @param   {object} req - Express request object
 * @param   {object} req.user - Authenticated user (from protect middleware)
 * @param   {string} req.user._id - User ID
 * @param   {object} req.body - Request body
 * @param   {string} req.body.bio - New bio text
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware
 */
export const updateBio = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { bio } = req.body;

    // Update bio
    const updatedProfile = await updateCreatorBio(userId, bio);

    res.status(200).json({
      success: true,
      message: 'Bio updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/creator-profile/me/social-links
 * @desc    Update social media links
 * @access  Private (Creator only)
 * 
 * Updates social media links in CreatorProfile.socials:
 * - Instagram
 * - YouTube
 * - Twitter/X
 * - Website
 * 
 * All fields are optional - can update one or all at once.
 * 
 * @param   {object} req - Express request object
 * @param   {object} req.user - Authenticated user (from protect middleware)
 * @param   {string} req.user._id - User ID
 * @param   {object} req.body - Request body
 * @param   {object} req.body.socials - Social links object
 * @param   {string} req.body.socials.instagram - Instagram URL (optional)
 * @param   {string} req.body.socials.youtube - YouTube URL (optional)
 * @param   {string} req.body.socials.twitter - Twitter/X URL (optional)
 * @param   {string} req.body.socials.website - Website URL (optional)
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware
 */
export const updateSocialLinks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { socials } = req.body;

    // Update social links
    const updatedProfile = await updateCreatorSocialLinks(userId, socials);

    res.status(200).json({
      success: true,
      message: 'Social links updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/creator-profile/me/support-amounts
 * @desc    Set recommended support amounts
 * @access  Private (Creator only)
 * 
 * Sets recommended support button amounts (e.g., $5, $10, $25, custom).
 * This allows creators to suggest common support amounts to their supporters.
 * 
 * @note    This feature may require adding a 'recommendedAmounts' field 
 *          to the CreatorProfile model if it doesn't exist.
 * 
 * @param   {object} req - Express request object
 * @param   {object} req.user - Authenticated user (from protect middleware)
 * @param   {string} req.user._id - User ID
 * @param   {object} req.body - Request body
 * @param   {array} req.body.recommendedAmounts - Array of recommended amounts
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware
 */
export const setRecommendedSupportAmounts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { recommendedAmounts } = req.body;

    // Set recommended support amounts
    const updatedProfile = await setCreatorSupportAmounts(
      userId,
      recommendedAmounts
    );

    res.status(200).json({
      success: true,
      message: 'Recommended support amounts updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/creator-profile/me/thank-you-message
 * @desc    Set custom thank you message for supporters
 * @access  Private (Creator only)
 * 
 * Sets a custom thank you message that will be displayed to supporters
 * after they provide support. This personalizes the supporter experience.
 * 
 * @note    This feature may require adding a 'thankYouMessage' field 
 *          to the CreatorProfile model if it doesn't exist.
 * 
 * @param   {object} req - Express request object
 * @param   {object} req.user - Authenticated user (from protect middleware)
 * @param   {string} req.user._id - User ID
 * @param   {object} req.body - Request body
 * @param   {string} req.body.thankYouMessage - Custom thank you message
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware
 */
export const setThankYouMessage = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { thankYouMessage } = req.body;

    // Set thank you message
    const updatedProfile = await setCreatorThankYouMessage(
      userId,
      thankYouMessage
    );

    res.status(200).json({
      success: true,
      message: 'Thank you message updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

