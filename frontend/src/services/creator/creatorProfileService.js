import api from '../../api/axios.js';

/**
 * Get public creator profile by user ID
 * @param {string} userId - Creator's user ID (MongoDB ObjectId)
 * @returns {Promise<object>} - Response with creator profile data
 */
export const getPublicCreatorProfile = async (userId) => {
  try {
    const response = await api.get(`/creator-profile/${userId}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch creator profile',
    };
  }
};

/**
 * Get current creator's own profile (with private data)
 * @returns {Promise<object>} - Response with full creator profile data
 */
export const getMyCreatorProfile = async () => {
  try {
    const response = await api.get('/creator-profile/own/me');
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch profile',
    };
  }
};

/**
 * Update creator profile
 * @param {object} updateData - Profile data to update
 * @param {string} updateData.bio - Bio text (optional)
 * @param {array} updateData.categories - Categories array (optional)
 * @returns {Promise<object>} - Response with updated profile
 */
export const updateCreatorProfile = async (updateData) => {
  try {
    const response = await api.put('/creator-profile/own/me', updateData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Profile updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update profile',
      errors: error.response?.data?.errors || null,
    };
  }
};

/**
 * Upload profile picture
 * @param {File} file - Image file
 * @returns {Promise<object>} - Response with updated profile
 */
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/creator-profile/me/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Profile picture uploaded successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to upload profile picture',
    };
  }
};

/**
 * Upload banner image
 * @param {File} file - Image file
 * @returns {Promise<object>} - Response with updated profile
 */
export const uploadBanner = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/creator-profile/me/banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Banner uploaded successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to upload banner',
    };
  }
};

/**
 * Update creator bio
 * @param {string} bio - New bio text
 * @returns {Promise<object>} - Response with updated profile
 */
export const updateBio = async (bio) => {
  try {
    const response = await api.put('/creator-profile/me/bio', { bio });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Bio updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update bio',
      errors: error.response?.data?.errors || null,
    };
  }
};

/**
 * Update social media links
 * @param {object} socials - Social links object
 * @param {string} socials.instagram - Instagram URL (optional)
 * @param {string} socials.youtube - YouTube URL (optional)
 * @param {string} socials.twitter - Twitter/X URL (optional)
 * @param {string} socials.website - Website URL (optional)
 * @returns {Promise<object>} - Response with updated profile
 */
export const updateSocialLinks = async (socials) => {
  try {
    const response = await api.put('/creator-profile/me/social-links', { socials });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Social links updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update social links',
      errors: error.response?.data?.errors || null,
    };
  }
};

/**
 * Set recommended support amounts
 * @param {array} recommendedAmounts - Array of recommended amounts
 * @returns {Promise<object>} - Response with updated profile
 */
export const setRecommendedSupportAmounts = async (recommendedAmounts) => {
  try {
    const response = await api.put('/creator-profile/me/support-amounts', {
      recommendedAmounts,
    });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Support amounts updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update support amounts',
      errors: error.response?.data?.errors || null,
    };
  }
};

/**
 * Set custom thank you message
 * @param {string} thankYouMessage - Custom thank you message
 * @returns {Promise<object>} - Response with updated profile
 */
export const setThankYouMessage = async (thankYouMessage) => {
  try {
    const response = await api.put('/creator-profile/me/thank-you-message', {
      thankYouMessage,
    });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Thank you message updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update thank you message',
      errors: error.response?.data?.errors || null,
    };
  }
};

