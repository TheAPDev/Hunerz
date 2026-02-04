import { useState } from 'react';
import { Search as SearchIcon, X, Bookmark } from 'lucide-react';
import { mockStudents, savedProfiles } from '../mockData';
import type { Student } from '../types';
import styles from './Search.module.css';

export const Search = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const allSkills = Array.from(
    new Set(mockStudents.flatMap((student) => student.skills.map((s) => s.name)))
  ).sort();

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSearch = () => {
    if (selectedSkills.length === 0) {
      setSearchResults([]);
      return;
    }

    const studentsWithScores = mockStudents.map((student) => {
      const studentSkillNames = student.skills.map((s) => s.name);
      const matchedSkills = selectedSkills.filter((skill) => studentSkillNames.includes(skill));
      const matchedSkillsCount = matchedSkills.length;

      const searchedSkillsScores = student.skills
        .filter((s) => selectedSkills.includes(s.name))
        .map((s) => s.score);
      const avgSearchedScore = searchedSkillsScores.length > 0
        ? searchedSkillsScores.reduce((a, b) => a + b, 0) / searchedSkillsScores.length
        : 0;

      const allSkillsAvg = student.skills.reduce((a, b) => a + b.score, 0) / student.skills.length;

      return {
        student,
        matchedSkillsCount,
        avgSearchedScore,
        allSkillsAvg,
      };
    });

    const filtered = studentsWithScores.filter((s) => s.matchedSkillsCount > 0);

    const sorted = filtered.sort((a, b) => {
      if (a.matchedSkillsCount !== b.matchedSkillsCount) {
        return b.matchedSkillsCount - a.matchedSkillsCount;
      }
      if (Math.abs(a.avgSearchedScore - b.avgSearchedScore) > 0.01) {
        return b.avgSearchedScore - a.avgSearchedScore;
      }
      return b.allSkillsAvg - a.allSkillsAvg;
    });

    setSearchResults(sorted.map((s) => s.student));
  };

  const handleSaveProfile = (studentId: string) => {
    if (savedProfiles.has(studentId)) {
      savedProfiles.delete(studentId);
    } else {
      savedProfiles.add(studentId);
    }
  };

  const getSkillScore = (student: Student, skillName: string) => {
    return student.skills.find((s) => s.name === skillName)?.score || 0;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Search Students</h1>
        <p className={styles.subtitle}>Find students based on their skills</p>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.skillsPanel}>
          <h3>Select Skills</h3>
          <div className={styles.skillsGrid}>
            {allSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => handleSkillToggle(skill)}
                className={`${styles.skillChip} ${selectedSkills.includes(skill) ? styles.selected : ''}`}
                title={skill}
                aria-label={skill}
              >
                {skill}
                {selectedSkills.includes(skill) && <X size={14} />}
              </button>
            ))}
          </div>
        </div>

        {selectedSkills.length > 0 && (
          <div className={styles.selectedSkills}>
            <span>Selected: {selectedSkills.join(', ')}</span>
            <button onClick={() => setSelectedSkills([])} className={styles.clearBtn}>
              Clear All
            </button>
          </div>
        )}

        <button
          onClick={handleSearch}
          className={styles.searchBtn}
          disabled={selectedSkills.length === 0}
        >
          <SearchIcon size={20} />
          Search Students
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className={styles.resultsSection}>
          <h2>
            {searchResults.length} Student{searchResults.length !== 1 ? 's' : ''} Found
          </h2>
          <div className={styles.resultsList}>
            {searchResults.map((student, index) => (
              <div
                key={student.id}
                className={styles.resultCard}
                onClick={() => setSelectedStudent(student)}
              >
                <div className={styles.rankBadge}>#{index + 1}</div>
                <div className={styles.studentInfo}>
                  <img
                    src={student.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'}
                    alt={student.name}
                    className={styles.avatar}
                  />
                  <div className={styles.studentDetails}>
                    <h3>{student.name}</h3>
                    <p>{student.email}</p>
                    <p className={styles.location}>{student.location}</p>
                  </div>
                </div>
                <div className={styles.matchedSkills}>
                  <div className={styles.skillsLabel}>Matched Skills:</div>
                  <div className={styles.skillsList}>
                    {selectedSkills.map((skill) => {
                      const score = getSkillScore(student, skill);
                      return score > 0 ? (
                        <div key={skill} className={styles.matchedSkill}>
                          <span className={styles.skillName}>{skill}</span>
                          <span className={styles.skillScore}>{score}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveProfile(student.id);
                  }}
                  className={`${styles.saveBtn} ${savedProfiles.has(student.id) ? styles.saved : ''}`}
                  title={savedProfiles.has(student.id) ? 'Unsave Profile' : 'Save Profile'}
                  aria-label={savedProfiles.has(student.id) ? 'Unsave Profile' : 'Save Profile'}
                >
                  <Bookmark size={18} fill={savedProfiles.has(student.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
            ))}
          </div>
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
