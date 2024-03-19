import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Judge0CodeExecutor from "./Judge";

interface data {
  username: string;
  src: string;
  stdin: string;
  language: string;
  createdAt: string;
}

export default function Dash() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const user = queryParams.get("user");
  const [data, setData] = useState<data>();

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        `http://15.206.169.115:443/api/v1/code?user=${user}`
      );
      setData(response.data);
    }
    fetchData();
  }, []);
  let id;

  if(data?.language=="C++") id=54
  else if(data?.language=="python") id=92
  else if(data?.language=="javascript") id=93

  return (
    <div className="bg-gray-700 overflow-y-auto h-screen flex justify-center items-center flex-col">
      <table className="border-collapse border border-gray-900 bg-gray-400">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-gray-700">Username</th>
            <th className="px-4 py-2 border border-gray-700">Language</th>
            <th className="px-4 py-2 border border-gray-700">Standard Input</th>
            <th className="px-4 py-2 border border-gray-700">Submitted</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 border border-gray-700">
              {data?.username}
            </td>
            <td className="px-4 py-2 border border-gray-700">
              {data?.language}
            </td>
            <td className="px-4 py-2 border border-gray-700">{data?.stdin}</td>
            <td className="px-4 py-2 border border-gray-700">
              {new Date(data?.createdAt as string).toLocaleString("en-IN", {
                timeZoneName: "short",
              })}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="overflow-y-auto overflow-x-auto max-h-96 lg:w-1/3 w-full flex flex-col lg:flex-row gap-4">
        <SyntaxHighlighter clas language={data?.language.toLocaleLowerCase()} style={docco}>
            {/* Limiting the display of the source code only to 100 characters */}
          {(data?.src as string)?.substring(0,100)}
        </SyntaxHighlighter>
        <div className="h-40 w-80 bg-gray-500">
            <h2 className="text-black pl-2 rounded-sm">Output:</h2>
            <Judge0CodeExecutor src={data?.src as string} id={id as number} stdin={data?.stdin as string} />
        </div>
      </div>
    </div>
  );
}
