import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../supabaseClient';
import styles from './Publish.module.css';

export const Publish = () => {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    requiredSkills: [] as string[],
    testCases: [''],
    constraints: [''],
    evaluationCriteria: [''],
  });
  const navigate = useNavigate();

  // Step navigation helpers
  const handleOpenModal = () => {
    setShowModal(true);
    setStep(1);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      title: '',
      description: '',
      difficulty: 'Medium',
      requiredSkills: [],
      testCases: [''],
      constraints: [''],
      evaluationCriteria: [''],
    });
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  // Skill management helpers
  const addSkill = (skill: string) => {
    if (skill && !formData.requiredSkills.includes(skill)) {
      setFormData({ ...formData, requiredSkills: [...formData.requiredSkills, skill] });
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter((s) => s !== skill),
    });
  };

  // Array item helpers
  const addArrayItem = (field: 'testCases' | 'constraints' | 'evaluationCriteria') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const updateArrayItem = (
    field: 'testCases' | 'constraints' | 'evaluationCriteria',
    index: number,
    value: string
  ) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const removeArrayItem = (field: 'testCases' | 'constraints' | 'evaluationCriteria', index: number) => {
    setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
  };

  // Available skills
  const availableSkills = [
    'React',
    'TypeScript',
    'Node.js',
    'Python',
    'Java',
    'Spring Boot',
    'Docker',
    'Kubernetes',
    'SQL',
    'MongoDB',
    'Machine Learning',
    'CSS',
  ];

  const handlePublish = async () => {
    // Defensive: check authentication
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user?.id) {
      alert('You must be logged in to publish a project.');
      return;
    }
    const userId = userData.user.id;
    // Only send valid columns to projects
    const { title, description, difficulty } = formData;
    const projectData = {
      title,
      description,
      difficulty,
      is_published: true,
      published_at: new Date().toISOString(),
      creator_id: userId,
    };
    // Insert project
    const { data, error } = await supabase.from('projects').insert([projectData]).select();
    if (error || !data || !data[0]?.id) {
      alert('Failed to publish project: ' + (error?.message || 'No project ID returned'));
      return;
    }
    const projectId = data[0].id;
    // Insert skills (RLS-compliant: select first, insert only if not found, handle insert errors gracefully)
    if (formData.requiredSkills && formData.requiredSkills.length > 0) {
      const skillIds: string[] = [];
      for (const skillName of formData.requiredSkills.filter(Boolean)) {
        // 1. Try to fetch skill by name
        const { data: skillData } = await supabase
          .from('skills')
          .select('id')
          .eq('name', skillName)
          .single();
        let skillId = skillData?.id;
        // 2. If not found, try to insert skill
        if (!skillId) {
          const { data: newSkill } = await supabase
            .from('skills')
            .insert([{ name: skillName }])
            .select('id')
            .single();
          if (newSkill?.id) {
            skillId = newSkill.id;
          } else {
            // 3. If insert fails (RLS or duplicate), try to re-fetch skill
            const { data: retrySkill } = await supabase
              .from('skills')
              .select('id')
              .eq('name', skillName)
              .single();
            if (retrySkill?.id) {
              skillId = retrySkill.id;
            } else {
              // 4. If still not found, skip this skill and continue
              console.warn('Skill "' + skillName + '" could not be inserted or found due to RLS or duplication. Skipping.');
              continue;
            }
          }
        }
        skillIds.push(skillId);
      }
      // 5. Insert into project_skills using only project_id and skill_id
      const skillRows = skillIds.map((skill_id) => ({ project_id: projectId, skill_id }));
      if (skillRows.length > 0) {
        const { error: skillsError } = await supabase.from('project_skills').insert(skillRows);
        if (skillsError) {
          alert('Project published, but failed to save skills: ' + skillsError.message);
          return;
        }
      }
    }
    // Insert test cases
    if (formData.testCases && formData.testCases.length > 0) {
      const testCaseRows = formData.testCases.filter(Boolean).map((test_case) => ({ project_id: projectId, test_case }));
      if (testCaseRows.length > 0) {
        const { error: testCasesError } = await supabase.from('project_test_cases').insert(testCaseRows);
        if (testCasesError) {
          alert('Project published, but failed to save test cases: ' + testCasesError.message);
          return;
        }
      }
    }
    // Insert constraints
    if (formData.constraints && formData.constraints.length > 0) {
      const constraintsRows = formData.constraints.filter(Boolean).map((description) => ({ project_id: projectId, description }));
      if (constraintsRows.length > 0) {
        const { error: constraintsError } = await supabase.from('project_constraints').insert(constraintsRows);
        if (constraintsError) {
          alert('Project published, but failed to save constraints: ' + constraintsError.message);
          return;
        }
      }
    }
    // Insert evaluation criteria
    if (formData.evaluationCriteria && formData.evaluationCriteria.length > 0) {
      const criteriaRows = formData.evaluationCriteria.filter(Boolean).map((criteria) => ({ project_id: projectId, criteria }));
      if (criteriaRows.length > 0) {
        const { error: criteriaError } = await supabase.from('project_evaluation_criteria').insert(criteriaRows);
        if (criteriaError) {
          alert('Project published, but failed to save evaluation criteria: ' + criteriaError.message);
          return;
        }
      }
    }
    setShowModal(false);
    navigate('/', { state: { refresh: true } });
  };

  // ...existing code...

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Publish Project</h1>
        <p className={styles.subtitle}>Share new projects with students</p>
      </div>

      <div className={styles.content}>
        <button onClick={handleOpenModal} className={styles.publishBtn} title="Publish New Project" aria-label="Publish New Project">
          <Upload size={24} />
          Publish New Project
        </button>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Publish Project</h2>
              <button onClick={handleCloseModal} className={styles.closeBtn} title="Close" aria-label="Close">
                <X size={24} />
              </button>
            </div>

            <div className={styles.stepIndicator}>
              <div className={`${styles.stepDot} ${step >= 1 ? styles.active : ''}`}>1</div>
              <div className={`${styles.stepLine} ${step >= 2 ? styles.active : ''}`} />
              <div className={`${styles.stepDot} ${step >= 2 ? styles.active : ''}`}>2</div>
              <div className={`${styles.stepLine} ${step >= 3 ? styles.active : ''}`} />
              <div className={`${styles.stepDot} ${step >= 3 ? styles.active : ''}`}>3</div>
            </div>

            <div className={styles.modalBody}>
              {step === 1 && (
                <div className={styles.stepContent}>
                  <div className={styles.inputGroup}>
                    <label>Project Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter project title"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter project description"
                      rows={4}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Difficulty</label>
                    <div className={styles.difficultyButtons}>
                      {(['Easy', 'Medium', 'Hard'] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => setFormData({ ...formData, difficulty: level })}
                          className={`${styles.difficultyBtn} ${formData.difficulty === level ? styles.active : ''}`}
                          title={level}
                          aria-label={level}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className={styles.stepContent}>
                  <div className={styles.inputGroup}>
                    <label>Required Skills</label>
                    <div className={styles.skillsSelector}>
                      {availableSkills.map((skill) => (
                        <button
                          key={skill}
                          onClick={() =>
                            formData.requiredSkills.includes(skill) ? removeSkill(skill) : addSkill(skill)
                          }
                          className={`${styles.skillChip} ${formData.requiredSkills.includes(skill) ? styles.selected : ''}`}
                          title={skill}
                          aria-label={skill}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Test Cases</label>
                    {formData.testCases.map((testCase, index) => (
                      <div key={index} className={styles.arrayInput}>
                        <input
                          type="text"
                          value={testCase}
                          onChange={(e) => updateArrayItem('testCases', index, e.target.value)}
                          placeholder={`Test case ${index + 1}`}
                        />
                        {formData.testCases.length > 1 && (
                          <button
                            onClick={() => removeArrayItem('testCases', index)}
                            className={styles.removeBtn}
                            title="Remove test case"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button onClick={() => addArrayItem('testCases')} className={styles.addBtn}>
                      + Add Test Case
                    </button>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Constraints</label>
                    {formData.constraints.map((constraint, index) => (
                      <div key={index} className={styles.arrayInput}>
                        <input
                          type="text"
                          value={constraint}
                          onChange={(e) => updateArrayItem('constraints', index, e.target.value)}
                          placeholder={`Constraint ${index + 1}`}
                        />
                        {formData.constraints.length > 1 && (
                          <button
                            onClick={() => removeArrayItem('constraints', index)}
                            className={styles.removeBtn}
                            title="Remove constraint"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button onClick={() => addArrayItem('constraints')} className={styles.addBtn}>
                      + Add Constraint
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className={styles.stepContent}>
                  <div className={styles.inputGroup}>
                    <label>Evaluation Criteria</label>
                    {formData.evaluationCriteria.map((criteria, index) => (
                      <div key={index} className={styles.arrayInput}>
                        <input
                          type="text"
                          value={criteria}
                          onChange={(e) => updateArrayItem('evaluationCriteria', index, e.target.value)}
                          placeholder={`Criteria ${index + 1}`}
                        />
                        {formData.evaluationCriteria.length > 1 && (
                          <button
                            onClick={() => removeArrayItem('evaluationCriteria', index)}
                            className={styles.removeBtn}
                            title="Remove criteria"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button onClick={() => addArrayItem('evaluationCriteria')} className={styles.addBtn}>
                      + Add Criteria
                    </button>
                  </div>

                  <div className={styles.reviewSection}>
                    <h3>Submission Review</h3>
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Project Title:</span>
                      <span className={styles.reviewValue}>{formData.title || '—'}</span>
                    </div>
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Difficulty Level:</span>
                      <span className={styles.reviewValue}>{formData.difficulty}</span>
                    </div>
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Number of Required Skills:</span>
                      <span className={styles.reviewValue}>{formData.requiredSkills.length}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              {step > 1 && (
                <button onClick={handlePrevious} className={styles.secondaryBtn}>
                  <ChevronLeft size={20} />
                  Previous
                </button>
              )}
              <div className={styles.flexSpacer} />
              {step < 3 ? (
                <button onClick={handleNext} className={styles.primaryBtn}>
                  Next
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button onClick={handlePublish} className={styles.publishBtnFinal}>
                  Publish
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
