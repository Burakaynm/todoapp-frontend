import axios from 'axios';


const baseUrl = 'http://localhost:5000/api/todos';
const authUrl = 'http://localhost:5000/api/auth';


const api = axios.create({
    baseURL: baseUrl,
});

const apiAuth = axios.create({
    baseURL: authUrl,
});


let isTokenExpired = false;

// Attach token to every request
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

// Attach token to every auth request
apiAuth.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

// Handle expired tokens
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 400 && !isTokenExpired) {
            isTokenExpired = true;
            localStorage.removeItem('token');
            alert(error.response.data.message);
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const extendSession = async () => {
    try {
        const response = await apiAuth.post('/extend-session'); // Extend session
        localStorage.setItem('token', response.data.token);
    } catch (err) {
        console.log(err);
    }
}

const getAllToDo = async (setToDo, setTotalPages, page = 1) => {
    try {
        const response = await api.get(`/?page=${page}`);
        setToDo(response.data.toDos);
        setTotalPages(response.data.totalPages);
    } catch (err) {
        console.log(err);
    }
};


const addToDo = async (formData, setText, setTags, setToDo, setTotalPages) => {
    try {
        await api.post('/save', formData);
        setText('');
        setTags('');
        await getAllToDo(setToDo, setTotalPages);
    } catch (err) {
        console.log(err);
    }
};


const updateToDo = async (formData, setToDo, setText, setTags, setIsUpdating, setTotalPages, page) => {
    try {
        await api.post('/update', formData);
        setText('');
        setTags('');
        setIsUpdating(false);
        await getAllToDo(setToDo, setTotalPages, page);
    } catch (err) {
        console.log(err);
    }
};

const deleteToDo = async (_id, setToDo, setTotalPages, page) => {
    try {
        await api.post('/delete', { _id });
        await getAllToDo(setToDo, setTotalPages, page);
    } catch (err) {
        console.log(err);
    }
};

const searchToDo = async (query, tag, setToDo, setTotalPages, page = 1) => {
    try {
        const { data } = await api.get(`/search?query=${query}&tag=${tag}&page=${page}`);
        setToDo(data.toDos);
        setTotalPages(data.totalPages);
    } catch (err) {
        console.log(err);
    }
}

const downloadFile = async (filename) => {
    try {
        const response = await api.get(`/download/${filename}`, {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (err) {
        console.log(err);
    }
}

const toggleComplete = async (_id, setToDo, setTotalPages, page) => {
    try {
        await api.post('/toggle-complete', { _id });
        await getAllToDo(setToDo, setTotalPages, page);
    } catch (err) {
        console.log(err);
    }
};

export { getAllToDo, addToDo, updateToDo, deleteToDo, searchToDo, downloadFile, extendSession, toggleComplete };
export default api;

