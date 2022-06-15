import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

const useStyles = makeStyles((theme) => ({
    formControl: {
        // margin: theme.spacing(1),
        width: '100%'
    },
}));

export default function AppSelectSingle({ tags, field, onChange = () => { } }) {
    const classes = useStyles();

    return (
        <div>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor={`outlined-${field.id}-native-simple`}>{field.label}</InputLabel>
                <Select
                    native
                    onChange={onChange}
                    label={field.label}
                    inputProps={{
                        name: field.id,
                        id: `outlined-${field.id}-native-simple`,
                    }}
                >
                    <option aria-label="None" value="" />
                    {tags.map((t, idx) => {
                        return (
                            <option key={idx + t.id} value={t.id}>{t.ten}</option>
                        );
                    })}
                </Select>
            </FormControl>
        </div>
    );
}
