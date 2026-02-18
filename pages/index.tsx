import { useState } from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'

interface Article {
  id: number
  documentId: string
  title: string
  slug: string
  content: string
  excerpt: string
  readTime?: number
}

interface HomeProps {
  articles: Article[]
}

export default function Home({ articles }: HomeProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <Head>
        <title>Zirve Dayanışma Ağı - Haberler ve Projeler</title>
        <meta name="description" content="Yardım kuruluşu haberler ve projeler" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div style={styles.page}>
        {/* Header / Navigation */}
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
                <Link href="/" style={{...styles.navLink, fontWeight: '600', color: '#2563eb'}}>Ana Sayfa</Link>
                <Link href="/projects" style={styles.navLink}>Projeler</Link>
                <Link href="/about" style={styles.navLink}>Hakkımızda</Link>
                <Link href="/contact" style={styles.navLink}>İletişim</Link>
              </nav>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <nav style={styles.mobileNav}>
                <Link href="/" style={{...styles.mobileNavLink, fontWeight: '600', color: '#2563eb'}}>Ana Sayfa</Link>
                <Link href="/projects" style={styles.mobileNavLink}>Projeler</Link>
                <Link href="/about" style={styles.mobileNavLink}>Hakkımızda</Link>
                <Link href="/contact" style={styles.mobileNavLink}>İletişim</Link>
              </nav>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section style={styles.hero}>
          <div style={styles.container}>
            <h2 style={styles.heroTitle}>
              Birlikte <span style={styles.heroHighlight}>Daha Güçlüyüz</span>
            </h2>
            <p style={styles.heroSubtitle}>
              Her gün binlerce insanın hayatına dokunuyor, gelecek için umut köprüleri kuruyoruz.
            </p>
            <div style={styles.heroStats}>
              <div style={styles.stat}>
                <div style={styles.statNumber}>12K+</div>
                <div style={styles.statLabel}>Yardım Edilen Aile</div>
              </div>
              <div style={styles.stat}>
                <div style={styles.statNumber}>48</div>
                <div style={styles.statLabel}>Aktif Proje</div>
              </div>
              <div style={styles.stat}>
                <div style={styles.statNumber}>250+</div>
                <div style={styles.statLabel}>Gönüllü</div>
              </div>
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section style={styles.articlesSection}>
          <div style={styles.container}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Son Haberler ve Projeler</h3>
              <p style={styles.sectionSubtitle}>Faaliyetlerimiz ve güncellemeler</p>
            </div>

            {articles.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📝</div>
                <h4 style={styles.emptyTitle}>Henüz içerik eklenmemiş</h4>
                <p style={styles.emptyText}>
                  Strapi admin panelinden yeni makaleler ekleyebilirsiniz
                </p>
                <a 
                  href="https://loved-book-43118cd8ad.strapiapp.com/admin" 
                  target="_blank"
                  style={styles.emptyButton}
                >
                  Admin Panel'e Git →
                </a>
              </div>
            ) : (
              <div style={styles.grid}>
                {articles.map((article, index) => (
                  <Link 
                    href={`/articles/${article.slug || article.documentId}`}
                    style={{textDecoration: 'none'}}
                  >
                    <article 
                      key={article.id} 
                      style={{
                        ...styles.card,
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <div style={styles.cardBadge}>YENİ</div>
                      <h4 style={styles.cardTitle}>{article.title || 'Başlık yok'}</h4>
                      <p style={styles.cardExcerpt}>
                        {article.excerpt || 'Bu makale için henüz açıklama eklenmemiş...'}
                      </p>
                      <div style={styles.cardFooter}>
                        <span style={styles.cardMeta}>
                          📖 {article.readTime || 5} dk okuma
                        </span>
                        <span style={styles.cardLink}>Devamını Oku →</span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
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
      </div>
    </>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#fafafa',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  } as React.CSSProperties,
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
    marginBottom: '10px',
  },
  errorHint: {
    fontSize: '14px',
    color: '#999',
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
    margin: 0,
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
  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '60px 0',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  heroTitle: {
    fontSize: '36px',
    fontWeight: '800' as const,
    marginBottom: '20px',
    lineHeight: '1.2',
  } as React.CSSProperties,
  heroHighlight: {
    background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSubtitle: {
    fontSize: '16px',
    maxWidth: '600px',
    margin: '0 auto 40px',
    opacity: 0.95,
    lineHeight: '1.6',
    padding: '0 20px',
  } as React.CSSProperties,
  heroStats: {
    display: 'flex',
    gap: '50px',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
  },
  stat: {
    textAlign: 'center' as const,
    minWidth: '100px',
  } as React.CSSProperties,
  statNumber: {
    fontSize: '32px',
    fontWeight: '700' as const,
    marginBottom: '8px',
  } as React.CSSProperties,
  statLabel: {
    fontSize: '12px',
    opacity: 0.9,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  } as React.CSSProperties,
  articlesSection: {
    padding: '60px 0',
  } as React.CSSProperties,
  sectionHeader: {
    textAlign: 'center' as const,
    marginBottom: '40px',
    padding: '0 20px',
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '700' as const,
    color: '#1f2937',
    marginBottom: '10px',
  } as React.CSSProperties,
  sectionSubtitle: {
    fontSize: '16px',
    color: '#6b7280',
  } as React.CSSProperties,
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  } as React.CSSProperties,
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative' as const,
    border: '1px solid #e5e7eb',
    animation: 'fadeInUp 0.6s ease-out forwards',
    opacity: 0,
  },
  cardBadge: {
    position: 'absolute' as const,
    top: '15px',
    right: '15px',
    backgroundColor: '#10b981',
    color: 'white',
    fontSize: '11px',
    fontWeight: '600' as const,
    padding: '4px 10px',
    borderRadius: '12px',
    letterSpacing: '0.5px',
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: '600' as const,
    color: '#1f2937',
    marginBottom: '15px',
    lineHeight: '1.4',
  },
  cardExcerpt: {
    color: '#6b7280',
    fontSize: '15px',
    lineHeight: '1.7',
    marginBottom: '20px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #f3f4f6',
  },
  cardMeta: {
    fontSize: '13px',
    color: '#9ca3af',
  },
  cardLink: {
    color: '#2563eb',
    fontSize: '14px',
    fontWeight: '600' as const,
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
    color: '#6b7280',
    marginBottom: '30px',
  },
  emptyButton: {
    display: 'inline-block',
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600' as const,
    transition: 'all 0.2s',
  },
  footer: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '60px 0 30px',
    marginTop: '80px',
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
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles`)
    const data = await res.json()

    return {
      props: {
        articles: data.data || [],
      },
      revalidate: 300, // Revalidate every 5 minutes (ISR)
    }
  } catch (error) {
    console.error('Error fetching articles:', error)
    return {
      props: {
        articles: [],
      },
      revalidate: 300,
    }
  }
}
