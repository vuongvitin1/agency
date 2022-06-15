import React, { createRef, useEffect, useState } from 'react';
import {
    Grid,
    Typography,
    Button,
    TextField,
    CircularProgress,
    Container,
    Card,
    CardActionArea,
    CardContent,
    Link,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import API, { endpoints } from '../../helpers/API';
import { ACCOUNT, INFO, TAG } from './ProfileCandidate.const';
import { useStyles } from './ProfileCandidate.styles';
import cookies from 'react-cookies';
import { useHistory } from 'react-router';
import { RoutePaths } from '../../routes/public-route';
import AppSelect from '../../components/AppSelect';
import moment from "moment";
import _ from "lodash";

export default function Profile() {
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    const [booking, setBooking] = useState([]);

    const userCookies = cookies.load("user");
    const [userData, setUserData] = useState({
        ...cookies.load("user"),
        nganh_nghe: userCookies.nganh_nghe.map(item => ({ value: item.id, label: item.ten })),
        bang_cap: userCookies.bang_cap.map(item => ({ value: item.id, label: item.ten })),
        ky_nang: userCookies.ky_nang.map(item => ({ value: item.id, label: item.ten })),
        kinh_nghiem: userCookies.kinh_nghiem.map(item => ({ value: item.id, label: item.ten })),
    });

    const [ngaySinh, setNgaySinh] = useState(userData.ngay_sinh ? new Date(userData.ngay_sinh) : null);
    const avatar = createRef();
    const cv = createRef();

    // Onchange thông tin thuộc bảng ứng viên
    const thongTinUngVien = (event) => {
        event.persist();
        setUserData({
            ...userData,
            [event.target.name]: event.target.value
        })
    }

    // Onchange thông tin thuộc bảng người dùng
    const thongTinNguoiDung = (event) => {
        event.persist();
        setUserData({
            ...userData,
            nguoi_dung: {
                ...userData.nguoi_dung,
                [event.target.name]: event.target.value
            }
        })
    }

    // Get thông tin có sẵn trên server các danh mục để lọc
    const [degrees, setDegrees] = useState([]);
    const [skills, setSkills] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [careers, setCareers] = useState([]);

    // Gửi request để lấy dữ liệu
    const getFilterCategory = async () => {
        const degreesRes = await API.get(endpoints["bang-cap"]);
        const skillsRes = await API.get(endpoints["ky-nang"]);
        const expRes = await API.get(endpoints["kinh-nghiem"]);
        const careersRes = await API.get(endpoints["nganh-nghe"]);
        setDegrees(careersRes.data.map(item => ({ value: item.id, label: item.ten })));
        setSkills(skillsRes.data.map(item => ({ value: item.id, label: item.ten })));
        setExperiences(expRes.data.map(item => ({ value: item.id, label: item.ten })));
        setCareers(degreesRes.data.map(item => ({ value: item.id, label: item.ten })));
    };

    const capNhatThongTin = async () => {
        // console.log(user)
        const formData = new FormData()
        // Duyệt qua người dùng lưu trong redux đã chỉnh sửa (nếu có) xong gán vào form data 
        for (let u in userData) {
            if (u === "nguoi_dung") {
                for (let i in userData.nguoi_dung) {
                    if (i !== "anh_dai_dien")
                        formData.append(i, userData.nguoi_dung[i]);
                }
            }
            else if (u === "nganh_nghe" || u === "bang_cap" || u === "ky_nang" || u === "kinh_nghiem") {
                formData.append(u, JSON.stringify(userData[u]));
                // formData.append(u, JSON.stringify(userData[u].map(item => ({ id: item.value, ten: item.label }))));
            }
            else if (u !== "cv")
                formData.append(u, userData[u]);
        }

        if (avatar.current.files[0])
            formData.append("anh_dai_dien", avatar.current.files[0]);

        if (cv.current.files[0])
            formData.append("cv", cv.current.files[0]);

        // for (var key of formData.keys()) {
        //     console.log(key, formData.get(key));
        // }

        try {
            const capNhat = await API.put(endpoints["ung-vien-cap-nhat"], formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })

            if (capNhat.status === 200) {
                console.log(capNhat.status)
                cookies.save("user", capNhat.data)
                alert("Cập nhật thông tin thành công!")
                window.location.reload()
            } else if (capNhat.status === 400) {
                alert("Thông tin không hợp lệ!")
            }
        } catch (error) {
            alert("Bạn vui lòng điển đủ thông tin còn thiếu \nLưu ý file CV hoặc ảnh không quá lớn")
        }
    }

    const onSubmit = async () => {
        // setLoading(true);
        // setTimeout(() => {
        capNhatThongTin();
        // setLoading(false);
        // }, 1000);
    }

    //  hiểu đơn giản là load trang
    useEffect(() => {
        async function init() {
            await getFilterCategory()
            await getSuggestion();
            await getOffer();
        }
        init()
    }, [])

    // Lấy các gợi ý việc làm dựa trên ngành nghề
    const [suggestion, setSuggestion] = useState([])
    const getSuggestion = async () => {
        const res = await API.get(endpoints["viec-lam-goi-y"](userData.nguoi_dung.id));
        setSuggestion(res.data)
    }

    // Lấy các việc làm được nhà tuyển dụng gửi đến
    const [offer, setOffer] = useState([])
    const getOffer = async () => {
        const res = await API.get(endpoints["de-xuat-viec-lam"](userData.nguoi_dung.id))
        setOffer(res.data)
    }

    // Bấm nút xem chi tiết công việc để đến trang chi tiết việc làm
    const denTrangChiTietViecLam = (post) => {
        const _path = RoutePaths.InfoPost.replace(':id', post.id)
        history.push(_path, {
            post: post
        });
    };

    // Format tiền lương ra định dạng VNĐ đẹp hơn
    const currency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
    }

    const pathCV = () => {
        if (!_.isNil(userData.cv)) {
            const path = userData.cv.includes('http://127.0.0.1:8000') ? userData.cv : `http://127.0.0.1:8000${userData.cv}`;
            return path
        } else {
            return ''
        }
    }

    return (
        <Container maxWidth="lg">
            <Grid container spacing={5} xs={12}>
                <Grid item xs={8}>
                    <Typography variant="h3" className={classes.titleInfo}>Thông tin người dùng</Typography>
                    <form className={classes.form}>
                        <Grid container spacing={5} xs={12}>
                            {/* thông tin người dùng */}
                            <Grid item xs={7}>
                                <Grid container spacing={2}>
                                    {/* Thông tin người dùng */}
                                    <Grid item xs={ACCOUNT.last_name.xs}>
                                        <TextField
                                            autoComplete="off"
                                            variant="outlined"
                                            // required
                                            fullWidth
                                            id={ACCOUNT.last_name.id}
                                            name={ACCOUNT.last_name.id}
                                            label={ACCOUNT.last_name.label}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={userData.nguoi_dung.last_name}
                                            onChange={thongTinNguoiDung}
                                        // defaultValue={userData.nguoi_dung.last_name}
                                        />
                                    </Grid>
                                    <Grid item xs={ACCOUNT.first_name.xs}>
                                        <TextField
                                            autoComplete="off"
                                            variant="outlined"
                                            // required
                                            fullWidth
                                            id={ACCOUNT.first_name.id}
                                            name={ACCOUNT.first_name.id}
                                            label={ACCOUNT.first_name.label}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={userData.nguoi_dung.first_name}
                                            onChange={thongTinNguoiDung}
                                        // defaultValue={user.nguoi_dung.first_name}
                                        />
                                    </Grid>
                                    <Grid item xs={ACCOUNT.email.xs}>
                                        <TextField
                                            autoComplete="off"
                                            variant="outlined"
                                            // required
                                            fullWidth
                                            id={ACCOUNT.email.id}
                                            name={ACCOUNT.email.id}
                                            label={ACCOUNT.email.label}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={userData.nguoi_dung.email}
                                            onChange={thongTinNguoiDung}
                                        // defaultValue={user.nguoi_dung.email}
                                        />
                                    </Grid>
                                    <Grid item xs={ACCOUNT.so_dien_thoai.xs}>
                                        <TextField
                                            autoComplete="off"
                                            variant="outlined"
                                            // required
                                            fullWidth
                                            id={ACCOUNT.so_dien_thoai.id}
                                            name={ACCOUNT.so_dien_thoai.id}
                                            label={ACCOUNT.so_dien_thoai.label}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={userData.nguoi_dung.so_dien_thoai}
                                            onChange={thongTinNguoiDung}
                                        // defaultValue={user.nguoi_dung.so_dien_thoai}
                                        />
                                    </Grid>
                                    <Grid item xs={INFO.dia_chi.xs}>
                                        <TextField
                                            autoComplete="off"
                                            variant="outlined"
                                            // required
                                            fullWidth
                                            id={INFO.dia_chi.id}
                                            name={INFO.dia_chi.id}
                                            label={INFO.dia_chi.label}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={userData.dia_chi}
                                            onChange={thongTinUngVien}
                                        // defaultValue={user.nguoi_dung.so_dien_thoai}
                                        />
                                    </Grid>
                                    <Grid item xs={INFO.gioi_thieu.xs}>
                                        <TextField
                                            autoComplete="off"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            multiline
                                            rows={15}
                                            id={INFO.gioi_thieu.id}
                                            name={INFO.gioi_thieu.id}
                                            label={INFO.gioi_thieu.label}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={userData.gioi_thieu}
                                            onChange={thongTinUngVien}
                                        // defaultValue={userData.nguoi_dung.gioi_thieu}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            onClick={onSubmit}
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                        >{loading ?
                                            <CircularProgress className={classes.loading} />
                                            : 'Cập nhập'
                                            }</Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={5}>
                                <Grid container spacing={2}>
                                    <Grid item xs={INFO.ngay_sinh.xs}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                disableToolbar
                                                format="dd/MM/yyyy"
                                                id="ngay_sinh"
                                                label="Ngày sinh"
                                                value={ngaySinh}
                                                onChange={(date) => {
                                                    setNgaySinh(date)
                                                    setUserData({ ...userData, ngay_sinh: moment(date).format("YYYY-MM-DD").toString() })
                                                }}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            // defaultValue={user.nguoi_dung.so_dien_thoai}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </Grid>
                                    <Grid item xs={7} >
                                        <input
                                            accept="image/*"
                                            className={classes.input}
                                            id="avatar"
                                            multiple
                                            type="file"
                                            ref={avatar}
                                        />
                                        <label htmlFor="avatar">
                                            <Button variant="contained" color="primary"
                                                maxWidth component="span">
                                                Ảnh đại diện
                                            </Button>
                                        </label>
                                    </Grid>
                                    <Grid item xs={12} >
                                        <input
                                            accept="pdf/*"
                                            className={classes.input}
                                            id="cv"
                                            multiple
                                            type="file"
                                            ref={cv}
                                        />
                                        <label htmlFor="cv">
                                            <Button variant="contained" color="primary"
                                                maxWidth component="span">
                                                CV
                                            </Button>
                                        </label>
                                        {userData.cv ? (
                                            <Link className={classes.linkCV} href={pathCV()}> Xem CV  </Link>
                                        ) : (
                                            <Link className={classes.linkCV}>  CV chưa cập nhập </Link>
                                        )}
                                    </Grid>
                                    <Grid item xs={TAG.nganh_nghe.xs}>
                                        <AppSelect
                                            classes={classes}
                                            tag_type={TAG.nganh_nghe.id} label={TAG.nganh_nghe.label}
                                            tags={degrees} userTag={userData.nganh_nghe}
                                            onChange={(e) => setUserData({ ...userData, nganh_nghe: e })}
                                        />
                                    </Grid>
                                    <Grid item xs={TAG.kinh_nghiem.xs}>
                                        <AppSelect
                                            classes={classes}
                                            tag_type={TAG.kinh_nghiem.id} label={TAG.kinh_nghiem.label}
                                            tags={experiences} userTag={userData.kinh_nghiem}
                                            onChange={(e) => setUserData({ ...userData, kinh_nghiem: e })}
                                        />
                                    </Grid>
                                    <Grid item xs={TAG.ky_nang.xs}>
                                        <AppSelect
                                            classes={classes}
                                            tag_type={TAG.ky_nang.id} label={TAG.ky_nang.label}
                                            tags={skills} userTag={userData.ky_nang}
                                            onChange={(e) => setUserData({ ...userData, ky_nang: e })}
                                        />
                                    </Grid>
                                    <Grid item xs={TAG.bang_cap.xs}>
                                        <AppSelect
                                            tag_type={TAG.bang_cap.id} label={TAG.bang_cap.label}
                                            tags={careers} userTag={userData.bang_cap}
                                            onChange={(e) => setUserData({ ...userData, bang_cap: e })}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>

                {/* gợi ý việc làm */}
                <Grid item xs={4}>
                    <Typography variant="h4" className={classes.titleInfo2}>Gợi ý công việc</Typography>
                    {suggestion.length > 0 ? suggestion.map((item, index) => (
                        <Grid item xs={12}>
                            <Card className={classes.card} onClick={() => denTrangChiTietViecLam(suggestion[index])}>
                                <CardActionArea>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">{suggestion[index].tieu_de}</Typography>
                                        <Typography variant="body1">{suggestion[index].nha_tuyen_dung.ten_cong_ty}</Typography>
                                        <Typography variant="body1">     Lương:{" "}
                                            {suggestion[index].luong === 0 ? "Thương lượng" : currency(suggestion[index].luong)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    )) : <Alert variant="secondary">Không có gợi ý phù hợp</Alert>}
                </Grid>

                {/* gợi ý việc làm đề xuất */}
                <Grid item xs={8}>
                    <Typography variant="h4" className={classes.titleInfo}>Việc làm đề xuất</Typography>
                    {offer.length > 0 ? offer.map((item, index) => (
                        <>
                            <Grid item xs={12}>
                                <Card className={classes.card} onClick={() => denTrangChiTietViecLam(item.viec_lam)}>
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="h2">{item.viec_lam.tieu_de}</Typography>
                                            <Typography variant="body1">{item.viec_lam.nha_tuyen_dung.ten_cong_ty} {" "}vừa gửi cho bạn một đề nghị việc làm ở vị trí{" "}</Typography>
                                            <Typography variant="body1">{" "}với mức lương{" "}
                                                {item.viec_lam.luong === 0 ? "Thương lượng" : currency(item.viec_lam.luong)}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        </>
                    )) : (
                        <Alert severity="info">Chưa có yêu cầu việc làm gửi cho bạn</Alert>
                    )}
                </Grid>
            </Grid>
        </Container>
    )
}