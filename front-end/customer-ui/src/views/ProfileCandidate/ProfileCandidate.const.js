import { TEXTFIELD_TYPE } from "../../consts/type-text";
import { FIELD_COMPONENT } from '../../consts/field';

export const ACCOUNT = {
    username: {
        id: 'username',
        label: 'Tên đăng nhập',
        xs: 12
    },
    password: {
        id: 'password',
        label: 'Mật khẩu',
        type: TEXTFIELD_TYPE.PASSWORD,
        xs: 12
    },
    confirm_password: {
        id: 'confirm_password',
        label: 'Xác nhận mật khẩu',
        type: TEXTFIELD_TYPE.PASSWORD,
        xs: 12
    },
    last_name: {
        id: 'last_name',
        label: 'Họ người dùng',
        xs: 7
    },
    first_name: {
        id: 'first_name',
        label: 'Tên người dùng',
        xs: 5
    },
    email: {
        id: 'email',
        label: 'Email',
        type: TEXTFIELD_TYPE.EMAIL,
        xs: 7
    },
    so_dien_thoai: {
        id: 'so_dien_thoai',
        label: 'Số điện thoại',
        xs: 5,
        type: 'number'
    },
}

export const INFO = {
    ngay_sinh: {
        id: 'ngay_sinh',
        label: 'Ngày sinh',
        xs: 12,
        component: FIELD_COMPONENT.DATE,
    },
    dia_chi: {
        id: 'dia_chi',
        label: 'Địa chỉ',
        xs: 12,
    },
    cv: {
        id: 'cv',
        label: 'CV',
        xs: 3
    },
    gioi_thieu: {
        id: 'gioi_thieu',
        label: 'Thông tin người dùng',
        xs: 12,
        component: FIELD_COMPONENT.TEXT_AREA,
        rows: 10,
    },
}

export const TAG = {
    nganh_nghe: {
        id: 'nganh_nghe',
        label: 'Ngành nghề',
        xs: 12,
    },
    ky_nang: {
        id: 'ky_nang',
        label: 'Kỹ năng',
        xs: 12,
    },
    kinh_nghiem: {
        id: 'kinh_nghiem',
        label: 'Kinh nghiệm',
        xs: 12,
    },
    bang_cap: {
        id: 'bang_cap',
        label: 'Bằng cấp',
        xs: 12,
    },
}