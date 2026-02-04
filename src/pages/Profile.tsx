import { useAuth } from '../context/AuthContext';
import { User, Mail, Building2, Briefcase } from 'lucide-react';
import styles from './Profile.module.css';

export const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Profile</h1>
        <p className={styles.subtitle}>Manage your account information</p>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarCircle}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <User size={64} strokeWidth={1.5} />
            )}
          </div>
          <h2>{user.name}</h2>
          <p className={styles.role}>{user.role}</p>
        </div>

        <div className={styles.infoSection}>
          <h3>Account Information</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <User size={20} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Full Name</div>
                <div className={styles.infoValue}>{user.name}</div>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <Mail size={20} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Email Address</div>
                <div className={styles.infoValue}>{user.email}</div>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <Building2 size={20} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Company</div>
                <div className={styles.infoValue}>{user.company}</div>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <Briefcase size={20} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Role</div>
                <div className={styles.infoValue}>{user.role}</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.statsSection}>
          <h3>Activity Summary</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <div className={styles.statValue}>4</div>
              <div className={styles.statLabel}>Published Projects</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue}>163</div>
              <div className={styles.statLabel}>Total Responses</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue}>2</div>
              <div className={styles.statLabel}>Saved Profiles</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue}>5</div>
              <div className={styles.statLabel}>Pending Reviews</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
