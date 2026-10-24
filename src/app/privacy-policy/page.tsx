import type { Metadata } from 'next'
import PrivacyContents from '@/components/privacy/PrivacyContents'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'
import Footer from '@/components/layouts/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy — LOCATOR',
  description: 'How LOCATOR handles personal information across its website, GPS tracking, fleet management, and related software services.',
  alternates: { canonical: '/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy | Locator',
    description: 'Information collection, service data, website forms, and privacy requests at LOCATOR.',
    url: '/privacy-policy',
    type: 'website',
  },
}

const sections = [
  {
    "id": "introduction",
    "title": "1. Introduction",
    "paragraphs": [
      "At LOCATOR, we respect the privacy and security of your information. This Privacy Policy explains how we collect, use, disclose, and protect personal information when you visit our website, contact us, or use our GPS tracking and fleet management services, including related software and mobile interfaces.",
      "LOCATOR is a product managed by Synosys Technologies LLC. Our services include asset tracking, motorcycle tracking, school bus tracking, sales and service tracking, delivery and truck tracking, and related fleet management capabilities.",
      "Where a business, employer, school, or fleet operator determines how personal information is collected and used through its deployment, that organization is responsible for those decisions and the required notices and permissions. We process that information to provide the agreed services. People whose vehicles or activities are monitored should also refer to the deploying organization’s privacy information."
    ]
  },
  {
    "id": "information",
    "title": "2. Information Collection and Use",
    "paragraphs": [
      "Information you provide: We collect information you submit when requesting a quote, booking a demo, sending an enquiry, using our support chat, applying for a role, or contacting us directly. Depending on the request, this may include your name, email address, telephone number, company, fleet requirements, appointment preferences, messages, and attachments. Career applications may also include a resume, employment history, and other recruitment details you provide.",
      "Service information: Depending on the services used and the customer’s configuration, we may process account details, vehicle or asset identifiers, location data, trip and route records, and operational information needed for vehicle tracking, asset monitoring, and field activity management.",
      "Technical and usage information: Our website and service tools may process information such as your IP address, browser or device information, usage events, and diagnostic records to operate and improve the services.",
      "We use this information to provide, maintain, protect, and improve our services; monitor vehicles, assets, and relevant activities as described in the service; respond to enquiries; prepare quotes; arrange demonstrations; provide customer support; assess job applications; and carry out related administration and communication. We also use information where necessary to secure our systems and meet applicable legal obligations."
    ]
  },
  {
    "id": "sharing",
    "title": "3. Information Sharing",
    "paragraphs": [
      "We do not sell or trade your personal information. We may share information with trusted providers that help us operate our website, deliver communications, host or support our systems, and provide our services. Access is limited to the relevant purpose and subject to appropriate confidentiality arrangements.",
      "In business tracking deployments, authorized users at the customer organization may access account, location, vehicle, and operational information as part of the agreed service.",
      "We may also disclose information where required by applicable law or lawful requests, or where necessary to protect legal rights, service security, and safety. Where service providers process information outside your country, applicable data protection requirements must be considered."
    ]
  },
  {
    "id": "security",
    "title": "4. Data Security",
    "paragraphs": [
      "We use reasonable technical and organizational safeguards designed to protect personal information against unauthorized access, alteration, disclosure, or loss. No method of internet transmission or electronic storage can be guaranteed completely secure. Please avoid submitting unnecessary sensitive information in website messages or attachments."
    ]
  },
  {
    "id": "cookies",
    "title": "5. Cookies and Tracking Technologies",
    "paragraphs": [
      "Our website may use cookies, browser storage, analytics, and conversion tracking to support functionality, understand website interactions, and measure events such as successful enquiries and demo bookings. These technologies may process device identifiers, IP addresses, and interaction information; they are not necessarily anonymous.",
      "Browser storage is also used to retain an on-site support chat conversation during your visit. Embedded Vimeo videos, Google Maps, and links to services such as WhatsApp may involve third-party processing of browser, device, and interaction information under those providers’ privacy policies.",
      "We use Cloudflare Turnstile to help verify enquiry and career application form submissions and reduce automated spam. This involves Cloudflare processing browser and device signals for verification. We validate the verification token with Cloudflare before sending an enquiry or application email.",
      "You can manage cookies and browser storage through your browser settings. Restricting them may affect some website features. This policy does not replace the privacy policies of third-party websites or services."
    ]
  },
  {
    "id": "children",
    "title": "6. Children’s Privacy",
    "paragraphs": [
      "Our website enquiry forms and business accounts are intended for adults. We do not knowingly solicit personal information directly from children through these channels.",
      "Some services, such as school bus tracking, may involve children’s information when deployed by an authorized organization. That organization is responsible for the required privacy notices and any necessary parent or guardian permissions under applicable law.",
      "If you believe a child has provided personal information without appropriate authorization, please contact us so we can review the matter and take appropriate action."
    ]
  },
  {
    "id": "retention",
    "title": "7. Data Retention",
    "paragraphs": [
      "We retain personal information for as long as reasonably needed for the purpose for which it was collected, including responding to requests, recruitment, providing contracted services, and meeting applicable legal or recordkeeping obligations.",
      "Retention depends on the type of information, the service, and relevant customer instructions and legal requirements. This policy does not specify a single retention period for every category of data."
    ]
  },
  {
    "id": "rights",
    "title": "8. Your Privacy Requests",
    "paragraphs": [
      "Depending on applicable law and your circumstances, you may request access to, correction of, or deletion of your personal information, or raise concerns about how it is used. We may need to verify your identity and consider contractual, security, and legal obligations before acting on a request.",
      "If your information is processed through an employer, school, fleet operator, or another business customer, that organization may be the appropriate first contact. We can help direct your enquiry where appropriate. Please contact info@locator.ae for privacy questions or requests."
    ]
  },
  {
    "id": "changes",
    "title": "9. Changes to This Privacy Policy",
    "paragraphs": [
      "We may update this policy to reflect changes to our website, services, or privacy practices. The updated version will be published on this page with a revised date. Please review it periodically. Where applicable law requires additional notice or consent, we will follow those requirements."
    ]
  },
  {
    "id": "contact-information",
    "title": "10. Contact Information",
    "paragraphs": [
      "For questions about this Privacy Policy or LOCATOR’s handling of personal information, contact info@locator.ae or use the contact page on our website.",
      "LOCATOR is managed by Synosys Technologies LLC."
    ]
  }
]

export default function PrivacyPolicyPage() {
  return (
    <main className="pp-page">
      <SoftwareNavbar />
      <style href="privacy-policy-page" precedence="medium">{`
        .pp-page { min-height: 100vh; background: #f8faff; color: #171c25; }
        .pp-hero { padding: 58px 24px 50px; text-align: center; background: linear-gradient(180deg,#f1f7ff 0%,#f8faff 100%); }
        .pp-hero::before { content: ''; display: block; width: 58px; height: 3px; margin: 0 auto 18px; background: #0875ef; border-radius: 2px; }
        .pp-hero h1 { margin: 0 0 16px; font-size: clamp(36px,4.6vw,58px); font-weight: 750; line-height: 1.16; letter-spacing: -.035em; }
        .pp-hero h1 span { color: #066bea; }
        .pp-hero-description { max-width: 600px; margin: 0 auto; font-size: 15px; line-height: 1.75; color: #626976; }
        .pp-updated { margin: 14px 0 0; font-size: 12px; color: #697282; }
        .pp-layout { display: grid; grid-template-columns: 250px minmax(0,1fr); align-items: start; gap: 48px; max-width: 1200px; margin: 0 auto; padding: 10px 32px 88px; }
        .pp-sidebar { position: sticky; top: 88px; }
        .pp-contents { background: #f2f5fb; padding: 22px 12px; border-radius: 8px; max-height: calc(100svh - 112px); overflow-y: auto; }
        .pp-contents h2 { font-size: 14px; line-height: 1.5; font-weight: 700; margin: 0 12px 14px; }
        .pp-contents ol { list-style: none; margin: 0; padding: 0; }
        .pp-contents li + li { margin-top: 3px; }
        .pp-contents a { position: relative; display: flex; align-items: baseline; gap: 7px; padding: 9px 12px; border-radius: 4px; color: #606875; font-size: 12px; line-height: 1.55; text-decoration: none; }
        .pp-nav-number { flex: 0 0 17px; }
        .pp-contents a:hover { background: #eaf1fd; color: #065cce; }
        .pp-contents a[aria-current="location"] { background: #e4efff; color: #0066db; font-weight: 600; }
        .pp-contents a[aria-current="location"]::before { content: ''; position: absolute; left: -3px; top: 15px; width: 7px; height: 7px; border-radius: 50%; background: #0875ef; }
        .pp-article { min-width: 0; }
        .pp-article section { margin-bottom: 42px; scroll-margin-top: 110px; overflow-wrap: anywhere; }
        .pp-article section:last-child { margin-bottom: 0; }
        .pp-article section::before { content: ''; display: block; width: 28px; height: 3px; margin-bottom: 14px; border-radius: 2px; background: #237cef; }
        .pp-article h2 { margin: 0 0 14px; font-size: clamp(21px,2vw,27px); font-weight: 700; line-height: 1.35; letter-spacing: -.025em; }
        .pp-section-number { color: #006cde; }
        .pp-article p { margin: 0 0 15px; color: #626976; font-size: 14px; line-height: 1.85; }
        .pp-article strong { color: #343c49; font-weight: 600; }
        .pp-article a { color: #0969da; text-decoration: underline; text-underline-offset: 3px; }
        .pp-page a:focus-visible { outline: 2px solid #0969da; outline-offset: 4px; }
        .pp-article .pp-links { font-size: 13px; }
        @media (max-width: 900px) {
          .pp-layout { grid-template-columns: 210px minmax(0,1fr); gap: 28px; padding-inline: 24px; }
        }
        @media (max-width: 700px) {
          .pp-hero { padding: 40px 20px 32px; }
          .pp-hero-description { font-size: 14px; }
          .pp-layout { grid-template-columns: minmax(0,1fr); gap: 32px; padding: 0 20px 56px; }
          .pp-sidebar { position: static; }
          .pp-contents { max-height: none; padding: 18px 12px; }
          .pp-contents ol { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 3px 8px; }
          .pp-contents li + li { margin-top: 0; }
          .pp-contents a { height: 100%; padding: 8px; font-size: 12px; }
          .pp-article section { margin-bottom: 34px; }
        }
        @media (max-width: 380px) {
          .pp-contents ol { grid-template-columns: minmax(0,1fr); }
        }
        @media print {
          .pp-hero { padding: 24px 0; }
          .pp-layout { display: block; padding: 0; }
          .pp-sidebar { display: none; }
          .pp-page { background: #fff; }
        }
      `}</style>
      <header className="pp-hero">
        <h1>Privacy <span>Policy</span></h1>
        <p className="pp-hero-description">This Privacy Policy explains how LOCATOR collects, uses, protects, and manages your personal information.</p>
        <p className="pp-updated">Last updated: <time dateTime="2026-10-21">21 October 2026</time></p>
      </header>
      <div className="pp-layout">
        <aside className="pp-sidebar">
          <PrivacyContents sections={sections.map(({ id, title }) => ({ id, title }))} />
        </aside>
        <article className="pp-article" aria-label="Privacy policy">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} aria-labelledby={`pp-${section.id}`}>
              <h2 id={`pp-${section.id}`}>
                <span className="pp-section-number">{index + 1}.</span>{' '}
                {section.title.replace(/^\d+\.\s*/, '')}
              </h2>
              {section.paragraphs.map(paragraph => {
                const label = paragraph.match(/^([^:]{1,45}:) /)?.[1]
                const body = label ? paragraph.slice(label.length + 1) : paragraph
                return (
                  <p key={paragraph}>
                    {label && <><strong>{label}</strong>{' '}</>}
                    {body.split(/(info@locator\.ae)/g).map((part, i) =>
                      part === 'info@locator.ae'
                        ? <a key={i} href={`mailto:${part}`}>{part}</a>
                        : part
                    )}
                  </p>
                )
              })}
              {section.id === 'cookies' && (
                <p className="pp-links">
                  Provider policies:{' '}
                  <a href="https://vimeo.com/privacy" target="_blank" rel="noopener noreferrer">Vimeo</a>,{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google</a>,{' '}
                  <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Cloudflare</a>, and{' '}
                  <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">WhatsApp</a>.
                </p>
              )}
            </section>
          ))}
        </article>
      </div>
      <Footer />
    </main>
  )
}
