import {
    AppBar,
    IconButton,
    Toolbar,
    Typography,
    Slide,
    useScrollTrigger,
    Button,
    Avatar,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos"
import { useStore } from "react-redux";
import cookies from 'react-cookies';
import { clearAuthLS } from '../../helpers/localStorage'
import { getAuthLS, LS_KEY } from '../../helpers/localStorage';
import _ from 'lodash'
const rolePaths = {
    UNG_VIEN: 'UNG VIEN',
    TUYEN_DUNG: 'TUYEN DUNG',
}
export default function ({ classes, open, setOpen, mainRef }) {
    const trigger = useScrollTrigger({ target: mainRef });
    const history = useHistory();
    const store = useStore();
    const auth = store.getState();

    const check = getAuthLS(LS_KEY.AUTH_TOKEN)

    let user = auth;
    if (cookies.load("user") != null) {
        user = cookies.load("user")
    };

    // xóa token tại localStorage khi đăng xuất
    const signOut = () => {
        clearAuthLS();
    }

    // chọn đăng xuất
    const handleLogout_click = () => {
        cookies.remove("user");
        cookies.remove("access_token");
        signOut();
        history.push('/');
        window.location.reload();
    };

    // chuyển trang khi chọn đăng nhập
    const handleLogin_click = (path) => {
        history.push(path);
    }

    const pathUser = () => {
        if (check === rolePaths.UNG_VIEN) {
            return '/ProfileCan'
        } else if (check === rolePaths.TUYEN_DUNG) {
            return '/HomeRecruiter'
        } else {
            return '/Dashboard'
        }
    }

    const AvatarPath = () => {
        if (_.isNil(user.nguoi_dung.anh_dai_dien)) {
            return (
                <Button onClick={() => handleLogin_click(`${pathUser()}`)}>
                    {user.nguoi_dung.username}
                </Button>
            )
        } else {
            const path = user.nguoi_dung.anh_dai_dien.includes('http://127.0.0.1:8000') ? user.nguoi_dung.anh_dai_dien : `http://127.0.0.1:8000${user.nguoi_dung.anh_dai_dien}`;
            return (
                <Button >
                    <Avatar onClick={() => handleLogin_click(`${pathUser()}`)} alt={user.username}
                        src={path} />
                </Button>
            )
        }
    }

    let userComponet = <>
        <Button onClick={() => handleLogin_click('/Login')} > <Typography variant="subtitle1" style={{ textTransform: 'none' }}>Đăng nhập</Typography> </Button>
        <Button onClick={() => handleLogin_click('/Register')} > <Typography variant="subtitle1" style={{ textTransform: 'none' }}>Đăng Ký</Typography> </Button>
    </>
    if (user != null) {
        if (user.nguoi_dung.username != null)
            userComponet = <>
                <AvatarPath />
                <Button onClick={handleLogout_click}> <Typography variant="subtitle1" style={{ textTransform: 'none' }}>Đăng xuất</Typography> </Button>
            </>
    }

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <div className="block-left">
                        <Button>
                            <Typography variant="h5" noWrap className="logo-text" onClick={() => handleLogin_click('/')}>
                                FIND JOB APP
                            </Typography>
                        </Button>
                    </div >

                    <div className="block-right " >
                        {userComponet}
                    </div>
                </Toolbar>
            </AppBar>
        </Slide>
    );
}