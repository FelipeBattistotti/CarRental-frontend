import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import Login from './pages/Login';
import Vehicles from './pages/Vehicles';

export default function Routes () {
    return (
        <ToastProvider autoDismiss autoDismissTimeout={4000}>
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={Login} />
                    <Route path="/vehicles" component={Vehicles} />
                </Switch>
            </BrowserRouter>
        </ToastProvider>
    );
}