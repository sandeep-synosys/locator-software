'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const vehicles = [
  {
    id: 'car',
    src: '/home/road/car.png',
    alt: 'Car',
    width: 72,
    height: 47,
    bottom: '70%',
    left: '14%',
    pinSize: 60,
    pinBottom: '85%',
    pinLeft: '13%',
    zIndex: 10,
    driverName: 'Zaid Omar',
    vehicleId: 'DRV1024',
    idlingTime: '3 mins',
    fuelLevel: '85%',
  },
  {
    id: 'bus',
    src: '/home/road/bus.png',
    alt: 'Bus',
    width: 145,
    height: 85,
    bottom: '54%',
    left: '30%',
    pinSize: 62,
    pinBottom: '77%',
    pinLeft: '32%',
    zIndex: 10,
    driverName: 'Rami Anas',
    vehicleId: 'BUS2156',
    idlingTime: '1 min',
    fuelLevel: '92%',
  },
  {
    id: 'van',
    src: '/home/road/van.png',
    alt: 'Van',
    width: 105,
    height: 62,
    bottom: '54%',
    left: '46%',
    pinSize: 58,
    pinBottom: '76%',
    pinLeft: '48%',
    zIndex: 10,
    driverName: 'Omar Saif',
    vehicleId: 'VAN3421',
    idlingTime: '5 mins',
    fuelLevel: '67%',
  },
  {
    id: 'yacht',
    src: '/home/road/yacht-boat.png',
    waterSrc: '/home/road/water.png',
    alt: 'Yacht',
    width: 106,
    height: 63,
    bottom: '84%',
    left: '57%',
    pinSize: 58,
    pinBottom: '100%',
    pinLeft: '59%',
    zIndex: 10,
    driverName: 'Arun Dev',
    vehicleId: 'YCH4892',
    idlingTime: '0 mins',
    fuelLevel: '78%',
  },
  {
    id: 'generator',
    src: '/home/road/generator.png',
    alt: 'Generator',
    width: 95,
    height: 95,
    bottom: 'calc(64% + 8px)',
    left: '72%',
    pinSize: 58,
    pinBottom: 'calc(79% + 8px)',
    pinLeft: '73%',
    zIndex: 10,
    driverName: 'Sami Zayd',
    vehicleId: 'GEN5673',
    idlingTime: '12 mins',
    fuelLevel: '45%',
  },
  {
    id: 'truck',
    src: '/home/road/track.png',
    alt: 'Truck',
    width: 144,
    height: 86,
    bottom: '64%',
    left: '84%',
    pinSize: 64,
    pinBottom: '91%',
    pinLeft: '86%',
    zIndex: 10,
    driverName: 'Amit Raj',
    vehicleId: 'TRK6789',
    idlingTime: '2 mins',
    fuelLevel: '91%',
  },
]

// On viewports ≤ 640px show four vehicles (car, bus, van, truck), evenly spaced, no tooltips.
const MOBILE_VEHICLE_IDS = new Set(['car', 'bus', 'van', 'truck'])
const MOBILE_OVERRIDES: Record<
  string,
  { left: string; bottom: string; pinLeft: string; pinBottom: string; widthFactor: number; pinFactor: number }
> = {
  car:   { left: '-12%', bottom: '175%', pinLeft: '-8%', pinBottom: '200%', widthFactor: 1.10, pinFactor: 1.00 },
  bus:   { left: '23%', bottom: '152%', pinLeft: '26%', pinBottom: '177%', widthFactor: 1.05, pinFactor: 1.00 },
  van:   { left: '62%', bottom: '175%', pinLeft: '65%', pinBottom: '200%', widthFactor: 1.08, pinFactor: 1.00 },
  truck: { left: '70%', bottom: '106%', pinLeft: '74%', pinBottom: '131%', widthFactor: 1.00, pinFactor: 1.00 },
}

export default function RoadSection() {
  const router = useRouter()
  const [hoveredPin, setHoveredPin] = useState<string | null>(null)
  const [showAllTooltips, setShowAllTooltips] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Auto-hide the on-load tooltip flash after 3s
  // (was incorrectly written with useState — never cleaned up).
  useEffect(() => {
    const timer = setTimeout(() => setShowAllTooltips(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  // Track narrow viewports so we can render a slimmer set of vehicles.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const renderedVehicles = isMobile
    ? vehicles
        .filter((v) => MOBILE_VEHICLE_IDS.has(v.id))
        .map((v) => {
          const o = MOBILE_OVERRIDES[v.id]
          return {
            ...v,
            left: o.left,
            bottom: o.bottom,
            pinLeft: o.pinLeft,
            pinBottom: o.pinBottom,
            width: Math.round(v.width * o.widthFactor),
            height: Math.round(v.height * o.widthFactor),
            pinSize: Math.round(v.pinSize * o.pinFactor),
          }
        })
    : vehicles

  // Tooltips are too large to fit beside vehicles on mobile — suppress them.
  const tooltipsEnabled = !isMobile

  return (
    <section
      className="relative w-full road-section"
      style={{
        height: isMobile ? '210px' : 'clamp(140px, 22vw, 240px)',
        marginTop: '-1px',
        overflow: 'visible',
        zIndex: 100,
        position: 'relative',
      }}
    >
      {/* Seamless blend — left side, fades inward smoothly */}
      <div
        style={{
          position: 'absolute',
          top: -10,
          left: 0,
          width: '36%',
          height: '20px',
          zIndex: 2,
          pointerEvents: 'none',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          maskImage: 'linear-gradient(to right, black 0%, black 50%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 35%, black 65%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 0%, black 50%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 35%, black 65%, transparent 100%)',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
      />
      {/* Seamless blend — right side, fades inward smoothly */}
      <div
        style={{
          position: 'absolute',
          top: -10,
          right: 0,
          width: '36%',
          height: '20px',
          zIndex: 2,
          pointerEvents: 'none',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          maskImage: 'linear-gradient(to left, black 0%, black 50%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 35%, black 65%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to left, black 0%, black 50%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 35%, black 65%, transparent 100%)',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
      />

      {/* Road surface */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <Image
          src="/home/road/road.png"
          alt="Road"
          fill
          className="object-cover object-top"
          sizes="100vw"
        />
      </div>

      {/* Wavy bottom border matching ScrollShowcase background */}
      <div
        style={{
          position: 'absolute',
          bottom: -2,
          left: 0,
          right: 0,
          zIndex: 20,
          lineHeight: 0,
          pointerEvents: 'none',
        }}
      >
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: '80px' }}
        >
          <path
            d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1380,20 1440,40 L1440,80 L0,80 Z"
            fill="#f5f7fa"
          />
        </svg>
      </div>

      {/* Vehicles layer */}
      <div className="road-vehicles-layer absolute inset-0" style={{ zIndex: 10 }}>
        {renderedVehicles.map((v) => (
          <div key={v.id}>
            <div
              className="absolute cursor-pointer transition-all duration-500 ease-out"
              style={{
                bottom: v.bottom,
                left: v.left,
                transform: hoveredPin === v.id ? 'translateY(-3px) scale(1.02)' : 'translateY(0) scale(1)',
                filter: hoveredPin === v.id ? 'drop-shadow(0 6px 16px rgba(0,0,0,0.25))' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))',
              }}
              onMouseEnter={() => setHoveredPin(v.id)}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <Image
                src={v.src}
                alt={v.alt}
                width={v.width}
                height={v.height}
                className="object-contain"
              />
            </div>
          </div>
        ))}

        {/* Scooter — desktop only (mobile drops it to declutter) */}
        {!isMobile && (
        <div className="absolute" style={{ bottom: '32%', left: '60%' }}>
          <div
            className="cursor-pointer transition-all duration-500 ease-out"
            style={{
              transform: hoveredPin === 'scooter' ? 'translateY(-3px) scale(1.02)' : 'translateY(0) scale(1)',
              filter: hoveredPin === 'scooter' ? 'drop-shadow(0 6px 16px rgba(0,0,0,0.25))' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))',
            }}
            onMouseEnter={() => setHoveredPin('scooter')}
            onMouseLeave={() => setHoveredPin(null)}
          >
            <Image
              src="/home/road/bike.png"
              alt="Delivery Scooter"
              width={182}
              height={153}
              className="object-contain"
            />
          </div>
        </div>
        )}
      </div>

      {/* CTA Buttons */}
      <div className="road-cta-wrap">
        {/* Get a Quote — filled blue */}
        <button
          className="road-cta-btn"
          onClick={() => router.push('/get-a-quote')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #1f6ff0 0%, #0d4fd4 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 10px rgba(21,120,235,0.35)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1" fill="white" />
            <rect x="9" y="1" width="6" height="6" rx="1" fill="white" />
            <rect x="1" y="9" width="6" height="6" rx="1" fill="white" />
            <rect x="9" y="9" width="6" height="6" rx="1" fill="white" />
          </svg>
          Get a Quote
        </button>

        {/* Get a Free Demo — outlined */}
        <button
          className="road-cta-btn"
          onClick={() => router.push('/get-a-free-demo')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ffffff',
            color: '#1360ee',
            border: '1.5px solid #c7dcff',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1" fill="#0b40b8" />
            <rect x="9" y="1" width="6" height="6" rx="1" fill="#0b40b8" />
            <rect x="1" y="9" width="6" height="6" rx="1" fill="#0b40b8" />
            <rect x="9" y="9" width="6" height="6" rx="1" fill="#0b40b8" />
          </svg>
          Get a Free Demo
        </button>
      </div>

      {/* GPS Icons layer - HIGHEST z-index */}
      <div className="road-vehicles-layer absolute inset-0" style={{ zIndex: 10000, pointerEvents: 'none' }}>
        {renderedVehicles.map((v, index) => (
          v.pinSize > 0 && (
            <div
              key={`pin-${v.id}`}
              className="absolute cursor-pointer group"
              style={{ 
                bottom: v.pinBottom, 
                left: v.pinLeft,
                animation: `iconEntrance 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s both, iconFloat 5s ease-in-out ${1.0 + index * 0.5}s infinite`,
                pointerEvents: 'auto',
              }}
              onMouseEnter={() => setHoveredPin(v.id)}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <div 
                className="relative transition-all duration-300 ease-out"
                style={{
                  filter: hoveredPin === v.id 
                    ? 'drop-shadow(0 0 10px rgba(58,174,219,0.9)) drop-shadow(0 0 16px rgba(58,174,219,0.6))' 
                    : 'drop-shadow(0 0 4px rgba(58,174,219,0.3))',
                  transform: hoveredPin === v.id ? 'scale(1.18) translateY(-4px)' : 'scale(1)',
                }}
              >
                <Image
                  src="/home/road/gps-pin.svg"
                  alt="Tracker"
                  width={v.pinSize}
                  height={v.pinSize}
                />
              </div>

              {tooltipsEnabled && (hoveredPin === v.id || (showAllTooltips && index % 2 === 0)) && (
                <div
                  className="absolute"
                  style={{
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: '12px',
                    animation: 'tooltipAppear 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
                    zIndex: 99999,
                    pointerEvents: 'auto',
                  }}
                  onMouseEnter={() => setHoveredPin(v.id)}
                  onMouseLeave={() => setHoveredPin(null)}
                >
                  <div
                    style={{
                      width: '178px',
                      padding: '14px 16px 12px',
                      background: 'rgba(255, 255, 255, 0.72)',
                      backdropFilter: 'blur(18px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(18px) saturate(150%)',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.7)',
                      boxShadow: `
                        inset 0 1px 0 rgba(255, 255, 255, 0.6),
                        0 20px 45px -14px rgba(15, 23, 42, 0.28),
                        0 8px 20px -10px rgba(15, 23, 42, 0.14)
                      `,
                      position: 'relative',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {/* Header with avatar, driver name and menu */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                      }}>
                        {/* Avatar */}
                        <div style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          background: '#eef1f5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#94a3b8"/>
                          </svg>
                        </div>
                        <div style={{
                          fontSize: '13.5px',
                          fontWeight: 700,
                          color: '#111827',
                          letterSpacing: '-0.01em',
                        }}>
                          {v.driverName}
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '3px',
                      }}>
                        <div style={{ width: '3.5px', height: '3.5px', borderRadius: '50%', background: '#94a3b8' }} />
                        <div style={{ width: '3.5px', height: '3.5px', borderRadius: '50%', background: '#94a3b8' }} />
                        <div style={{ width: '3.5px', height: '3.5px', borderRadius: '50%', background: '#94a3b8' }} />
                      </div>
                    </div>

                    {/* Vehicle ID */}
                    <div style={{
                      fontSize: '11px',
                      color: '#94a3b8',
                      fontWeight: 500,
                      marginBottom: '10px',
                    }}>
                      ID: {v.vehicleId}
                    </div>

                    {/* Divider */}
                    <div style={{
                      height: '1px',
                      background: '#e5e9f0',
                      marginBottom: '8px',
                    }} />

                    {/* Idling Time */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="#94a3b8" strokeWidth="2" fill="none"/>
                          <path d="M12 6v6l4 2" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span style={{
                          fontSize: '11px',
                          color: '#475569',
                          fontWeight: 500,
                        }}>
                          Idling Time
                        </span>
                      </div>
                      <span style={{
                        fontSize: '12.5px',
                        color: '#2f6fed',
                        fontWeight: 700,
                      }}>
                        {v.idlingTime}
                      </span>
                    </div>

                    {/* Divider */}
                    <div style={{
                      height: '1px',
                      background: '#e5e9f0',
                      marginBottom: '8px',
                    }} />

                    {/* Fuel Level */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M3 8h12v10c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V8zm0-2V4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v2M15 11l4-4v10l-4-4" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        </svg>
                        <span style={{
                          fontSize: '11px',
                          color: '#475569',
                          fontWeight: 500,
                        }}>
                          Fuel
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}>
                        <svg width="14" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M3 8h12v10c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V8zm0-2V4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v2M15 11l4-4v10l-4-4" stroke="#2f6fed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#2f6fed"/>
                        </svg>
                        <span style={{
                          fontSize: '12.5px',
                          color: '#2f6fed',
                          fontWeight: 700,
                        }}>
                          {v.fuelLevel}
                        </span>
                      </div>
                    </div>

                    {/* Pointer — only the LOWER HALF of the rotated square is drawn.
                        The card is translucent glass, so the half that overlaps it
                        does not disappear behind it: the two fills stack and the
                        whole diamond reads as a seam sitting on the card. Cutting it
                        leaves a clean tail that continues out of the bubble.

                        clip-path is applied in the element's own coordinates, BEFORE
                        the 45° rotation — so the triangle below is the square's
                        lower-right corner, which the rotation carries round to the
                        bottom of the diamond. It keeps the right and bottom borders
                        (the tail's two visible edges — the other two are already
                        off) and the rounded corner that becomes the tip.

                        No box-shadow: clip-path clips an element's outset shadow away
                        with everything else, so it would only have been dead weight.
                        The card's own shadow already carries the depth. */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-5px',
                      left: '50%',
                      width: '13px',
                      height: '13px',
                      background: 'rgba(255, 255, 255, 0.72)',
                      backdropFilter: 'blur(18px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(18px) saturate(150%)',
                      border: '1px solid rgba(255, 255, 255, 0.7)',
                      borderTop: 'none',
                      borderLeft: 'none',
                      transform: 'translateX(-50%) rotate(45deg)',
                      borderRadius: '5px',
                      clipPath: 'polygon(100% 0%, 100% 100%, 0% 100%)',
                    }} />
                  </div>
                </div>
              )}
            </div>
          )
        ))}

        {/* Scooter GPS pin — desktop only */}
        {!isMobile && (
        <div
          className="absolute cursor-pointer group"
          style={{
            bottom: '67%',
            left: '63.5%',
            animation: 'iconEntrance 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.24s both, iconFloat 5s ease-in-out 1.5s infinite',
            pointerEvents: 'auto',
          }}
          onMouseEnter={() => setHoveredPin('scooter')}
          onMouseLeave={() => setHoveredPin(null)}
        >
          <div
            className="relative transition-all duration-300 ease-out"
            style={{
              filter: hoveredPin === 'scooter' 
                ? 'drop-shadow(0 0 10px rgba(58,174,219,0.9)) drop-shadow(0 0 16px rgba(58,174,219,0.6))' 
                : 'drop-shadow(0 0 4px rgba(58,174,219,0.3))',
              transform: hoveredPin === 'scooter' ? 'scale(1.18) translateY(-4px)' : 'scale(1)',
            }}
          >
            <Image src="/home/road/gps-pin.svg" alt="Tracker" width={60} height={60} />
          </div>

          {tooltipsEnabled && hoveredPin === 'scooter' && (
            <div
              className="absolute"
              style={{
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginBottom: '12px',
                animation: 'tooltipAppear 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
                zIndex: 99999,
                pointerEvents: 'auto',
              }}
              onMouseEnter={() => setHoveredPin('scooter')}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <div
                style={{
                  width: '178px',
                  padding: '14px 16px 12px',
                  background: 'rgba(255, 255, 255, 0.72)',
                  backdropFilter: 'blur(18px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(18px) saturate(150%)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.7)',
                  boxShadow: `
                    inset 0 1px 0 rgba(255, 255, 255, 0.6),
                    0 20px 45px -14px rgba(15, 23, 42, 0.28),
                    0 8px 20px -10px rgba(15, 23, 42, 0.14)
                  `,
                  position: 'relative',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Header with avatar, driver name and menu */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                  }}>
                    {/* Avatar */}
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: '#eef1f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#94a3b8"/>
                      </svg>
                    </div>
                    <div style={{
                      fontSize: '13.5px',
                      fontWeight: 700,
                      color: '#111827',
                      letterSpacing: '-0.01em',
                    }}>
                      Ali Rahman
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '3px',
                  }}>
                    <div style={{ width: '3.5px', height: '3.5px', borderRadius: '50%', background: '#94a3b8' }} />
                    <div style={{ width: '3.5px', height: '3.5px', borderRadius: '50%', background: '#94a3b8' }} />
                    <div style={{ width: '3.5px', height: '3.5px', borderRadius: '50%', background: '#94a3b8' }} />
                  </div>
                </div>

                {/* Vehicle ID */}
                <div style={{
                  fontSize: '11px',
                  color: '#94a3b8',
                  fontWeight: 500,
                  marginBottom: '10px',
                }}>
                  ID: SCT7845
                </div>

                {/* Divider */}
                <div style={{
                  height: '1px',
                  background: '#e5e9f0',
                  marginBottom: '8px',
                }} />

                {/* Idling Time */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#94a3b8" strokeWidth="2" fill="none"/>
                      <path d="M12 6v6l4 2" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span style={{
                      fontSize: '11px',
                      color: '#475569',
                      fontWeight: 500,
                    }}>
                      Idling Time
                    </span>
                  </div>
                  <span style={{
                    fontSize: '12.5px',
                    color: '#2f6fed',
                    fontWeight: 700,
                  }}>
                    4 mins
                  </span>
                </div>

                {/* Divider */}
                <div style={{
                  height: '1px',
                  background: '#e5e9f0',
                  marginBottom: '8px',
                }} />

                {/* Fuel Level */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M3 8h12v10c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V8zm0-2V4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v2M15 11l4-4v10l-4-4" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                    <span style={{
                      fontSize: '11px',
                      color: '#475569',
                      fontWeight: 500,
                    }}>
                      Fuel
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}>
                    <svg width="14" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 8h12v10c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V8zm0-2V4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v2M15 11l4-4v10l-4-4" stroke="#2f6fed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#2f6fed"/>
                    </svg>
                    <span style={{
                      fontSize: '12.5px',
                      color: '#2f6fed',
                      fontWeight: 700,
                    }}>
                      73%
                    </span>
                  </div>
                </div>

                {/* Pointer — lower half only, exactly as the vehicle tooltip above.
                    See the comment there for why the overlapping half has to be cut
                    rather than left to hide behind a translucent card. */}
                <div style={{
                  position: 'absolute',
                  bottom: '-5px',
                  left: '50%',
                  width: '13px',
                  height: '13px',
                  background: 'rgba(255, 255, 255, 0.72)',
                  backdropFilter: 'blur(18px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(18px) saturate(150%)',
                  border: '1px solid rgba(255, 255, 255, 0.7)',
                  borderTop: 'none',
                  borderLeft: 'none',
                  transform: 'translateX(-50%) rotate(45deg)',
                  borderRadius: '5px',
                  clipPath: 'polygon(100% 0%, 100% 100%, 0% 100%)',
                }} />
              </div>
            </div>
          )}
        </div>
        )}
      </div>

      <style jsx>{`
        @keyframes iconEntrance {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.88);
            filter: blur(4px);
          }
          65% {
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes tooltipAppear {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(8px) scale(0.94);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes statusPulse {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
          }
          50% {
            opacity: 0.8;
            box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.3);
          }
        }
      `}</style>
    </section>
  )
}
