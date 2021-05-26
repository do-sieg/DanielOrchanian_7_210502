import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Error404 from './pages/Error404';
import Home from './pages/Home';
import Profile from './pages/Profile';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/profile" component={Profile} />
                <Route component={Error404} />
            </Switch>
        </BrowserRouter>
    );
}