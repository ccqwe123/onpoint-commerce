const Footer = () => {
  return (
    <footer className="absolute bottom-0 w-full bg-footer-bg py-6">
      <div className="max-w-[1480px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
        <div className="text-sm text-footer-text">
          Questions? Contact Us.
        </div>
        <div className="text-sm text-footer-text">
          © 2025 OnPoint Inc.
        </div>
      </div>
    </footer>
  );
};

export default Footer;