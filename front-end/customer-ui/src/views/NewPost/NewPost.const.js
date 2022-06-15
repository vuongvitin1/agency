import { TEXTFIELD_TYPE } from "../../consts/type-text";

export const INFO_POST = {
    // ngay_tao: {
    //     id: 'ngay_tao',
    //     label: 'Ngày tạo',
    //     xs: 12,
    // },
    ngay_het_han: {
        id: 'ngay_het_han',
        label: 'Ngày hết hạn',
        xs: 12,
        required: 'required',
    },
    noi_dung: {
        id: 'noi_dung',
        label: 'Nội dung',
        xs: 12,
        rows: 25,
        required: 'required',
    },
    tieu_de: {
        id: 'tieu_de',
        label: 'Tiêu đề',
        xs: 12,
        required: 'true',
    },
    luong: {
        id: 'luong',
        label: 'Lương',
        xs: 12,
        type: TEXTFIELD_TYPE.NUMBER,
        required: 'true',
    },
    // trang_thai_viec_lam: {
    //     id: 'trang_thai_viec_lam',
    //     label: 'Trạng thái bài viết',
    //     xs: 12,
    // }
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
    phuc_loi: {
        id: 'benefit',
        label: 'Phúc lợi',
        xs: 12,
    },
}
