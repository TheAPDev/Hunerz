import { useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
import { mockSubmissions } from '../mockData';
import type { Submission } from '../types';
import styles from './VerifyProfiles.module.css';

export const VerifyProfiles = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const allSkills = Array.from(
    new Set(mockSubmissions.flatMap((sub) => sub.student.skills.map((s) => s.name)))
  ).sort();

  const filteredSubmissions = mockSubmissions.filter((submission) => {
    const matchesSearch =
      !searchQuery ||
      submission.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.projectTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.every((skill) =>
        submission.student.skills.some((s) => s.name === skill)
      );

    return matchesSearch && matchesSkills;
  });

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'var(--success)';
      case 'rejected':
        return 'var(--error)';
      default:
        return 'var(--warning)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} />;
      case 'rejected':
        return <XCircle size={20} />;
      default:
        return <Clock size={20} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Verify Profiles</h1>
        <p className={styles.subtitle}>
          {filteredSubmissions.length} submission{filteredSubmissions.length !== 1 ? 's' : ''} to review
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by student name or project title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`${styles.filterBtn} ${showFilters ? styles.active : ''}`}
        >
          <Filter size={20} />
          Filters
          {selectedSkills.length > 0 && <span className={styles.badge}>{selectedSkills.length}</span>}
        </button>
      </div>

      {showFilters && (
        <div className={styles.filtersPanel}>
          <div className={styles.filtersHeader}>
            <h3>Filter by Skills</h3>
            {selectedSkills.length > 0 && (
              <button onClick={() => setSelectedSkills([])} className={styles.clearBtn}>
                Clear
              </button>
            )}
          </div>
          <div className={styles.skillsGrid}>
            {allSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => handleSkillToggle(skill)}
                className={`${styles.skillChip} ${selectedSkills.includes(skill) ? styles.selected : ''}`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.submissionsList}>
        {filteredSubmissions.map((submission) => (
          <div
            key={submission.id}
            className={styles.submissionCard}
            onClick={() => setSelectedSubmission(submission)}
          >
            <div className={styles.studentInfo}>
              <img
                src={submission.student.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'}
                alt={submission.student.name}
                className={styles.avatar}
              />
              <div>
                <h3>{submission.student.name}</h3>
                <p className={styles.email}>{submission.student.email}</p>
                <p className={styles.location}>{submission.student.location}</p>
              </div>
            </div>

            <div className={styles.submissionInfo}>
              <div className={styles.projectTitle}>{submission.projectTitle}</div>
              <div className={styles.submittedDate}>
                Submitted: {submission.submittedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className={styles.skills}>
                {submission.student.skills.slice(0, 3).map((skill) => (
                  <span key={skill.name} className={styles.skillTag}>
                    {skill.name}
                  </span>
                ))}
                {submission.student.skills.length > 3 && (
                  <span className={styles.moreSkills}>+{submission.student.skills.length - 3} more</span>
                )}
              </div>
            </div>

            <div className={styles.statusBadge} style={{ color: getStatusColor(submission.status) }}>
              {getStatusIcon(submission.status)}
              <span>{submission.status}</span>
            </div>

            {submission.score && (
              <div className={styles.score}>
                <div className={styles.scoreValue}>{submission.score}</div>
                <div className={styles.scoreLabel}>Score</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedSubmission && (
        <div className={styles.modal} onClick={() => setSelectedSubmission(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Submission Details</h2>
              <button onClick={() => setSelectedSubmission(null)} className={styles.closeBtn}>
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.studentSection}>
                <img
                  src={selectedSubmission.student.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'}
                  alt={selectedSubmission.student.name}
                  className={styles.modalAvatar}
                />
                <div>
                  <h3>{selectedSubmission.student.name}</h3>
                  <p>{selectedSubmission.student.email}</p>
                  <p className={styles.location}>{selectedSubmission.student.location}</p>
                  <p className={styles.bio}>{selectedSubmission.student.bio}</p>
                </div>
              </div>

              <div className={styles.section}>
                <h4>Project</h4>
                <p>{selectedSubmission.projectTitle}</p>
              </div>

              <div className={styles.section}>
                <h4>Submission Content</h4>
                <p>{selectedSubmission.content}</p>
              </div>

              <div className={styles.section}>
                <h4>Student Skills</h4>
                <div className={styles.allSkills}>
                  {selectedSubmission.student.skills.map((skill) => (
                    <div key={skill.name} className={styles.skillItem}>
                      <span className={styles.skillName}>{skill.name}</span>
                      <div className={styles.skillBar}>
                        <div className={styles.skillBarFill} style={{ width: `${skill.score}%` }} />
                      </div>
                      <span className={styles.skillScore}>{skill.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.section}>
                <h4>Status</h4>
                <div className={styles.statusBadgeLarge} style={{ color: getStatusColor(selectedSubmission.status) }}>
                  {getStatusIcon(selectedSubmission.status)}
                  <span>{selectedSubmission.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
