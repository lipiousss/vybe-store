import React, { useEffect } from 'react';
import ProfileMenu from '../../components/profile/ProfileMenu.jsx';
import { useProfileStore } from '../../store/profileStore.js';

const backendUrl = 'http://localhost:4000';

function avatarUrl(avatar) {
  if (!avatar) {
    return null;
  }

  return avatar.startsWith('/uploads') ? `${backendUrl}${avatar}` : avatar;
}

export default function ProfilePage() {
  const { profile, fetchProfile, isLoading, error } = useProfileStore();
  const user = profile?.user;
  const userProfile = profile?.profile;
  const stats = profile?.stats || { favorites: 0, orders: 0 };

  useEffect(() => {
    fetchProfile().catch(() => {});
  }, [fetchProfile]);

  return (
    <main className="profile-page">
      <ProfileMenu />
      <section className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar large">
            {avatarUrl(user?.avatar) ? (
              <img src={avatarUrl(user.avatar)} alt={user?.username || 'User avatar'} />
            ) : (
              <span>{user?.username?.[0]?.toUpperCase() || 'V'}</span>
            )}
          </div>
          <div className="profile-main-info">
            <p className="eyebrow">Profile</p>
            <h1>{user?.username || 'VYBE user'}</h1>
            {isLoading && <p className="state-text">Loading profile...</p>}
            {error && <p className="state-text danger">{error}</p>}
            <dl className="profile-details">
              <div>
                <dt>Email</dt>
                <dd>{user?.email || '-'}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{user?.role || '-'}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{user?.phone || '-'}</dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</dd>
              </div>
            </dl>
            {userProfile?.bio && <p>{userProfile.bio}</p>}
          </div>
        </div>

        <section className="profile-stats">
          <article>
            <span>{stats.favorites}</span>
            <p>Favorites</p>
          </article>
          <article>
            <span>{stats.orders}</span>
            <p>Orders</p>
          </article>
        </section>
      </section>
    </main>
  );
}
