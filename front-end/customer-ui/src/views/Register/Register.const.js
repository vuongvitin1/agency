import { TEXTFIELD_TYPE } from "../../consts/type-text";
import { FIELD_COMPONENT } from '../../consts/field';

// export const ACCOUNT1 = [
//     {
//         id: 'last_name',
//         label: 'Họ người dùng',
//         xs: 7,
//         required: 'true',
//     },
//     {
//         id: 'first_name',
//         label: 'Tên người dùng',
//         xs: 5,
//         // required,
//     },
//     {
//         id: 'email',
//         label: 'Email',
//         xs: 7,
//         // required,
//     },
//     {
//         id: 'so_dien_thoai',
//         label: 'Số điện thoại',
//         xs: 5,
//         type: TEXTFIELD_TYPE.NUMBER,
//         // required,
//     },
//     {
//         id: 'username',
//         label: 'Tên đăng nhập',
//         xs: 12,
//         // required,
//     },
//     {
//         id: 'password',
//         label: 'Mật khẩu',
//         type: TEXTFIELD_TYPE.PASSWORD,
//         xs: 12,
//         // required,
//     },
//     {
//         id: 'confirm_password',
//         label: 'Xác nhận mật khẩu',
//         type: TEXTFIELD_TYPE.PASSWORD,
//         xs: 12,
//         // required,
//     },
// ]

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
    // day_birth: {
    //     id: 'day_birth',
    //     label: 'Ngày sinh',
    //     xs: 5,
    //     component: FIELD_COMPONENT.DATE,
    // },
    // anh_dai_dien: {
    //     id: 'anh_dai_dien',
    //     label: 'Ảnh đại diện',
    //     xs: 3,
    //     component: FIELD_COMPONENT.FILE_IMG,
    // },
    // cv: {
    //     id: 'cv',
    //     label: 'CV',
    //     xs: 3
    // },
    // gioi_thieu: {
    //     id: 'gioi_thieu',
    //     label: 'Thông tin người dùng',
    //     xs: 12,
    //     component: FIELD_COMPONENT.TEXT_AREA,
    //     rows: 10,
    // },
}