import React, { createRef, useState } from 'react';
import {
    TextField,
    Button,
    CssBaseline,
    CircularProgress,
    Link,
    Grid,
    Typography,
    Container,
} from '@material-ui/core';
import { useStyles } from './Register.styles';
import { ACCOUNT } from './Register.const';
import API, { endpoints } from '../../helpers/API';
import { useHistory } from 'react-router';
import { PublicRoutes } from '../../routes/public-route';
import useSubmitForm from '../../helpers/CustomHooks';
import { nguoi_dung, vai_tro } from '../../consts/models';
import { AlertSuccess, AlertWarning } from '../../components/AppAlert';

export default function Register() {
    const classes = useStyles();
    const avatar = createRef();
    const history = useHistory()
    const [openError, setOpenError] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [messSuc, setMessSuc] = useState('');
    const [messErr, setMessErr] = useState('');

    const [loading, setLoading] = useState(false);
    const [roleName, setRoleName] = useState(vai_tro.ung_vien);

    const register = async () => {
        const form = new FormData();
        console.info('ava', avatar)
        if (inputs.password === inputs.confirm_password) {
            for (let k in inputs) {
                if (k !== "confirm_password") form.append(k, inputs[k]);
            }
            //Avatar da co chua?
            if (avatar.current.files.length !== 0) {
                form.append("anh_dai_dien", avatar.current.files[0]);
            }
            form.append(nguoi_dung.vai_tro, roleName);

            // for (var key of form.keys()) {
            //     console.log(key, form.get(key));
            // }

            try {
                let res = await API.post(endpoints["nguoi-dung"], form, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (res.status === 201) {
                    setOpenSuccess(true);
                    setMessSuc('Đăng ký tài khoản thành công');
                    setOpenError(false);
                } else {
                    setOpenError(true);
                    setMessErr('Đã xảy ra lỗi');
                }
            } catch (err) {
                console.log("error:", err);
                setOpenError(true);
                setMessErr('Đã xảy ra lỗi');
            }
        } else {
            setOpenError(true);
            setMessErr('Lỗi xác nhận mật khẩu');
        }
    }

    const onSubmit = async () => {
        // setLoading(true);
        // setTimeout(() => {
        //     register();
        //     setLoading(false);
        // }, 1000);
        register();

    }

    const { inputs, handleInputChange, handleSubmit } = useSubmitForm(onSubmit);

    // const onKeyDown = (e) => {
    //     if (e.key === 'Enter') {
    //         onSubmit();
    //     }
    // }

    const changeRole = () => {
        if (roleName === vai_tro.ung_vien) {
            setRoleName(vai_tro.nha_tuyen_dung);
        } else {
            setRoleName(vai_tro.ung_vien)
        }
    }

    const handleCloseSuc = (event, reason) => {
        if (reason === 'clickaway') {
            setMessSuc(false);
            const _path = PublicRoutes.Login.path;
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
        <div>
            <Container component="main" maxWidth="md">
                <CssBaseline />
                <div className={classes.paper}>
                    {roleName === vai_tro.ung_vien ?
                        (
                            <>
                                <Typography variant="h3">Đăng ký tài khoản ứng viên</Typography>
                                <Link href="#" onClick={changeRole} variant="body1" className={classes.linkRole}>Đăng ký tài khoản nhà tuyển dụng</Link>
                            </>
                        ) : (
                            <>
                                <Typography variant="h3">Đăng ký tài khoản nhà tuyển dụng</Typography>
                                <Link href="#" onClick={changeRole} variant="body1" className={classes.linkRole}>Đăng ký tài khoản ứng viên</Link>
                            </>
                        )
                    }
                    <form className={classes.form} onSubmit={handleSubmit}>
                        {/* Tài khoản */}
                        <Grid container xs={6} spacing={2} className={classes.formBody}>
                            <Grid item xs={ACCOUNT.last_name.xs}>
                                <TextField
                                    autoComplete="off"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id={ACCOUNT.last_name.id}
                                    name={ACCOUNT.last_name.id}
                                    label={ACCOUNT.last_name.label}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={handleInputChange}
                                    value={inputs.last_name}
                                />
                            </Grid>
                            <Grid item xs={ACCOUNT.first_name.xs}>
                                <TextField
                                    autoComplete="off"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id={ACCOUNT.first_name.id}
                                    name={ACCOUNT.first_name.id}
                                    label={ACCOUNT.first_name.label}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={handleInputChange}
                                    value={inputs.first_name}
                                />
                            </Grid>
                            <Grid item xs={ACCOUNT.email.xs}>
                                <TextField
                                    autoComplete="off"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    type={ACCOUNT.email.type}
                                    id={ACCOUNT.email.id}
                                    name={ACCOUNT.email.id}
                                    label={ACCOUNT.email.label}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={handleInputChange}
                                    value={inputs.email}
                                />
                            </Grid>
                            <Grid item xs={ACCOUNT.so_dien_thoai.xs}>
                                <TextField
                                    autoComplete="off"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    type={ACCOUNT.so_dien_thoai.type}
                                    id={ACCOUNT.so_dien_thoai.id}
                                    name={ACCOUNT.so_dien_thoai.id}
                                    label={ACCOUNT.so_dien_thoai.label}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={handleInputChange}
                                    value={inputs.so_dien_thoai}
                                />
                            </Grid>
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
                            <Grid item xs={ACCOUNT.confirm_password.xs}>
                                <TextField
                                    autoComplete="off"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    type={ACCOUNT.confirm_password.type}
                                    id={ACCOUNT.confirm_password.id}
                                    name={ACCOUNT.confirm_password.id}
                                    label={ACCOUNT.confirm_password.label}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={handleInputChange}
                                    value={inputs.confirm_password}
                                />
                            </Grid>
                            {/* ảnh */}
                            <Grid item xs={12} >
                                <input
                                    accept="image/*"
                                    className={classes.input}
                                    id="avatar"
                                    multiple
                                    type="file"
                                    ref={avatar}
                                    // required
                                    // name='avatar'
                                />
                                <label htmlFor="avatar">
                                    <Button variant="contained" color="primary"
                                        maxWidth component="span">
                                        Ảnh đại diện
                                    </Button>
                                </label>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    className={classes.submit}
                                // onClick={onSubmit}
                                >
                                    {loading ?
                                        <CircularProgress className={classes.loading} />
                                        : 'Đăng ký'
                                    }
                                </Button>
                            </Grid>
                            <Grid item >
                                <Link href="/Login" variant="body2">
                                    Đã có tài khoản? Đăng nhập
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>

                {/* xử lý thông báo */}
                <AlertSuccess content={messSuc} open={openSuccess} handleClose={handleCloseSuc} />
                <AlertWarning content={messErr} open={openError} handleClose={handleClose} />
            </Container>
        </div>
    );
}
