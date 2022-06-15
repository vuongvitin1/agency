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
    ButtonGroup
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Pagination, Alert, Rating } from '@material-ui/lab';
import API, { endpoints } from '../../helpers/API';
import { PublicRoutes, PublicRouteNames } from '../../routes/public-route'
import SearchIcon from '@material-ui/icons/Search';
import { useStyles } from './Home.styles';
import AppSelect from '../../components/AppSelect';
import { getAuthLS, clearAuthLS, LS_KEY } from "../../helpers/localStorage";
import cookies from 'react-cookies';
import AppSelectSingle from '../../components/AppSelectSingle';
import { TAG } from '../HomeRecruiter/HomeRecruiter.const';
import { RoutePaths } from '../../routes/public-route';
import _ from 'lodash';

export default function HomePage() {
    const classes = useStyles();
    const history = useHistory();

    const [nguoidung] = useState({
        ...cookies.load("user"),
    });

    // Handle chức năng tìm kiếm nhà tuyển dụng
    const [showSearchResult, setShowSearchResult] = useState(false)
    const [searchResult, setSearchResult] = useState([])
    const [searchInput, setSearchInput] = useState("")

    // Hứng res trả ra từ server để hiện thanh phân trang
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);

    const fetchRecruiter = async (text = searchInput, pages = 1) => {
        const res = await API.get(endpoints["nha-tuyen-dung-tim-kiem"](text) + `&page=${pages}`)
        if (res.data) {
            let results = [];
            for (let i = 0; i < res.data.results.length; i++) {
                results.push(res.data.results[i])
            }
            setSearchResult(results);
            setCount(res.data.count);
            setShowSearchResult(true);
        }
    }

    // Handle chức năng tìm kiếm nhà tuyển dụng theo tên
    const handleSearch = (event, value) => {
        setPage(value);
        fetchRecruiter(searchInput, value);
    }

    // Get thông tin có sẵn trên server các danh mục để lọc
    const [degrees, setDegrees] = useState([]);
    const [skills, setSkills] = useState([]);
    const [experiences, setExperiences] = useState([])
    const [careers, setCareers] = useState([]);

    // Gửi request để lấy dữ liệu
    const getFilterCategory = async () => {
        const degreesRes = await API.get(endpoints["bang-cap"]);
        const skillsRes = await API.get(endpoints["ky-nang"]);
        const expRes = await API.get(endpoints["kinh-nghiem"]);
        const careersRes = await API.get(endpoints["nganh-nghe"]);
        setDegrees(degreesRes.data)
        setSkills(skillsRes.data)
        setExperiences(expRes.data)
        setCareers(careersRes.data)
    }

    // Dữ liệu lọc sẽ được gửi lên server
    const [filterData, setFilterData] = useState({
        "career": "",
        "degree": "",
        "experience": "",
        "skill": "",
    })

    // Handle thay đổi giá trị select của người dùng
    const handleSelectChange = (event) => {
        setFilterData({
            ...filterData,
            [event.target.name]: event.target.value
        })
    }

    const [filterResult, setFilterResult] = useState({})
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    // Tiến hành lọc trả ra kết quả cho người dùng (khi nhấn nút filter)
    const handleFilter = async (page = 1) => {
        const res = await API.get(endpoints["viec-lam-loc"](
            filterData.career, filterData.degree, filterData.experience, filterData.skill) + `&page=${page}`);
        // console.log(res.data)
        setFilterResult({ ...filterResult, ...res.data });
        setIsFirstLoad(false);
        setCountF(res.data.count)
    }

    useEffect(() => {
        getFilterCategory();
        fetchJobs();
        // console.info(_.isUndefined((filterResult.count)))
    }, []);

    const currency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
    }

    // Bấm nút xem chi tiết công việc để đến trang chi tiết việc làm
    const denTrangChiTietViecLam = (post) => {
        const _path = RoutePaths.InfoPost.replace(':id', post.id)
        history.push(_path, {
            post: post
        });
    };

    const hanleNameCompany = (recruId) => {
        const _path = RoutePaths.RecruInfo.replace(':id', recruId)
        history.push(_path, {
            tuyendungId: recruId
        });
    }

    const [jobs, setJobs] = useState([]);
    const [countJ, setCountJ] = useState(0)
    const fetchJobs = async (value) => {
        const _path = endpoints["viec-lam"] + (value ? `?page=${value}` : `?page=1`)
        API.get(_path).then(res => {
            setJobs(res.data.results)
            setCountJ(res.data.count)
        })
    }

    const [pageJ, setPageJ] = useState(1);
    // chuyển trang
    const handleChangePageJ = (event, value) => {
        setPageJ(value);
        fetchJobs(value);
    };

    const [countF, setCountF] = useState(0)
    const handleChangePageFilter = (event, value) => {
        setPageJ(value);
        handleFilter(value);
    };

    return (
        <Container maxWidth='lg' >
            {nguoidung.nguoi_dung ? (
                <Box className={classes.block}>
                    <Typography variant="h4" className={classes.titleInfo}>Tìm công ty bạn muốn ứng tuyển ngay hôm nay!</Typography>
                    <ButtonGroup color="primary" fullWidth>
                        <Grid container spacing={0} xs={12}>
                            <Grid item xs={11}>
                                <TextField
                                    autoComplete="off" variant="outlined" fullWidth
                                    id='searchInput' value={searchInput}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSearch();
                                    }}
                                    onChange={(event) => setSearchInput(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.search}
                                    onClick={() => fetchRecruiter()}
                                ><SearchIcon className={classes.icon} /></Button>
                            </Grid>
                        </Grid>
                    </ButtonGroup>

                    {showSearchResult ? (
                        <>
                            <Grid container spacing={4} xs={12}>
                                <Grid item xs={7}>
                                    <Typography variant="body1" className={classes.titleInfo}>Kết quả tìm kiếm</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <div className={classes.pagination}>
                                        <Pagination count={Math.ceil(count / 2)} onChange={handleSearch} className={classes.pagination} size='large' />
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid container spacing={4} xs={12}>
                                {searchResult.length > 0 ? (
                                    searchResult.map((result, index) => {
                                        return (
                                            <Grid item xs={6}>
                                                <Card className={classes.card} onClick={() => hanleNameCompany(result.nguoi_dung.id)}>
                                                    <CardActionArea>
                                                        <CardContent>
                                                            <Typography variant="h6" className={classes.text2}>{result.ten_cong_ty}</Typography>
                                                            <Divider />
                                                            <Typography variant="body1" className={classes.text}>
                                                                Đánh giá: <Rating value={result.diem_danh_gia_tb} precision={0.5} readOnly size="large" />
                                                            </Typography>
                                                            <Typography variant="body1" className={classes.text}>{result.gioi_thieu.substr(0, 245)}...</Typography>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                            </Grid>
                                        );
                                    })
                                ) : (
                                    <Alert className={classes.card} severity="info">Không có kết quả phù hợp</Alert>
                                )}
                            </Grid>
                        </>
                    ) : (
                        <></>
                    )}
                </Box>
            ) : (
                <></>
            )}


            <Box className={classes.block}>
                <Typography variant="h4" className={classes.titleInfo}>Tìm kiếm công việc phù hợp với bạn!</Typography>
                <Grid container spacing={4} xs={12}>
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
                            onClick={() => handleFilter()}
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.search2}
                        >Tìm kiếm</Button>
                    </Grid>
                </Grid>

                <Grid container spacing={4} xs={12}>
                    {filterResult.count > 0
                        ? (
                            (filterResult.results).map((post, index) => {
                                return (
                                    <Grid item xs={6}>
                                        <Card className={classes.card} onClick={() => denTrangChiTietViecLam(post)}>
                                            <CardActionArea>
                                                <CardContent>
                                                    <Typography variant="h6" className={classes.text2}>{post.tieu_de}</Typography>
                                                    <Divider />
                                                    <Typography variant="body1" className={classes.text}>{post.nha_tuyen_dung.ten_cong_ty}</Typography>
                                                    <Typography variant="body1" className={classes.text}>Mức lương{" "}
                                                        {post.luong === 0 ? "Thương lượng" : currency(post.luong)}
                                                    </Typography>
                                                    <Divider />
                                                    <Typography variant="body1" className={classes.text}>{post.noi_dung.substr(0, 150)}...</Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                )
                            })
                        )
                        : (
                            (isFirstLoad ? (<></>) : (
                                <Alert className={classes.card} severity="info">Không có kết quả phù hợp</Alert>
                            ))
                        )
                    }

                    {filterResult.count > 0 ? (
                        <Grid item xs={12} >
                            <Pagination count={Math.ceil(countF / 2)} page={pageJ} onChange={handleChangePageFilter} className={classes.pagination} size='large' />
                        </Grid>
                    ) : (
                        <></>
                    )}
                </Grid>
            </Box>

            {_.isUndefined(filterResult.count) ? (
                <Box className={classes.block}>
                    <Typography variant="h4" className={classes.titleInfo}>Danh sách việc làm</Typography>
                    <Grid container spacing={4} xs={12}>
                        {jobs.map((post, index) => {
                            return (
                                <Grid item xs={6}>
                                    <Card className={classes.card} onClick={() => denTrangChiTietViecLam(post)}>
                                        <CardActionArea>
                                            <CardContent>
                                                <Typography variant="h6" className={classes.text2}>{post.tieu_de}</Typography>
                                                <Divider />
                                                <Typography variant="body1" className={classes.text}>{post.nha_tuyen_dung.ten_cong_ty}</Typography>
                                                <Typography variant="body1" className={classes.text}>Mức lương{" "}
                                                    {post.luong === 0 ? "Thương lượng" : currency(post.luong)}
                                                </Typography>
                                                <Divider />
                                                <Typography variant="body1" className={classes.text}>{post.noi_dung.substr(0, 150)}...</Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            )
                        })}
                        <Grid item xs={12} >
                            <Pagination count={Math.ceil(countJ / 2)} page={pageJ} onChange={handleChangePageJ} className={classes.pagination} size='large' />
                        </Grid>
                    </Grid>
                </Box>
            ) : (
                <></>
            )}
        </Container>
    );
}
