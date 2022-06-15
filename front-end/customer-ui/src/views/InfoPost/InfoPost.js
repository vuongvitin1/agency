import React, { useEffect, useState } from 'react';
import {
    Grid,
    Typography,
    Button,
    Link,
    Container,
    Chip,
    Divider,
    TextField,
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import API, { endpoints } from '../../helpers/API';
import { useStyles } from './InfoPost.styles';
import cookies from 'react-cookies';
import { useHistory, useLocation } from 'react-router';
import { RoutePaths } from '../../routes/public-route';
import moment from "moment";
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

const CONG_VIEC = {
    id: 'job',
    label: 'Công việc'
}

const VAI_TRO = {
    UNG_VIEN: "UNG VIEN",
    TUYEN_DUNG: "TUYEN DUNG",
    QUAN_LY: "QUAN LY",
};
const TRANG_THAI_UNG_TUYEN = {
    DUOC_CHAP_NHAN: "CHAP NHAN",
    BI_TU_CHOI: "TU CHOI",
    CHO_XU_LY: "CHO XU LY",
};

export default function InfoPostPage() {
    const classes = useStyles();
    const history = useHistory();
    const { state } = useLocation();
    const [user, setUser] = useState({
        ...cookies.load("user"),
    });

    // Gọi khi nút Nộp đơn ứng tuyển được nhấn
    const applyOffer = (jobId = state.post.id, userId = 0) => {
        // Kiểm tra trạng thái đăng nhập có hợp lệ hay không
        if (!user.hasOwnProperty("nguoi_dung")) {
            alert("Bạn cần đăng nhập tài khoản Ứng viên để thực hiện nộp đơn ứng tuyển!");
            return;
        } else if (user.nguoi_dung.vai_tro === VAI_TRO.TUYEN_DUNG) {
            alert("Nhà tuyển dụng không được thực hiện thao tác này!")
            return;
        } else if (user.nguoi_dung.vai_tro === VAI_TRO.QUAN_LY) {
            alert("Quản lý không được thực hiện thao tác này!")
            return;
        }

        userId = user.nguoi_dung.id

        // Nếu hợp lệ thì tiến hành request tạo dữ liệu dưới csdl
        const apply = async () => {
            try {
                const create = await API.post(endpoints["ung-tuyen"], {
                    viec_lam: jobId,
                    ung_vien: userId,
                    trang_thai_ho_so: TRANG_THAI_UNG_TUYEN.CHO_XU_LY,
                    ung_vien_nop_don: true,
                    nguoi_yeu_cau: VAI_TRO.UNG_VIEN,
                })
                // Nếu tạo bản ghi dưới csdl thành công
                if (create.status === 201)
                    alert("Nộp đơn ứng tuyển thành công!");
                else if (create.status === 200) {
                    alert("Xác nhận đã nhận công việc thành công!");
                    history.push(RoutePaths.ProfileCan);
                } else if (create.status === 409)
                    alert("Bạn đã nộp đơn ứng tuyển công việc này trước đó rồi, hoặc công việc đã được gửi đến bạn!")

            } catch (ex) {
                // console.log(ex.response.status)
                if (ex.response.status === 409)
                    alert("Bạn đã nộp đơn ứng tuyển công việc này trước đó rồi, hoặc công việc đã được gửi đến bạn!")
            }
        };
        apply()
    }

    // Render icon ngành nghề này kia gọn hơn
    const infoDetail = (item) => {
        return (
            <div>
                <Typography variant="body1" className={classes.tag}>{item.title}</Typography>
                {(item.arr).length > 0
                    ? (item.arr).map(i => {
                        return <Chip className={classes.tagItem} label={i.ten} color="primary" />
                    })
                    : <span className="text-muted">Không có bản ghi</span>
                }
            </div>
        );
    }

    // Format tiền lương ra định dạng VNĐ đẹp hơn
    const currency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
    }

    const back = () => {
        history.push(RoutePaths.ProfileCan);
    }

    const hanleNameCompany = () => {
        const _path = RoutePaths.RecruInfo.replace(':id', state.post.nha_tuyen_dung.nguoi_dung.id)
        history.push(_path, {
            tuyendungId: state.post.nha_tuyen_dung.nguoi_dung.id,
            tuyendungAvatar: state.post.nha_tuyen_dung.nguoi_dung.anh_dai_dien ? state.post.nha_tuyen_dung.nguoi_dung.anh_dai_dien : null
        });
        // console.info(state.post.nha_tuyen_dung.nguoi_dung)
    }

    // useEffect(() => {
    //     console.info(_.isUndefined(state))
    // }, []);

    if (_.isUndefined(state)) {
        return <Redirect to='/' />
    } else
        return (
            <Container maxWidth="lg">
                <Grid container spacing={10} xs={12}>
                    <Grid item xs={8}>
                        <Typography variant="h3" className={classes.title}>{state.post.tieu_de}</Typography>
                        <Typography className={classes.text} variant="h6" >Lương: {state.post.luong === 0 ? 'Thỏa thuận' : currency(state.post.luong)}</Typography>
                        {/* <Typography className={classes.text} variant="body1" >{state.post.noi_dung}</Typography> */}
                        <TextField
                            // variant="outlined"
                            fullWidth
                            // label='Giới thiệu'
                            readOnly
                            multiline
                            rows={25}
                            value={state.post.noi_dung}
                        />
                        <Grid container spacing={0} xs={12}>
                            {/* <Grid item xs={4}>
                            <Button onClick={() => back()}
                                fullWidth
                                className={classes.submit}
                                color='primary'
                                variant="contained">
                                Quay về
                            </Button>
                        </Grid> */}
                            <Grid item xs={12}>
                                <Button onClick={() => applyOffer()}
                                    fullWidth
                                    className={classes.submit}
                                    color='primary'
                                    variant="contained">
                                    Nộp đơn ứng tuyển
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={4}>
                        <Typography className={classes.text} variant="body1" > Đăng ngày: {moment(state.post.ngay_tao).format("DD-MM-YYYY").toString()}</Typography>
                        {user.nguoi_dung ? (
                            <Typography className={classes.text} variant="h5" onClick={() => hanleNameCompany()}><Link>{state.post.nha_tuyen_dung.ten_cong_ty}</Link></Typography>
                        ) : (
                            <Typography className={classes.text} variant="h5">{state.post.nha_tuyen_dung.ten_cong_ty}</Typography>
                        )}
                        <Typography className={classes.text} variant="body1" >Email: {state.post.nha_tuyen_dung.nguoi_dung.email}</Typography>
                        <Typography className={classes.text} variant="body1" >Số điện thoại: {state.post.nha_tuyen_dung.nguoi_dung.so_dien_thoai}</Typography>
                        <Typography className={classes.text} variant="body1" >Địa chỉ: {state.post.nha_tuyen_dung.dia_chi}</Typography>
                        <Typography className={classes.text} variant="body1" >Đánh giá: {'   '}
                            <Rating value={state.post.nha_tuyen_dung.diem_danh_gia_tb} precision={0.5} readOnly size="large" />
                        </Typography>
                        <Grid container spacing={4} xs={12}>
                            <Grid item xs={12}>
                                <Divider />
                                {infoDetail({ title: 'Bằng cấp', arr: state.post.bang_cap })}
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                                {infoDetail({ title: 'Ngành nghề', arr: state.post.nganh_nghe })}
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                                {infoDetail({ title: 'Kinh nghiệm', arr: state.post.kinh_nghiem })}
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                                {infoDetail({ title: 'Kỹ năng', arr: state.post.ky_nang })}
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                                {infoDetail({ title: 'Phúc lợi', arr: state.post.phuc_loi })}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        )
}