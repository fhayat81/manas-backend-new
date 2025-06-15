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
    const user = await User.findById(req.user._id).select('-password');
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
        country: updateData.location.country || (user.location && user.location.country)
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

module.exports = {
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  updateProfilePicture
};
