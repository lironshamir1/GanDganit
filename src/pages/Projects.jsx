import { Link, useParams } from 'react-router-dom'
import { projects } from '../data/projectsData'
import './Projects.css'

/* עמוד לקריאה בלבד. התוכן נכתב ב-src/data/projectsData.js
   /projects — חלונית לכל פרויקט; /projects/:id — העמוד של הפרויקט */
export default function Projects() {
  return (
    <div className="page projects-page">
      <h1 className="page-title">🧩 פרויקטים</h1>

      {projects.length === 0 ? (
        <div className="card projects-empty">
          <p>כשיהיה פרויקט חדש בגן, הוא יופיע כאן</p>
        </div>
      ) : (
        <div className="projects-list">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="project-tile"
              style={project.color ? { '--tile-bg': project.color } : undefined}
            >
              <span className="project-tile-icon">{project.icon}</span>
              <span className="project-tile-body">
                <span className="project-tile-title">{project.title}</span>
                {project.summary && <span className="project-tile-text">{project.summary}</span>}
              </span>
              <span className="project-tile-arrow">←</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProjectPage() {
  const { id } = useParams()
  const project = projects.find((item) => item.id === id)

  return (
    <div className="page projects-page">
      <h1 className="page-title">🧩 פרויקטים</h1>
      <div className="project-back-row">
        <Link to="/projects" className="project-back">→ לכל הפרויקטים</Link>
      </div>

      {!project ? (
        <div className="card projects-empty">
          <p>הפרויקט לא נמצא</p>
        </div>
      ) : (
        <article className="card project-card">
          <header className="project-header">
            <span className="project-icon">{project.icon}</span>
            <h2 className="project-title">{project.title}</h2>
            {project.status && <span className="project-status">{project.status}</span>}
          </header>

          {project.description?.map((paragraph, idx) => (
            <p key={idx} className="project-text">{paragraph}</p>
          ))}

          {project.spotlight && (
            <aside className="project-spotlight">
              <span className="project-spotlight-icon">{project.spotlight.icon}</span>
              <span className="project-spotlight-body">
                <strong className="project-spotlight-title">{project.spotlight.title}</strong>
                <span className="project-spotlight-text">{project.spotlight.text}</span>
              </span>
            </aside>
          )}

          {project.tips?.length > 0 && (
            <section className="project-tips">
              {project.tipsTitle && <h3 className="project-tips-title">{project.tipsTitle}</h3>}
              {project.tipsIntro && <p className="project-tips-intro">{project.tipsIntro}</p>}
              <ul className="project-tips-list">
                {project.tips.map((tip) => (
                  <li key={tip.title} className="project-tip">
                    <span className="project-tip-icon">{tip.icon}</span>
                    <span className="project-tip-body">
                      <strong className="project-tip-title">{tip.title}</strong>
                      <span className="project-tip-text">{tip.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.closing && (
            <footer className="project-closing">
              {project.closing.title && <p className="project-closing-title">{project.closing.title}</p>}
              {project.closing.text && <p className="project-closing-text">{project.closing.text}</p>}
            </footer>
          )}
        </article>
      )}
    </div>
  )
}
