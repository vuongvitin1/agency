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
}