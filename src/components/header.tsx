import { navigate } from "raviger";
import { IconContext } from "react-icons";
import { FaRoute } from "react-icons/fa";
import firebase from "../firebase/firebase";

interface Props {
    auth: firebase.auth.Auth;
    isSignedIn: boolean;
}

export const Header = (props: Props) => {
    const { auth, isSignedIn } = props;
    const displayButtons = isSignedIn ? (
        <button className="header-button" onClick={() => auth.signOut()}>
            Sign out
        </button>
    ) : (
        <div className="header-sign-in-up-div">
            <button
                className="header-button header-sign-in-button"
                onClick={() => navigate("sign_in")}
            >
                Sign in
            </button>
            <button
                className="header-button"
                onClick={() => navigate("sign_up")}
            >
                Sign up
            </button>
        </div>
    );

    return (
        <div className="header">
            <div className="router-icon-container">
                <IconContext.Provider
                    value={{
                        className: "router-icon",
                    }}
                >
                    <FaRoute />
                </IconContext.Provider>
                <span className="router-icon-span">
                    <span>R</span>outer
                </span>
            </div>

            <div className="header-buttons-container">{displayButtons}</div>
        </div>
    );
};
