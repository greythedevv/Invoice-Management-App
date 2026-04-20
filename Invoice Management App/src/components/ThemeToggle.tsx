// import { useEffect, useState } from "react"

// export const ToggleButton = () => {
//   // 1. get saved value (or default false)
//   const [isOn, setIsOn] = useState<boolean>(() => {
//     const saved = localStorage.getItem("toggle")
//     return saved ? JSON.parse(saved) : false
//   })

//   // 2. toggle function
//   const toggle = () => {
//     setIsOn(prev => !prev)
//   }

//   // 3. save to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem("toggle", JSON.stringify(isOn))
//   }, [isOn])

//   return (
//     <button
//       onClick={toggle}
//       className={`w-14 h-7 flex items-center rounded-full p-1 transition ${
//         isOn ? "bg-green-500 justify-end" : "bg-gray-400 justify-start"
//       }`}
//     >
//       <div className="w-5 h-5 bg-white rounded-full shadow-md"></div>
//     </button>
//   )
// }
