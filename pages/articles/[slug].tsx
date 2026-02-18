import { useState } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
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
  image?: {
    url: string
    formats?: any
  }
}

// Helper function to get image URL
const getImageUrl = (image: any) => {
  if (!image) return null
  const url = image.url || image.formats?.large?.url || image.formats?.medium?.url || image.formats?.small?.url
  if (!url) return null
  return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`
}

interface ArticleDetailPageProps {
  article: Article | null
}

export default function ArticleDetailPage({ article }: ArticleDetailPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
              <Link href="/" style={styles.breadcrumbLink}>Anasayfa</Link>
              <span style={styles.breadcrumbSeparator}>/</span>
              <Link href="/" style={styles.breadcrumbLink}>Haberler</Link>
              <span style={styles.breadcrumbSeparator}>/</span>
              <span style={styles.breadcrumbCurrent}>{article.title}</span>
            </div>

            {/* Article Title */}
            <h1 style={styles.articleTitle}>{article.title}</h1>

            {/* Cover Image */}
            {article.image && getImageUrl(article.image) && (
              <div style={styles.coverImageContainer}>
                <img 
                  src={getImageUrl(article.image)!} 
                  alt={article.title}
                  style={styles.coverImage}
                />
              </div>
            )}

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
          <Link href="/" style={styles.logo}>
            <span className="logo-emoji">🏔️</span>
            <span className="logo-text"> Z.D.A.</span>
          </Link>
          
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
            <Link href="/about" style={styles.navLink}>Hakkımızda</Link>
            <Link href="/contact" style={styles.navLink}>İletişim</Link>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav style={styles.mobileNav}>
            <Link href="/" style={styles.mobileNavLink} className="mobile-home-link">Anasayfa</Link>
            <Link href="/projects" style={styles.mobileNavLink}>Projeler</Link>
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
  coverImageContainer: {
    width: '100%',
    maxWidth: '900px',
    height: 'auto',
    margin: '30px auto',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  coverImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'cover' as const,
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
  navLink: {
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500' as const,
    transition: 'color 0.2s',
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

// Generate static paths for all articles
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles`)
    const data = await res.json()
    
    const paths = (data.data || []).map((article: Article) => ({
      params: { slug: article.slug || article.documentId },
    }))

    return {
      paths,
      fallback: 'blocking',
    }
  } catch (error) {
    console.error('Error fetching article paths:', error)
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
}

// Fetch article data at build time
export const getStaticProps: GetStaticProps<ArticleDetailPageProps> = async ({ params }) => {
  try {
    const slug = params?.slug as string
    
    const fetchUrl = slug.includes('-') 
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`
      : `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?filters[documentId][$eq]=${slug}&populate=*`

    const res = await fetch(fetchUrl)
    const data = await res.json()

    if (!data.data || data.data.length === 0) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        article: data.data[0],
      },
      revalidate: 300, // Revalidate every 5 minutes (ISR)
    }
  } catch (error) {
    console.error('Error fetching article:', error)
    return {
      notFound: true,
    }
  }
}
