import { useState } from "react";

function App() {
    const[isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <div>
            <h1>Conditioanl Rendering Example</h1>

            {isLoggedIn ? (
                <h2>Welcome Rishav!</h2>
            ) : (
                <h2>Please Login</h2>
            )}

            <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
                Toggle Login 
            </button>
        </div>
        );
}