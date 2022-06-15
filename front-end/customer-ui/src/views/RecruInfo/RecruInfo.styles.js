import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    title: {
        marginBottom: '25px',
        marginTop: '20px'
    },
    title2: {
        marginBottom: '25px',
        marginTop: '40px'
    },
    content: {
        marginTop: '25px',
        paddingBottom: '15px',
    },
    text: {
        marginTop: '10px'
    },
    text2: {
        marginBottom: '20px',
        marginTop: '20px',
    },
    submit: {
        fontSize: '17px',
        marginLeft: '8px',
        marginBottom: '20px',
    },
    loading: {
        color: 'white',
    },
    formControl: {
        margin: theme.spacing(1),
        width: '100%'
    },
    boxRight: {
        marginTop: '30px',
        border: '3px solid',
        padding: '12px',
        borderRadius: '3%'
    },
    card: {
        width: '100%',
        marginBottom: '5px',
        backgroundColor: '#e0f7d1'
    },
    cardRate: {
        width: '100%',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#e5f5c6'
    },
    rate: {
        padding: '15px'
    },
    formControl: {
        margin: theme.spacing(1),
        width: '100%'
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    btn: {
        marginTop: '10px'
    },
    avatar: {
        width: '100%',
        backgroundColor: '#d9e0e6',
    },
    media: {
        height: 280,
    },
    alert: {
        marginTop: '22px'
    },
}));