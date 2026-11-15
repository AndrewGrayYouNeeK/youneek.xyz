import { Link } from 'react-router-dom';
import AirTrafficFrame from './AirTrafficFrame';

const ISSUES_URL = 'https://github.com/AndrewGrayYouNeeK/YNKAIRTRAFFICGAME/issues';

export default function AirTrafficSupport() {
  return (
    <AirTrafficFrame
      title="Support — YNK Air Traffic"
      description="Support for YNK Air Traffic, the YouNeeK iPhone air traffic control game. Contact Andrew Gray through GitHub issues on the game repository."
      path="/air-traffic/support"
    >
      <article className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <p className="font-mono text-xs tracking-[0.35em] text-primary/70">YOUNEEK</p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-primary sm:text-4xl">Support</h1>
        <p className="mt-4 break-all font-mono text-xs text-muted-foreground">https://youneek.xyz/air-traffic/support</p>

        <div className="mt-8 space-y-4 font-mono text-sm leading-relaxed text-foreground/90 sm:text-base">
          <p>
            YNK Air Traffic is a YouNeeK game by Andrew Gray. The iPhone bundle id is{' '}
            <span className="text-primary">com.youneek.airtraffic</span>.
          </p>
          <p>
            For help with the game, open a GitHub issue on the YNK Air Traffic repository. That repository is the
            contact for this app.
          </p>
          <p>
            <a
              href={ISSUES_URL}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-md border border-primary bg-primary px-6 font-heading text-sm font-bold tracking-wide text-primary-foreground shadow-[0_0_28px_hsl(180_100%_50%/0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open GitHub issues
            </a>
          </p>
          <p className="break-all text-xs text-muted-foreground">{ISSUES_URL}</p>
          <p>
            The{' '}
            <Link to="/air-traffic/privacy" className="text-primary underline underline-offset-4">
              privacy policy
            </Link>{' '}
            covers what the app stores on the device, and the{' '}
            <Link to="/air-traffic" className="text-primary underline underline-offset-4">
              game page
            </Link>{' '}
            has the screenshots.
          </p>
        </div>
      </article>
    </AirTrafficFrame>
  );
}
