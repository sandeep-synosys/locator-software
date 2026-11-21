import Image from 'next/image'
import Link from 'next/link'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

export default function ContactHero() {
  return (
    <>
      <style href="ct-contacthero" precedence="medium">{`
        .cth { background: #fff; }

        /* Photo band. object-fit: cover fills the band edge-to-edge at every
           viewport width — object-position biases the crop toward the agent
           at the desk (right two-thirds of the source image), the visual
           focal point, rather than centring on empty floor/ceiling. */
        .cth-photo { position: relative; overflow: hidden; height: clamp(300px, 34vw, 440px); background: #01050b; }
        .cth-photo img { object-fit: cover; object-position: 66% center; }
        .cth-scrim {
          position: absolute; inset: 0; z-index: 1;
          background:
            linear-gradient(90deg, rgba(4,8,18,.5) 0%, rgba(4,8,18,.42) 34%, rgba(4,8,18,.18) 62%, transparent 88%),
            linear-gradient(0deg, rgba(4,8,18,.32) 0%, transparent 42%);
        }

        .cth-body {
          position: relative; z-index: 2; height: 100%;
          display: flex; flex-direction: column; justify-content: center;
          max-width: var(--w-1280); margin: 0 auto; padding: clamp(24px,3vw,40px) 28px;
        }
        .cth-content { max-width: min(660px, 100%); }

        .cth-eyebrow {
          display: block;
          font-size: max(clamp(11px,1vw,13px), min(0.903vw, 18.85px)); font-weight: 800; letter-spacing: .18em; text-transform: uppercase;
          color: #4d94ff; margin-bottom: clamp(10px,1.4vw,16px);
        }

        .cth-title {
          margin: 0; font-size: clamp(28px, calc(2.5vw + 16px), 46px); font-weight: 800;
          line-height: 1.16; letter-spacing: -.022em; color: #ffffff;
          text-shadow: 0 2px 24px rgba(0,0,0,.4);
        }

        .cth-lead {
          margin: clamp(14px,1.6vw,18px) 0 0; max-width: 48ch;
          font-size: clamp(15px, 1.05vw, 17px); line-height: 1.72; color: rgba(255,255,255,.8);
        }

        /* Breadcrumb sits inside the banner, under the copy. */
        .cth-crumbs {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
          margin-top: clamp(20px,3vw,34px);
          font-size: var(--f-13-5); color: rgba(255,255,255,.55);
        }
        .cth-crumbs a { color: rgba(255,255,255,.85); font-weight: 600; text-decoration: none; transition: color .18s ease; }
        .cth-crumbs a:hover { color: #fff; }
        .cth-crumbs .cur { color: #4d94ff; font-weight: 700; }

        @media (max-width: 640px) {
          .cth-photo { height: clamp(320px, 78vw, 400px); }
          .cth-scrim { background: linear-gradient(0deg, rgba(4,8,18,.52) 0%, rgba(4,8,18,.42) 45%, rgba(4,8,18,.3) 100%); }
          .cth-body { padding: 24px 20px; }
          .cth-lead { max-width: 100%; }
        }
      `}</style>

      <section className="cth">
        <SoftwareNavbar />

        <div className="cth-photo">
          <Image
            src="/contact/contact-office-hero-banner.webp"
            alt="Modern glass-walled office meeting room where the Locator team meets with fleet customers"
            fill
            priority
            sizes="100vw"
          />
          <div className="cth-scrim" />
          <div className="cth-body">
            <div className="cth-content">
              <span className="cth-eyebrow">Get in touch</span>
              <h1 className="cth-title">Contact LOCATOR</h1>
              <p className="cth-lead">
                We&rsquo;re here to help your business move smarter. Reach out to our team for sales,
                support, partnerships or any other inquiries.
              </p>
              <nav className="cth-crumbs" aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span>/</span>
                <span className="cur">Contact Us</span>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
