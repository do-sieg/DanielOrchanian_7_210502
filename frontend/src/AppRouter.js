
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Error404 from './pages/Error404';
import Home from './pages/Home';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route component={Error404} />
            </Switch>
        </BrowserRouter>
    );
}