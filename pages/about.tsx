import { useState } from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'

interface PageData {
  id: number
  documentId: string
  title: string
  content: string
  slug: string
}

interface AboutPageProps {
  page: PageData | null
}

export default function AboutPage({ page }: AboutPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!page) {
    return (
      <div style={styles.page}>
        <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>📄</div>
          <h1 style={styles.emptyTitle}>Hakkımızda Sayfası Bulunamadı</h1>
          <p style={styles.emptyText}>
            Strapi admin panelinden "about" slug'ı ile bir sayfa oluşturmalısınız.
          </p>
          <Link href="/" style={styles.backLink}>
            ← Anasayfaya Dön
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{page.title} - Zirve Dayanışma Ağı</title>
        <meta name="description" content={page.title || ''} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div style={styles.page}>
        <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

        {/* Page Header */}
        <section style={styles.pageHeader}>
          <div style={styles.container}>
            <h1 style={styles.pageTitle}>{page.title}</h1>
            <div style={styles.breadcrumb}>
              <Link href="/" style={styles.breadcrumbLink}>Anasayfa</Link>
              <span style={styles.breadcrumbSeparator}>/</span>
              <span style={styles.breadcrumbCurrent}>{page.title}</span>
            </div>
          </div>
        </section>

        {/* Page Content */}
        <section style={styles.contentSection}>
          <div style={styles.container}>
            <div style={styles.contentWrapper}>
              <article style={styles.content}>
                {/* Content'i paragraf paragraf render et */}
                {page.content && Array.isArray(page.content) ? (
                  // Rich text content (array of blocks)
                  page.content.map((block: any, index: number) => {
                    if (block.type === 'paragraph' && block.children) {
                      return (
                        <p key={index} style={styles.paragraph}>
                          {block.children.map((child: any, i: number) => child.text).join('')}
                        </p>
                      )
                    }
                    return null
                  })
                ) : typeof page.content === 'string' ? (
                  page.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} style={styles.paragraph}>
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p style={styles.paragraph}>İçerik bulunmuyor.</p>
                )}
              </article>

              {/* Sidebar */}
              <aside style={styles.sidebar}>
                <div style={styles.sidebarCard}>
                  <h3 style={styles.sidebarTitle}>📞 İletişim</h3>
                  <p style={styles.sidebarText}>
                    <strong>Email:</strong><br />
                    info@zirvedayanisma.org
                  </p>
                  <p style={styles.sidebarText}>
                    <strong>Telefon:</strong><br />
                    +90 555 123 45 67
                  </p>
                </div>

                <div style={styles.sidebarCard}>
                  <h3 style={styles.sidebarTitle}>🎯 Misyonumuz</h3>
                  <p style={styles.sidebarText}>
                    Her gün binlerce insanın hayatına dokunmak ve gelecek için umut köprüleri kurmak.
                  </p>
                </div>

                <div style={styles.sidebarCard}>
                  <h3 style={styles.sidebarTitle}>📊 İstatistikler</h3>
                  <div style={styles.statItem}>
                    <div style={styles.statNumber}>12,000+</div>
                    <div style={styles.statLabel}>Aile</div>
                  </div>
                  <div style={styles.statItem}>
                    <div style={styles.statNumber}>48</div>
                    <div style={styles.statLabel}>Proje</div>
                  </div>
                  <div style={styles.statItem}>
                    <div style={styles.statNumber}>250+</div>
                    <div style={styles.statLabel}>Gönüllü</div>
                  </div>
                </div>
              </aside>
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
            <Link href="/" style={styles.navLink}>Anasayfa</Link>
            <Link href="/projects" style={styles.navLink}>Projeler</Link>
            <Link href="/about" style={styles.navLinkActive}>Hakkımızda</Link>
            <Link href="/contact" style={styles.navLink}>İletişim</Link>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav style={styles.mobileNav}>
            <Link href="/" style={styles.mobileNavLink}>Anasayfa</Link>
            <Link href="/projects" style={styles.mobileNavLink}>Projeler</Link>
            <Link href="/about" style={{...styles.mobileNavLink, fontWeight: '600', color: '#2563eb'}}>Hakkımızda</Link>
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
  emptyContainer: {
    textAlign: 'center' as const,
    padding: '100px 20px',
    minHeight: '60vh',
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '32px',
    color: '#1f2937',
    marginBottom: '15px',
  },
  emptyText: {
    fontSize: '18px',
    color: '#6b7280',
    marginBottom: '30px',
    maxWidth: '500px',
    margin: '0 auto 30px',
  },
  backLink: {
    display: 'block',
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '14px',
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
    fontSize: '18px',
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
  contentSection: {
    padding: '60px 0 80px',
  },
  contentWrapper: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '40px',
  },
  content: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    lineHeight: '1.8',
  },
  paragraph: {
    fontSize: '17px',
    color: '#374151',
    marginBottom: '20px',
    lineHeight: '1.8',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  sidebarCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  sidebarTitle: {
    fontSize: '18px',
    fontWeight: '600' as const,
    color: '#1f2937',
    marginBottom: '15px',
  },
  sidebarText: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.6',
    marginBottom: '10px',
  },
  statItem: {
    borderBottom: '1px solid #f3f4f6',
    paddingBottom: '12px',
    marginBottom: '12px',
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '700' as const,
    color: '#2563eb',
  },
  statLabel: {
    fontSize: '13px',
    color: '#9ca3af',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
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
}

// Server-side data fetching (SSG with ISR)
export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/pages?filters[slug][$eq]=about`)
    const data = await res.json()

    return {
      props: {
        page: data.data && data.data.length > 0 ? data.data[0] : null,
      },
      revalidate: 300, // Revalidate every 5 minutes (ISR)
    }
  } catch (error) {
    console.error('Error fetching about page:', error)
    return {
      props: {
        page: null,
      },
      revalidate: 300,
    }
  }
}
