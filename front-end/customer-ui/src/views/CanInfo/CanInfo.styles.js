import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    title: {
        marginBottom: '25px'
    },
    tool: {
        margin: '25px',
        textAlign: 'center'
    },
    toolText: {
        marginLeft: '8px',
    },
    text: {
        marginBottom: '10px'
    },
    submit: {
        fontSize: '17px',
        marginLeft: '8px',
        marginBottom: '20px',
    },
    loading: {
        color: 'white',
    },
    tag: {
        paddingTop: '10px'
    },
    tagItem: {
        marginLeft: '10px',
        marginTop: '10px',
    },
    formControl: {
        margin: theme.spacing(1),
        width: '100%'
    },
    avatar: {
        width: '100%',
        backgroundColor: '#d9e0e6',
    },
    media: {
        height: 280,
    },
    linkCV: {
        fontSize: '22px',
        marginLeft: '15px',
    },
}));