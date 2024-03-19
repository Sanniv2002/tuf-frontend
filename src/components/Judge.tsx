import { useState, useEffect } from 'react';
import axios from 'axios';

type code = {
    src: string,
    id: number,
    stdin: string
}

const API_KEY = '4d3c0fdd31mshe4121f9afc0979cp1212eajsnb7681c7df7f3'


const Judge0CodeExecutor = ({src, id, stdin}: code) => {
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    console.log(stdin, src, id)
    const executeCode = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
                source_code: src,
                language_id: id,
                stdin: stdin,
                expected_output: '',
                cpu_time_limit: 10,
                cpu_extra_time: 0.5,
                wall_time_limit: 5,
                memory_limit: 128000,
                stack_limit: 64000,
                max_processes_and_or_threads: 30,
                enable_per_process_and_thread_time_limit: false,
                enable_per_process_and_thread_memory_limit: false,
                max_file_size: 1024
            }, {
                headers: {
                    'x-rapidapi-key': API_KEY,
                    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                    'content-type': 'application/json',
                    'accept': 'application/json'
                }
            });
            await pollSubmissionStatus(response.data.token);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const pollSubmissionStatus = async (token: any) => {
        let status = 'queued';
        while (status === 'queued' || status === 'Processing') {
            try {
                const response = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
                    headers: {
                        'x-rapidapi-key': API_KEY,
                        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                        'accept': 'application/json'
                    }
                });
                status = response.data.status.description;
                if (status === 'Wrong Answer') {
                    setOutput(response.data.stdout);
                    setIsLoading(false);
                    return;
                } else if (status === 'failed' || status === 'runtime-error' || status === 'time-limit-exceeded') {
                    setIsLoading(false);
                    return;
                } else {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (error) {
                setIsLoading(false);
                return;
            }
        }
    };

    useEffect(() => {
        executeCode()
    }, [src])

    return (
        <div className='bg-gray-200 p-3 overflow-y-auto'>
            {/* <button onClick={executeCode} className='p-2 bg-gray-600 rounded-md text-white'>Execute</button> */}
            {isLoading ? 'Executing...' : null}
            {output && <pre>{output}</pre>}
        </div>
    );
};

export default Judge0CodeExecutor;
