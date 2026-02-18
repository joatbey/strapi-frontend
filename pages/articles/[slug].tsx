import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

interface Article {
  id: number
  documentId: string
  title: string
  slug: string
  excerpt: string
  content: string
  readTime?: number
  publishedAt: string
}

export default function ArticleDetailPage() {
  const router = useRouter()
  const { slug } = router.query
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!slug) return

    // Try slug first, fallback to documentId
    const fetchUrl = slug.includes('-') 
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`
      : `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?filters[documentId][$eq]=${slug}&populate=*`

    fetch(fetchUrl)
      .then(res => res.json())
      .then(data => {
        console.log('Article Detail:', data)
        if (data.data && data.data.length > 0) {
          setArticle(data.data[0])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Makale yükleniyor...</p>
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

  if (!article) {
    return (
      <div style={styles.page}>
        <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <div style={styles.notFoundContainer}>
          <div style={styles.notFoundIcon}>📄</div>
          <h1 style={styles.notFoundTitle}>Makale Bulunamadı</h1>
          <p style={styles.notFoundText}>
            Aradığınız makale mevcut değil veya kaldırılmış olabilir.
          </p>
          <Link href="/" style={styles.backButton}>
            ← Ana Sayfaya Dön
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{article.title} - Zirve Dayanışma Ağı</title>
        <meta name="description" content={article.excerpt || ''} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div style={styles.page}>
        <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

        {/* Article Header */}
        <article style={styles.article}>
          <div style={styles.container}>
            {/* Breadcrumb */}
            <div style={styles.breadcrumb}>
              <Link href="/" style={styles.breadcrumbLink}>Ana Sayfa</Link>
              <span style={styles.breadcrumbSeparator}>/</span>
              <Link href="/" style={styles.breadcrumbLink}>Haberler</Link>
              <span style={styles.breadcrumbSeparator}>/</span>
              <span style={styles.breadcrumbCurrent}>{article.title}</span>
            </div>

            {/* Article Title */}
            <h1 style={styles.articleTitle}>{article.title}</h1>

            {/* Article Meta */}
            <div style={styles.articleMeta}>
              <span style={styles.metaItem}>
                📅 {new Date(article.publishedAt).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              {article.readTime && (
                <span style={styles.metaItem}>
                  📖 {article.readTime} dakika okuma
                </span>
              )}
            </div>

            {/* Article Excerpt */}
            {article.excerpt && (
              <div style={styles.excerpt}>
                {article.excerpt}
              </div>
            )}

            {/* Article Content */}
            <div style={styles.content}>
              {article.content && typeof article.content === 'string' ? (
                article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} style={styles.paragraph}>
                    {paragraph}
                  </p>
                ))
              ) : article.content && Array.isArray(article.content) ? (
                // Rich text content (array of blocks)
                article.content.map((block: any, index: number) => {
                  if (block.type === 'paragraph' && block.children) {
                    return (
                      <p key={index} style={styles.paragraph}>
                        {block.children.map((child: any, i: number) => child.text).join('')}
                      </p>
                    )
                  }
                  return null
                })
              ) : (
                <p style={styles.paragraph}>İçerik bulunmuyor.</p>
              )}
            </div>

            {/* Share Section */}
            <div style={styles.shareSection}>
              <h3 style={styles.shareTitle}>Bu makaleyi paylaşın</h3>
              <div style={styles.shareButtons}>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.shareButton}
                >
                  📘 Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(article.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.shareButton}
                >
                  🐦 Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.shareButton}
                >
                  💼 LinkedIn
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`${article.title}\n\n${article.excerpt || ''}\n\nDevamını okumak için: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                  style={styles.shareButton}
                >
                  📧 E-posta
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div style={styles.articleNav}>
              <Link href="/" style={styles.navButton}>
                ← Tüm Haberler
              </Link>
              <Link href="/contact" style={styles.navButtonPrimary}>
                İletişime Geç →
              </Link>
            </div>
          </div>
        </article>

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
          <Link href="/" style={styles.logo}>🏔️</Link>
          
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
            <Link href="/projects" style={styles.navLink}>Projeler</Link>
            <Link href="/about" style={styles.navLink}>Hakkımızda</Link>
            <Link href="/contact" style={styles.navLink}>İletişim</Link>
            <a href={`${process.env.NEXT_PUBLIC_STRAPI_URL}/admin`} target="_blank" style={styles.adminLink}>
              Admin Panel →
            </a>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav style={styles.mobileNav}>
            <Link href="/" style={styles.mobileNavLink}>Ana Sayfa</Link>
            <Link href="/projects" style={styles.mobileNavLink}>Projeler</Link>
            <Link href="/about" style={styles.mobileNavLink}>Hakkımızda</Link>
            <Link href="/contact" style={styles.mobileNavLink}>İletişim</Link>
            <a href={`${process.env.NEXT_PUBLIC_STRAPI_URL}/admin`} target="_blank" style={styles.mobileAdminLink}>
              Admin Panel →
            </a>
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
  notFoundContainer: {
    textAlign: 'center' as const,
    padding: '100px 20px',
    minHeight: '60vh',
  },
  notFoundIcon: {
    fontSize: '80px',
    marginBottom: '20px',
  },
  notFoundTitle: {
    fontSize: '32px',
    color: '#1f2937',
    marginBottom: '15px',
  },
  notFoundText: {
    fontSize: '18px',
    color: '#6b7280',
    marginBottom: '30px',
  },
  backButton: {
    display: 'inline-block',
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '14px 28px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600' as const,
    fontSize: '16px',
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
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  logo: {
    fontSize: '20px',
    fontWeight: '800' as const,
    color: '#1f2937',
    textDecoration: 'none',
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
  article: {
    padding: '40px 0 80px',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    marginBottom: '30px',
    color: '#6b7280',
  },
  breadcrumbLink: {
    color: '#6b7280',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  breadcrumbSeparator: {
    color: '#d1d5db',
  },
  breadcrumbCurrent: {
    color: '#1f2937',
    fontWeight: '500' as const,
  },
  articleTitle: {
    fontSize: '48px',
    fontWeight: '800' as const,
    color: '#1f2937',
    lineHeight: '1.2',
    marginBottom: '20px',
  },
  articleMeta: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e5e7eb',
  },
  metaItem: {
    fontSize: '14px',
    color: '#6b7280',
  },
  excerpt: {
    fontSize: '20px',
    lineHeight: '1.6',
    color: '#4b5563',
    fontWeight: '500' as const,
    marginBottom: '40px',
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderLeft: '4px solid #2563eb',
    borderRadius: '4px',
  },
  content: {
    fontSize: '18px',
    lineHeight: '1.8',
    color: '#374151',
    marginBottom: '50px',
  },
  paragraph: {
    marginBottom: '20px',
  },
  shareSection: {
    padding: '30px 0',
    borderTop: '1px solid #e5e7eb',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '30px',
  },
  shareTitle: {
    fontSize: '18px',
    fontWeight: '600' as const,
    color: '#1f2937',
    marginBottom: '15px',
  },
  shareButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
  },
  shareButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500' as const,
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textDecoration: 'none',
    display: 'inline-block',
  },
  articleNav: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '15px',
    flexWrap: 'wrap' as const,
  },
  navButton: {
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600' as const,
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#6b7280',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  navButtonPrimary: {
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600' as const,
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: 'white',
    textDecoration: 'none',
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
    maxWidth: '1200px',
    margin: '0 auto 40px',
    padding: '0 20px',
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
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px 0',
  },
}
