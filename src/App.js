import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from './config/theme';
import Home from './components/pages/Home'

const App = () => {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            <Home/>
        </MuiThemeProvider>
    );
};

export default App;