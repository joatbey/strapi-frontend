import { useState, FormEvent } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      // Strapi'ye POST isteği gönder
      const response = await fetch('http://localhost:1337/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            subject: formData.subject,
            message: formData.message,
            contactStatus: 'new' // Otomatik olarak "new" olarak işaretle
          }
        })
      })

      if (!response.ok) {
        throw new Error('Form gönderilemedi')
      }

      const data = await response.json()
      console.log('Form başarıyla gönderildi:', data)
      
      setStatus('success')
      
      // Form'u sıfırla
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })

      // 5 saniye sonra success mesajını kaldır
      setTimeout(() => setStatus('idle'), 5000)
      
    } catch (error) {
      console.error('Form gönderim hatası:', error)
      setErrorMessage('Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.')
      setStatus('error')
      
      // 5 saniye sonra error mesajını kaldır
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <Head>
        <title>İletişim - Zirve Dayanışma Ağı</title>
        <meta name="description" content="Bizimle iletişime geçin. Her sorunuz için buradayız." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div style={styles.page}>
        <Header />

        {/* Page Header */}
        <section style={styles.pageHeader}>
          <div style={styles.container}>
            <h1 style={styles.pageTitle}>İletişime Geçin</h1>
            <p style={styles.pageSubtitle}>
              Sorularınız, önerileriniz veya destek talebiniz için bize ulaşın
            </p>
            <div style={styles.breadcrumb}>
              <Link href="/" style={styles.breadcrumbLink}>Ana Sayfa</Link>
              <span style={styles.breadcrumbSeparator}>/</span>
              <span style={styles.breadcrumbCurrent}>İletişim</span>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section style={styles.contactSection}>
          <div style={styles.container}>
            <div style={styles.contactWrapper}>
              {/* Contact Form */}
              <div style={styles.formContainer}>
                <h2 style={styles.formTitle}>Mesaj Gönderin</h2>
                <p style={styles.formSubtitle}>
                  Formu doldurun, en kısa sürede size dönüş yapalım.
                </p>

                {status === 'success' && (
                  <div style={styles.successMessage}>
                    <span style={styles.successIcon}>✓</span>
                    Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
                  </div>
                )}

                {status === 'error' && (
                  <div style={styles.errorMessage}>
                    <span style={styles.errorIcon}>✗</span>
                    {errorMessage || 'Bir hata oluştu. Lütfen tekrar deneyin.'}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="name">
                        Ad Soyad <span style={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={styles.input}
                        placeholder="Adınız ve soyadınız"
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="email">
                        E-posta <span style={styles.required}>*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={styles.input}
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="phone">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="+90 555 123 45 67"
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="subject">
                        Konu <span style={styles.required}>*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        style={styles.select}
                      >
                        <option value="">Konu seçin</option>
                        <option value="genel">Genel Bilgi</option>
                        <option value="bagis">Bağış Yapmak İstiyorum</option>
                        <option value="gonullu">Gönüllü Olmak İstiyorum</option>
                        <option value="proje">Proje Hakkında</option>
                        <option value="diger">Diğer</option>
                      </select>
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="message">
                      Mesajınız <span style={styles.required}>*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      style={styles.textarea}
                      placeholder="Mesajınızı buraya yazın..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    style={{
                      ...styles.submitButton,
                      ...(status === 'sending' ? styles.submitButtonDisabled : {})
                    }}
                  >
                    {status === 'sending' ? (
                      <>
                        <span style={styles.spinner}></span>
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        📮 Mesajı Gönder
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Info Sidebar */}
              <aside style={styles.sidebar}>
                <div style={styles.infoCard}>
                  <div style={styles.infoIcon}>📍</div>
                  <h3 style={styles.infoTitle}>Adres</h3>
                  <p style={styles.infoText}>
                    Caddebostan, Haldun Taner Sk. No:11,<br />
                    34728 Kadıköy/İstanbul
                  </p>
                  <a 
                    href="https://www.google.com/maps/place//data=!4m2!3m1!1s0x14cac7743f173ccf:0x38392b73f79e1093?sa=X&ved=1t:8290&ictx=111"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.mapLink}
                  >
                    📍 Haritada Görüntüle
                  </a>
                </div>

                <div style={styles.infoCard}>
                  <div style={styles.infoIcon}>📧</div>
                  <h3 style={styles.infoTitle}>E-posta</h3>
                  <p style={styles.infoText}>
                    <a href="mailto:info@zirvedayanisma.org" style={styles.infoLink}>
                      info@zirvedayanisma.org
                    </a><br />
                    <a href="mailto:destek@zirvedayanisma.org" style={styles.infoLink}>
                      destek@zirvedayanisma.org
                    </a>
                  </p>
                </div>

                <div style={styles.infoCard}>
                  <div style={styles.infoIcon}>📱</div>
                  <h3 style={styles.infoTitle}>Telefon</h3>
                  <p style={styles.infoText}>
                    <a href="tel:+905551234567" style={styles.infoLink}>
                      +90 555 123 45 67
                    </a><br />
                    <span style={styles.infoSmall}>Pazartesi - Cuma: 09:00 - 18:00</span>
                  </p>
                </div>

                <div style={styles.infoCard}>
                  <div style={styles.infoIcon}>🕐</div>
                  <h3 style={styles.infoTitle}>Çalışma Saatleri</h3>
                  <p style={styles.infoText}>
                    <strong>Hafta içi:</strong> 09:00 - 18:00<br />
                    <strong>Cumartesi:</strong> 10:00 - 16:00<br />
                    <strong>Pazar:</strong> Kapalı
                  </p>
                </div>

                <div style={styles.socialCard}>
                  <h3 style={styles.infoTitle}>Sosyal Medya</h3>
                  <div style={styles.socialLinks}>
                    <a href="#" style={styles.socialLink}>📘 Facebook</a>
                    <a href="#" style={styles.socialLink}>📷 Instagram</a>
                    <a href="#" style={styles.socialLink}>🐦 Twitter</a>
                    <a href="#" style={styles.socialLink}>💼 LinkedIn</a>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section style={styles.mapSection}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3060.176255544934!2d32.85394!3d39.91987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac7743f173ccf%3A0x38392b73f79e1093!2z!5e0!3m2!1str!2str!4v1234567890!5m2!1str!2str"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Zirve Dayanışma Ağı Konumu"
          />
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
            <Link href="/#projeler" style={styles.navLink}>Projeler</Link>
            <Link href="/about" style={styles.navLink}>Hakkımızda</Link>
            <Link href="/contact" style={styles.navLinkActive}>İletişim</Link>
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
    maxWidth: '600px',
    margin: '0 auto 20px',
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
  contactSection: {
    padding: '60px 0 80px',
  },
  contactWrapper: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '40px',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  formTitle: {
    fontSize: '28px',
    fontWeight: '700' as const,
    color: '#1f2937',
    marginBottom: '10px',
  },
  formSubtitle: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '30px',
  },
  successMessage: {
    backgroundColor: '#d1fae5',
    border: '1px solid #10b981',
    color: '#065f46',
    padding: '15px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  successIcon: {
    backgroundColor: '#10b981',
    color: 'white',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold' as const,
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    border: '1px solid #dc2626',
    color: '#991b1b',
    padding: '15px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  errorIcon: {
    backgroundColor: '#dc2626',
    color: 'white',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold' as const,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#374151',
  },
  required: {
    color: '#dc2626',
  },
  input: {
    padding: '12px 16px',
    fontSize: '15px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    transition: 'all 0.2s',
    outline: 'none',
  },
  select: {
    padding: '12px 16px',
    fontSize: '15px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    transition: 'all 0.2s',
    outline: 'none',
    backgroundColor: 'white',
  },
  textarea: {
    padding: '12px 16px',
    fontSize: '15px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    transition: 'all 0.2s',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: '600' as const,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid white',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  infoCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    textAlign: 'center' as const,
  },
  infoIcon: {
    fontSize: '40px',
    marginBottom: '15px',
  },
  infoTitle: {
    fontSize: '18px',
    fontWeight: '600' as const,
    color: '#1f2937',
    marginBottom: '10px',
  },
  infoText: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.6',
  },
  infoLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '500' as const,
  },
  infoSmall: {
    fontSize: '12px',
    color: '#9ca3af',
    display: 'block',
    marginTop: '5px',
  },
  socialCard: {
    backgroundColor: '#f3f4f6',
    padding: '25px',
    borderRadius: '12px',
    textAlign: 'center' as const,
  },
  socialLinks: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  socialLink: {
    color: '#374151',
    textDecoration: 'none',
    fontSize: '14px',
    padding: '10px',
    borderRadius: '6px',
    backgroundColor: 'white',
    transition: 'all 0.2s',
  },
  mapSection: {
    marginTop: '40px',
    width: '100%',
  },
  mapLink: {
    display: 'inline-block',
    marginTop: '10px',
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600' as const,
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
