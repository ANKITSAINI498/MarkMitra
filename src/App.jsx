import {Routes,Route,Navigate} from 'react-router-dom';
import Workspace from './pages/Workspace';
import Templates from './pages/Templates';
import NotFound from './pages/NotFound';
export default function App(){return <Routes><Route path="/" element={<Workspace/>}/><Route path="/templates" element={<Templates/>}/><Route path="*" element={<NotFound/>}/></Routes>}
