import axios from 'axios';
const api=axios.create({baseURL:'/api',timeout:4000});
export async function fetchWorkspace(){try{return (await api.get('/documents')).data}catch(error){throw error}}
export async function saveWorkspace(documents){return (await api.post('/documents',{documents})).data}
