import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    block: {
        padding: '20px',
    },
    titleInfo: {
        padding: '15px',
        marginTop: '15px',
        textAlign: 'center'
    },
    search: {
        height: '56px',
        width: '56px'
    },
    search2: {
        height: '45px',
        marginBottom: '20px'
    },
    icon: {
        fontSize: '36px'
    },
    card: {
        // padding: '15px',
        width: '100%',
        height: '250px',
        backgroundColor: '#f5f5df'
    },
    pagination: {
        float: 'right',
        margin: 'auto',
    },
    text: {
        marginTop: '10px'
    },
    text2: {
        marginBottom: '10px'
    },
}));