import React from 'react'
import { BiEdit } from 'react-icons/bi'
import { AiFillDelete } from 'react-icons/ai'
import { FaDownload } from 'react-icons/fa';
import './ToDo.css';
import { downloadFile } from '../utils/HandleApi';


const ToDo = ({ text, tags, thumbnail, file, completed, updateMode, deleteToDo, toggleComplete }) => {
    const handleDownload = () => {
        downloadFile(file.split('/').pop()); // Extract filename and initiate download
    };

    return (
        <div className={`todo ${completed ? 'completed' : ''}`}>
            <input type="checkbox" checked={completed} onChange={toggleComplete} />
            {thumbnail && <img src={`http://localhost:5000${thumbnail}`} alt="thumbnail" />}
            <div className='text'>
                {text}
                {tags && tags.length > 0 && (
                    <span className='tags'> ({tags.join(', ')})</span>
                )}
            </div>
            <div className='icons'>
                {file && (
                    <FaDownload className='icon' onClick={handleDownload} />
                )}
                <BiEdit className='icon' onClick={updateMode} />
                <AiFillDelete className='icon' onClick={deleteToDo} />
            </div>
        </div>
    );
}

export default ToDo;