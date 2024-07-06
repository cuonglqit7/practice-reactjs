import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";

import { loginApi } from "../services/UserService";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./context/UserContent";


const Login = (props) => {

    const { loginContext } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [isShowLoad, setIsShowLoad] = useState(false);
    const [pw, setPw] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token) {
            navigate("/");
        }
    }, []);

    const handleLogin = async () => {
        setIsShowLoad(true);
        if (!email || !pw) {
            toast.error("Missing email or password");
            return;
        }
        let res = await loginApi(email.trim(), pw);
        if (res && res.token) {
            
            loginContext(email, res.token);
            navigate("/");
        } else {
            if (res && res.status > 200) {
                toast.error(res.data.error);
            }
        }
        setIsShowLoad(false);
    };

    const handleGoBack = () => {
        navigate("/");
    }

    const handleEnter = async(e) => {
        if(e && e.key === "Enter") {
            handleLogin();
        }
    }
    return (
        <>
            <div className="login-container col-12 col-sm-4 d-flex">
                <h1 className="title">Login</h1>
                <div className="text">
                    Email or Username: "eve.holt@reqres.in"
                </div>
                <div className="box-input">
                    <input
                        type="text"
                        placeholder="Enter email or username..."
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        onKeyDown={(e) => handleEnter(e)}
                    />
                </div>
                <div className="text">Password:</div>
                <div className="box-input">
                    <input
                        type="password"
                        placeholder="Password...."
                        value={pw}
                        onChange={(e) => {
                            setPw(e.target.value);
                        }}
                        onKeyDown={(e) => handleEnter(e)}
                    />
                </div>
                <button
                    className={email && pw ? "active" : ""}
                    disabled={email && pw ? false : true}
                    onClick={() => handleLogin()}
                >
                    {isShowLoad === true ? (
                        <i
                            className="fa-solid fa-circle-notch fa-spin"
                            disabled={email && pw ? false : true}
                        ></i>
                    ) : (
                        " Login"
                    )}
                </button>
                <div className="back" onClick={()=> handleGoBack()}>
                    <a>
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>Go back</span>
                    </a>
                </div>
            </div>
        </>
    );
};

export default Login;
