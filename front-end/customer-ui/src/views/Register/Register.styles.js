import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  linkRole: {
    color: 'blue',
    marginTop: '20px',
    // alignSelf: 'self-end',
    // justifyContent: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
    textAlign: '-webkit-center'
  },
  formBody: {
    // justifyContent: 'center',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    fontSize: '22px'
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
  loading: {
    color: 'white',
  },
  note: {
    left: 'auto',
  }
}));
