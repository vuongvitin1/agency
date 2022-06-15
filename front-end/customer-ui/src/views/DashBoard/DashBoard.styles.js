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
    titleInfo2: {
        padding: '15px',
        marginTop: '25px',
        // textAlign: 'center'
    },
    bar: {
        backgroundColor: '#d9fab6'
    },
    cardBox: {
        width: '100%',
        backgroundColor: '#f5f5df',
        borderRadius: '3%',
        padding: '30px'
    },
    card: {
        width: '100%',
        backgroundColor: '#c9ebff',
        borderRadius: '3%',
        margin: '10px'
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
    boxRight: {
        border: '3px solid',
        borderRadius: '4%'
    },
    formControl: {
        marginTop: '22px',
        width: '100%'
    },
    media: {
        height: 120,
        width: 120,
        margin: '20px',
        borderRadius: '10%',
    },
}));