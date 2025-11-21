import { Dashboard } from './components/Dashboard';
import { Toaster } from 'react-hot-toast';
import './styles/toast.css';

function App() {
    return (
        <div className="App">
            <Toaster position="top-right" />
            <Dashboard />
        </div>
    );
}

export default App;
