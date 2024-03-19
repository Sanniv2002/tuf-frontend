import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


export default function Home() {
  const [lang, setLang] = useState("C++");
  const [username, setUsername] = useState("");
  const [src, setSrc] = useState("");
  const [stdin, setStdin] = useState("");
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errordesc, setErrordesc] = useState("")
  const navigate = useNavigate()


  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const { selectionStart, selectionEnd } = event.currentTarget;
      const newValue =
        src.substring(0, selectionStart) + "    " + src.substring(selectionEnd);
      setSrc(newValue);
      // Move the cursor to the correct position after inserting 4 spaces
      const newCursorPosition = selectionStart + 4;
      if (event.currentTarget.setSelectionRange) {
        event.currentTarget.setSelectionRange(
          newCursorPosition,
          newCursorPosition
        );
      }
    }
  };

  const submit = async () => {
    if(username==="" && src===""){
        alert("Some input fields are missing")
        return
    }
    setLoading(true)
    try{
      const response = await axios.post("http://65.0.182.126/api/v1/create", {
        username: username,
        language: lang,
        stdin: stdin,
        src: src
      })
      if(response.status===200){
        console.log("you will be redirected")
        navigate(`/code?user=${username}`)
      }
    }
    catch(e){
      setError(true)
      setErrordesc("User Already Exists, either try with a different username")
      setTimeout(() => setError(false), 3000)
    }

    // if(response.status===403){
    //   alert("User Already Exits")
    //   setLoading(false)
    // }
    // else if(response.status===200){
    //   console.log("You will be redirected")
    // }
    setLoading(false)
  }

  return (
    <div className="bg-gray-700 overflow-y-auto h-screen">
      {error? <div className="flex gap-2 group fixed bottom-12 left-12 bg-gray-800 text-white p-5 rounded-lg">{errordesc}</div>: null}
      <header className="text-white text-2xl w-full text-center p-10">
        Code Snipper
      </header>
      <section className="grid lg:grid-cols-2 h-96 px-4 lg:px-44 py-12 pb-4 lg:pb-0">
        <div className="flex flex-col gap-2 lg:border-r-2 lg:h-96 border-b-2 lg:border-b-0">
          <div className="flex gap-2">
            <h2 className="text-white text-lg">Username:</h2>
            <input
              onChange={(e) => setUsername(e.target.value)}
              className="p-1 rounded-sm bg-gray-500 text-white"
              type="text"
              placeholder=" username"
            />
          </div>
          <div className="flex gap-2">
            <h2 className="text-white text-lg">
              Select your preferred code language:
            </h2>
            <select
              onChange={(e) => setLang(e.target.value)}
              className="rounded-md bg-gray-500 text-white px-2"
            >
              <option value="c++">C++</option>
              <option value="javascript">Javascript</option>
              <option value="python">Python</option>
            </select>
          </div>
          <button onClick={submit} className="bg-blue-400 text-white hover:bg-blue-500 transition-colors duration-300 w-20 rounded-sm p-2">{loading? <span className="text-md animate-pulse text-white">///</span>: <span>Submit</span>}</button>
        </div>

        <div className="flex flex-col gap-2 h-96 md:px-44 pl-6">
          <div>
            <h2 className="text-white">Editor</h2>
            <textarea
              value={src}
              onKeyDown={handleKeyDown}
              onChange={(e) => setSrc(e.target.value)}
              className="rounded-sm p-1 bg-gray-100 text-black"
              cols={45}
              rows={10}
            />
          </div>
          <div>
            <h2 className="text-white">Standard Input</h2>
            <textarea
              onChange={(e) => setStdin(e.target.value)}
              className="rounded-sm p-1 bg-gray-100 text-black"
              cols={46}
              rows={4}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
