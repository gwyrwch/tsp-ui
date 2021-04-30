import "./App.css";
import { initializeFirebase } from "./firebase/firebase";
import { NotFound } from "./components/not-found";
import { useRoutes } from "raviger";
import { ROUTES } from "./routes";

const App = () => {
    const { auth, database } = initializeFirebase();
    const routeResult = useRoutes(ROUTES, {
        routeProps: { auth: auth, database: database },
    });
    return <>{routeResult || <NotFound />}</>;
};

export default App;
