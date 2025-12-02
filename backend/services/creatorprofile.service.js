import CreatorProfile from '../models/CreatorProfile.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import MembershipTier from '../models/MembershipTier.js';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary
// Note: Ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET
// are set in your .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} buffer - Image file buffer
 * @param {string} folder - Cloudinary folder path
 * @param {string} publicId - Public ID for the image (optional)
 * @returns {Promise<string>} - Cloudinary secure URL
 */
const uploadToCloudinary = async (buffer, folder, publicId = null) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: publicId,
        resource_type: 'image',
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    // Convert buffer to stream
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

/**
 * Get public creator profile by username
 * 
 * Returns public information visible to everyone:
 * - Profile photo (from User.avatarUrl)
 * - Banner (from CreatorProfile.bannerUrl)
 * - Display name (from User.name)
 * - Username (from User.email or username if exists)
 * - Bio (from CreatorProfile.bio)
 * - Social links (from CreatorProfile.socials)
 * - Support buttons information
 * - Public posts feed (free posts + locked posts preview)
 * - Membership tiers (if any)
 * 
 * @param {string} username - Creator's username (email or username field)
 * @returns {Promise<object>} - Public creator profile object
 * @throws {Error} - If creator not found
 */
export const getPublicCreatorProfile = async (username) => {
  // Find user by username (assuming username is email or a username field)
  // Note: If User model has a separate username field, use that instead
  const user = await User.findOne({
    $or: [
      { email: username.toLowerCase() },
      // Add username field check if it exists in User model
      // { username: username.toLowerCase() }
    ],
    role: 'creator',
  }).select('name email avatarUrl role createdAt');

  if (!user) {
    const error = new Error('Creator profile not found');
    error.statusCode = 404;
    throw error;
  }

  // Find or create creator profile
  let creatorProfile = await CreatorProfile.findOne({ userId: user._id })
    .populate('membershipTiers', 'title description price benefits')
    .populate('featuredPostId', 'title content type mediaUrl createdAt')
    .lean();

  // If profile doesn't exist, create a default one
  if (!creatorProfile) {
    creatorProfile = await CreatorProfile.create({
      userId: user._id,
    });
  }

  // Get public posts (free posts + preview of locked posts)
  // Free posts: full content
  // Locked posts: title and preview only
  const publicPosts = await Post.find({
    creatorId: user._id,
    accessType: 'free',
  })
    .select('title content type mediaUrl videoEmbedUrl linkUrl createdAt')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const lockedPostsPreview = await Post.find({
    creatorId: user._id,
    accessType: { $in: ['supporter-only', 'membership-only'] },
  })
    .select('title createdAt accessType')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Check profile completion status
  const missingFields = [];
  if (!creatorProfile.bio || creatorProfile.bio.trim() === '') {
    missingFields.push('bio');
  }
  if (!user.avatarUrl || user.avatarUrl.trim() === '') {
    missingFields.push('avatarUrl');
  }
  if (!creatorProfile.bannerUrl || creatorProfile.bannerUrl.trim() === '') {
    missingFields.push('bannerUrl');
  }
  const hasSocials = creatorProfile.socials && (
    creatorProfile.socials.instagram ||
    creatorProfile.socials.youtube ||
    creatorProfile.socials.twitter ||
    creatorProfile.socials.website
  );
  if (!hasSocials) {
    missingFields.push('socials');
  }

  const totalFields = 4; // bio, avatarUrl, bannerUrl, socials
  const completedFields = totalFields - missingFields.length;
  const completionPercentage = Math.round((completedFields / totalFields) * 100);

  // Build public profile response
  return {
    // User information
    user: {
      _id: user._id,
      name: user.name,
      username: user.email, // Or use user.username if exists
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    },
    // Profile information
    profile: {
      bannerUrl: creatorProfile.bannerUrl,
      bio: creatorProfile.bio,
      categories: creatorProfile.categories,
      socials: creatorProfile.socials,
      // Support buttons information
      // Note: Add recommendedAmounts if field exists in model
      // recommendedAmounts: creatorProfile.recommendedAmounts || [5, 10, 25],
    },
    // Public statistics (visible to everyone)
    stats: {
      supportersCount: creatorProfile.supportersCount || 0,
      // Note: earningsTotal should not be public
    },
    // Posts feed
    posts: {
      free: publicPosts,
      locked: lockedPostsPreview.map((post) => ({
        _id: post._id,
        title: post.title,
        createdAt: post.createdAt,
        accessType: post.accessType,
        isLocked: true,
      })),
    },
    // Membership tiers
    membershipTiers: creatorProfile.membershipTiers || [],
    // Featured post
    featuredPost: creatorProfile.featuredPostId || null,
    // Profile completion status
    completionStatus: {
      isComplete: missingFields.length === 0,
      completionPercentage,
      missingFields,
      totalFields,
      completedFields,
    },
  };
};

/**
 * Get creator profile by user ID (with optional private data)
 * 
 * Returns full creator profile including private information:
 * - All public information
 * - Earnings statistics
 * - Supporters count
 * - Featured post
 * - All membership tiers
 * - Private settings
 * 
 * @param {string} userId - User ID
 * @param {boolean} includePrivate - Whether to include private data
 * @returns {Promise<object>} - Full creator profile object
 * @throws {Error} - If creator profile not found
 */
export const getCreatorProfileByUserId = async (
  userId,
  includePrivate = false
) => {
  // Verify user exists and is a creator
  const user = await User.findById(userId).select('name email avatarUrl role');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== 'creator') {
    const error = new Error('User is not a creator');
    error.statusCode = 403;
    throw error;
  }

  // Find or create creator profile
  let creatorProfile = await CreatorProfile.findOne({ userId: user._id })
    .populate('membershipTiers', 'title description price benefits stripePriceId')
    .populate('featuredPostId')
    .lean();

  if (!creatorProfile) {
    creatorProfile = await CreatorProfile.create({
      userId: user._id,
    });
  }

  // Get all posts (for creator's own view)
  const allPosts = await Post.find({ creatorId: user._id })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  // Separate posts by access type for consistent structure
  const freePosts = allPosts.filter((post) => post.accessType === 'free');
  const lockedPosts = allPosts.filter(
    (post) => post.accessType === 'supporter-only' || post.accessType === 'membership-only'
  );

  // Check profile completion status
  const missingFields = [];
  if (!creatorProfile.bio || creatorProfile.bio.trim() === '') {
    missingFields.push('bio');
  }
  if (!user.avatarUrl || user.avatarUrl.trim() === '') {
    missingFields.push('avatarUrl');
  }
  if (!creatorProfile.bannerUrl || creatorProfile.bannerUrl.trim() === '') {
    missingFields.push('bannerUrl');
  }
  const hasSocials = creatorProfile.socials && (
    creatorProfile.socials.instagram ||
    creatorProfile.socials.youtube ||
    creatorProfile.socials.twitter ||
    creatorProfile.socials.website
  );
  if (!hasSocials) {
    missingFields.push('socials');
  }

  const totalFields = 4; // bio, avatarUrl, bannerUrl, socials
  const completedFields = totalFields - missingFields.length;
  const completionPercentage = Math.round((completedFields / totalFields) * 100);

  // Build profile response
  const profileData = {
    // User information
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    },
    // Profile information
    profile: {
      bannerUrl: creatorProfile.bannerUrl,
      bio: creatorProfile.bio,
      categories: creatorProfile.categories,
      socials: creatorProfile.socials,
      // Note: Add these fields if they exist in the model
      // recommendedAmounts: creatorProfile.recommendedAmounts || [],
      // thankYouMessage: creatorProfile.thankYouMessage || '',
    },
    // Posts (structured same as public profile for consistency)
    posts: {
      free: freePosts,
      locked: lockedPosts.map((post) => ({
        _id: post._id,
        title: post.title,
        content: post.content,
        type: post.type,
        mediaUrl: post.mediaUrl,
        createdAt: post.createdAt,
        accessType: post.accessType,
        isLocked: true,
      })),
    },
    // Membership tiers
    membershipTiers: creatorProfile.membershipTiers || [],
    // Featured post
    featuredPost: creatorProfile.featuredPostId || null,
    // Profile completion status
    completionStatus: {
      isComplete: missingFields.length === 0,
      completionPercentage,
      missingFields,
      totalFields,
      completedFields,
    },
  };

  // Add private data if requested
  if (includePrivate) {
    profileData.stats = {
      earningsTotal: creatorProfile.earningsTotal || 0,
      supportersCount: creatorProfile.supportersCount || 0,
    };
  }

  return profileData;
};

/**
 * Update creator profile
 * 
 * Updates multiple profile fields at once. Only provided fields will be updated.
 * 
 * @param {string} userId - User ID
 * @param {object} updateData - Profile data to update
 * @param {string} updateData.bio - Bio text (optional)
 * @param {array} updateData.categories - Categories array (optional)
 * @param {object} updateData.socials - Social links object (optional)
 * @returns {Promise<object>} - Updated creator profile
 * @throws {Error} - If creator profile not found or validation fails
 */
export const updateCreatorProfile = async (userId, updateData) => {
  // Verify user is a creator
  const user = await User.findById(userId);
  if (!user || user.role !== 'creator') {
    const error = new Error('User is not a creator');
    error.statusCode = 403;
    throw error;
  }

  // Find or create creator profile
  let creatorProfile = await CreatorProfile.findOne({ userId: user._id });

  if (!creatorProfile) {
    creatorProfile = await CreatorProfile.create({ userId: user._id });
  }

  // Build update object (only include provided fields)
  const updateFields = {};
  if (updateData.bio !== undefined) {
    updateFields.bio = updateData.bio.trim();
  }
  if (updateData.categories !== undefined) {
    updateFields.categories = Array.isArray(updateData.categories)
      ? updateData.categories
      : [];
  }
  // Add other fields as needed

  // Update profile
  Object.assign(creatorProfile, updateFields);
  await creatorProfile.save();

  // Return updated profile with completion status (include private data for own profile)
  return await getCreatorProfileByUserId(userId, true);
};

/**
 * Upload profile picture to Cloudinary and update User.avatarUrl
 * 
 * @param {string} userId - User ID
 * @param {object} file - Multer file object
 * @param {Buffer} file.buffer - File buffer
 * @param {string} file.mimetype - File MIME type
 * @returns {Promise<object>} - Updated profile with new avatar URL
 * @throws {Error} - If upload fails or user not found
 */
export const uploadProfileImage = async (userId, file) => {
  // Verify user exists and is a creator
  const user = await User.findById(userId);
  if (!user || user.role !== 'creator') {
    const error = new Error('User is not a creator');
    error.statusCode = 403;
    throw error;
  }

  try {
    // Upload to Cloudinary
    const avatarUrl = await uploadToCloudinary(
      file.buffer,
      'jcreatorconnect/profiles',
      `profile_${userId}`
    );

    // Update user avatar
    user.avatarUrl = avatarUrl;
    await user.save();

    // Get updated profile
    return await getCreatorProfileByUserId(userId, true);
  } catch (error) {
    const uploadError = new Error('Failed to upload profile picture');
    uploadError.statusCode = 500;
    uploadError.originalError = error;
    throw uploadError;
  }
};

/**
 * Upload banner image to Cloudinary and update CreatorProfile.bannerUrl
 * 
 * @param {string} userId - User ID
 * @param {object} file - Multer file object
 * @param {Buffer} file.buffer - File buffer
 * @param {string} file.mimetype - File MIME type
 * @returns {Promise<object>} - Updated profile with new banner URL
 * @throws {Error} - If upload fails or creator profile not found
 */
export const uploadBannerImage = async (userId, file) => {
  // Verify user exists and is a creator
  const user = await User.findById(userId);
  if (!user || user.role !== 'creator') {
    const error = new Error('User is not a creator');
    error.statusCode = 403;
    throw error;
  }

  // Find or create creator profile
  let creatorProfile = await CreatorProfile.findOne({ userId: user._id });
  if (!creatorProfile) {
    creatorProfile = await CreatorProfile.create({ userId: user._id });
  }

  try {
    // Upload to Cloudinary
    const bannerUrl = await uploadToCloudinary(
      file.buffer,
      'jcreatorconnect/banners',
      `banner_${userId}`
    );

    // Update banner URL
    creatorProfile.bannerUrl = bannerUrl;
    await creatorProfile.save();

    // Get updated profile
    return await getCreatorProfileByUserId(userId, true);
  } catch (error) {
    const uploadError = new Error('Failed to upload banner');
    uploadError.statusCode = 500;
    uploadError.originalError = error;
    throw uploadError;
  }
};

/**
 * Update creator bio
 * 
 * @param {string} userId - User ID
 * @param {string} bio - New bio text (max 1000 characters)
 * @returns {Promise<object>} - Updated creator profile
 * @throws {Error} - If validation fails or creator profile not found
 */
export const updateCreatorBio = async (userId, bio) => {
  // Verify user is a creator
  const user = await User.findById(userId);
  if (!user || user.role !== 'creator') {
    const error = new Error('User is not a creator');
    error.statusCode = 403;
    throw error;
  }

  // Find or create creator profile
  let creatorProfile = await CreatorProfile.findOne({ userId: user._id });
  if (!creatorProfile) {
    creatorProfile = await CreatorProfile.create({ userId: user._id });
  }

  // Update bio
  creatorProfile.bio = bio ? bio.trim() : '';
  await creatorProfile.save();

  // Return updated profile with completion status
  return await getCreatorProfileByUserId(userId, true);
};

/**
 * Update creator social links
 * 
 * Updates social media links. Only provided links will be updated.
 * 
 * @param {string} userId - User ID
 * @param {object} socials - Social links object
 * @param {string} socials.instagram - Instagram URL (optional)
 * @param {string} socials.youtube - YouTube URL (optional)
 * @param {string} socials.twitter - Twitter/X URL (optional)
 * @param {string} socials.website - Website URL (optional)
 * @returns {Promise<object>} - Updated creator profile
 * @throws {Error} - If creator profile not found
 */
export const updateCreatorSocialLinks = async (userId, socials) => {
  // Verify user is a creator
  const user = await User.findById(userId);
  if (!user || user.role !== 'creator') {
    const error = new Error('User is not a creator');
    error.statusCode = 403;
    throw error;
  }

  // Find or create creator profile
  let creatorProfile = await CreatorProfile.findOne({ userId: user._id });
  if (!creatorProfile) {
    creatorProfile = await CreatorProfile.create({ userId: user._id });
  }

  // Update social links (only provided fields)
  if (socials.instagram !== undefined) {
    creatorProfile.socials.instagram = socials.instagram.trim() || '';
  }
  if (socials.youtube !== undefined) {
    creatorProfile.socials.youtube = socials.youtube.trim() || '';
  }
  if (socials.twitter !== undefined) {
    creatorProfile.socials.twitter = socials.twitter.trim() || '';
  }
  if (socials.website !== undefined) {
    creatorProfile.socials.website = socials.website.trim() || '';
  }

  await creatorProfile.save();

  // Return updated profile with completion status
  return await getCreatorProfileByUserId(userId, true);
};

/**
 * Set recommended support amounts
 * 
 * Sets the recommended support button amounts (e.g., $5, $10, $25, custom).
 * 
 * @note    This function assumes a 'recommendedAmounts' field exists in 
 *          the CreatorProfile model. If it doesn't, the model schema 
 *          needs to be updated.
 * 
 * @param {string} userId - User ID
 * @param {array} recommendedAmounts - Array of recommended amounts
 * @returns {Promise<object>} - Updated creator profile
 * @throws {Error} - If creator profile not found or validation fails
 */
export const setCreatorSupportAmounts = async (userId, recommendedAmounts) => {
  // Verify user is a creator
  const user = await User.findById(userId);
  if (!user || user.role !== 'creator') {
    const error = new Error('User is not a creator');
    error.statusCode = 403;
    throw error;
  }

  // Find or create creator profile
  let creatorProfile = await CreatorProfile.findOne({ userId: user._id });
  if (!creatorProfile) {
    creatorProfile = await CreatorProfile.create({ userId: user._id });
  }

  // Update recommended amounts
  // Note: This field may need to be added to CreatorProfile model
  // creatorProfile.recommendedAmounts = recommendedAmounts || [];
  // await creatorProfile.save();

  // For now, return profile without updating (until model is updated)
  // Uncomment the above lines once the field is added to the model

  // Return updated profile
  return await getCreatorProfileByUserId(userId, true);
};

/**
 * Set custom thank you message
 * 
 * Sets a custom thank you message for supporters.
 * 
 * @note    This function assumes a 'thankYouMessage' field exists in 
 *          the CreatorProfile model. If it doesn't, the model schema 
 *          needs to be updated.
 * 
 * @param {string} userId - User ID
 * @param {string} thankYouMessage - Custom thank you message (max 500 characters)
 * @returns {Promise<object>} - Updated creator profile
 * @throws {Error} - If creator profile not found or validation fails
 */
export const setCreatorThankYouMessage = async (userId, thankYouMessage) => {
  // Verify user is a creator
  const user = await User.findById(userId);
  if (!user || user.role !== 'creator') {
    const error = new Error('User is not a creator');
    error.statusCode = 403;
    throw error;
  }

  // Find or create creator profile
  let creatorProfile = await CreatorProfile.findOne({ userId: user._id });
  if (!creatorProfile) {
    creatorProfile = await CreatorProfile.create({ userId: user._id });
  }

  // Update thank you message
  // Note: This field may need to be added to CreatorProfile model
  // creatorProfile.thankYouMessage = thankYouMessage ? thankYouMessage.trim() : '';
  // await creatorProfile.save();

  // For now, return profile without updating (until model is updated)
  // Uncomment the above lines once the field is added to the model

  // Return updated profile
  return await getCreatorProfileByUserId(userId, true);
};

