import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        marginBottom: '25px'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        textAlign: '-webkit-center'
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        fontSize: '22px'
    },
    loading: {
        color: 'white',
    },
}));