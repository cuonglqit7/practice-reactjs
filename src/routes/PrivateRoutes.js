import { useContext } from "react";
import { Alert } from "react-bootstrap";

import { UserContext } from "../components/context/UserContent";

const PrivateRoutes = (props) => {
    const { user } = useContext(UserContext);


    if(user && !user.auth) {
        return (<>
            <Alert variant="danger" className="mt-3">
                <Alert.Heading>
                    You have much Login now!
                </Alert.Heading>
                <p>
                    Login to use Manaager user
                </p>
            </Alert>
        </>)
    }

    return (
        <>
            {props.children}
        </>
    );
};

export default PrivateRoutes;
