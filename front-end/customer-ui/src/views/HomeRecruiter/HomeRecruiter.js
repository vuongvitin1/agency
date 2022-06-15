import React, { createRef, useEffect, useState } from 'react';
import {
    Grid,
    Typography,
    Button,
    TextField,
    CircularProgress,
    Card,
    CardActionArea,
    CardContent,
    CardActions,
    Container,
    Box,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Rating from '@material-ui/lab/Rating';
import API, { endpoints } from '../../helpers/API';
import { ACCOUNT, INFO, JOB_TABLE, TAG } from './HomeRecruiter.const';
import { useStyles } from './HomeRecruiter.styles';
import cookies from 'react-cookies';
import { useHistory } from 'react-router';
import { RoutePaths } from '../../routes/public-route';
import AppTable from '../../components/AppTable';
import AppSelectSingle from '../../components/AppSelectSingle';
import moment from "moment";

function createData(stt, tieu_de, noi_dung, luong, ngay_tao, ngay_het_han, trang_thai_viec_lam, itemId) {
    return { stt, tieu_de, noi_dung, luong, ngay_tao, ngay_het_han, trang_thai_viec_lam, itemId };
}

export default function Profile() {
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    const [danhSachViecLam, setDanhSachViecLam] = useState([]);
    const [ketQua, setKetQua] = useState({
        count: 0,
        next: null,
        previous: null,
        results: []
    })

    const [userData, setUserData] = useState({
        ...cookies.load("user"),
    });

    const avatar = React.createRef();

    // Onchange thông tin thuộc bảng ứng viên
    const thongTinNhaTuyenDung = (event) => {
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
            else
                formData.append(u, userData[u]);
        }

        if (avatar.current.files[0])
            formData.append("anh_dai_dien", avatar.current.files[0]);

        // for (var key of formData.keys()) {
        //     console.log(key, formData.get(key));
        // }

        try {
            const capNhat = await API.put(endpoints["nha-tuyen-dung"], formData, {
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
            alert("Đã có lỗi, vui lòng thực hiện lại! \nLưu ý file ảnh không quá lớn")
        }

        // console.info('capNhat', capNhat)


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
            await fetchViecLam()
            await getFilterCategory()
            await getPendingApply()
            await getUngVienDanhGia()
        }
        init()
    }, [])

    const fetchViecLam = async () => {
        const res = await API.get(endpoints["nha-tuyen-dung-viec-lam"](userData.nguoi_dung.id))
        setDanhSachViecLam(res.data.map((b, idx) =>
            createData(idx + 1, b.tieu_de.length > 30 ? `${b.tieu_de.substr(0, 30)}. . .` : b.tieu_de,
                b.noi_dung.length > 50 ? `${b.noi_dung.substr(0, 50)}. . .` : b.noi_dung,
                b.luong !== 0 ? b.luong : 'thỏa thuận', moment(b.ngay_tao).format("DD-MM-YYYY").toString(), moment(b.ngay_het_han).format("DD-MM-YYYY").toString(), b.trang_thai_viec_lam, b.id),
        ))
    }

    // chuyển về trang bài viết đã đăng
    const handleChoose = (postId) => {
        const _pathPage = RoutePaths.PostDetail.replace(':id', postId)
        history.push(_pathPage, {
            baivietId: postId,
            nguoidungId: userData.nguoi_dung.id
        })
    }


    // Get thông tin có sẵn trên server các danh mục để lọc (nên gom lại 1 object cho gọn)
    const [degrees, setDegrees] = useState([]);
    const [skills, setSkills] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [careers, setCareers] = useState([]);
    const [benefits, setBenefits] = useState([])

    // Gửi request để lấy dữ liệu danh mục
    const getFilterCategory = async () => {
        const degreesRes = await API.get(endpoints["bang-cap"]);
        const skillsRes = await API.get(endpoints["ky-nang"]);
        const expRes = await API.get(endpoints["kinh-nghiem"]);
        const careersRes = await API.get(endpoints["nganh-nghe"]);
        const benefitsRes = await API.get(endpoints["phuc-loi"])
        setDegrees(degreesRes.data);
        setSkills(skillsRes.data);
        setExperiences(expRes.data);
        setCareers(careersRes.data);
        setBenefits(benefitsRes.data);
    };

    const [filterData, setFilterData] = useState({
        "career": "1",
        "degree": "1",
        "experience": "1",
        "skill": "1",
    })

    const locUngVien = async (page = 1) => {
        const res = await API.get(endpoints["ung-vien"](filterData.career, filterData.degree, filterData.experience, filterData.skill))
        setKetQua(res.data)
    }

    const handleSelectChange = (event) => {
        setFilterData({
            ...filterData,
            [event.target.name]: event.target.value
        })
    }

    const handleCandidae = (uv) => {
        const _path = RoutePaths.CanInfo.replace(':id', uv.nguoi_dung.first_name)
        history.push(_path, {
            ungvien: uv,
            nguoidungId: userData.nguoi_dung.id,
            trang_thai_nha_tuyen_dung: userData.doi_xet_duyet,
        });
    }

    const taoBaiViet = () => {
        if (userData.doi_xet_duyet) {
            alert("Tài khoản của bạn đang đợi xét duyệt, vui lòng chờ!")
        } else {
            history.push(RoutePaths.NewPost, {
                nguoidungId: userData.nguoi_dung.id,
            })
        }
    }

    // Thông tin các ứng viên đang đợi duyệt nhận đơn ứng tuyển (lưu trữ)
    const [applyInfo, setApplyInfo] = useState([])

    // Lấy danh sách các ứng viên đợi được chấp nhận đơn ứng tuyển
    const getPendingApply = async (hiringId = userData.nguoi_dung.id) => {
        const res = await API.get(endpoints["ung-vien-doi-duyet"](hiringId));
        setApplyInfo(res.data);
    }

    const handleApply = (info) => {
        const _path = RoutePaths.CanInfo.replace(':id', info.ung_vien.nguoi_dung.first_name)
        history.push(_path, {
            ungvien: info.ung_vien,
            nguoidungId: userData.nguoi_dung.id,
            vieclamId: info.viec_lam.id,
            tenViecLam: info.viec_lam.tieu_de,
        });
    }

    const [hidden, setHidden] = useState(false);
    const handleHidden = () => {
        // if (hidden) {
        //     setHidden(false)
        // } else {
        //     setHidden(true)
        // }
        setHidden(hidden ? false : true);
    }

    // Lấy bài đánh giá của ứng viên
    const [danhGiaCuaUngVien, setDanhGiaCuaUngVien] = useState({});
    const getUngVienDanhGia = async () => {
        const res = await API.get(endpoints['tuyen-dung-xem-danh-gia'](userData.nguoi_dung.id));
        setDanhGiaCuaUngVien(res.data);
    };

    return (
        <Container maxWidth="lg">
            <Grid container spacing={2} xs={12}>
                <Grid item xs={8}>
                    <Typography variant="h3" className={classes.titleInfo}>Thông tin nhà tuyển dụng</Typography>
                    <form className={classes.form}>
                        <Grid container spacing={4} xs={12}>
                            <Grid item xs={6}>
                                <Grid container spacing={2}>
                                    <Grid item xs={INFO.ten_cong_ty.xs}>
                                        <TextField
                                            autoComplete="off"
                                            variant="outlined"
                                            // required
                                            fullWidth
                                            id={INFO.ten_cong_ty.id}
                                            name={INFO.ten_cong_ty.id}
                                            label={INFO.ten_cong_ty.label}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={userData.ten_cong_ty}
                                            onChange={thongTinNhaTuyenDung}
                                        // defaultValue={userData.nguoi_dung.last_name}
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
                                            onChange={thongTinNhaTuyenDung}
                                        // defaultValue={user.nguoi_dung.so_dien_thoai}
                                        />
                                    </Grid>
                                    <Grid item xs={INFO.quy_mo.xs}>
                                        <TextField
                                            autoComplete="off"
                                            variant="outlined"
                                            // required
                                            fullWidth
                                            id={INFO.quy_mo.id}
                                            name={INFO.quy_mo.id}
                                            label={INFO.quy_mo.label}
                                            type={INFO.quy_mo.type}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={userData.quy_mo}
                                            onChange={thongTinNhaTuyenDung}
                                        // defaultValue={user.nguoi_dung.so_dien_thoai}
                                        />
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
                                    <Grid item xs={INFO.diem_danh_gia_tb.xs}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={8}>
                                                <Typography component="legend">{INFO.diem_danh_gia_tb.label}</Typography>
                                                <Rating value={userData.diem_danh_gia_tb} precision={0.5} readOnly name={INFO.diem_danh_gia_tb.label} size="large" />
                                            </Grid>
                                            <Grid item xs={4}>
                                                {hidden ? (
                                                    <Button fullWidth variant="contained" color="primary" className={classes.submit} onClick={() => handleHidden()}>
                                                        Ẩn
                                                    </Button>
                                                ) : (
                                                    <Button fullWidth variant="contained" color="primary" className={classes.submit} onClick={() => handleHidden()}>
                                                        Xem
                                                    </Button>
                                                )}
                                            </Grid>
                                        </Grid>

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

                            <Grid item xs={6}>
                                <Grid container spacing={2}>
                                    <Grid item xs={INFO.gioi_thieu.xs}>
                                        <TextField
                                            autoComplete="off"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            multiline
                                            rows={INFO.gioi_thieu.rows}
                                            id={INFO.gioi_thieu.id}
                                            name={INFO.gioi_thieu.id}
                                            label={INFO.gioi_thieu.label}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={userData.gioi_thieu}
                                            onChange={thongTinNhaTuyenDung}
                                        // defaultValue={userData.nguoi_dung.gioi_thieu}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>

                    {hidden ? (
                        <Box>
                            <Typography variant="h3" className={classes.titleInfo}>Đánh giá của ứng viên</Typography>
                            {danhGiaCuaUngVien.length > 0 ? danhGiaCuaUngVien.map((item, index) => (
                                <Card className={classes.cardRate}>
                                    <Rating value={item.diem_danh_gia} precision={0.5} readOnly size="large" />
                                    <Typography variant="body2" className={classes.text}>Đã ứng tuyển cho vị trí: {item.viec_lam.tieu_de}</Typography>
                                    <Typography variant="body1" className={classes.text}>{item.noi_dung}</Typography>
                                </Card>
                            )) : (
                                <Alert severity="info">Bạn chưa viết nhận được đánh giá nào</Alert>
                            )}
                        </Box>
                    ) : (
                        <></>
                    )}
                </Grid>

                <Grid item xs={4}>
                    <Typography variant="h4" className={classes.titleInfo}>Tìm kiếm ứng viên</Typography>
                    <Grid container spacing={1} xs={12}>
                        <Grid item xs={6}>
                            <AppSelectSingle tags={degrees} field={TAG.bang_cap} onChange={(e) => handleSelectChange(e)} />
                        </Grid>
                        <Grid item xs={6}>
                            <AppSelectSingle tags={experiences} field={TAG.kinh_nghiem} onChange={(e) => handleSelectChange(e)} />
                        </Grid>
                        <Grid item xs={6}>
                            <AppSelectSingle tags={skills} field={TAG.ky_nang} onChange={(e) => handleSelectChange(e)} />
                        </Grid>
                        <Grid item xs={6}>
                            <AppSelectSingle tags={careers} field={TAG.nganh_nghe} onChange={(e) => handleSelectChange(e)} />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                onClick={locUngVien}
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.search}
                            >Tìm kiếm</Button>
                        </Grid>

                    </Grid>
                    <Grid container spacing={1} xs={12}>
                        {ketQua.results.length > 0 ? ketQua.results.map((uv, idx) => (
                            <Grid item xs={12}>
                                <Card className={classes.card} onClick={() => handleCandidae(uv)}>
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                {uv.nguoi_dung.last_name} {uv.nguoi_dung.first_name}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" component="p">
                                                {(uv.gioi_thieu).substr(0, 50)}...
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        )) : (<><Typography gutterBottom variant="body1">Không thấy kết quả tìm kiếm</Typography></>)}
                    </Grid>
                </Grid>

                {/* Thông báo tuyển dụng */}
                <Grid item xs={12}>
                    <Typography variant="h3" className={classes.titleInfo}>Thông báo tuyển dụng</Typography>
                    <Grid container spacing={3} xs={6}>
                        {applyInfo.length > 0 ? applyInfo.map((info, index) => (
                            <Card className={classes.card}
                                onClick={() => handleApply(info)}>
                                <CardActionArea>
                                    <CardContent>
                                        <Typography gutterBottom variant="h6">
                                            {applyInfo[index].ung_vien.nguoi_dung.last_name} {applyInfo[index].ung_vien.nguoi_dung.first_name}
                                            {" "}đã nộp đơn ứng tuyển vào vị trí{" "}
                                        </Typography>
                                        <Typography variant="h5">{applyInfo[index].viec_lam.tieu_de}</Typography>
                                        <Typography gutterBottom variant="body1" color="textSecondary">Ngày nộp đơn: {applyInfo[index].ngay_ung_tuyen}</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        )) : (
                            <Typography variant="body1" className={classes.note}>Không có hồ sơ chờ duyệt</Typography>
                        )}
                    </Grid>
                </Grid>

                {/* Bài viết đã đăng */}
                <Grid item xs={12}>
                    {/* Các bài viết đã đăng */}
                    <Typography variant="h3" className={classes.titleInfo}>Bài viết đã đăng</Typography>
                    <AppTable columns={JOB_TABLE} data={danhSachViecLam} handleChoose={handleChoose} />
                    <Button
                        onClick={taoBaiViet}
                        fullWidth
                        variant="contained"
                        color="primary"
                    >Thêm mới</Button>
                </Grid>
            </Grid>
        </Container >
    )
}