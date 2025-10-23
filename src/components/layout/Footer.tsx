const Footer = () => {
  return (
    <footer className="mt-auto border-t bg-muted/50 py-8">
  <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
    <div className="text-center md:text-left">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} KADA Connect. Powered by Elice.
      </p>
    </div>
    <div className="flex items-center gap-4">
      <a
        href="https://elice.io"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        About Elice
      </a>
    </div>
  </div>
</footer>

  );
};

export default Footer;
