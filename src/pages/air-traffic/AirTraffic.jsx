import { GraduationCap, Mic, Pointer, WifiOff } from 'lucide-react';
import AirTrafficFrame from './AirTrafficFrame';
import StoreButton from './StoreButton';

const FEATURES = [
  {
    title: 'Guided tutorial',
    icon: GraduationCap,
    copy: 'The first shift walks through the scope, the buttons, and an optional radio call. You cannot fail the lesson.',
  },
  {
    title: 'Voice commands',
    icon: Mic,
    copy: 'Tap the mic and say a clearance. Speech stays on the iPhone when the device can recognize it there. The mic is optional.',
  },
  {
    title: 'Thumb controls',
    icon: Pointer,
    copy: 'Heading, altitude, speed, and the landing clearance sit along the bottom of the screen, in reach of a thumb.',
  },
  {
    title: 'Offline play',
    icon: WifiOff,
    copy: 'The game is in the app. It plays with no account and no connection. Scores stay on the device.',
  },
];

const SHOTS = [
  {
    src: '/air-traffic/airport.jpg',
    width: 1600,
    height: 738,
    alt: 'Airport select in YNK Air Traffic, with a guided mission button and Los Angeles International marked easy.',
    caption: 'Pick an airport. The first shift is a guided lesson.',
  },
  {
    src: '/air-traffic/scope.jpg',
    width: 1600,
    height: 738,
    alt: 'A guided shift at KLAX. Thumb buttons turn, climb, and slow the airplane, and a mic button takes a spoken clearance.',
    caption: 'Thumb buttons fly the airplane. Tap the mic to say the clearance.',
  },
];

export default function AirTraffic() {
  return (
    <AirTrafficFrame
      title="YNK Air Traffic — YouNeeK"
      description="YNK Air Traffic is YouNeeK's iPhone air traffic control game. A guided tutorial, thumb controls, voice clearances, and offline play. Coming soon to TestFlight and the App Store."
      path="/air-traffic"
    >
      <section className="px-4 pb-16 pt-10 sm:pt-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-12">
          <img
            src="/air-traffic/icon.png"
            width={1024}
            height={1024}
            alt="YNK Air Traffic app icon, a radar scope with the letters YNK."
            fetchPriority="high"
            className="h-32 w-32 rounded-[22%] shadow-[0_0_48px_hsl(120_80%_40%/0.35)] sm:h-44 sm:w-44"
          />
          <div className="max-w-xl text-center sm:text-left">
            <p className="font-mono text-xs tracking-[0.35em] text-primary/70">YOUNEEK</p>
            <h1 className="mt-3 font-heading text-4xl font-black leading-none tracking-tight text-primary sm:text-6xl">
              YNK Air Traffic
            </h1>
            <p className="mt-4 font-mono text-lg text-foreground sm:text-xl">Speak clearances. Land planes.</p>
            <p className="mt-4 font-mono text-sm leading-relaxed text-muted-foreground sm:text-base">
              A tower shift on your iPhone. Pick an airport, watch the scope, and clear one airplane at a time.
              Hold the phone sideways.
            </p>
            <StoreButton />
            <p className="mt-4 font-mono text-[11px] tracking-wide text-muted-foreground/80">
              com.youneek.airtraffic
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-12" aria-labelledby="shots-heading">
        <div className="mx-auto max-w-5xl">
          <h2 id="shots-heading" className="font-heading text-2xl text-primary sm:text-3xl">
            On the scope
          </h2>
          <p className="mt-3 max-w-2xl font-mono text-sm text-muted-foreground">
            Landscape gameplay from the iPhone build. The lesson starts on the airport list, then the clearance pad
            takes the shift.
          </p>
          <div className="mt-8 grid gap-8">
            {SHOTS.map((shot) => (
              <figure key={shot.src}>
                <img
                  src={shot.src}
                  width={shot.width}
                  height={shot.height}
                  alt={shot.alt}
                  loading="lazy"
                  className="h-auto w-full rounded-xl border border-primary/30 bg-black shadow-[0_0_40px_hsl(180_100%_50%/0.12)]"
                />
                <figcaption className="mt-3 font-mono text-xs text-muted-foreground">{shot.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12" aria-labelledby="features-heading">
        <div className="mx-auto max-w-5xl">
          <h2 id="features-heading" className="font-heading text-2xl text-primary sm:text-3xl">
            How you work the tower
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <li key={feature.title} className="rounded-lg border border-primary/25 bg-card/70 p-5">
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="mt-3 font-heading text-lg text-foreground">{feature.title}</h3>
                  <p className="mt-2 font-mono text-sm leading-relaxed text-muted-foreground">{feature.copy}</p>
                </li>
              );
            })}
          </ul>
          <StoreButton />
        </div>
      </section>
    </AirTrafficFrame>
  );
}
