const EASE = 'cubic-bezier(.22,.61,.36,1)'

type Social = {
  name: string
  handle: string
  blurb: string
  href: string
  brand: string
  /** Second stop for the tile gradient — Instagram needs its full ramp. */
  brand2: string
  cta: string
  icon: React.ReactNode
}

// NOTE: placeholder profile URLs and handles, matching the footer. Swap in the
// real Locator accounts when they're confirmed.
const SOCIALS: Social[] = [
  {
    name: 'LinkedIn',
    handle: '@locatormedia',
    blurb: 'Company news, hiring, and fleet industry insight.',
    href: 'https://www.linkedin.com/company/locatormedia/',
    brand: '#0A66C2', brand2: '#004182',
    cta: 'Follow',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.7c0-1.36-.03-3.1-1.95-3.1-1.95 0-2.25 1.47-2.25 3v5.8H9z" /></svg>,
  },
  {
    name: 'Instagram',
    handle: '@locatormedia',
    blurb: 'Installs, hardware close-ups, and life at Locator.',
    href: 'https://www.instagram.com/locatormedia?srtk=MWtnMnVmZHFyNnE4bA==',
    brand: '#E1306C', brand2: '#F77737',
    cta: 'Follow',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5.5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" stroke="none" /></svg>,
  },
  {
    name: 'WhatsApp',
    handle: '+971 50 874 66 88',
    blurb: 'The fastest line to our team during working hours.',
    href: 'https://wa.me/971508746688',
    brand: '#25D366', brand2: '#128C7E',
    cta: 'Chat',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>,
  },
  {
    name: 'YouTube',
    handle: '@locatormedia820',
    blurb: 'Product walkthroughs, demos, and platform tutorials.',
    href: 'https://www.youtube.com/@locatormedia820',
    brand: '#FF0000', brand2: '#B80000',
    cta: 'Watch',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 12s0-3.8-.48-5.62a2.94 2.94 0 0 0-2.07-2.08C18.63 3.8 12 3.8 12 3.8s-6.63 0-8.45.5A2.94 2.94 0 0 0 1.48 6.4C1 8.2 1 12 1 12s0 3.8.48 5.62a2.94 2.94 0 0 0 2.07 2.08c1.82.5 8.45.5 8.45.5s6.63 0 8.45-.5a2.94 2.94 0 0 0 2.07-2.08C23 15.8 23 12 23 12zM9.8 15.4V8.6l5.9 3.4z" /></svg>,
  },
  {
    name: 'Facebook',
    handle: '@locatormedia',
    blurb: 'Announcements, events, and customer stories.',
    href: 'https://www.facebook.com/locatormedia',
    brand: '#1877F2', brand2: '#0B5FCE',
    cta: 'Follow',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
  },
  {
    name: 'X',
    handle: '@locator_ae',
    blurb: 'Short updates, release notes, and service status.',
    href: 'https://x.com',
    brand: '#0f0f10', brand2: '#3a3a40',
    cta: 'Follow',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.53 3h3.1l-6.77 7.74L21.8 21h-6.2l-4.86-6.35L5.18 21H2.07l7.24-8.28L2.2 3h6.36l4.4 5.82zm-1.09 16.1h1.72L7.63 4.8H5.79z" /></svg>,
  },
]

export default function ContactSocial() {
  return (
    <section className="cts" id="follow">
      <style href="ct-contactsocial" precedence="medium">{`
        .cts {
          position: relative; overflow: hidden;
          background: #fff;
          padding: clamp(20px,3vw,40px) 28px clamp(52px,7vw,88px);
        }
        .cts-inner { max-width: var(--w-1180); margin: 0 auto; }

        .cts-head { text-align: center; max-width: 620px; margin: 0 auto clamp(26px,3.4vw,40px); }
        .cts-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: max(clamp(12px,1.05vw,13.5px), min(0.938vw, 19.57px)); font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: #1360ee; }
        .cts-eyebrow i { display: block; width: 28px; height: 2.5px; background: #1360ee; border-radius: 2px; }
        .cts-title { margin: 10px 0 0; font-size: max(clamp(25px,2.7vw,33px), min(2.292vw, 47.85px)); font-weight: 800; letter-spacing: -.028em; line-height: 1.16; color: #1d1d1f; }
        .cts-sub { margin: 12px 0 0; font-size: max(clamp(14px,1.2vw,15.5px), min(1.076vw, 22.47px)); line-height: 1.7; color: #6e6e73; }

        .cts-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: clamp(12px,1.5vw,18px); }
        @media (max-width: 940px) { .cts-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
        @media (max-width: 560px) { .cts-grid { grid-template-columns: 1fr; } }

        /* Each network wears its own colour at all times — no blue resting
           state, no reveal on hover. --sb/--sb2 come in on the element from the
           SOCIALS data; these two just give them the names the rules below
           paint with. The @property registration and the colour transition that
           used to sit here went with the swap: nothing animates between colours
           any more, so there is nothing to interpolate. */
        .cts-card {
          --csoc-brand: var(--sb);
          --csoc-brand2: var(--sb2);
          position: relative; overflow: hidden;
          display: flex; align-items: center; gap: 15px;
          padding: clamp(16px,1.8vw,20px); border-radius: 20px;
          background: #fff; border: 1px solid #e7ebf3; text-decoration: none;
          box-shadow: 0 14px 28px -30px rgba(20,40,90,.4);
          transition: transform .26s ${EASE}, box-shadow .26s ${EASE}, border-color .26s ${EASE};
        }
        /* Hover keeps the lift but wears its colour far more lightly — the tint
           and glow are roughly half their old strength so the row of cards reads
           calm rather than washed in colour. */
        .cts-card:hover {
          transform: translateY(-5px);
          border-color: color-mix(in srgb, var(--csoc-brand) 24%, transparent);
          box-shadow: 0 18px 34px -30px color-mix(in srgb, var(--csoc-brand) 32%, transparent);
        }
        /* Brand wash that fills in from the left behind the content. */
        .cts-card::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(100deg, color-mix(in srgb, var(--csoc-brand) 6%, transparent), transparent 62%);
          opacity: 0; transition: opacity .3s ${EASE};
        }
        .cts-card:hover::before { opacity: 1; }
        .cts-card > * { position: relative; z-index: 1; }

        /* Logo tile carries the network's real colour, always. The coloured
           glow beneath it was the loudest thing in the section — an 80% tint
           bleeding out of every tile — so it is now a restrained drop shadow at
           roughly a third of that, tightened in radius as well as strength. */
        .cts-ic {
          width: 52px; height: 52px; border-radius: 16px; flex-shrink: 0;
          display: grid; place-items: center; color: #fff;
          background: linear-gradient(140deg, var(--csoc-brand), var(--csoc-brand2));
          box-shadow:
            0 6px 14px -8px color-mix(in srgb, var(--csoc-brand) 30%, transparent),
            inset 0 1px 0 rgba(255,255,255,.4);
          transition: transform .3s ${EASE}, box-shadow .3s ${EASE};
        }
        .cts-card:hover .cts-ic {
          transform: rotate(-6deg) scale(1.08);
          box-shadow: 0 10px 20px -8px color-mix(in srgb, var(--csoc-brand) 40%, transparent), inset 0 1px 0 rgba(255,255,255,.5);
        }
        .cts-ic svg { width: 24px; height: 24px; }

        .cts-text { min-width: 0; flex: 1; }
        .cts-row { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
        .cts-name { margin: 0; font-size: var(--f-16); font-weight: 800; letter-spacing: -.02em; color: #1d1d1f; }
        /* Handle stays the site blue on every card and in every state. It is
           interface text, not branding — tying it to the network's colour made
           it near-invisible on the light ones and jarring on the red one. */
        .cts-handle { font-size: var(--f-12-5); font-weight: 600; color: #1360ee; }
        .cts-blurb { margin: 5px 0 0; font-size: var(--f-12-5); line-height: 1.55; color: #8e97a8; }

        /* CTA pill — the site blue, and only the site blue. It reads as one
           consistent action across all six cards rather than six different
           buttons, so its colour is fixed and hover moves it rather than
           recolouring it. The blues are literal rather than color-mix on the
           brand variable, which is what used to drag it to each network. */
        .cts-cta {
          flex-shrink: 0; display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 15px; border-radius: 999px;
          font-size: var(--f-12); font-weight: 800; letter-spacing: .02em;
          color: #1360ee; border: 1.5px solid rgba(19,96,238,.32);
          background: rgba(19,96,238,.07);
          transition: transform .24s ${EASE};
        }
        .cts-card:hover .cts-cta { transform: translateX(2px); }
        .cts-cta svg { transition: transform .22s ${EASE}; }
        .cts-card:hover .cts-cta svg { transform: translate(2px,-2px); }

        @media (max-width: 400px) {
          .cts-blurb { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cts-card, .cts-card::before, .cts-ic, .cts-cta, .cts-cta svg { transition: none; }
        }
      `}</style>

      <div className="cts-inner">
        <div className="cts-head" data-reveal>
          <span className="cts-eyebrow"><i />Follow us<i /></span>
          <h2 className="cts-title">Keep up with Locator</h2>
          <p className="cts-sub">
            Product releases, install stories, and what our engineers are shipping — pick the feed you already use.
          </p>
        </div>

        <div className="cts-grid">
          {SOCIALS.map((s, i) => (
            <a
              key={s.name}
              href={s.href}
              className="cts-card"
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
              data-reveal-delay={i * 70}
              // The network's own colours. Deliberately NOT --csoc-brand/-brand2:
              // those are what every surface paints with, and an inline value
              // would outrank the :hover rule that swaps them.
              style={{ '--sb': s.brand, '--sb2': s.brand2 } as React.CSSProperties}
            >
              <span className="cts-ic">{s.icon}</span>
              <span className="cts-text">
                <span className="cts-row">
                  <h3 className="cts-name">{s.name}</h3>
                  <span className="cts-handle">{s.handle}</span>
                </span>
                <span className="cts-blurb">{s.blurb}</span>
              </span>
              <span className="cts-cta">
                {s.cta}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
