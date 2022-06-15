import React from 'react';
import {
    TextField,
} from '@material-ui/core';
import _ from "lodash";

export default function AppTextField({ field, value, multiline, rows, onChange = () => { } }) {
    const ext = {};
    if (multiline) {
        ext['multiline'] = true;
        ext['rows'] = rows || 5;
    }

    return (
        <>
            <TextField
                autoComplete="off"
                variant="outlined"
                required={_.get(field, ['required'], false)}
                {...ext}
                type={field.type || 'text'}
                fullWidth
                id={field.id}
                name={field.id}
                label={field.label}
                InputLabelProps={{
                    shrink: true,
                }}
                value={value}
                onChange={onChange}
            />
        </>
    );
}