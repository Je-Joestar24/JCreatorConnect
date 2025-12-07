import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPublicProfile,
  fetchMyProfile,
  updateProfile,
  uploadProfilePic,
  uploadBannerImage,
  updateProfileBio,
  updateProfileSocialLinks,
  setSupportAmounts,
  setThankYouMsg,
  clearProfile,
  clearError,
} from '../store/slices/creatorProfileSlice.js';

/**
 * Custom hook for creator profile operations
 * @returns {object} - Profile state and methods
 */
export const useCreatorProfile = () => {
  const dispatch = useDispatch();
  const profileState = useSelector((state) => state.creatorProfile);

  /**
   * Fetch public creator profile by user ID
   * @param {string} userId - Creator's user ID (MongoDB ObjectId)
   * @returns {Promise<void>}
   */
  const getPublicProfile = async (userId) => {
    try {
      await dispatch(fetchPublicProfile(userId)).unwrap();
    } catch (error) {
      console.error('Failed to fetch public profile:', error);
      // Re-throw with error details
      const errorObj = {
        message: error?.error || error?.message || 'Failed to fetch profile',
        error: error?.error || error?.message,
        response: error?.response,
      };
      throw errorObj;
    }
  };

  /**
   * Fetch current creator's own profile
   * @returns {Promise<void>}
   */
  const getMyProfile = async () => {
    try {
      await dispatch(fetchMyProfile()).unwrap();
    } catch (error) {
      console.error('Failed to fetch my profile:', error);
      // Re-throw with error details
      const errorObj = {
        message: error?.error || error?.message || 'Failed to fetch profile',
        error: error?.error || error?.message,
        response: error?.response,
      };
      throw errorObj;
    }
  };

  /**
   * Update creator profile
   * @param {object} updateData - Profile data to update
   * @returns {Promise<void>}
   */
  const handleUpdateProfile = async (updateData) => {
    try {
      await dispatch(updateProfile(updateData)).unwrap();
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  /**
   * Upload profile picture
   * @param {File} file - Image file
   * @returns {Promise<void>}
   */
  const handleUploadProfilePicture = async (file) => {
    try {
      await dispatch(uploadProfilePic(file)).unwrap();
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      throw error;
    }
  };

  /**
   * Upload banner image
   * @param {File} file - Image file
   * @returns {Promise<void>}
   */
  const handleUploadBanner = async (file) => {
    try {
      await dispatch(uploadBannerImage(file)).unwrap();
    } catch (error) {
      console.error('Failed to upload banner:', error);
      throw error;
    }
  };

  /**
   * Update bio
   * @param {string} bio - New bio text
   * @returns {Promise<void>}
   */
  const handleUpdateBio = async (bio) => {
    try {
      await dispatch(updateProfileBio(bio)).unwrap();
    } catch (error) {
      console.error('Failed to update bio:', error);
      throw error;
    }
  };

  /**
   * Update social links
   * @param {object} socials - Social links object
   * @returns {Promise<void>}
   */
  const handleUpdateSocialLinks = async (socials) => {
    try {
      await dispatch(updateProfileSocialLinks(socials)).unwrap();
    } catch (error) {
      console.error('Failed to update social links:', error);
      throw error;
    }
  };

  /**
   * Set recommended support amounts
   * @param {array} recommendedAmounts - Array of recommended amounts
   * @returns {Promise<void>}
   */
  const handleSetSupportAmounts = async (recommendedAmounts) => {
    try {
      await dispatch(setSupportAmounts(recommendedAmounts)).unwrap();
    } catch (error) {
      console.error('Failed to set support amounts:', error);
      throw error;
    }
  };

  /**
   * Set thank you message
   * @param {string} thankYouMessage - Custom thank you message
   * @returns {Promise<void>}
   */
  const handleSetThankYouMessage = async (thankYouMessage) => {
    try {
      await dispatch(setThankYouMsg(thankYouMessage)).unwrap();
    } catch (error) {
      console.error('Failed to set thank you message:', error);
      throw error;
    }
  };

  /**
   * Clear profile data
   */
  const handleClearProfile = () => {
    dispatch(clearProfile());
  };

  /**
   * Clear error
   */
  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    // State
    profile: profileState.profile,
    loading: profileState.loading,
    error: profileState.error,
    isOwnProfile: profileState.isOwnProfile,

    // Methods
    getPublicProfile,
    getMyProfile,
    updateProfile: handleUpdateProfile,
    uploadProfilePicture: handleUploadProfilePicture,
    uploadBanner: handleUploadBanner,
    updateBio: handleUpdateBio,
    updateSocialLinks: handleUpdateSocialLinks,
    setSupportAmounts: handleSetSupportAmounts,
    setThankYouMessage: handleSetThankYouMessage,
    clearProfile: handleClearProfile,
    clearError: handleClearError,
  };
};

export default useCreatorProfile;

