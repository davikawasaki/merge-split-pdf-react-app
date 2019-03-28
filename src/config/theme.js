import { createMuiTheme} from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import red from '@material-ui/core/colors/red';

// A theme with custom primary and secondary color.
// It's optional.
const theme = {
    palette: {
        primary: {
            light: indigo[300],
            main: indigo[500],
            dark: indigo[700],
        },
        secondary: {
            light: red[300],
            main: red[500],
            dark: red[700],
        }
    },
    typography: {
        useNextVariants: true,
    },
};

export default createMuiTheme(theme);