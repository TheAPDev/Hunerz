import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../supabaseClient';
import styles from './Home.module.css';

// Explicit types for project and location state
export type ProjectItem = {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  is_published: boolean;
  published_at: Date | null;
  creator_id: string;
  acceptance_rate?: number;
};

export type LocationState = {
  responsesData?: ProjectItem[];
};

export const Home = () => {
  const location = useLocation();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [fetchError, setFetchError] = useState('');

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
        const projectsWithDate: ProjectItem[] = data.map((p: any) => ({
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

  // If you want to show responses, fetch from navigation state or fallback to empty array
  const responsesData: ProjectItem[] = location.state?.responsesData ?? [];

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
          <div className={`${styles.statIcon} ${styles.statIconBlue}`}>
            <Users size={24} style={{ color: 'var(--electric-blue)' }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{totalResponses}</div>
            <div className={styles.statLabel}>Total Responses</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
            <CheckCircle size={24} style={{ color: 'var(--success)' }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{avgAcceptanceRate}%</div>
            <div className={styles.statLabel}>Avg Acceptance Rate</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconYellow}`}>
            <TrendingUp size={24} style={{ color: 'var(--warning)' }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{projects.length}</div>
            <div className={styles.statLabel}>Active Projects</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconGray}`}>
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
          <div className={styles.fetchError}>
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
