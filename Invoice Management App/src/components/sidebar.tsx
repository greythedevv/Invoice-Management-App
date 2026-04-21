import Logo from "../assets/Logo.svg"
import toggleButton from "../assets/togglebuton.svg"
import profilePicture from "../assets/profilepcture.svg"



export const Sidebar = ()=>{
    return(
        <div>
             {/* Sidebar */}
      <aside className="fixed bg-[#373B53] w-20 h-screen flex flex-col justify-between  items-stretch py-6 z-50">

        {/* Top Logo */}
        <div className="w-full flex justify-center">
          <img src={Logo} alt="logo" className="w-10" />
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-6 w-full">
       
          <button onClick={() => alert("hey there")}>
            <img src={toggleButton} alt="toggle button" />
          </button>

          <hr className="w-full border-[#494E6E]" />

          <img
            src={profilePicture}
            alt="profile"
            className="w-10 h-10 rounded-full"
          />

        </div>

      </aside>
        </div>
    )
}