import Image from 'next/image'
import Link from 'next/link'
import { MEET, MEET_LINKS } from './gitex-2026-content'
import { GITEX_ASSETS, GITEX_EVENT } from './gitex-2026-data'
import { ArrowIcon, Bar, KeepDates, Paras } from './GitexText'

/* "Meet LOCATOR at GITEX GLOBAL 2026": the event box as a ticket ("plan your
   visit" inside it), the invitation, then visitor registration, contact and
   demo links, in the order the brief places them. */
export default function GitexMeet() {
  return (
    <section className="gxb-sec gxe" id="meet-locator">
      <style href="gitex-2026-meet" precedence="medium">{`
        .gxe { background: linear-gradient(180deg, #fff 0%, #f3f7ff 55%, #fff 100%); }
        .gxe-head { text-align: center; max-width: 820px; margin: 0 auto clamp(32px,4vw,56px); }
        .gxe-head .gxb-bar { justify-content: center; }
        .gxe-ticket {
          position: relative; display: grid; grid-template-columns: minmax(0,.8fr) minmax(0,1.2fr);
          border-radius: 28px; background: #fff; box-shadow: 0 30px 70px rgba(13,31,79,.14); overflow: hidden;
        }
        .gxe-stub {
          position: relative; padding: clamp(26px,3vw,48px); color: #fff; overflow: hidden;
          background: linear-gradient(150deg, #2f7bff 0%, #1360ee 45%, #0d3db8 100%);
          display: flex; flex-direction: column; justify-content: space-between; gap: 28px;
        }
        .gxe-stub::after {
          content: ''; position: absolute; right: -60px; bottom: -60px; width: 240px; height: 240px; border-radius: 50%;
          border: 40px solid rgba(255,255,255,.08);
        }
        .gxe-stub-logo { background: #fff; border-radius: 14px; padding: 12px 16px; width: fit-content; }
        .gxe-stub-logo img { display: block; width: clamp(110px,9vw,150px); height: auto; }
        .gxe-big { display: grid; gap: 4px; }
        .gxe-big small { font-size: max(clamp(12px,.85vw,14px), min(.8vw, 18px)); letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.75); font-weight: 600; }
        .gxe-big b { font-size: max(clamp(34px,3.6vw,56px), min(3.2vw, 72px)); line-height: 1; font-weight: 700; letter-spacing: -.01em; }
        .gxe-big span { font-size: max(clamp(16px,1.3vw,21px), min(1.2vw, 27px)); font-weight: 600; }
        .gxe-perf { position: absolute; top: 0; bottom: 0; left: calc(40% - 1px); width: 2px; background-image: linear-gradient(#dbe5f7 50%, transparent 50%); background-size: 2px 14px; }
        .gxe-rows { margin: 0; padding: clamp(18px,2.4vw,40px) clamp(22px,3vw,48px); display: flex; flex-direction: column; justify-content: center; }
        .gxe-row { display: grid; grid-template-columns: 110px 1fr; gap: 16px; padding: clamp(12px,1.3vw,18px) 0; border-bottom: 1px solid #edf1f8; align-items: baseline; }
        .gxe-row dt { color: #1360ee; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; font-size: max(clamp(11px,.8vw,13px), min(.75vw, 17px)); }
        .gxe-row dd { margin: 0; color: #0d1f4f; font-weight: 600; font-size: max(clamp(14.5px,1.05vw,17px), min(1vw, 23px)); line-height: 1.5; }
        .gxe-plan { margin-top: clamp(16px,1.6vw,22px); align-self: flex-start; }
        .gxe-invite { max-width: 860px; margin: clamp(32px,4vw,56px) auto 0; text-align: center; }
        .gxe-ctas { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: clamp(24px,2.6vw,36px); }
        @media (max-width: 860px) {
          .gxe-ticket { grid-template-columns: 1fr; }
          .gxe-perf { display: none; }
        }
        @media (max-width: 520px) {
          .gxe-row { grid-template-columns: 1fr; gap: 4px; }
          .gxe-ctas .gxb-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="gxb-wrap">
        <div className="gxe-head" data-reveal>
          <Bar />
          <h2 className="gxb-h2">{MEET.heading}</h2>
        </div>

        <div className="gxe-ticket" data-reveal="zoom">
          <div className="gxe-stub">
            <span className="gxe-stub-logo">
              <Image src={`${GITEX_ASSETS}/gitex-logo.png`} alt="GITEX GLOBAL" width={541} height={195} />
            </span>
            <div className="gxe-big">
              <small>Stand</small>
              <b>{GITEX_EVENT.stand}</b>
              <span>Hall {GITEX_EVENT.hall}</span>
            </div>
          </div>
          <span className="gxe-perf" aria-hidden="true" />
          <div className="gxe-rows">
            <dl style={{ margin: 0 }}>
              {MEET.rows.map(r => (
                <div key={r.label} className="gxe-row">
                  <dt>{r.label}</dt>
                  <dd>
                    <KeepDates text={r.value} />
                  </dd>
                </div>
              ))}
            </dl>
            <a className="gxb-btn gxb-btn--ghost gxe-plan" href={MEET_LINKS.planVisit.href} target="_blank" rel="noopener">
              {MEET_LINKS.planVisit.text}
              <ArrowIcon external />
            </a>
          </div>
        </div>

        <div className="gxe-invite" data-reveal>
          <Paras paras={MEET.paras} />
          <div className="gxe-ctas">
            <a className="gxb-btn gxb-btn--primary" href={MEET_LINKS.registration.href} target="_blank" rel="noopener">
              {MEET_LINKS.registration.text}
              <ArrowIcon external />
            </a>
            <Link className="gxb-btn gxb-btn--ghost" href={MEET_LINKS.contact.href}>
              {MEET_LINKS.contact.text}
              <ArrowIcon />
            </Link>
            <Link className="gxb-btn gxb-btn--ghost" href={MEET_LINKS.demo.href}>
              {MEET_LINKS.demo.text}
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
