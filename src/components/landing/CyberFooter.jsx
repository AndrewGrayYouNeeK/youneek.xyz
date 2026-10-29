export default function CyberFooter() {
  return (
    <footer className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-[#8fb4b6]">
          Andrew Gray · {new Date().getFullYear()}
        </p>
        <a
          href="https://github.com/AndrewGrayYouNeeK"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-[#7ee7ea] underline-offset-4 hover:underline"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
