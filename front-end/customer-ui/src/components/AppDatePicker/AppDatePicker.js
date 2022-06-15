import React, { createRef, useEffect, useState } from 'react';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

export default function AppDatePicker({ field, value, onChange = (date) => { } }) {
    return (
        <>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    disableToolbar
                    format="dd/MM/yyyy"
                    id={field.id}
                    label={field.label}
                    value={value}
                    onChange={onChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>
        </>
    );
}