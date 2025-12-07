import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getPublicCreatorProfile,
  getMyCreatorProfile,
  updateCreatorProfile,
  uploadProfilePicture,
  uploadBanner,
  updateBio,
  updateSocialLinks,
  setRecommendedSupportAmounts,
  setThankYouMessage,
} from '../../services/creator/creatorProfileService.js';

// Async thunk for fetching public creator profile
export const fetchPublicProfile = createAsyncThunk(
  'creatorProfile/fetchPublicProfile',
  async (userId, { rejectWithValue }) => {
    const result = await getPublicCreatorProfile(userId);
    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue({ error: result.error });
    }
  }
);

// Async thunk for fetching own profile
export const fetchMyProfile = createAsyncThunk(
  'creatorProfile/fetchMyProfile',
  async (_, { rejectWithValue }) => {
    const result = await getMyCreatorProfile();
    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue({ error: result.error });
    }
  }
);

// Async thunk for updating profile
export const updateProfile = createAsyncThunk(
  'creatorProfile/updateProfile',
  async (updateData, { rejectWithValue }) => {
    const result = await updateCreatorProfile(updateData);
    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue({
        error: result.error,
        errors: result.errors,
      });
    }
  }
);

// Async thunk for uploading profile picture
export const uploadProfilePic = createAsyncThunk(
  'creatorProfile/uploadProfilePic',
  async (file, { rejectWithValue }) => {
    const result = await uploadProfilePicture(file);
    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue({ error: result.error });
    }
  }
);

// Async thunk for uploading banner
export const uploadBannerImage = createAsyncThunk(
  'creatorProfile/uploadBannerImage',
  async (file, { rejectWithValue }) => {
    const result = await uploadBanner(file);
    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue({ error: result.error });
    }
  }
);

// Async thunk for updating bio
export const updateProfileBio = createAsyncThunk(
  'creatorProfile/updateProfileBio',
  async (bio, { rejectWithValue }) => {
    const result = await updateBio(bio);
    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue({
        error: result.error,
        errors: result.errors,
      });
    }
  }
);

// Async thunk for updating social links
export const updateProfileSocialLinks = createAsyncThunk(
  'creatorProfile/updateProfileSocialLinks',
  async (socials, { rejectWithValue }) => {
    const result = await updateSocialLinks(socials);
    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue({
        error: result.error,
        errors: result.errors,
      });
    }
  }
);

// Async thunk for setting support amounts
export const setSupportAmounts = createAsyncThunk(
  'creatorProfile/setSupportAmounts',
  async (recommendedAmounts, { rejectWithValue }) => {
    const result = await setRecommendedSupportAmounts(recommendedAmounts);
    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue({
        error: result.error,
        errors: result.errors,
      });
    }
  }
);

// Async thunk for setting thank you message
export const setThankYouMsg = createAsyncThunk(
  'creatorProfile/setThankYouMsg',
  async (thankYouMessage, { rejectWithValue }) => {
    const result = await setThankYouMessage(thankYouMessage);
    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue({
        error: result.error,
        errors: result.errors,
      });
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  error: null,
  isOwnProfile: false,
  // Form state to preserve data during edits
  formData: {
    bio: '',
    instagram: '',
    youtube: '',
    twitter: '',
    website: '',
  },
  profilePicPreview: null,
  bannerPreview: null,
};

const creatorProfileSlice = createSlice({
  name: 'creatorProfile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.isOwnProfile = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setProfilePicPreview: (state, action) => {
      state.profilePicPreview = action.payload;
    },
    setBannerPreview: (state, action) => {
      state.bannerPreview = action.payload;
    },
    clearFormData: (state) => {
      state.formData = {
        bio: '',
        instagram: '',
        youtube: '',
        twitter: '',
        website: '',
      };
      state.profilePicPreview = null;
      state.bannerPreview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch public profile
      .addCase(fetchPublicProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isOwnProfile = false;
      })
      .addCase(fetchPublicProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.isOwnProfile = false;
      })
      .addCase(fetchPublicProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch profile';
      })
      // Fetch my profile
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isOwnProfile = true;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.isOwnProfile = true;
        // Sync form data with profile
        if (action.payload) {
          state.formData = {
            bio: action.payload.profile?.bio || '',
            instagram: action.payload.profile?.socials?.instagram || '',
            youtube: action.payload.profile?.socials?.youtube || '',
            twitter: action.payload.profile?.socials?.twitter || '',
            website: action.payload.profile?.socials?.website || '',
          };
          state.profilePicPreview = action.payload.user?.avatarUrl || null;
          state.bannerPreview = action.payload.profile?.bannerUrl || null;
        }
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch profile';
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update profile';
      })
      // Upload profile picture
      .addCase(uploadProfilePic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfilePic.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(uploadProfilePic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to upload profile picture';
      })
      // Upload banner
      .addCase(uploadBannerImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadBannerImage.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(uploadBannerImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to upload banner';
      })
      // Update bio
      .addCase(updateProfileBio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileBio.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfileBio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update bio';
      })
      // Update social links
      .addCase(updateProfileSocialLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileSocialLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfileSocialLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update social links';
      })
      // Set support amounts
      .addCase(setSupportAmounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setSupportAmounts.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(setSupportAmounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update support amounts';
      })
      // Set thank you message
      .addCase(setThankYouMsg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setThankYouMsg.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(setThankYouMsg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update thank you message';
      });
  },
});

export const { 
  clearProfile, 
  clearError, 
  updateFormData, 
  setProfilePicPreview, 
  setBannerPreview,
  clearFormData 
} = creatorProfileSlice.actions;
export default creatorProfileSlice.reducer;

