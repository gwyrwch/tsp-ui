import firebase from "./firebase";

export const signInToFirebaseWithGoogle = async (auth: firebase.auth.Auth) => {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);
    if (!result.user) {
        console.debug("auth with google failed");
    }
};
