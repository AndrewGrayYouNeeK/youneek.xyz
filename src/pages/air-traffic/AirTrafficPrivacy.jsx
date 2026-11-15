import { Link } from 'react-router-dom';
import AirTrafficFrame from './AirTrafficFrame';

const SUPPORT_ISSUE_URL = 'https://github.com/AndrewGrayYouNeeK/YNKAIRTRAFFICGAME/issues';

export default function AirTrafficPrivacy() {
  return (
    <AirTrafficFrame
      title="Privacy Policy — YNK Air Traffic"
      description="YNK Air Traffic privacy policy. YouNeeK collects no personal data. The microphone and speech recognition stay on the device and are used only when you tap the mic to give a clearance."
      path="/air-traffic/privacy"
    >
      <article className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <p className="font-mono text-xs tracking-[0.35em] text-primary/70">YOUNEEK</p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-primary sm:text-4xl">
          YNK Air Traffic privacy policy
        </h1>
        <p className="mt-4 font-mono text-sm text-muted-foreground">Effective date: November 10, 2026</p>
        <p className="mt-2 break-all font-mono text-xs text-muted-foreground">https://youneek.xyz/air-traffic/privacy</p>

        <div className="mt-8 space-y-4 font-mono text-sm leading-relaxed text-foreground/90 sm:text-base">
          <p>
            YNK Air Traffic is a game published by YouNeeK. This policy covers the iOS app, the Android app, and the
            website that ships the same game.
          </p>

          <h2 className="pt-4 font-heading text-xl text-primary">Data YouNeeK collects</h2>
          <p>
            YouNeeK does not collect, sell, or share personal data. There is no account and no login. There are no
            analytics, crash-reporting, or advertising SDKs.
          </p>
          <p>
            Scores, unlocked airports, and the tutorial choice stay on the device in local storage. They are not
            uploaded. Uninstalling the app deletes them.
          </p>
          <p>The App Store privacy label is Data Not Collected.</p>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Data used to track you: none.</li>
            <li>Data linked to you: none.</li>
            <li>Data not linked to you: none.</li>
            <li>Tracking: no.</li>
          </ul>

          <h2 className="pt-4 font-heading text-xl text-primary">Microphone and speech</h2>
          <p>
            The mic button is optional. Thumb buttons and the typed clearance fly the airplane without it.
          </p>
          <p>
            When you tap the mic, the phone asks for microphone and speech-recognition permission. The iPhone app uses
            Apple&apos;s Speech framework and requests on-device recognition for English when the device supports it.
            The audio stays on the iPhone, the mic still works in airplane mode, and YouNeeK does not receive the audio
            or the transcript.
          </p>
          <p>
            If that iPhone cannot recognize speech on-device, iOS may send the audio to Apple to transcribe it. That
            transfer is between the device and Apple. YouNeeK is not a party to it and does not receive the audio.
          </p>
          <p>
            Android uses the platform speech recognizer the same way. The transcript is used for the clearance and
            then discarded. YouNeeK does not receive it.
          </p>
          <p>
            Microphone audio is not data YouNeeK collects. The permission prompts still appear when you tap the mic,
            and the app explains them.
          </p>

          <h2 className="pt-4 font-heading text-xl text-primary">Network use</h2>
          <p>
            The game is bundled inside the app and plays offline. The installed app does not load its user interface
            from the internet.
          </p>
          <p>
            If the phone is online, a shift may request weather for the airport you picked from Open-Meteo. That
            request sends the airport&apos;s published latitude and longitude, not your location. The app does not ask
            for location permission. If the request fails, the shift uses weather stored in the game.
          </p>
          <p>
            Map screens elsewhere on the game&apos;s website may load map tiles. Those screens are not required to play.
          </p>

          <h2 className="pt-4 font-heading text-xl text-primary">Children</h2>
          <p>
            The game is rated 4+ and is not directed at children under 13. It does not use tracking, it does not
            contain third-party advertising, and it does not knowingly collect personal information from anyone.
          </p>

          <h2 className="pt-4 font-heading text-xl text-primary">Contact</h2>
          <p>
            YouNeeK / Andrew Gray. Questions about this policy go to the{' '}
            <Link to="/air-traffic/support" className="text-primary underline underline-offset-4">
              support page
            </Link>{' '}
            or a{' '}
            <a
              href={SUPPORT_ISSUE_URL}
              className="text-primary underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub issue on the YNK Air Traffic repository
            </a>
            .
          </p>
        </div>
      </article>
    </AirTrafficFrame>
  );
}
