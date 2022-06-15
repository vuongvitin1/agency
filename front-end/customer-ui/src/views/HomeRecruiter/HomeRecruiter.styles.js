import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    fontSize: '22px',
    marginBottom: '50px',
  },
  search: {
    fontSize: '22px',
    // marginLeft: '8px',
    marginBottom: '20px',
  },
  card: {
    // marginLeft: '8px',
    width: '100%',
    backgroundColor: '#e0f7d1'
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
    marginTop: '15px'
  },
  loading: {
    color: 'white',
  },
  note: {
    padding: '10px',
    fontSize: '20px',
    marginLeft: '30px',
    backgroundColor: '#f5f5df'
  },
  cardRate: {
    width: '100%',
    padding: '15px',
    marginBottom: '7px',
    backgroundColor: '#e5f5c6'
  },
  text: {
    marginTop: '10px'
  },
}));



