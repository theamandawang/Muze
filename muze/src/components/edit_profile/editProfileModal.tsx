'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Avatar from '@/app/profile/settings/avatar';
import { TextField } from '@mui/material';
import { getCurrentUser, updateUser } from '@/app/api/user/route';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  onProfileUpdate: () => void;
}

export default function EditProfileModal({ open, onClose, onProfileUpdate }: EditProfileModalProps) {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      async function loadUser() {
        try {
          const user = await getCurrentUser();
          if (user) {
            setAvatarUrl(user.profile_pic || '');
            setUsername(user.username);
            setBio(user.bio || '');
          }
        } catch (error) {
          console.error('Error loading user: ', error);
        }
      }
      loadUser();
    }
  }, [open]);

  async function handleUpdateProfile() {
    const success = await updateUser(username, bio, file, avatarUrl);
    if (success) {
      alert('Profile updated successfully!');
      onProfileUpdate(); 
      onClose();
    } else {
      alert('Failed to update profile.');
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: 'var(--background)',
          color: 'white',
        }
      }}
    >
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Avatar url={avatarUrl} size={100} onUpload={(file) => setFile(file)}/>
        
        {/* Username TextField */}
        <TextField
          fullWidth
          margin="dense"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            color: 'white', // Label color
            '& .MuiInputLabel-root': {
              color: 'white', // Label color
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'var(--primary)', // Default border color (primary)
              },
              '&:hover fieldset': {
                borderColor: 'var(--primary)', // Outline color on hover (primary, thicker border)
              },
              '&.Mui-focused fieldset': {
                borderColor: 'var(--primary)', // Outline color on focus (primary, thicker border)
              },
              '& input': {
                color: 'white', // Text 
              },
            },
          }}
        />

        {/* Bio TextField */}
        <TextField
          fullWidth
          margin='dense'
          label='Bio'
          multiline
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          sx={{
            color: 'white',
            '& .MuiInputLabel-root': {
              color: 'white', // Label color
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'var(--primary)', // Default border color (primary)
              },
              '&:hover fieldset': {
                borderColor: 'var(--primary)', // Outline color on hover (primary, thicker border)
              },
              '&.Mui-focused fieldset': {
                borderColor: 'var(--primary)', // Outline color on focus (primary, thicker border)
              },
              '& textarea': {
                color: 'white', // Text area color (white)
              },
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: 'white' }}>Cancel</Button>
        <Button onClick={handleUpdateProfile} variant="contained" sx={{ backgroundColor: 'var(--primary)'}}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
