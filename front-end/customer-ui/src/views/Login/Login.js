import React, { useState } from 'react';
import {
    Button,
    CssBaseline,
    TextField,
    Link,
    Grid,
    Typography,
    Container,
    CircularProgress,
} from '@material-ui/core';
import useSubmitForm from '../../helpers/CustomHooks';
import API, { endpoints } from '../../helpers/API';
import cookies from 'react-cookies';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useStyles } from "./Login.styles";
import { setAuthLS, clearAuthLS, LS_KEY } from "../../helpers/localStorage";
import { AlertSuccess, AlertWarning } from '../../components/AppAlert';
import { ACCOUNT } from './Login.const';
import { PublicRoutes } from '../../routes/public-route';

export default function Login() {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [messSuc, setMessSuc] = useState('');
    const [messErr, setMessErr] = useState('');

    const signInSucess = (role) => {
        setAuthLS(LS_KEY.AUTH_TOKEN, role);
    }

    const Login = async () => {
        try {
            clearAuthLS();
            const info = await API.get(endpoints['oauth2-info']);
            const res = await API.post(endpoints['dang-nhap'], {
                client_id: info.data.client_id,
                client_secret: info.data.client_secret,
                username: inputs.username,
                password: inputs.password,
                grant_type: "password",
            })

            cookies.save("access_token", res.data.access_token)

            let user = await API.get(endpoints['nguoi-dung-hien-tai'], {
                headers: {
                    Authorization: `Bearer ${cookies.load("access_token")}`
                }
            })
            if (user.status === 200) {
                setOpenSuccess(true);
                setMessSuc('Đăng nhập thành công');
                setOpenError(false);
                cookies.save("user", user.data);
                signInSucess(user.data.nguoi_dung.vai_tro);
                dispatch({
                    "type": "login",
                    "payload": user.data
                })
            } else {
                setOpenError(true);
                setMessErr('Sai tài khoản hoặc mật khẩu');
            }


        } catch (err) {
            setOpenError(true);
            setMessErr('Đã xảy ra lỗi');
            console.info(err)
        }
    }

    const onSubmit = async () => {
        setLoading(true);
        setTimeout(() => {
            Login();
            setLoading(false);
        }, 1000);
    }

    const { inputs, handleInputChange, handleSubmit } = useSubmitForm(onSubmit);

    // xử lý tắt thông báo
    const handleCloseSuc = (event, reason) => {
        if (reason === 'clickaway') {
            setMessSuc(false);
            const _path = PublicRoutes.Home.path;
            history.push(_path);
            window.location.reload();
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    };

    return (
        <Container component="main" maxWidth="md" >
            <CssBaseline />
            <div className={classes.paper}>
                <Typography variant="h3" className={classes.title}>
                    Đăng nhập tài khoản
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container xs={5} spacing={2} >
                        <Grid item xs={ACCOUNT.username.xs}>
                            <TextField
                                autoComplete="off"
                                variant="outlined"
                                required
                                fullWidth
                                id={ACCOUNT.username.id}
                                name={ACCOUNT.username.id}
                                label={ACCOUNT.username.label}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={handleInputChange}
                                value={inputs.username}
                            />
                        </Grid>
                        <Grid item xs={ACCOUNT.password.xs}>
                            <TextField
                                autoComplete="off"
                                variant="outlined"
                                required
                                fullWidth
                                type={ACCOUNT.password.type}
                                id={ACCOUNT.password.id}
                                name={ACCOUNT.password.id}
                                label={ACCOUNT.password.label}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={handleInputChange}
                                value={inputs.password}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                {loading ?
                                    <CircularProgress className={classes.loading} />
                                    : 'Đăng nhập'
                                }
                            </Button>
                        </Grid>
                        <Grid item>
                            <Link href="/Register" variant="body2">
                                {"Bạn chưa có tài khoản? Đăng ký"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>

            {/* xử lý thông báo */}
            <AlertSuccess content={messSuc} open={openSuccess} handleClose={handleCloseSuc} />
            <AlertWarning content={messErr} open={openError} handleClose={handleClose} />
        </Container>
    );
}