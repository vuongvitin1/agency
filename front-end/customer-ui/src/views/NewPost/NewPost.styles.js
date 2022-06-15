import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        fontSize: '22px',
        marginBottom: '50px',
    },
    search: {
        fontSize: '22px',
        marginLeft: '8px',
        marginBottom: '20px',
    },
    card: {
        marginLeft: '13px',
        width: '100%',
    },
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
    title: {
        padding: '15px',
        textAlign: 'center'
    },
    loading: {
        color: 'white',
    },
}));



