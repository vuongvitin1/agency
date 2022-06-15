import React from 'react';
import {
    Typography,
    makeStyles,
    FormControl
} from '@material-ui/core';
import Select from 'react-select';

const useStyles = makeStyles((theme) => ({
    tagForm: {
        width: '100%',
        fontSize: '22px',
    }
}));

export default function MultipleSelect({tag_type, label, tags, userTag, onChange = () => { } }) {
    const classes = useStyles();

    return (
        <div>
            <FormControl className={classes.tagForm}>
                <Typography variant="body1">{label}</Typography>
                <Select
                    closeMenuOnSelect={false}
                    isMulti
                    name={tag_type}
                    options={tags}
                    value={userTag}
                    onChange={onChange}
                />
            </FormControl>
        </div>
    );
}
