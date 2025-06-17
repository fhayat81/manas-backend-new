const { User } = require('../models/User.js');
const { updateUserSchema } = require('../validations/auth.js');

// Update User
const updateUser = async (req, res) => {
  try {
    const validatedData = updateUserSchema.parse(req.body);
    const userId = req.user && req.user.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: validatedData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const userId = req.user && req.user.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('expressed_interests.user', 'full_name profile_photo')
      .populate('received_interests.user', 'full_name profile_photo');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('Starting profile update for user:', userId);
    console.log('Update data received:', req.body);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    const updateData = req.body;
    
    // Check if updateData is empty
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No data provided for update' });
    }

    // Handle profile photo if present
    if (updateData.profile_photo !== undefined) {
      console.log('Updating profile photo:', {
        type: typeof updateData.profile_photo,
        isBuffer: Buffer.isBuffer(updateData.profile_photo),
        isString: typeof updateData.profile_photo === 'string',
        isEmpty: updateData.profile_photo === ''
      });

      if (updateData.profile_photo === '') {
        // Remove profile photo
        user.profile_photo = undefined;
      } else if (typeof updateData.profile_photo === 'string' && updateData.profile_photo.startsWith('data:')) {
        // Store base64 string directly
        user.profile_photo = updateData.profile_photo;
      } else if (Buffer.isBuffer(updateData.profile_photo)) {
        // Convert buffer to base64
        user.profile_photo = `data:image/jpeg;base64,${updateData.profile_photo.toString('base64')}`;
      } else {
        return res.status(400).json({ message: 'Invalid profile photo format' });
      }
    }

    // Update fields if present
    const fieldsToUpdate = [
      'full_name',
      'email',
      'age',
      'gender',
      'marital_status',
      'education',
      'children_count',
      'profession',
      'phone_number',
      'interests_hobbies',
      'brief_personal_description'
    ];

    let hasUpdates = false;
    fieldsToUpdate.forEach(field => {
      if (updateData[field] !== undefined) {
        console.log(`Updating ${field}:`, {
          old: user[field],
          new: updateData[field]
        });
        user[field] = updateData[field];
        hasUpdates = true;
      }
    });
    
    // Update location if present
    if (updateData.location) {
      console.log('Updating location:', {
        old: user.location,
        new: updateData.location
      });
      user.location = {
        city: updateData.location.city || (user.location && user.location.city),
        state: updateData.location.state || (user.location && user.location.state)
      };
      hasUpdates = true;
    }

    if (!hasUpdates) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    try {
      console.log('Saving updated user data...');
      await user.save();
      console.log('User data saved successfully');
    } catch (error) {
      console.error('Error saving user data:', error);
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error saving user data' });
    }
    
    // Return updated user without password
    const updatedUser = await User.findById(userId).select('-password');
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found after update' });
    }
    console.log('Profile update completed successfully');
    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Profile Picture
const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user._id;
    const { profile_photo } = req.body;

    if (!profile_photo) {
      return res.status(400).json({ message: 'Profile photo is required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profile_photo },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ profile_photo: user.profile_photo });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Failed to update profile picture' });
  }
};

// Get Profile by ID (for viewing other profiles)
const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;

    // Don't allow users to view their own profile through this endpoint
    if (id === currentUserId.toString()) {
      return res.status(403).json({ message: 'Use /profile endpoint to view your own profile' });
    }

    const profile = await User.findById(id)
      .select('-password -email -phone_number') // Exclude sensitive information
      .lean();

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Get profile by ID error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// Get All Profiles (for view profiles page)
const getAllProfiles = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    
    // Get query parameters for filtering
    const { 
      location, 
      ageRange, 
      profession, 
      search,
      gender,
      marital_status,
      education,
      limit = 50,
      page = 1
    } = req.query;

    // Build filter object
    const filter = {
      _id: { $ne: currentUserId } // Exclude current user
    };

    // Location filter - Smart filtering for state and city
    if (location) {
      const locationSearch = location.toLowerCase().trim();
      const locationRegex = { $regex: locationSearch, $options: 'i' };
      
      // Search in both state and city
      filter.$or = [
        { 'location.state': locationRegex },
        { 'location.city': locationRegex }
      ];
    }

    // Age range filter
    if (ageRange) {
      if (ageRange.includes('+')) {
        // Handle "46+" format
        const minAge = parseInt(ageRange.replace('+', ''));
        if (!isNaN(minAge)) {
          filter.age = { $gte: minAge };
        }
      } else if (ageRange.includes('-')) {
        // Handle "18-25" format
        const [minAge, maxAge] = ageRange.split('-').map(Number);
        if (!isNaN(minAge) && !isNaN(maxAge)) {
          filter.age = { $gte: minAge, $lte: maxAge };
        } else if (!isNaN(minAge)) {
          filter.age = { $gte: minAge };
        }
      } else {
        // Handle single age
        const age = parseInt(ageRange);
        if (!isNaN(age)) {
          filter.age = { $gte: age };
        }
      }
    }

    // Profession filter
    if (profession) {
      filter.profession = { $regex: profession, $options: 'i' };
    }

    // Gender filter
    if (gender) {
      filter.gender = gender;
    }

    // Marital status filter
    if (marital_status) {
      filter.marital_status = marital_status;
    }

    // Education filter
    if (education) {
      filter.education = education;
    }

    // Search filter (searches across multiple fields)
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      const searchOr = [
        { full_name: searchRegex },
        { profession: searchRegex },
        { interests_hobbies: searchRegex },
        { brief_personal_description: searchRegex },
        { 'location.city': searchRegex },
        { 'location.state': searchRegex }
      ];
      
      // If we already have location filter, combine with AND
      if (filter.$or) {
        filter.$and = [
          { $or: filter.$or },
          { $or: searchOr }
        ];
        delete filter.$or;
      } else {
        filter.$or = searchOr;
      }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch profiles with filters
    const profiles = await User.find(filter)
      .select('-password -email -phone_number') // Exclude sensitive information
      .sort({ created_at: -1 }) // Sort by newest first
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
    const totalCount = await User.countDocuments(filter);

    res.json({
      profiles,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNextPage: skip + profiles.length < totalCount,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get all profiles error:', error);
    res.status(500).json({ message: 'Failed to fetch profiles' });
  }
};

const expressInterest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user._id;

    if (!targetUserId) {
      return res.status(400).json({ message: 'Target user ID is required.' });
    }

    if (currentUserId.toString() === targetUserId.toString()) {
      return res.status(400).json({ message: 'Cannot express interest in yourself.' });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if already expressed
    const alreadyExpressed = currentUser.expressed_interests.some(
      (entry) => entry.user && entry.user.toString() === targetUserId
    );
    if (!alreadyExpressed) {
      currentUser.expressed_interests.push({ user: targetUserId, sentAt: new Date() });
      await currentUser.save();
    }

    // Check if already received
    const alreadyReceived = targetUser.received_interests.some(
      (entry) => entry.user && entry.user.toString() === currentUserId
    );
    if (!alreadyReceived) {
      targetUser.received_interests.push({ user: currentUserId, sentAt: new Date() });
      await targetUser.save();
    }

    res.status(200).json({ message: 'Interest expressed successfully!' });
  } catch (error) {
    console.error('Error expressing interest:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeInterest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user._id;

    if (!targetUserId) {
      return res.status(400).json({ message: 'Target user ID is required.' });
    }

    // Remove from current user's expressed_interests
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { expressed_interests: { user: targetUserId } }
    });

    // Remove from target user's received_interests
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { received_interests: { user: currentUserId } }
    });

    res.status(200).json({ message: 'Interest removed successfully!' });
  } catch (error) {
    console.error('Error removing interest:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  updateProfilePicture,
  getAllProfiles,
  getProfileById,
  expressInterest,
  removeInterest
};
