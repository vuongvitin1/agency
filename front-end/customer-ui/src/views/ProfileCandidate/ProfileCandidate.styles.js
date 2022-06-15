import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    fontSize: '22px',
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
  titleInfo: {
    padding: '15px',
  },
  titleInfo2: {
    textAlign: 'center',
    padding: '15px',

  },
  loading: {
    color: 'white',
  },
  card: {
    marginLeft: '13px',
    width: '100%',
    marginBottom: '5px',
    backgroundColor: '#e0f7d1'
  },
  linkCV: {
    fontSize: '22px',
    marginLeft: '15px',
  },
}));



