const VEHICLES = [
  'Desert safari',
  'Cash in transit vehicles',
  'Chemical materials',
  'Diesel transport',
  'Explosive & fireworks',
  'Flammable liquids',
  'Gas trading',
  'Hazardous material',
  'Mobile workshop',
  'Petroleum transport',
  'Pilling contractors',
  'Radioactive materials',
  'Hazardous – Cargo',
  'Non-Hazardous – Cargo',
  'Personal vehicles',
  'Environmental waste',
]

export default function SecurepathPremiumVehicleList() {
  return (
    <>
      <style>{`
        .spp-veh-list { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px; }
        .spp-veh-list li { font-size: max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px)); line-height: 1.7; color: #6e6e73; }
      `}</style>

      <section style={{ padding: 'clamp(56px,7vw,80px) 28px', background: '#fff' }}>
        <div style={{ maxWidth: 'var(--w-1180)', margin: '0 auto' }}>
          <h2 data-reveal style={{ margin: '0 0 14px', fontSize: 'max(clamp(22px,2.8vw,30px), min(2.083vw, 43.5px))', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-.02em', color: '#1360ee' }}>
            Vehicles That Require SecurePath Premium
          </h2>
          <p data-reveal style={{ margin: '0 0 24px', fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
            SecurePath Premium offers you a comprehensive list of vehicles that should be registered. Let&apos;s explore the list of vehicles that should be registered in SecurePath Premium.
          </p>

          <ul className="spp-veh-list" data-reveal>
            {VEHICLES.map(v => <li key={v}>{v}</li>)}
          </ul>
        </div>
      </section>
    </>
  )
}
