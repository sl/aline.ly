import React from 'react';
import { Switch, Route } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Home from './Home';
import InLine from './InLine';
import AdminLogin from './AdminLogin';
import Admin from './Admin';
import Create from './Create';

injectTapEventPlugin();

const App = () => (
  <MuiThemeProvider>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/login' component={AdminLogin} />
      <Route path='/admin' component={Admin} />
      <Route path='/create' component={Create} />
      <Route path='/:lineid' component={InLine} />
    </Switch>
  </MuiThemeProvider>
);

export default App;
