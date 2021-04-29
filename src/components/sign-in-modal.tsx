import { SignInPage } from "./auth/sign-in-page";
import firebase from "../firebase/firebase";

interface Props {
    closeModal: () => void;
    auth: firebase.auth.Auth;
    database: firebase.database.Database;
}

export const SignInModal = (props: Props) => {
    const { closeModal, auth, database } = props;
    return (
        <div className="modal-wrapper">
            <div className="modal-header">
                <h3>Sign in to maps</h3>
            </div>
            <SignInPage auth={auth} database={database}></SignInPage>
            <div>
                <button className="btn-cancel" onClick={closeModal}>
                    CANCEL
                </button>
            </div>
        </div>
    );
};
