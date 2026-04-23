import Logo from "../assets/Logo.svg"
import toggleButton from "../assets/togglebuton.svg"
import profilePicture from "../assets/profilepcture.svg"
import { useInvoices } from "../context/InvoiceContext"

export const Sidebar = () => {
  const { isDark, toggleDark } = useInvoices();

  return (
    <>
      <style>{`
        @keyframes sidebar-in {
          from { opacity:0; transform:translateX(-10px); }
          to   { opacity:1; transform:translateX(0); }
        }
        .sidebar {
          background: var(--bg-sidebar);
          transition: background 0.25s ease;
          z-index: 50;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          animation: sidebar-in 0.3s ease both;
        }

        /* ── Desktop: fixed left vertical bar ─────────── */
        @media (min-width: 768px) {
          .sidebar {
            position: fixed;
            top: 0; left: 0;
            width: 72px; height: 100vh;
            flex-direction: column;
            justify-content: space-between;
            border-radius: 0 20px 20px 0;
          }
          .sidebar-spacer {
            width: 72px;
            height: 100vh;
            flex-shrink: 0;
          }
          .sidebar-divider {
            width: 100%; height: 1px;
            background: #494E6E; border: none;
          }
          .sidebar-logo-wrap { width: 100%; height: 72px; }
          .sidebar-logo-wrap::after {
            bottom: 0; left: 0; right: 0; height: 50%;
            border-radius: 0 20px 20px 0;
          }
          .sidebar-bottom {
            flex-direction: column;
            padding-bottom: 24px;
            gap: 20px;
          }
        }

        /* ── Mobile + Tablet: fixed top horizontal bar ── */
        @media (max-width: 767px) {
          .sidebar {
            position: fixed;
            top: 0; left: 0; right: 0;
            width: 100%; height: 72px;
            flex-direction: row;
            justify-content: space-between;
            border-radius: 0 0 20px 20px;
          }
          /* Spacer pushes page content DOWN below the top bar */
          .sidebar-spacer {
            width: 100%;
            height: 72px;
            flex-shrink: 0;
            display: block;
          }
          .sidebar-divider {
            width: 1px; height: 100%;
            background: #494E6E; border: none;
          }
          .sidebar-logo-wrap { width: 72px; height: 100%; }
          .sidebar-logo-wrap::after {
            top: 0; right: 0; bottom: 0; width: 50%;
            border-radius: 0 20px 20px 0;
          }
          .sidebar-bottom {
            flex-direction: row;
            padding-right: 24px;
            padding-bottom: 0;
            gap: 20px;
          }
        }

        /* ── Shared ───────────────────────────────────── */
        .sidebar-logo-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
      
        .sidebar-bottom {
          display: flex;
          align-items: center;
        }
        .sidebar-toggle {
          background: none; border: none; cursor: pointer;
          padding: 10px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.18s ease, transform 0.18s ease;
          opacity: 0.7;
        }
        .sidebar-toggle:hover  { background: rgba(255,255,255,0.1); opacity:1; transform:scale(1.08); }
        .sidebar-toggle:active { transform: scale(0.95); }
        .sidebar-toggle:focus-visible { outline: 2px solid #7C5DFA; outline-offset: 3px; border-radius: 50%; }
        .sidebar-avatar {
          width: 36px; height: 36px; border-radius: 50%; object-fit: cover;
          border: 2px solid transparent;
          transition: border-color 0.18s ease, transform 0.18s ease; cursor: pointer;
        }
        .sidebar-avatar:hover { border-color: #7C5DFA; transform: scale(1.07); }
      `}</style>

      {/*
        The spacer is a SIBLING of <aside>, not inside it.
        On desktop it adds 72px left margin; on mobile it adds 72px top padding.
        It must be rendered BEFORE the <aside> so flex parents stack correctly.
      */}
      <div className="sidebar-spacer" aria-hidden="true" />

      <aside className="sidebar" role="navigation" aria-label="Main navigation">
        {/* Logo */}
        <div className="sidebar-logo-wrap">
          <img src={Logo} alt="Invoice App Logo" className="sidebar-logo-img" />
        </div>

        {/* Bottom controls */}
        <div className="sidebar-bottom">
          <button
            className="sidebar-toggle"
            onClick={toggleDark}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <img
              src={toggleButton}
              alt=""
              aria-hidden="true"
              style={{
                width: 20, height: 20,
                filter: isDark ? "brightness(0) invert(1)" : "brightness(0.6)",
                transition: "filter 0.2s ease",
              }}
            />
          </button>

          <div className="sidebar-divider" aria-hidden="true" />

          <img
            src={profilePicture}
            alt="User profile"
            className="sidebar-avatar"
          />
        </div>
      </aside>
    </>
  );
};
