import { Link } from "react-router-dom"
export default function NotFound(){
    return (
    <div className="bg-[#181824] h-screen flex flex-col items-center justify-center">
        <h2 className="text-white text-xl">☹️ The page you're looking for does not exists</h2>
        <Link className="mt-3 bg-gray-900 rounded-lg px-3 py-1 text-white hover:bg-gray-800 transition-colors duration-300" to="/">Redirect</Link>
    </div>
    )
}