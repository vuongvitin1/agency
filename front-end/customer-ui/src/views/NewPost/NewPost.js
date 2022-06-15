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
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import API, { endpoints } from '../../helpers/API';
import { INFO_POST, TAG } from './NewPost.const';
import { useStyles } from './NewPost.styles';
import cookies from 'react-cookies';
import { useHistory, useLocation, useParams } from 'react-router';
import { PublicRoutes, RoutePaths } from '../../routes/public-route';
import AppSelect from '../../components/AppSelect';
import AppTextField from '../../components/AppTextField';
import AppDatePicker from '../../components/AppDatePicker';
import moment from "moment";
import _ from "lodash";

export default function Profile() {
    const classes = useStyles();
    const history = useHistory();
    const baivietId  = useParams();
    console.log(baivietId)
    const [loading, setLoading] = useState(false);
    const { state } = useLocation();
    console.log(state)
    const [ngayHetHan, setNgayHetHan] = useState(new Date());
    const [tinTuyenDung, setTinTuyenDung] = useState({
        tieu_de: "",
        luong: "",
        noi_dung: "",
        ngay_het_han: moment(ngayHetHan).format("YYYY-MM-DD").toString(),
        nha_tuyen_dung_id: state.nguoidungId,
        bang_cap: [],
        ky_nang: [],
        kinh_nghiem: [],
        nganh_nghe: [],
        phuc_loi: [],
    })

    const [check, setCheck] = useState(false);
    const getThongTinBaiViet = async () => {
        if (baivietId.id) {
            setCheck(true)
            const res = await API.get(endpoints["viec-lam-chi-tiet"](state.baivietId))

            const tagkinh_nghiem = res.data.kinh_nghiem.map(item => ({ value: item.id, label: item.ten }))
            const tagky_nang = res.data.ky_nang.map(item => ({ value: item.id, label: item.ten }))
            const tagnganh_nghe = res.data.nganh_nghe.map(item => ({ value: item.id, label: item.ten }))
            const tagphuc_loi = res.data.phuc_loi.map(item => ({ value: item.id, label: item.ten }))
            const tagbang_cap = res.data.bang_cap.map(item => ({ value: item.id, label: item.ten }))
            // console.info('ret id', res)
            setTinTuyenDung({
                id: res.data.id,
                tieu_de: res.data.tieu_de,
                luong: res.data.luong,
                noi_dung: res.data.noi_dung,
                ngay_het_han: res.data.ngay_het_han,
                bang_cap: tagbang_cap,
                ky_nang: tagky_nang,
                kinh_nghiem: tagkinh_nghiem,
                nganh_nghe: tagnganh_nghe,
                phuc_loi: tagphuc_loi,
            })
            setNgayHetHan(res.data.ngay_het_han)
        }
    }

    // Phương thức gửi dữ liệu lên server để tạo bản ghi
    const dangTinTuyenDung = async (event) => {
        const res = await API.post(endpoints["viec-lam"], tinTuyenDung)
        if (res.data === 201) {
            alert("Tạo việc làm thành công!")
            history.push(RoutePaths.HomeRecruiter);
        } else if (res.data === 400) {
            alert("Hệ thống đang lỗi vui lòng thử lại sau!")
        }
    }

    const onSubmit = async () => {
        setLoading(true);
        setTimeout(() => {
            dangTinTuyenDung();
            setLoading(false);
        }, 1000);
    }

    const capNhapBaiViet = async () => {
        const dataForm = {
            ...tinTuyenDung,
            // bang_cap: tinTuyenDung.bang_cap.map(item => ({ id: item.value, ten: item.label })),
            // ky_nang: tinTuyenDung.ky_nang.map(item => ({ id: item.value, ten: item.label })),
            // kinh_nghiem: tinTuyenDung.kinh_nghiem.map(item => ({ id: item.value, ten: item.label })),
            // nganh_nghe: tinTuyenDung.nganh_nghe.map(item => ({ id: item.value, ten: item.label })),
            // phuc_loi: tinTuyenDung.phuc_loi.map(item => ({ id: item.value, ten: item.label })),

            bang_cap: tinTuyenDung.bang_cap,
            ky_nang: tinTuyenDung.ky_nang,
            kinh_nghiem: tinTuyenDung.kinh_nghiem,
            nganh_nghe: tinTuyenDung.nganh_nghe,
            phuc_loi: tinTuyenDung.phuc_loi,
        }

        try {
            const res = await API.put(endpoints["viec-lam"], dataForm)
            // console.info(res)
            if (res.status === 200) {
                alert("Cập nhập thành công!")
                history.push(RoutePaths.HomeRecruiter);
            } else if (res.status === 400) {
                alert("Hệ thống đang lỗi vui lòng thử lại sau!")
            }
        } catch (error) {
            alert("Hệ thống đang lỗi vui lòng thử lại sau!")
        }
    }

    const onSubmit2 = async () => {
        setLoading(true);
        setTimeout(() => {
            capNhapBaiViet();
            setLoading(false);
        }, 1000);
    }


    const [degrees, setDegrees] = useState([]);
    const [skills, setSkills] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [careers, setCareers] = useState([]);
    const [benefits, setBenefits] = useState([])

    const getFilterCategory = async () => {
        const degreesRes = await API.get(endpoints["bang-cap"]);
        const skillsRes = await API.get(endpoints["ky-nang"]);
        const expRes = await API.get(endpoints["kinh-nghiem"]);
        const careersRes = await API.get(endpoints["nganh-nghe"]);
        const benefitsRes = await API.get(endpoints["phuc-loi"])
        setDegrees(careersRes.data.map(item => ({ value: item.id, label: item.ten })));
        setSkills(skillsRes.data.map(item => ({ value: item.id, label: item.ten })));
        setExperiences(expRes.data.map(item => ({ value: item.id, label: item.ten })));
        setCareers(degreesRes.data.map(item => ({ value: item.id, label: item.ten })));
        setBenefits(benefitsRes.data.map(item => ({ value: item.id, label: item.ten })));
    };

    useEffect(() => {
        async function init() {
            await getFilterCategory()
            await getThongTinBaiViet()
        }
        init()
    }, [])

    const back = () => {
        history.push(RoutePaths.HomeRecruiter);
    }

    return (
        <Container maxWidth="lg">
            <Grid container spacing={2} xs={12} justifyContent="center">
                <Grid item xs={10}>
                    <Typography variant="h3" className={classes.title}>Thông tin bài viết</Typography>
                    <form className={classes.form} >
                        <Grid container spacing={4} xs={12}>
                            <Grid item xs={5}>
                                <Grid container spacing={2}>
                                    <Grid item xs={INFO_POST.tieu_de.xs}>
                                        <AppTextField field={INFO_POST.tieu_de} value={tinTuyenDung.tieu_de}
                                            onChange={(e) => setTinTuyenDung({ ...tinTuyenDung, tieu_de: e.target.value })} />
                                    </Grid>
                                    <Grid item xs={INFO_POST.ngay_het_han.xs}>
                                        <AppDatePicker field={INFO_POST.ngay_het_han} value={ngayHetHan}
                                            onChange={(date) => {
                                                setNgayHetHan(date)
                                                setTinTuyenDung({ ...tinTuyenDung, ngay_het_han: moment(date).format("YYYY-MM-DD").toString() })
                                            }} />
                                    </Grid>
                                    <Grid item xs={INFO_POST.luong.xs}>
                                        <AppTextField field={INFO_POST.luong} value={tinTuyenDung.luong}
                                            onChange={(e) => setTinTuyenDung({ ...tinTuyenDung, luong: e.target.value })} />
                                    </Grid>
                                    <Grid item xs={TAG.nganh_nghe.xs}>
                                        <AppSelect
                                            classes={classes}
                                            tag_type={TAG.nganh_nghe.id} label={TAG.nganh_nghe.label}
                                            tags={degrees} userTag={tinTuyenDung.nganh_nghe}
                                            onChange={(e) => setTinTuyenDung({ ...tinTuyenDung, nganh_nghe: e })}
                                        />
                                    </Grid>
                                    <Grid item xs={TAG.kinh_nghiem.xs}>
                                        <AppSelect
                                            classes={classes}
                                            tag_type={TAG.kinh_nghiem.id} label={TAG.kinh_nghiem.label}
                                            tags={experiences} userTag={tinTuyenDung.kinh_nghiem}
                                            onChange={(e) => setTinTuyenDung({ ...tinTuyenDung, kinh_nghiem: e })}
                                        />
                                    </Grid>
                                    <Grid item xs={TAG.ky_nang.xs}>
                                        <AppSelect
                                            classes={classes}
                                            tag_type={TAG.ky_nang.id} label={TAG.ky_nang.label}
                                            tags={skills} userTag={tinTuyenDung.ky_nang}
                                            onChange={(e) => setTinTuyenDung({ ...tinTuyenDung, ky_nang: e })}
                                        />
                                    </Grid>
                                    <Grid item xs={TAG.bang_cap.xs}>
                                        <AppSelect
                                            tag_type={TAG.bang_cap.id} label={TAG.bang_cap.label}
                                            tags={careers} userTag={tinTuyenDung.bang_cap}
                                            onChange={(e) => setTinTuyenDung({ ...tinTuyenDung, bang_cap: e })}
                                        />
                                    </Grid>
                                    <Grid item xs={TAG.phuc_loi.xs}>
                                        <AppSelect
                                            tag_type={TAG.phuc_loi.id} label={TAG.phuc_loi.label}
                                            tags={benefits} userTag={tinTuyenDung.phuc_loi}
                                            onChange={(e) => setTinTuyenDung({ ...tinTuyenDung, phuc_loi: e })}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={7}>
                                <Grid container spacing={2}>
                                    <Grid item xs={INFO_POST.noi_dung.xs}>
                                        <AppTextField field={INFO_POST.noi_dung} value={tinTuyenDung.noi_dung} multiline={true} rows={INFO_POST.noi_dung.rows}
                                            onChange={(e) => setTinTuyenDung({ ...tinTuyenDung, noi_dung: e.target.value })} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Button
                                    onClick={back}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >Quay về</Button>
                            </Grid>
                            <Grid item xs={8}>
                                {check ? (
                                    <Button
                                        onClick={onSubmit2}
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                    >{loading ?
                                        <CircularProgress className={classes.loading} />
                                        : 'Cập nhập'
                                        }</Button>
                                ) : (
                                    <Button
                                        onClick={onSubmit}
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                    >{loading ?
                                        <CircularProgress className={classes.loading} />
                                        : 'Tạo mới'
                                        }</Button>
                                )}
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </Container>
    );
}