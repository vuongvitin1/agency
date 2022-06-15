import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { TYPE_ALERT } from "../../consts/field";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    note: {
        left: 'auto'
    }
}));

export function AlertSuccess({ content, open, handleClose = () => { } }) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Snackbar className={classes.note} open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">{content}</Alert>
            </Snackbar>
        </div>
    );
}

export function AlertWarning({ content, open, handleClose = () => { } }) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Snackbar className={classes.note} open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="warning">{content}</Alert>
            </Snackbar>
        </div>
    );
}