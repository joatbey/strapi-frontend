import { useState } from 'react'
import { GetStaticProps } from 'next'
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
  coverImage?: {
    url: string
    formats?: any
  }
}

interface Category {
  id: number
  name: string
  slug: string
}

// Helper function to get image URL
const getImageUrl = (image: any) => {
  if (!image) return null
  const url = image.url || image.formats?.medium?.url || image.formats?.small?.url || image.formats?.thumbnail?.url
  if (!url) return null
  return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`
}

interface ProjectsPageProps {
  projects: Project[]
  categories: Category[]
}

export default function ProjectsPage({ projects, categories }: ProjectsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Filter projects by status, category and search
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all'
    const matchesStatus = selectedStatus === 'all' || project.projectStatus === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

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
        <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

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
                  href="https://loved-book-43118cd8ad.strapiapp.com/admin/content-manager/collection-types/api::project.project" 
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
                      key={project.id}
                      style={{textDecoration: 'none', color: 'inherit'}}
                    >
                      <article 
                        style={{
                          ...styles.projectCard,
                          animationDelay: `${index * 0.1}s`
                        }}
                      >
                        {/* Cover Image */}
                        {project.coverImage && getImageUrl(project.coverImage) && (
                          <div style={styles.cardImageContainer}>
                            <img 
                              src={getImageUrl(project.coverImage)!} 
                              alt={project.title}
                              style={styles.cardImage}
                            />
                          </div>
                        )}
                        
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
                          <span style={styles.cardLink}>
                            Detayları Gör →
                          </span>
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
function Header({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen: boolean, setMobileMenuOpen: (open: boolean) => void }) {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.nav}>
          <Link href="/" style={styles.logo}>🏔️ Z.D.A.</Link>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={styles.mobileMenuButton}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>

          {/* Desktop Navigation */}
          <nav style={styles.navLinks}>
            <Link href="/" style={styles.navLink}>Ana Sayfa</Link>
            <Link href="/projects" style={styles.navLinkActive}>Projeler</Link>
            <Link href="/about" style={styles.navLink}>Hakkımızda</Link>
            <Link href="/contact" style={styles.navLink}>İletişim</Link>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav style={styles.mobileNav}>
            <Link href="/" style={styles.mobileNavLink}>Ana Sayfa</Link>
            <Link href="/projects" style={{...styles.mobileNavLink, fontWeight: '600', color: '#2563eb'}}>Projeler</Link>
            <Link href="/about" style={styles.mobileNavLink}>Hakkımızda</Link>
            <Link href="/contact" style={styles.mobileNavLink}>İletişim</Link>
          </nav>
        )}
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
    fontSize: '20px',
    fontWeight: '800' as const,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    lineHeight: '1',
  } as React.CSSProperties,
  mobileMenuButton: {
    display: 'none',
    fontSize: '28px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#1f2937',
    padding: '5px',
  } as React.CSSProperties,
  navLinks: {
    display: 'flex',
    gap: '30px',
    alignItems: 'center',
  } as React.CSSProperties,
  mobileNav: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
    padding: '20px 0',
    borderTop: '1px solid #e5e7eb',
  } as React.CSSProperties,
  mobileNavLink: {
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500' as const,
    padding: '10px 0',
  } as React.CSSProperties,
  mobileAdminLink: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '12px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600' as const,
    textAlign: 'center' as const,
    display: 'block',
  } as React.CSSProperties,
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
    fontSize: '36px',
    fontWeight: '800' as const,
    marginBottom: '15px',
  } as React.CSSProperties,
  pageSubtitle: {
    fontSize: '16px',
    opacity: 0.95,
    marginBottom: '20px',
    padding: '0 20px',
  } as React.CSSProperties,
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
  } as React.CSSProperties,
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  } as React.CSSProperties,
  projectCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s',
    cursor: 'pointer',
    animation: 'fadeInUp 0.6s ease-out forwards',
    opacity: 0,
    overflow: 'hidden',
  },
  cardImageContainer: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    transition: 'transform 0.3s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    padding: '20px 25px 0',
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
    padding: '0 25px',
  },
  cardExcerpt: {
    fontSize: '15px',
    color: '#6b7280',
    lineHeight: '1.6',
    marginBottom: '15px',
    padding: '0 25px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '15px',
    borderTop: '1px solid #f3f4f6',
    marginBottom: '15px',
    padding: '15px 25px',
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
    padding: '0 25px 20px',
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
    fontSize: '28px',
    fontWeight: '700' as const,
    marginBottom: '15px',
  } as React.CSSProperties,
  ctaText: {
    fontSize: '16px',
    opacity: 0.95,
    marginBottom: '30px',
    maxWidth: '600px',
    margin: '0 auto 30px',
    padding: '0 20px',
  } as React.CSSProperties,
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
    margin: '0 25px 15px',
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

// Server-side data fetching (SSG with ISR)
export const getStaticProps: GetStaticProps<ProjectsPageProps> = async () => {
  try {
    const [projectsRes, categoriesRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/projects?populate=*&sort=publishedAt:desc`),
      fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/categories`)
    ])

    const projectsData = await projectsRes.json()
    const categoriesData = await categoriesRes.json()

    return {
      props: {
        projects: projectsData.data || [],
        categories: categoriesData.data || [],
      },
      revalidate: 300, // Revalidate every 5 minutes (ISR)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: {
        projects: [],
        categories: [],
      },
      revalidate: 300, // Revalidate every 5 minutes (ISR)
    }
  }
}
