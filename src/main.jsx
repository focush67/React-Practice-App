import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if(!rootElement) {
    console.log("Root Element is undefined. Failed to render application");
}
else{
    createRoot(rootElement).render(
        <StrictMode>
            <App/>
        </StrictMode>
    )
}