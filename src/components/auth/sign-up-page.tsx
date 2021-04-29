import { navigate } from "raviger";
import React, { useState } from "react";
import firebase from "../../firebase/firebase";

interface Props {
    auth: firebase.auth.Auth;
    database: firebase.database.Database;
}

export const SignUpPage = (props: Props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { auth } = props;

    auth.onAuthStateChanged((user) => {
        if (user) {
            navigate("/router", true);
        }
    });

    const singUpWitnEmailAndPassword = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        setErrorMessage("");
        event.preventDefault();
        if (password !== passwordRepeat) {
            setErrorMessage("Passwords don't match");
            return;
        }

        try {
            console.log("here2s");
            await auth.createUserWithEmailAndPassword(email, password);
            // navigate("/router", true);
        } catch (err) {
            console.log("here2");
            setErrorMessage(err.message);
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
        <div className="sign-in-div">
            <h4>Sign up</h4>
            <form
                onSubmit={singUpWitnEmailAndPassword}
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
                <div>
                    <label>
                        Repeat password:
                        <input
                            type="password"
                            value={passwordRepeat}
                            placeholder="password"
                            onChange={createInputChangeHandler(
                                setPasswordRepeat
                            )}
                            className="sign-in-input"
                        />
                    </label>
                </div>
                <div className="sign-in-button-div">
                    <input
                        className="sign-in-button"
                        type="submit"
                        value="Sign up"
                    />
                </div>
                <span>{errorMessage}</span>
            </form>
            <div className="dont-have-account-div">
                Already have an account?{" "}
                <span onClick={() => navigate("sign_in")}>
                    Sign in for Router...
                </span>
            </div>
        </div>
    );
};
