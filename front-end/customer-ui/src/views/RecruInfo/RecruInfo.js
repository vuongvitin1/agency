import React, { useState, useEffect } from 'react';
import {
    Grid,
    Typography,
    Button,
    Container,
    Box,
    Divider,
    Card,
    CardActionArea,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    CardMedia,
    TextField,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Rating from '@material-ui/lab/Rating';
import API, { endpoints } from '../../helpers/API';
import { useStyles } from './RecruInfo.styles';
import cookies from 'react-cookies';
import { useHistory, useLocation } from 'react-router';
import { RoutePaths } from '../../routes/public-route';
import AppTextField from '../../components/AppTextField';
import _ from 'lodash';
import { Redirect } from 'react-router-dom';

export default function RecruInfoPage() {
    const classes = useStyles();
    const history = useHistory();
    const { state } = useLocation();
    const [nguoidung, setNguoidung] = useState({
        ...cookies.load("user"),
    });

    // Lấy thông tin chi tiết của nhà tuyển dụng (bảng nha_tuyen_dung)
    const [detail, setDetail] = useState({});
    // Các bài đánh giá của nhà tuyển dụng
    const [ratings, setRatings] = useState([]);
    // Id của trang nhà tuyển dụng đang xem
    let hiringid = 0;
    if (_.isUndefined(state)) {
        hiringid = 0
    } else {
        hiringid = state.tuyendungId
    }

    // const hiringid = state.tuyendungId.id ? state.tuyendungId.id : state.RecruInfo.id;
    // const hiringid = state.RecruInfo.id;
    // const hiringid = 17;

    // Phương thức lấy dữ liệu các bài đánh giá theo id nhà tuyển dụng
    const getRating = async (hiringId = hiringid, page = 1) => {
        const rating = await API.get(endpoints["nha-tuyen-dung-danh-gia"](hiringId) + `?page=${page}`)
        setRatings(rating.data);
    };

    // Phương thức lấy thông tin chi tiết nhà tuyển dụng
    const getDetail = async () => {
        const detail = await API.get(endpoints["nha-tuyen-dung-chi-tiet"](hiringid));
        setDetail(detail.data);
    };

    // Lấy các việc làm dựa của nhà tuyển dụng này (gợi ý)
    const [goiYViecLam, setgoiYViecLam] = useState([]);
    const getGoiYViecLam = async () => {
        const res = await API.get(endpoints["nha-tuyen-dung-viec-lam"](hiringid));
        setgoiYViecLam(res.data);
    }

    // Lấy bài đánh giá của ứng viên đang đăng nhập ở trang công việc hiện tại
    const [danhGiaCuaUngVien, setDanhGiaCuaUngVien] = useState({});
    // const getUngVienDanhGia = async () => {
    //     const res = await API.get(endpoints['ung-vien-danh-gia'](nguoidung.nguoi_dung.id, hiringid,))
    //     setDanhGiaCuaUngVien(res.data);
    // };
    const getUngVienDanhGia = async () => {
        const res = await API.get(endpoints['tuyen-dung-xem-danh-gia'](hiringid));
        setDanhGiaCuaUngVien(res.data);
    };

    // Lấy danh sách các công việc ứng viên đã ứng tuyển và được chấp nhận để được phép thao tác đánh giá
    const [congViecChapNhan, setCongViecChapNhan] = useState([])
    const getCongViecChapNhan = async () => {
        const res = await API.get(endpoints["viec-lam-duoc-chap-nhan"](nguoidung.nguoi_dung.id, hiringid));
        if ((res.data).length > 0) {
            setCongViecChapNhan(res.data);
            setViecLamId(res.data[0].viec_lam.id)
        }
    }

    // Đăng bài đánh giá, nếu bài đánh giá đã tồn tại thì cập nhật lại, tính lại điểm tb của nhà tuyển dụng
    // Lấy dữ liệu người dùng nhập từ ô input
    const [diemDanhGia, setDiemDanhGia] = useState(0);
    const [noiDungDanhGia, setNoiDungDanhGia] = useState("");
    const [viecLamId, setViecLamId] = useState(0)
    // Tiến hành request lên server cập nhật/tạo bản ghi
    const danhGia = async () => {
        let data = {
            'ung_vien_id': nguoidung.nguoi_dung.id,
            'viec_lam_id': parseInt(viecLamId),
            'nha_tuyen_dung_id': hiringid,
            'noi_dung': noiDungDanhGia,
            'diem_danh_gia': diemDanhGia
        }
        // console.log(data)
        const res = await API.post(endpoints["danh-gia-nha-tuyen-dung"], data)
        if (res.status === 200) {
            alert("Cập nhật bài đánh giá thành công!");
        } else if (res.status === 201) {
            alert("Đăng bài đánh giá thành công!")
        }
        getDetail();
        getRating();
        getUngVienDanhGia();
    }

    // Format tiền lương ra định dạng VNĐ đẹp hơn
    const currency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
    };

    useEffect(() => {
        async function init() {
            await getDetail()
            await getRating()
            await getGoiYViecLam()
            await getUngVienDanhGia()
            await getCongViecChapNhan()
        }
        init()
        console.info(state)
    }, []);

    const denTrangChiTietViecLam = (post) => {
        const _path = RoutePaths.InfoPost.replace(':id', post.id)
        history.push(_path, {
            post: post
        });
    };

    const noidung = {
        id: 'noiDung',
        label: 'Nội dung',
    }

    const AvatarComponent = () => {
        // if (await !_.isNil(detail.nguoi_dung.anh_dai_dien)) {
        //     const path = detail.nguoi_dung.anh_dai_dien.includes('http://127.0.0.1:8000') ? detail.nguoi_dung.anh_dai_dien : `http://127.0.0.1:8000${detail.nguoi_dung.anh_dai_dien}`;
        if (!_.isNil(state.tuyendungAvatar)) {
            const path = state.tuyendungAvatar.includes('http://127.0.0.1:8000') ? state.tuyendungAvatar : `http://127.0.0.1:8000${state.tuyendungAvatar}`;
            return (
                <Card className={classes.avatar}>
                    <CardMedia
                        className={classes.media}
                        image={path}
                        title="Ảnh đại diện"
                    />
                </Card>
            )
        } else {
            return <></>
        }
    }

    if (_.isUndefined(state)) {
        return <Redirect to='/' />
    } else
        return (
            <Container maxWidth="lg">
                <Grid container spacing={10} xs={12}>
                    <Grid item xs={8}>
                        <Typography variant="h3" className={classes.title}>{detail.ten_cong_ty}</Typography>
                        <Divider />
                        {/* <Typography className={classes.content} variant="body1" >{detail.gioi_thieu}</Typography>
                    <Divider /> */}
                        <TextField
                            // variant="outlined"
                            fullWidth
                            className={classes.content}
                            multiline
                            rows={17}
                            value={detail.gioi_thieu}
                        />

                        <Grid container spacing={10} xs={12}>
                            <Grid item xs={12}>
                                {congViecChapNhan.length > 0 ? (
                                    <>
                                        <Typography variant="h5" className={classes.title2}>Viết bài đánh giá</Typography>
                                        <Card className={classes.cardRate}>
                                            <FormControl variant="outlined" className={classes.formControl}>
                                                <InputLabel htmlFor={`outlined-congViecChapNhan-native-simple`}>Công việc được chấp nhận bởi nhà tuyển dụng này</InputLabel>
                                                <Select
                                                    native
                                                    onChange={(event) => {
                                                        setViecLamId(event.target.value);
                                                        console.log(event.target.value);
                                                    }}
                                                    label='Công việc được chấp nhận bởi nhà tuyển dụng này'
                                                    inputProps={{
                                                        name: 'congViecChapNhan',
                                                        id: `outlined-congViecChapNhan-native-simple`,
                                                    }}
                                                >
                                                    {congViecChapNhan.map((item, idx) => {
                                                        return (
                                                            <option value={item.viec_lam.id}>{item.viec_lam.tieu_de}</option>
                                                        );
                                                    })}
                                                </Select>
                                            </FormControl>

                                            <Rating value={diemDanhGia} size="large" name="diemDanhGia" className={classes.rate}
                                                onChange={(event, newValue) => {
                                                    setDiemDanhGia(newValue);
                                                }} />

                                            <AppTextField field={noidung} value={noiDungDanhGia} multiline={true} rows={3}
                                                onChange={(e) => setNoiDungDanhGia(e.target.value)} />
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                onClick={danhGia}
                                                className={classes.btn}
                                            >Đăng/Cập nhật đánh giá</Button>
                                        </Card>
                                    </>
                                ) : (
                                    <Alert className={classes.alert} severity="info">Bạn chưa có công việc nào chấp nhận/được chấp nhận với nhà tuyển dụng này</Alert>
                                )}

                                <Typography variant="h5" className={classes.title2}>Đánh giá từ người dùng</Typography>
                                {danhGiaCuaUngVien.length > 0 ? danhGiaCuaUngVien.map((item, index) => (
                                    <Card className={classes.cardRate}>
                                        <Rating value={item.diem_danh_gia} precision={0.5} readOnly size="large" />
                                        <Typography variant="body2" className={classes.text}>{item.ung_vien.nguoi_dung.first_name} ứng tuyển cho vị trí: {item.viec_lam.tieu_de}</Typography>
                                        <Divider />
                                        <Typography variant="body1" className={classes.text}>{item.noi_dung}</Typography>
                                    </Card>
                                )) : (
                                    <Alert className={classes.alert} severity="info">Chưa có bài đánh giá nào</Alert>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={4}>
                        <Box className={classes.boxRight}>
                            <AvatarComponent />
                            <Typography className={classes.text} variant="body1" >Địa chỉ: {detail.dia_chi}</Typography>
                            <Typography className={classes.text2} variant="body1" >Quy mô: {detail.quy_mo} nhân viên</Typography>
                            <Typography className={classes.text} variant="body1" component='span'>Đánh giá:</Typography>
                            <Rating value={parseFloat(detail.diem_danh_gia_tb)} precision={0.5} readOnly size="large" />
                        </Box>

                        <Box className={classes.boxRight}>
                            <Typography className={classes.title} variant="h4" >Việc làm từ công ty</Typography>
                            {goiYViecLam.length > 0 ? goiYViecLam.map((vieclam, index) => (
                                <>
                                    <Card className={classes.card} onClick={() => denTrangChiTietViecLam(vieclam)}>
                                        <CardActionArea>
                                            <CardContent>
                                                <Typography gutterBottom variant="h6">{goiYViecLam[index].tieu_de}</Typography>
                                                <Typography gutterBottom variant="body1">
                                                    Lương:{" "}
                                                    {goiYViecLam[index].luong === 0 ? "Thương lượng" : currency(goiYViecLam[index].luong)}
                                                </Typography>
                                                <Typography gutterBottom variant="body1">{goiYViecLam[index].noi_dung.substr(0, 80)}. . . </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </>
                            )) : (
                                <Alert severity="info">Không có bản ghi</Alert>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        )
}