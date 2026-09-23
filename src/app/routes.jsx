import {Routes, Route} from 'react-router-dom'
import RegisterPage from '../features/auth/RegisterPage'
import HomePage from '../features/auth/HomePage';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/register" element={<RegisterPage />}></Route>
            <Route path='/' element={<HomePage/>}></Route >
        </Routes>
    );
}
export default AppRoutes;