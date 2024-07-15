import React, { useEffect, useRef, useState } from "react";
import ToDo from "../../components/ToDo";
import { getAllToDo, addToDo, updateToDo, deleteToDo, searchToDo, extendSession, toggleComplete } from "../../utils/HandleApi";

const Main = () => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    // State variables for managing to-dos and form inputs
    const [toDo, setToDo] = useState([]);
    const [text, setText] = useState("");
    const [tags, setTags] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [toDoId, setToDoId] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(5);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterTag, setFilterTag] = useState("");


    const idleTimer = useRef(null);
    const idleTimeout = 15 * 60 * 1000; // 15 min

    // Fetch to-dos on component mount and when dependencies change
    useEffect(() => {
        const fetchData = async () => {
            if (searchQuery || filterTag) {
                await searchToDo(searchQuery, filterTag, setToDo, setTotalPages, page);
            } else {
                await getAllToDo(setToDo, setTotalPages, page);
            }
        };
        fetchData();
    }, [page, searchQuery, filterTag]);

    // Idle timer to automatically log out user after inactivity
    useEffect(() => {
        const events = ['keydown', 'scroll', 'click'];

        const resetTimer = () => {
            clearTimeout(idleTimer.current);
            idleTimer.current = setTimeout(logout, idleTimeout);
            extendSession();
        };

        const logout = () => {
            localStorage.removeItem('token');
            window.location.href = '/login';
        };

        events.forEach(event => window.addEventListener(event, resetTimer));

        resetTimer();

        return () => {
            events.forEach(event => window.removeEventListener(event, resetTimer));
            clearTimeout(idleTimer.current);
        };
    }, [idleTimeout]);

    // Set update mode for editing a to-do
    const updateMode = (_id, text, tags, thumbnail, file) => {
        setIsUpdating(true);
        setText(text);
        setTags(tags.join(','));
        setToDoId(_id);
        setThumbnail(thumbnail);
        setFile(file);
    };

    // Handle file input change for thumbnails
    const handleThumbnailChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setThumbnail(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            alert('Please select an image file');
        }
    };

    // Handle file input change for attachments
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && (selectedFile.type.startsWith('application/'))) {
            setFile(selectedFile);
        } else {
            alert('Please select a valid file');
        }
    };

    // Handle adding or updating a to-do
    const handleAddUpdate = async () => {
        const formData = new FormData();
        formData.append('text', text);
        formData.append('tags', tags);
        if (thumbnail) formData.append('thumbnail', thumbnail);
        if (file) formData.append('file', file);

        if (isUpdating) {
            formData.append('_id', toDoId);
            await updateToDo(formData, setToDo, setText, setTags, setIsUpdating, setTotalPages, page);
        } else {
            await addToDo(formData, setText, setTags, setToDo, setTotalPages);
            setPage(1);
        }

        setText('');
        setTags('');
        setThumbnail(null);
        setThumbnailPreview(null);
        setFile(null);
    };

    const handleSearch = query => {
        setSearchQuery(query);
        setPage(1);
    };

    const handleTagFilter = tag => {
        setFilterTag(tag);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleDelete = async (id) => {
        await deleteToDo(id, setToDo, setTotalPages, page);
        if (searchQuery || filterTag) {
            await searchToDo(searchQuery, filterTag, setToDo, setTotalPages, page);
        } else {
            await getAllToDo(setToDo, setTotalPages, page);
        }
    };

    const handleToggleComplete = async (id) => {
        await toggleComplete(id, setToDo, setTotalPages, page);
    };


    return (
        <div className="App">
            <div className="container">
                <nav className="navbar">
                    <h1>ToDo App</h1>
                    <button className='white_btn' onClick={handleLogout}>
                        Logout
                    </button>
                </nav>

                <div className="top">
                    <input
                        type="text"
                        placeholder="Add ToDo.."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Add Tags (Comma separated).."
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />

                    {thumbnailPreview && <img src={thumbnailPreview} alt="thumbnail preview" style={{ width: '36px', height: '36px', marginRight: '5px', borderRadius: '5px' }} />}

                    <label className="custom-file-upload">
                        <input type="file" onChange={handleThumbnailChange} style={{ display: 'none' }} />
                        Image
                    </label>


                    <label className="custom-file-upload">
                        <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                        File
                    </label>

                    <div className="add" onClick={handleAddUpdate}>
                        {isUpdating ? 'Update' : 'Add'}
                    </div>

                </div>
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Search.."
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filter by Tag.."
                        onChange={(e) => handleTagFilter(e.target.value)}
                    />
                </div>
                <div className="list">
                    {toDo.map((item) => (
                        <ToDo
                            key={item._id}
                            text={item.text}
                            tags={item.tags}
                            thumbnail={item.thumbnail}
                            file={item.file}
                            completed={item.completed}
                            updateMode={() => updateMode(item._id, item.text, item.tags, item.thumbnail, item.file)}
                            deleteToDo={() => handleDelete(item._id)}
                            toggleComplete={() => handleToggleComplete(item._id)}
                        />
                    ))}
                </div>

                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={page === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Main;