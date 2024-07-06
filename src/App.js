import Container from "react-bootstrap/Container";
import { ToastContainer } from "react-toastify";
import { useContext, useEffect } from "react";

import "./App.scss";
import Header from "./components/Header";
import { UserContext } from "./components/context/UserContent";
import AppRoute from "./routes/AppRoute";

function App() {

    const {user, loginContext} = useContext(UserContext);
    useEffect(() => {
        if(localStorage.getItem("token")) {
            loginContext(localStorage.getItem("email"), localStorage.getItem("token"))
        }
    },[])
    return (
        <>
            <div className="app-container">
                <Container>
                    <Header/>
                    <AppRoute/>
                </Container>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
}

export default App;
