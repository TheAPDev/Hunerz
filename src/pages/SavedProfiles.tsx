import { useState } from 'react';
import { X, Bookmark } from 'lucide-react';
import { mockStudents, savedProfiles } from '../mockData';
import type { Student } from '../types';
import styles from './SavedProfiles.module.css';

export const SavedProfiles = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const saved = mockStudents.filter((student) => savedProfiles.has(student.id));

  const handleUnsave = (studentId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    savedProfiles.delete(studentId);
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Saved Profiles</h1>
        <p className={styles.subtitle}>
          {saved.length} saved profile{saved.length !== 1 ? 's' : ''}
        </p>
      </div>

      {saved.length === 0 ? (
        <div className={styles.emptyState}>
          <Bookmark size={64} strokeWidth={1} />
          <h3>No saved profiles yet</h3>
          <p>Profiles you save from the Search page will appear here</p>
        </div>
      ) : (
        <div className={styles.profilesList}>
          {saved.map((student) => (
            <div key={student.id} className={styles.profileCard} onClick={() => setSelectedStudent(student)}>
              <img
                src={student.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'}
                alt={student.name}
                className={styles.avatar}
              />
              <div className={styles.profileInfo}>
                <h3>{student.name}</h3>
                <p className={styles.email}>{student.email}</p>
                <p className={styles.location}>{student.location}</p>
                <p className={styles.bio}>{student.bio}</p>
                <div className={styles.skills}>
                  {student.skills.slice(0, 4).map((skill) => (
                    <span key={skill.name} className={styles.skillTag}>
                      {skill.name} {skill.score}
                    </span>
                  ))}
                  {student.skills.length > 4 && (
                    <span className={styles.moreSkills}>+{student.skills.length - 4} more</span>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => handleUnsave(student.id, e)}
                className={styles.unsaveBtn}
                title="Remove from saved"
              >
                <Bookmark size={20} fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedStudent && (
        <div className={styles.modal} onClick={() => setSelectedStudent(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedStudent(null)} title="Close" aria-label="Close">
              <X size={24} />
            </button>
            <div className={styles.modalHeader}>
              <img
                src={selectedStudent.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'}
                alt={selectedStudent.name}
                className={styles.modalAvatar}
              />
              <div>
                <h2>{selectedStudent.name}</h2>
                <p>{selectedStudent.email}</p>
                <p className={styles.location}>{selectedStudent.location}</p>
              </div>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.section}>
                <h3>Bio</h3>
                <p>{selectedStudent.bio}</p>
              </div>
              <div className={styles.section}>
                <h3>Education</h3>
                <p>{selectedStudent.education}</p>
              </div>
              <div className={styles.section}>
                <h3>Experience</h3>
                <p>{selectedStudent.experience}</p>
              </div>
              <div className={styles.section}>
                <h3>Skills</h3>
                <div className={styles.allSkills}>
                  {selectedStudent.skills.map((skill) => (
                    <div key={skill.name} className={styles.skillItem}>
                      <span className={styles.skillName}>{skill.name}</span>
                      <div className={styles.skillBar}>
                        <div
                          className={styles.skillBarFill}
                          data-score={skill.score}
                        />
                      </div>
                      <span className={styles.skillScore}>{skill.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
