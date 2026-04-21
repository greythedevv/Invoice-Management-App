import Logo from "../assets/Logo.svg"
import toggleButton from "../assets/togglebuton.svg"
import profilePicture from "../assets/profilepcture.svg"

export const Sidebar = () => {
  return (
    <>
      <style>{`
        @keyframes sidebar-in {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .sidebar-root {
          animation: sidebar-in 0.35s cubic-bezier(.22,.68,0,1.2) both;
        }

        .sidebar-logo-wrap {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .sidebar-logo-wrap::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 50%;
          background: #7C5DFA;
          border-radius: 0 20px 20px 0;
          z-index: 0;
        }

        .sidebar-logo-img {
          position: relative;
          z-index: 1;
          width: 40px;
          height: 40px;
          object-fit: contain;
        }

        .sidebar-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: 10px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.18s ease, transform 0.18s ease;
          opacity: 0.6;
        }
        .sidebar-toggle:hover {
          background: rgba(255,255,255,0.08);
          opacity: 1;
          transform: scale(1.08);
        }
        .sidebar-toggle:active { transform: scale(0.95); }

        .sidebar-divider {
          width: 100%;
          border: none;
          border-top: 1px solid #494E6E;
          margin: 0;
        }

        .sidebar-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid transparent;
          transition: border-color 0.18s ease, transform 0.18s ease;
          cursor: pointer;
        }
        .sidebar-avatar:hover {
          border-color: #7C5DFA;
          transform: scale(1.07);
        }
      `}</style>

      <aside className="sidebar-root fixed bg-[#1E2139] w-18 h-screen flex flex-col justify-between items-stretch z-50 rounded-r-[20px] overflow-hidden">

        {/* Logo */}
        <div className="sidebar-logo-wrap h-18">
          <img src={Logo} alt="logo" className="sidebar-logo-img" />
        </div>

        {/* Bottom controls */}
        <div className="flex flex-col items-center gap-5 pb-6">
          <button className="sidebar-toggle" onClick={() => alert("Toggle theme")}>
            <img src={toggleButton} alt="toggle theme" style={{ width: 20, height: 20, opacity: 1 }} />
          </button>

          <hr className="sidebar-divider" />

          <img
            src={profilePicture}
            alt="profile"
            className="sidebar-avatar"
          />
        </div>

      </aside>

      {/* Spacer so page content doesn't hide behind sidebar */}
      <div style={{ width: 72, flexShrink: 0 }} />
    </>
  )
}
