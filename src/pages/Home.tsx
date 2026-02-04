import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../supabaseClient';
import styles from './Home.module.css';
export const Home = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const location = window.location;
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, description, difficulty, is_published, published_at, creator_id')
        .eq('is_published', true);
      if (error) {
        setFetchError(error.message);
      } else if (data) {
        // Convert published_at to Date object
        const projectsWithDate = data.map((p) => ({
          ...p,
          published_at: p.published_at ? new Date(p.published_at) : null,
        }));
        setProjects(projectsWithDate);
        setSelectedProject(projectsWithDate[0] || null);
      }
    };
    fetchProjects();
  }, [location.state?.refresh]);

  const sortedProjects = [...projects].sort(
    (a, b) => (b.published_at?.getTime?.() || 0) - (a.published_at?.getTime?.() || 0)
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'var(--success)';
      case 'Medium':
        return 'var(--warning)';
      case 'Hard':
        return 'var(--error)';
      default:
        return 'var(--platinum)';
    }
  };

  // If you want to show responses, fetch from a child table or view
  const responsesData = [];

  // acceptance_rate should come from SQL query alias if available
  const acceptanceData = selectedProject?.acceptance_rate !== undefined
    ? [{ month: 'Current', rate: selectedProject.acceptance_rate }]
    : [];

  // If you want to show total responses, fetch from a child table or view
  const totalResponses = 0;
  const avgAcceptanceRate = projects.length > 0 ? Math.round(
    projects.reduce((sum, p) => sum + (p.acceptance_rate || 0), 0) / projects.length
  ) : 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Dashboard</h1>
          <p className={styles.subtitle}>Overview of your published projects</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(14, 165, 233, 0.1)' }}>
            <Users size={24} style={{ color: 'var(--electric-blue)' }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{totalResponses}</div>
            <div className={styles.statLabel}>Total Responses</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <CheckCircle size={24} style={{ color: 'var(--success)' }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{avgAcceptanceRate}%</div>
            <div className={styles.statLabel}>Avg Acceptance Rate</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            <TrendingUp size={24} style={{ color: 'var(--warning)' }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{projects.length}</div>
            <div className={styles.statLabel}>Active Projects</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(184, 184, 184, 0.1)' }}>
            <Clock size={24} style={{ color: 'var(--platinum-dark)' }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {projects.filter((p) => p.published_at && (new Date().getTime() - p.published_at.getTime() < 7 * 24 * 60 * 60 * 1000)).length}
            </div>
            <div className={styles.statLabel}>Published This Week</div>
          </div>
        </div>
      </div>

      <div className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <h3>Monthly Responses Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={responsesData}>
              <defs>
                <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--electric-blue)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--electric-blue)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--charcoal-light)" />
              <XAxis dataKey="month" stroke="var(--platinum-dark)" />
              <YAxis stroke="var(--platinum-dark)" />
              <Tooltip
                contentStyle={{
                  background: 'var(--charcoal-black)',
                  border: '1px solid var(--charcoal-light)',
                  borderRadius: '8px',
                  color: 'var(--platinum)',
                }}
              />
              <Area type="monotone" dataKey="responses" stroke="var(--electric-blue)" fill="url(#colorResponses)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3>Acceptance Rate Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={acceptanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--charcoal-light)" />
              <XAxis dataKey="month" stroke="var(--platinum-dark)" />
              <YAxis stroke="var(--platinum-dark)" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: 'var(--charcoal-black)',
                  border: '1px solid var(--charcoal-light)',
                  borderRadius: '8px',
                  color: 'var(--platinum)',
                }}
              />
              <Line type="monotone" dataKey="rate" stroke="var(--success)" strokeWidth={2} dot={{ fill: 'var(--success)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.projectsSection}>
        <h2>Published Projects</h2>
        {fetchError && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>
            Error fetching projects: {fetchError}
          </div>
        )}
        <div className={styles.projectsList}>
          {sortedProjects.map((project) => (
            <div
              key={project.id}
              className={styles.publishedProjectCard}
            >
              <div className={styles.publishedProjectHeader}>
                <h3>{project.title}</h3>
              </div>
              <div className={styles.publishedProjectDate}>
                Published: {project.published_at ? project.published_at.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
