import React, { useEffect } from 'react';
import ProfileMenu from '../../components/profile/ProfileMenu.jsx';
import { useProfileStore } from '../../store/profileStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';
import { maskRuPhone } from '../../utils/phoneMask.js';

function avatarUrl(avatar) {
  if (!avatar) {
    return null;
  }

  return mediaUrl(avatar);
}

export default function ProfileSettingsPage() {
  const {
    profile,
    fetchProfile,
    updateProfile,
    changePassword,
    changeEmail,
    updatePhone,
    uploadAvatar,
    clearMessages,
    isLoading,
    error,
    success,
  } = useProfileStore();
  const [profileForm, setProfileForm] = React.useState({
    username: '',
    firstName: '',
    lastName: '',
    bio: '',
    birthDate: '',
  });
  const [phone, setPhone] = React.useState('');
  const [emailForm, setEmailForm] = React.useState({ newEmail: '', password: '' });
  const [passwordForm, setPasswordForm] = React.useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    fetchProfile().catch(() => {});
  }, [fetchProfile]);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setProfileForm({
      username: profile.user?.username || '',
      firstName: profile.profile?.firstName || '',
      lastName: profile.profile?.lastName || '',
      bio: profile.profile?.bio || '',
      birthDate: profile.profile?.birthDate
        ? profile.profile.birthDate.slice(0, 10)
        : '',
    });
    setPhone(profile.user?.phone || '');
    setEmailForm((current) => ({ ...current, newEmail: profile.user?.email || '' }));
  }, [profile]);

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0];

    if (file) {
      await uploadAvatar(file);
    }
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    clearMessages();
    await updateProfile(profileForm);
  }

  async function handlePhoneSubmit(event) {
    event.preventDefault();
    clearMessages();
    await updatePhone({ phone });
  }

  async function handleEmailSubmit(event) {
    event.preventDefault();
    clearMessages();
    await changeEmail(emailForm);
    setEmailForm((current) => ({ ...current, password: '' }));
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    clearMessages();
    await changePassword(passwordForm);
    setPasswordForm({ currentPassword: '', newPassword: '' });
  }

  return (
    <main className="profile-page">
      <ProfileMenu />
      <section className="profile-content settings-content">
        <div className="section-heading">
          <p className="eyebrow">Settings</p>
          <h1>Profile Settings</h1>
        </div>

        {error && <p className="state-text danger">{error}</p>}
        {success && <p className="state-text success">{success}</p>}

        <section className="settings-panel">
          <h2>Avatar</h2>
          <div className="avatar-upload">
            <div className="profile-avatar large">
              {avatarUrl(profile?.user?.avatar) ? (
                <img src={avatarUrl(profile.user.avatar)} alt={profile?.user?.username || 'Avatar'} />
              ) : (
                <span>{profile?.user?.username?.[0]?.toUpperCase() || 'V'}</span>
              )}
            </div>
            <label className="file-input-label">
              Choose image
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarChange} />
            </label>
          </div>
        </section>

        <form className="settings-panel" onSubmit={handleProfileSubmit}>
          <h2>Main profile</h2>
          <div className="settings-grid">
            <label>
              Username
              <input
                value={profileForm.username}
                onChange={(event) => setProfileForm({ ...profileForm, username: event.target.value })}
              />
            </label>
            <label>
              First name
              <input
                value={profileForm.firstName}
                onChange={(event) => setProfileForm({ ...profileForm, firstName: event.target.value })}
              />
            </label>
            <label>
              Last name
              <input
                value={profileForm.lastName}
                onChange={(event) => setProfileForm({ ...profileForm, lastName: event.target.value })}
              />
            </label>
            <label>
              Birth date
              <input
                type="date"
                value={profileForm.birthDate}
                onChange={(event) => setProfileForm({ ...profileForm, birthDate: event.target.value })}
              />
            </label>
          </div>
          <label>
            Bio
            <textarea
              value={profileForm.bio}
              onChange={(event) => setProfileForm({ ...profileForm, bio: event.target.value })}
              rows="4"
            />
          </label>
          <button className="gold-button" type="submit" disabled={isLoading}>Save profile</button>
        </form>

        <form className="settings-panel" onSubmit={handlePhoneSubmit}>
          <h2>Phone</h2>
          <label>
            Phone
            <input
              type="tel"
              placeholder="+7 (999) 999-99-99"
              maxLength="18"
              value={phone}
              onChange={(event) => setPhone(maskRuPhone(event.target.value))}
            />
          </label>
          <button className="gold-button" type="submit" disabled={isLoading}>Save phone</button>
        </form>

        <form className="settings-panel" onSubmit={handleEmailSubmit}>
          <h2>Email</h2>
          <div className="settings-grid">
            <label>
              New email
              <input
                type="email"
                value={emailForm.newEmail}
                onChange={(event) => setEmailForm({ ...emailForm, newEmail: event.target.value })}
              />
            </label>
            <label>
              Current password
              <input
                type="password"
                value={emailForm.password}
                onChange={(event) => setEmailForm({ ...emailForm, password: event.target.value })}
              />
            </label>
          </div>
          <button className="gold-button" type="submit" disabled={isLoading}>Change email</button>
        </form>

        <form className="settings-panel" onSubmit={handlePasswordSubmit}>
          <h2>Password</h2>
          <div className="settings-grid">
            <label>
              Current password
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })}
              />
            </label>
            <label>
              New password
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })}
              />
            </label>
          </div>
          <button className="gold-button" type="submit" disabled={isLoading}>Change password</button>
        </form>
      </section>
    </main>
  );
}
