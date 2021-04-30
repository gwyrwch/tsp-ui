import { navigate } from "raviger";
import React, { useState } from "react";
import { signInToFirebaseWithGoogle } from "../../firebase/sign-in";
import firebase from "../../firebase/firebase";
import { IconContext } from "react-icons";
import { FcGoogle } from "react-icons/fc";

interface Props {
    auth: firebase.auth.Auth;
    database: firebase.database.Database;
}

export const SignInPage = (props: Props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { auth } = props;

    auth.onAuthStateChanged((user) => {
        if (user) {
            navigate("/router", true);
        }
    });

    const singInWitnEmailAndPassword = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        setErrorMessage("");
        event.preventDefault();

        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            navigate("/router", true);
        } catch (err) {
            setErrorMessage(err.message);
        }
    };

    const signInWithGoogle = async () => {
        setErrorMessage("");
        try {
            await signInToFirebaseWithGoogle(auth);
            navigate("/router", true);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const createInputChangeHandler = (
        setterMethod: React.Dispatch<React.SetStateAction<string>>
    ) => (event: React.FormEvent<HTMLInputElement>) => {
        setErrorMessage("");

        const { value } = event.currentTarget;
        setterMethod(value);
    };

    return (
        <div className="white-wrapper">
            <div className="sign-in-div">
                <h4>Sign in</h4>
                <form
                    onSubmit={singInWitnEmailAndPassword}
                    className="sign-in-form"
                >
                    <div>
                        <label>
                            Email:
                            <input
                                type="email"
                                value={email}
                                placeholder="gwyrwch@mail.ru"
                                onChange={createInputChangeHandler(setEmail)}
                                className="sign-in-input"
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Password:
                            <input
                                type="password"
                                value={password}
                                placeholder="password"
                                onChange={createInputChangeHandler(setPassword)}
                                className="sign-in-input"
                            />
                        </label>
                    </div>
                    <div className="sign-in-button-div">
                        <input
                            className="sign-in-button"
                            type="submit"
                            value="Sign in"
                        />
                    </div>
                    <span>{errorMessage}</span>
                </form>
                <div className="dont-have-account-div">
                    Don't have an account?{" "}
                    <span onClick={() => navigate("sign_up")}>
                        Sign up for Router...
                    </span>
                </div>
                <div className="sign-in-with-google-div">
                    You can also{" "}
                    <span onClick={signInWithGoogle}>
                        sign in with{"  "}
                        <div className="google-icon-wrapper">
                            <IconContext.Provider
                                value={{
                                    className: "google-icon",
                                }}
                            >
                                <FcGoogle />
                            </IconContext.Provider>
                            <span>oogle...</span>
                        </div>
                    </span>
                </div>
            </div>
        </div>
    );
};
