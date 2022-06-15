import React, { useEffect, useState } from 'react';
import {
    TextField,
    Typography,
    Grid,
    Container,
    Button,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    InputBase,
    Divider,
    Box,
    CardActions,
    FormControl,
    InputLabel,
    Select,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Pagination, Alert, Rating } from '@material-ui/lab';
import API, { endpoints } from '../../helpers/API';
import { PublicRoutes, PublicRouteNames } from '../../routes/public-route'
import SearchIcon from '@material-ui/icons/Search';
import { useStyles } from './DashBoard.styles';
import AppSelect from '../../components/AppSelect';
import { getAuthLS, clearAuthLS, LS_KEY } from "../../helpers/localStorage";
import cookies from 'react-cookies';
// import AppTable from '../../components/AppTable';
import AppSelectSingle from '../../components/AppSelectSingle';
import { TAG } from '../HomeRecruiter/HomeRecruiter.const';
import { RoutePaths } from '../../routes/public-route';
import _ from 'lodash';
import { Bar, Doughnut } from "react-chartjs-2";

export default function HomePage() {
    const classes = useStyles();
    const history = useHistory();

    const [user] = useState({
        ...cookies.load("user"),
    });

    // Lấy danh sách nhà tuyển dụng đợi duyệt
    const [dsXetDuyet, setDsXetDuyet] = useState([]);
    const getDsXetDuyet = async () => {
        const res = await API.get(endpoints["nha-tuyen-dung-doi-xet-duyet"]);
        setDsXetDuyet(res.data)
    };

    // Cập nhật trạng thái nhà tuyển dụng được duyệt
    const duyetNhaTuyenDung = async (nhatuyendungId) => {
        // console.log(nhatuyendungId)
        try {
            const res = await API.patch(endpoints["kich-hoat"](nhatuyendungId), {
                quanLyId: user.nguoi_dung.id
            })
            console.log(res.data)
            if (res.status === 200) {
                getDsXetDuyet();
                alert("Duyệt hồ sơ nhà tuyển dụng này thành công!");
            } else alert("Lỗi!")
        } catch (error) {
            alert("Lỗi api!")
        }
    };

    // Xử lý ô select chọn dữ liệu lọc
    const [quyThongKe, setQuyThongKe] = useState(0)
    const [namThongKe, setNamThongKe] = useState(2021)
    const xuLySelect = (event) => {
        if (event.target.name === "nam") {
            setNamThongKe(event.target.value);
            setQuyThongKe(0)
        }
        if (event.target.name === "quy") {
            setQuyThongKe(event.target.value);
        }
    };
    // Nếu server trả tra dữ liệu hợp lệ thì set = true
    const [coDuLieu, setCoDuLieu] = useState(false);
    // Lưu dữ liệu thô trả ra từ server để hiển thị tính toán
    const [duLieuTho, setDuLieuTho] = useState({})
    // Cấu trúc data đổ vào của chartjs-2
    const [duLieuThongKe, setDuLieuThongKe] = useState({
        labels: [],
        datasets: [
            {
                label: 'Số lượng ứng tuyển',
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                data: [],
                borderWidth: 3
            },
        ]
    });
    // Lấy dữ liệu thống kê từ server
    const thongKe = async () => {
        const res = await API.get(endpoints['thong-ke'](quyThongKe, namThongKe));
        // Kiểm tra xem res (array) trả về có giá trị không (tổng các value lớn hơn 0)
        if (Object.values(res.data).reduce((a, b) => a + b, 0) === 0) {
            setCoDuLieu(false);
        }
        else {
            setDuLieuTho(res.data)
            setDuLieuThongKe({
                ...duLieuThongKe,
                labels: Object.keys(res.data),
                datasets: [{
                    ...duLieuThongKe.datasets[0],
                    ...duLieuThongKe.datasets[1],
                    data: Object.values(res.data)
                }]
            })
            setCoDuLieu(true)
        }
    };

    useEffect(() => {
        getDsXetDuyet();
        thongKe()
        // console.info(dsXetDuyet[0].nguoi_dung.anh_dai_dien)
    }, [])

    const AvatarComponent = ({ item }) => {
        if (!_.isNil(item.nguoi_dung.anh_dai_dien)) {
            const path = item.nguoi_dung.anh_dai_dien.includes('http://127.0.0.1:8000') ? item.nguoi_dung.anh_dai_dien : `http://127.0.0.1:8000${item.nguoi_dung.anh_dai_dien}`;
            return (
                <CardMedia
                    className={classes.media}
                    image={path}
                    title="Ảnh đại diện"
                />
            )
        } else {
            return <></>
        }
    }

    return (
        <Container maxWidth='lg' >
            <Grid container spacing={7} xs={12}>
                <Grid item xs={8}>
                    {/* <Typography variant="h4" className={classes.titleInfo}>Báo cáo thống kê</Typography> */}
                    <Typography variant="h4" className={classes.titleInfo}>Thống kê số lượng ứng tuyển theo ngành nghề</Typography>
                    {coDuLieu ? (
                        <>
                            <Bar
                                className={classes.bar}
                                data={duLieuThongKe}
                                options={{
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'top',
                                        },
                                        // title: {
                                        //     display: true,
                                        //     text: 'Thống kê số lượng ứng tuyển theo ngành nghề',
                                        // },
                                    }
                                }}
                            />
                        </>
                    ) : (
                        <Alert className={classes.alert} severity="info">Không có dữ liệu</Alert>
                    )}
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="h5" className={classes.titleInfo}>Bảng điều khiển</Typography>
                    <Box className={classes.boxRight}>
                        <Card className={classes.cardBox}>
                            <Typography className={classes.text} variant="body1" >Thống kê ứng viên nộp đơn theo ngành nghề</Typography>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel htmlFor={`outlined-sort-native-simple`}>Quý</InputLabel>
                                <Select
                                    native
                                    onChange={(e) => xuLySelect(e)}
                                    label='Quý'
                                    inputProps={{
                                        name: 'quy',
                                        id: `outlined-sort-native-simple`,
                                    }}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <TextField
                                    autoComplete="off"
                                    variant="outlined"
                                    fullWidth
                                    id='nam'
                                    name='nam'
                                    label='Năm'
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={namThongKe}
                                    onChange={(e) => xuLySelect(e)}
                                />
                            </FormControl>
                            <Button
                                onClick={thongKe}
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.formControl}
                            >Lọc kết quả</Button>
                        </Card>
                    </Box>
                </Grid>
            </Grid>

            <Typography variant="h4" className={classes.titleInfo2}>Nhà tuyển dụng đợi duyệt</Typography>
            <Grid container spacing={7} xs={12}>
                {/* <Grid item xs={7}>
                    <Box>
                        <Typography variant="h3" className={classes.titleInfo}>Bài viết đã đăng</Typography>
                        <AppTable columns={JOB_TABLE} data={danhSachViecLam} handleChoose={handleChoose} />
                    </Box>

                </Grid> */}

                {/* <Typography variant="h5" className={classes.titleInfo}>Nhà tuyển dụng đợi duyệt</Typography> */}
                {dsXetDuyet.length > 0 ? dsXetDuyet.map((item, index) => (
                    <Grid item xs={6}>
                        {/* <Card className={classes.card} onClick={() => denTrangChiTietViecLam(vieclam)}> */}
                        <Card className={classes.card} >
                            <CardActionArea>
                                <Grid container>
                                    <Grid item xs={4}>
                                        <AvatarComponent item={item} />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <CardContent>
                                            <Typography gutterBottom variant="body1">{item.ten_cong_ty ? item.ten_cong_ty : 'Chưa cập nhập tên công ty'}</Typography>
                                            <Divider />
                                            <Typography gutterBottom variant="body1">Quy mô: {item.quy_mo} nhân viên</Typography>
                                            <Typography gutterBottom variant="body1">Email: {item.nguoi_dung.email}</Typography>
                                            <Typography gutterBottom variant="body1">Số điện thoại: {item.nguoi_dung.so_dien_thoai}</Typography>
                                            <Typography gutterBottom variant="body1">Địa chỉ: {item.dia_chi}</Typography>
                                        </CardContent>
                                    </Grid>
                                </Grid>
                            </CardActionArea>
                            <CardActions>
                                <Button
                                    onClick={() => duyetNhaTuyenDung(item.nguoi_dung.id)}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.formControl}
                                >Duyệt nhà tuyển dụng này</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                )) : (
                    <Alert severity="info">Không có bản ghi</Alert>
                )}
            </Grid>
        </Container>
    );
}
