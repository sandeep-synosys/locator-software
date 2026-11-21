
import Image from 'next/image'

export default function SecurepathExplainer() {
  return (
    <>
      <style>{`
        .sph-exp-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: clamp(32px, 5vw, 64px);
          align-items: start;
        }

        .sph-exp-image {
          position: sticky;
          top: 110px;
          align-self: start;
        }

        .sph-exp-grid a {
          color: #1360ee;
          font-weight: 600;
          text-decoration: none;
        }

        .sph-exp-grid a:hover {
          text-decoration: underline;
        }

        @media (max-width: 900px) {
          .sph-exp-grid {
            grid-template-columns: 1fr;
          }

          .sph-exp-image {
            position: static;
            top: auto;
            align-self: auto;
            order: -1;
          }
        }
      `}</style>

      <section
        style={{
          paddingTop: 0,
          paddingBottom: 'clamp(56px,7vw,80px)',
          paddingLeft: 28,
          paddingRight: 28,
          background: '#fff',
        }}
      >
        <div
          className="sph-exp-grid"
          style={{
            maxWidth: 'var(--w-1180)',
            margin: '0 auto',
          }}
        >
          <div data-reveal="left">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                display: 'grid',
                placeItems: 'center',
                marginBottom: '18px',
                background: 'rgba(19,96,238,.10)',
                color: '#1360ee',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 28 28"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="9" cy="9" r="5" fill="currentColor" opacity=".9" />
                <circle cx="19" cy="9" r="5" fill="currentColor" opacity=".65" />
                <circle cx="14" cy="18" r="5" fill="currentColor" opacity=".4" />
              </svg>
            </div>

            <h2
              style={{
                margin: '0 0 18px',
                fontSize:
                  'max(clamp(22px,2.8vw,30px), min(2.083vw, 43.5px))',
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: '-.02em',
                color: '#1360ee',
              }}
            >
              SecurePath GPS Tracking &amp; Its Importance
            </h2>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '36px',
              }}
            >
              <p style={paragraphStyle}>
                In the modern world, GPS tracking systems have seamlessly
                intertwined themselves into the fabric of everyday life,
                offering a wide range of applications from safeguarding
                individuals to optimizing commercial operations.
              </p>

              <p style={paragraphStyle}>
                <a
                  href="https://www.sira.gov.ae"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Security Industries Regulatory Agency (SIRA Dubai)
                </a>{' '}
                initiated a process by which all Rental vehicles and some
                other security related vehicles in Dubai and some other
                Emirates has to install a GPS Tracking Device with
                Certificate of Installation.
              </p>

              <p style={paragraphStyle}>
                Through{' '}
                <a
                  href="https://securepath.ae"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SecurePath
                </a>{' '}
                login or{' '}
                <a
                  href="https://www.sira.gov.ae"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SIRA
                </a>{' '}
                Portal Login, customer can monitor the activities of the
                vehicles with encrypted data.
              </p>

              <p style={paragraphStyle}>
                As a reliable GPS Tracking company, we always aim to ensure
                that the GPS tracker installed in the vehicles aligned as
                per{' '}
                <a
                  href="https://securepath.ae"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SecurePath
                </a>{' '}
                regulations.
              </p>
            </div>

            <h3 style={subheadingStyle}>
              What Is SecurePath?
            </h3>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '36px',
              }}
            >
              <p style={paragraphStyle}>
                Securepath is a mandatory registration system introduced
                by the Security Industry Regulatory Agency (SIRA) in
                collaboration with the Roads and Transport Authority
                (RTA). This system aims to enhance security measures
                within the car rental industry in Dubai.
              </p>

              <p style={paragraphStyle}>
                Securepath ensures that all car rental companies operating
                in Dubai are registered with SIRA, thereby ensuring that
                they meet the necessary safety and security standards.
                By registering in SecurePath, it ensures transparency
                and accountability within the car rental industry.
              </p>
            </div>

            <h3 style={subheadingStyle}>
              Features of SecurePath GPS Tracking Systems
            </h3>

            <p style={paragraphStyle}>
              Renowned for their innovative and user-friendly design,{' '}
              <a
                href="https://securepath.ae"
                target="_blank"
                rel="noopener noreferrer"
              >
                SecurePath
              </a>{' '}
              GPS Tracking Systems are loaded with a robust suite of
              features. The system provides real-time tracking and
              geo-fencing capabilities, sending prompt alerts when
              tracked assets venture beyond designated zones. Detailed
              reporting gives users a comprehensive overview of their
              vehicles&apos; status and location, invaluable in managing
              resources effectively. The advanced technology at{' '}
              <a
                href="https://securepath.ae"
                target="_blank"
                rel="noopener noreferrer"
              >
                SecurePath
              </a>
              &apos;s core ensures pinpoint accuracy and steadfast
              reliability, providing users with peace of mind.
            </p>
          </div>

          <div
            data-reveal="right"
            className="sph-exp-image"
          >
            <Image
              src="/regulatory/securepath/securepath-certification.webp"
              alt="SecurePath GPS tracking route on map illustration"
              width={1200}
              height={1022}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>
        </div>
      </section>
    </>
  )
}

const paragraphStyle = {
  margin: 0,
  fontSize:
    'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))',
  lineHeight: 1.8,
  color: '#6e6e73',
}

const subheadingStyle = {
  margin: '0 0 14px',
  fontSize:
    'max(clamp(19px,2.2vw,24px), min(1.667vw, 34.8px))',
  fontWeight: 800,
  letterSpacing: '-.02em',
  color: '#1360ee',
}
