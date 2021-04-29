import { SignInPage } from "./components/auth/sign-in-page";
import { SignUpPage } from "./components/auth/sign-up-page";
import { MainPage } from "./components/main-page";

export const ROUTES = {
    "/sign_in": (props: { [k: string]: any }) => (
        <SignInPage auth={props.auth} database={props.database} />
    ),
    "/sign_up": (props: { [k: string]: any }) => (
        <SignUpPage auth={props.auth} database={props.database} />
    ),
    "/router": (props: { [k: string]: any }) => (
        <MainPage auth={props.auth} database={props.database} />
    ),
    // "/table/:gameType/:tableId": (props: { [k: string]: any }) => (
    //     <TableContainer
    //         auth={props.auth}
    //         database={props.database}
    //         gameTypeStr={props.gameType}
    //         tableId={props.tableId}
    //     />
    // ),
};
