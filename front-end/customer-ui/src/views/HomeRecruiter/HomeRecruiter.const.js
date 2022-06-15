import { TEXTFIELD_TYPE } from "../../consts/type-text";

export const ACCOUNT = {
    // username: {
    //     id: 'username',
    //     label: 'Tên đăng nhập',
    //     xs: 12
    // },
    // password: {
    //     id: 'password',
    //     label: 'Mật khẩu',
    //     type: TEXTFIELD_TYPE.PASSWORD,
    //     xs: 12
    // },
    // confirm_password: {
    //     id: 'confirm_password',
    //     label: 'Xác nhận mật khẩu',
    //     type: TEXTFIELD_TYPE.PASSWORD,
    //     xs: 12
    // },
    // last_name: {
    //     id: 'last_name',
    //     label: 'Họ người dùng',
    //     xs: 7
    // },
    // first_name: {
    //     id: 'first_name',
    //     label: 'Tên người dùng',
    //     xs: 5
    // },
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
    ten_cong_ty: {
        id: 'ten_cong_ty',
        label: 'Tên công ty',
        xs: 12,
    },
    dia_chi: {
        id: 'dia_chi',
        label: 'Địa chỉ',
        xs: 12,
    },
    gioi_thieu: {
        id: 'gioi_thieu',
        label: 'Thông tin công ty',
        xs: 12,
        rows: 17,
    },
    diem_danh_gia_tb: {
        id: 'diem_danh_gia_tb',
        label: 'Điểm đánh giá',
        xs: 12,
        readOnly: true,
    },
    quy_mo: {
        id: 'quy_mo',
        label: 'Số lượng nhân viên',
        xs: 12,
        type: 'number',
    }
}

export const TAG = {
    nganh_nghe: {
        id: 'career',
        label: 'Ngành nghề',
        xs: 12,
    },
    ky_nang: {
        id: 'skill',
        label: 'Kỹ năng',
        xs: 12,
    },
    kinh_nghiem: {
        id: 'experience',
        label: 'Kinh nghiệm',
        xs: 12,
    },
    bang_cap: {
        id: 'degree',
        label: 'Bằng cấp',
        xs: 12,
    },
}

export const JOB_TABLE = [
    { id: 'stt', label: 'STT', maxWidth: 20, align: 'center', },
    {
        id: 'tieu_de',
        label: 'Tiêu đề',
        minWidth: 100,
        // align: 'center',
    },
    {
        id: 'noi_dung',
        label: 'Nội dung',
        minWidth: 100,
        // align: 'right',
    },
    {
        id: 'luong',
        label: 'Mức lương',
        minWidth: 100,
        align: 'right',
    },
    {
        id: 'ngay_tao',
        label: 'Ngày đăng',
        minWidth: 100,
        align: 'right',
    },
    {
        id: 'ngay_het_han',
        label: 'Đén ngày',
        minWidth: 100,
        align: 'right',
    },
    {
        id: 'trang_thai_viec_lam',
        label: 'Trạng thái',
        minWidth: 100,
        align: 'center',
    },
]