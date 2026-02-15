import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

interface Project {
  id: number
  documentId: string
  title: string
  slug: string
  description: string
  content: string
  excerpt?: string
  projectStatus: 'planning' | 'active' | 'completed'
  progress: number
  targetAmount?: number
  collectedAmount?: number
  startDate?: string
  endDate?: string
  beneficiaries?: number
  location?: string
  readTime?: number
  publishedAt: string
}

interface Category {
  id: number
  name: string
  slug: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/projects?populate=*&sort=publishedAt:desc`).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/categories`).then(res => res.json())
    ])
      .then(([projectsData, categoriesData]) => {
        console.log('Projects:', projectsData)
        console.log('Categories:', categoriesData)
        setProjects(projectsData.data || [])
        setCategories(categoriesData.data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Filter projects by status, category and search
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all'
    const matchesStatus = selectedStatus === 'all' || project.projectStatus === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Projeler yükleniyor...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h1 style={styles.errorTitle}>⚠️ Hata</h1>
        <p style={styles.errorText}>{error}</p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Projelerimiz - Zirve Dayanışma Ağı</title>
        <meta name="description" content="Yardım projelerimiz ve faaliyetlerimiz" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div style={styles.page}>
        <Header />

        {/* Page Header */}
        <section style={styles.pageHeader}>
          <div style={styles.container}>
            <h1 style={styles.pageTitle}>Projelerimiz</h1>
            <p style={styles.pageSubtitle}>
              İnsanlara dokunduğumuz her proje, bir umut köprüsü
            </p>
            <div style={styles.breadcrumb}>
              <Link href="/" style={styles.breadcrumbLink}>Ana Sayfa</Link>
              <span style={styles.breadcrumbSeparator}>/</span>
              <span style={styles.breadcrumbCurrent}>Projeler</span>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section style={styles.statsSection}>
          <div style={styles.container}>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>📊</div>
                <div style={styles.statNumber}>{projects.length}</div>
                <div style={styles.statLabel}>Toplam Proje</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>✅</div>
                <div style={styles.statNumber}>
                  {projects.filter(p => p.projectStatus === 'completed').length}
                </div>
                <div style={styles.statLabel}>Tamamlanan</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>🚀</div>
                <div style={styles.statNumber}>
                  {projects.filter(p => p.projectStatus === 'active').length}
                </div>
                <div style={styles.statLabel}>Aktif Projeler</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>👥</div>
                <div style={styles.statNumber}>
                  {projects.reduce((sum, p) => sum + (p.beneficiaries || 0), 0).toLocaleString('tr-TR')}
                </div>
                <div style={styles.statLabel}>Faydalanan Kişi</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Search Section */}
        <section style={styles.filterSection}>
          <div style={styles.container}>
            <div style={styles.filterWrapper}>
              {/* Search Bar */}
              <div style={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="🔍 Proje ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
              </div>

              {/* Status Filter */}
              <div style={styles.categoryFilter}>
                <button
                  onClick={() => setSelectedStatus('all')}
                  style={{
                    ...styles.categoryButton,
                    ...(selectedStatus === 'all' ? styles.categoryButtonActive : {})
                  }}
                >
                  🌟 Tümü ({projects.length})
                </button>
                <button
                  onClick={() => setSelectedStatus('active')}
                  style={{
                    ...styles.categoryButton,
                    ...(selectedStatus === 'active' ? styles.categoryButtonActive : {})
                  }}
                >
                  🚀 Aktif ({projects.filter(p => p.projectStatus === 'active').length})
                </button>
                <button
                  onClick={() => setSelectedStatus('completed')}
                  style={{
                    ...styles.categoryButton,
                    ...(selectedStatus === 'completed' ? styles.categoryButtonActive : {})
                  }}
                >
                  ✅ Tamamlanan ({projects.filter(p => p.projectStatus === 'completed').length})
                </button>
                <button
                  onClick={() => setSelectedStatus('planning')}
                  style={{
                    ...styles.categoryButton,
                    ...(selectedStatus === 'planning' ? styles.categoryButtonActive : {})
                  }}
                >
                  📋 Planlanan ({projects.filter(p => p.projectStatus === 'planning').length})
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div style={styles.resultsInfo}>
              <p style={styles.resultsText}>
                {filteredProjects.length} proje bulundu
                {searchQuery && ` "${searchQuery}" için`}
              </p>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section style={styles.projectsSection}>
          <div style={styles.container}>
            {filteredProjects.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📂</div>
                <h3 style={styles.emptyTitle}>Proje bulunamadı</h3>
                <p style={styles.emptyText}>
                  {searchQuery 
                    ? `"${searchQuery}" araması için sonuç bulunamadı. Farklı bir arama deneyin.`
                    : 'Henüz proje eklenmemiş. Strapi admin panelinden "Project" content type oluşturup proje ekleyin.'}
                </p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    style={styles.clearButton}
                  >
                    Aramayı Temizle
                  </button>
                )}
                <a 
                  href="http://localhost:1337/admin/content-manager/collection-types/api::project.project" 
                  target="_blank"
                  style={styles.adminButton}
                >
                  Strapi'de Proje Ekle →
                </a>
              </div>
            ) : (
              <div style={styles.projectsGrid}>
                {filteredProjects.map((project, index) => {
                  // Status badge colors
                  const statusConfig = {
                    active: { bg: '#10b981', text: '🚀 Aktif', color: 'white' },
                    completed: { bg: '#6366f1', text: '✅ Tamamlandı', color: 'white' },
                    planning: { bg: '#f59e0b', text: '📋 Planlanıyor', color: 'white' }
                  }
                  const status = statusConfig[project.projectStatus] || statusConfig.active

                  return (
                    <Link 
                      href={`/projects/${project.slug || project.documentId}`}
                      style={{textDecoration: 'none'}}
                      key={project.id}
                    >
                    <article 
                      key={project.id}
                      style={{
                        ...styles.projectCard,
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <div style={styles.cardHeader}>
                        <span style={{...styles.cardBadge, backgroundColor: status.bg}}>
                          {status.text}
                        </span>
                        {project.location && (
                          <span style={styles.cardLocation}>
                            📍 {project.location}
                          </span>
                        )}
                      </div>

                      <h3 style={styles.cardTitle}>
                        {project.title || 'Başlıksız Proje'}
                      </h3>

                      <p style={styles.cardExcerpt}>
                        {project.description || 'Açıklama bulunmuyor.'}
                      </p>

                      {/* Beneficiaries & Target */}
                      <div style={styles.projectInfo}>
                        {project.beneficiaries && (
                          <div style={styles.infoItem}>
                            <span style={styles.infoIcon}>👥</span>
                            <span style={styles.infoText}>{project.beneficiaries} kişi</span>
                          </div>
                        )}
                        {project.targetAmount && (
                          <div style={styles.infoItem}>
                            <span style={styles.infoIcon}>💰</span>
                            <span style={styles.infoText}>
                              {project.collectedAmount?.toLocaleString('tr-TR')} / {project.targetAmount.toLocaleString('tr-TR')} ₺
                            </span>
                          </div>
                        )}
                      </div>

                      <div style={styles.cardFooter}>
                        <div style={styles.cardMeta}>
                          <span style={styles.metaItem}>
                            📅 {new Date(project.startDate || project.publishedAt).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                        </div>
                        <Link 
                          href={`/projects/${project.slug || project.documentId}`}
                          style={styles.cardLink}
                        >
                          Detayları Gör →
                        </Link>
                      </div>

                      {/* Progress Bar */}
                      <div style={styles.cardProgress}>
                        <div style={styles.progressBar}>
                          <div 
                            style={{
                              ...styles.progressFill,
                              width: `${project.progress}%`,
                              backgroundColor: project.projectStatus === 'completed' ? '#6366f1' : '#10b981'
                            }}
                          ></div>
                        </div>
                        <span style={styles.progressText}>
                          %{project.progress} Tamamlandı
                        </span>
                      </div>
                    </article>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section style={styles.ctaSection}>
          <div style={styles.container}>
            <div style={styles.ctaCard}>
              <h2 style={styles.ctaTitle}>Bir Projeye Destek Ol</h2>
              <p style={styles.ctaText}>
                Her bağış, bir başkasının hayatına dokunuyor. Siz de projelerimize destek olabilirsiniz.
              </p>
              <div style={styles.ctaButtons}>
                <Link href="/contact" style={styles.ctaPrimary}>
                  💝 Bağış Yap
                </Link>
                <Link href="/about" style={styles.ctaSecondary}>
                  📖 Hakkımızda
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}

// Reusable Header Component
function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.nav}>
          <Link href="/" style={styles.logo}>🏔️ Zirve Dayanışma Ağı</Link>
          <nav style={styles.navLinks}>
            <Link href="/" style={styles.navLink}>Ana Sayfa</Link>
            <Link href="/projects" style={styles.navLinkActive}>Projeler</Link>
            <Link href="/about" style={styles.navLink}>Hakkımızda</Link>
            <Link href="/contact" style={styles.navLink}>İletişim</Link>
            <a href="http://localhost:1337/admin" target="_blank" style={styles.adminLink}>
              Admin Panel →
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

// Reusable Footer Component
function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h5 style={styles.footerTitle}>🏔️ Zirve Dayanışma Ağı</h5>
            <p style={styles.footerText}>
              2024'ten beri insanlık için çalışıyoruz.
            </p>
          </div>
          <div style={styles.footerSection}>
            <h5 style={styles.footerTitle}>Teknoloji</h5>
            <p style={styles.footerText}>
              ⚡ Next.js + Strapi CMS<br />
              🎨 Modern UI Design<br />
              🚀 Vercel Ready
            </p>
          </div>
          <div style={styles.footerSection}>
            <h5 style={styles.footerTitle}>İletişim</h5>
            <p style={styles.footerText}>
              📧 info@zirvedayanisma.org<br />
              📱 +90 555 123 45 67
            </p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>© 2024 Zirve Dayanışma Ağı. Built with ❤️ by DevYogo</p>
        </div>
      </div>
    </footer>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#fafafa',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#fafafa',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e0e0e0',
    borderTop: '4px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '20px',
    color: '#666',
    fontSize: '16px',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#fafafa',
  },
  errorTitle: {
    fontSize: '32px',
    marginBottom: '10px',
    color: '#dc2626',
  },
  errorText: {
    fontSize: '18px',
    color: '#666',
  },
  header: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky' as const,
    top: 0,
    zIndex: 50,
    backdropFilter: 'blur(10px)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: '800' as const,
    color: '#1f2937',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    gap: '30px',
    alignItems: 'center',
  },
  navLink: {
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500' as const,
    transition: 'color 0.2s',
  },
  navLinkActive: {
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600' as const,
    borderBottom: '2px solid #2563eb',
    paddingBottom: '2px',
  },
  adminLink: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600' as const,
    transition: 'all 0.2s',
  },
  pageHeader: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '60px 0 40px',
    textAlign: 'center' as const,
  },
  pageTitle: {
    fontSize: '48px',
    fontWeight: '800' as const,
    marginBottom: '15px',
  },
  pageSubtitle: {
    fontSize: '18px',
    opacity: 0.95,
    marginBottom: '20px',
  },
  breadcrumb: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    opacity: 0.9,
  },
  breadcrumbLink: {
    color: 'white',
    textDecoration: 'none',
    transition: 'opacity 0.2s',
  },
  breadcrumbSeparator: {
    opacity: 0.6,
  },
  breadcrumbCurrent: {
    fontWeight: '600' as const,
  },
  statsSection: {
    padding: '40px 0',
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  statCard: {
    textAlign: 'center' as const,
    padding: '20px',
  },
  statIcon: {
    fontSize: '36px',
    marginBottom: '10px',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: '700' as const,
    color: '#2563eb',
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  filterSection: {
    padding: '40px 0 20px',
  },
  filterWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    marginBottom: '20px',
  },
  searchContainer: {
    width: '100%',
  },
  searchInput: {
    width: '100%',
    padding: '14px 20px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    outline: 'none',
    transition: 'all 0.2s',
  },
  categoryFilter: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
  },
  categoryButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500' as const,
    border: '2px solid #e5e7eb',
    borderRadius: '20px',
    backgroundColor: 'white',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  categoryButtonActive: {
    borderColor: '#2563eb',
    backgroundColor: '#2563eb',
    color: 'white',
  },
  resultsInfo: {
    paddingTop: '10px',
  },
  resultsText: {
    fontSize: '14px',
    color: '#6b7280',
  },
  projectsSection: {
    padding: '20px 0 60px',
  },
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '30px',
  },
  projectCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s',
    cursor: 'pointer',
    animation: 'fadeInUp 0.6s ease-out forwards',
    opacity: 0,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  cardBadge: {
    backgroundColor: '#10b981',
    color: 'white',
    fontSize: '11px',
    fontWeight: '600' as const,
    padding: '4px 10px',
    borderRadius: '12px',
    letterSpacing: '0.5px',
  },
  cardDate: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  cardTitle: {
    fontSize: '22px',
    fontWeight: '600' as const,
    color: '#1f2937',
    marginBottom: '12px',
    lineHeight: '1.4',
  },
  cardExcerpt: {
    fontSize: '15px',
    color: '#6b7280',
    lineHeight: '1.6',
    marginBottom: '15px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '15px',
    borderTop: '1px solid #f3f4f6',
    marginBottom: '15px',
  },
  cardMeta: {
    display: 'flex',
    gap: '15px',
  },
  metaItem: {
    fontSize: '13px',
    color: '#9ca3af',
  },
  cardLink: {
    color: '#2563eb',
    fontSize: '14px',
    fontWeight: '600' as const,
    textDecoration: 'none',
  },
  cardProgress: {
    marginTop: '15px',
  },
  progressBar: {
    height: '6px',
    backgroundColor: '#e5e7eb',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(to right, #10b981, #059669)',
    borderRadius: '10px',
    transition: 'width 0.5s ease',
  },
  progressText: {
    fontSize: '12px',
    color: '#10b981',
    fontWeight: '500' as const,
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '80px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '2px dashed #e5e7eb',
  },
  emptyIcon: {
    fontSize: '60px',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '24px',
    color: '#1f2937',
    marginBottom: '10px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '20px',
    maxWidth: '500px',
    margin: '0 auto 20px',
  },
  clearButton: {
    padding: '12px 24px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  ctaSection: {
    padding: '60px 0',
    backgroundColor: '#f9fafb',
  },
  ctaCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '60px 40px',
    borderRadius: '16px',
    textAlign: 'center' as const,
  },
  ctaTitle: {
    fontSize: '36px',
    fontWeight: '700' as const,
    marginBottom: '15px',
  },
  ctaText: {
    fontSize: '18px',
    opacity: 0.95,
    marginBottom: '30px',
    maxWidth: '600px',
    margin: '0 auto 30px',
  },
  ctaButtons: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
  },
  ctaPrimary: {
    backgroundColor: 'white',
    color: '#667eea',
    padding: '14px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600' as const,
    transition: 'all 0.2s',
  },
  ctaSecondary: {
    backgroundColor: 'transparent',
    color: 'white',
    padding: '14px 32px',
    borderRadius: '8px',
    border: '2px solid white',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600' as const,
    transition: 'all 0.2s',
  },
  footer: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '60px 0 30px',
  },
  footerContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    marginBottom: '40px',
  },
  footerSection: {},
  footerTitle: {
    fontSize: '18px',
    fontWeight: '600' as const,
    marginBottom: '15px',
  },
  footerText: {
    color: '#9ca3af',
    fontSize: '14px',
    lineHeight: '1.8',
  },
  footerBottom: {
    textAlign: 'center' as const,
    paddingTop: '30px',
    borderTop: '1px solid #374151',
    color: '#9ca3af',
    fontSize: '14px',
  },
  cardLocation: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  projectInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    marginBottom: '15px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  infoIcon: {
    fontSize: '14px',
  },
  infoText: {
    fontSize: '13px',
    color: '#374151',
    fontWeight: '500' as const,
  },
  adminButton: {
    display: 'inline-block',
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600' as const,
    marginTop: '15px',
  },
}
