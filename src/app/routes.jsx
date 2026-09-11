import {Routes, Route} from 'react-router-dom'
import RegisterPage from '../features/auth/RegisterPage'

function AppRoutes() {
    return (
        <Routes>
            <Route path="/register" element={<RegisterPage />}></Route>
            <Route path='/' element={<RegisterPage/}></Route >
        </Routes>
    );
}
export default AppRoutes;