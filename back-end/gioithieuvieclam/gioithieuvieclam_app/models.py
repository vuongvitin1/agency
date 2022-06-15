# Tập tin này dùng để cấu hình các model ánh xạ xuống cơ sở dữ liệu
from django.contrib.auth.models import AbstractUser
from django.db import models
# from ckeditor.fields import RichTextField

# Ghi chú: Các trường của model default null=False


# Kế thừa lớp user của django để sử dụng các chức năng chứng thực của nó
class NguoiDung(AbstractUser):
    """
    Những trường có sẵn từ AbstractUser: id, password, last_login, is_superuser,
    username, first_name, last_name, email, is_staff, is_active, date_joined
    """

    class Meta:
        db_table = 'nguoi_dung'

    # Biến static để đánh dấu vai trò người dùng
    NHA_TUYEN_DUNG = 'TUYEN DUNG'
    UNG_VIEN = 'UNG VIEN'
    QUAN_LY = 'QUAN LY'
    VAI_TRO = [
        (NHA_TUYEN_DUNG, 'Nha tuyen dung'),
        (UNG_VIEN, 'Ung vien'),
        (QUAN_LY, 'Quan ly')
    ]

    email = models.CharField(max_length=50, null=False, unique=True)
    so_dien_thoai = models.CharField(max_length=15, blank=True, default="")
    anh_dai_dien = models.ImageField(upload_to='static/upload/%Y/%m', null=True,
                                     default='static/upload/avatarDefault.jpg')
    vai_tro = models.CharField(
        max_length=10,
        choices=VAI_TRO,
        default=''
    )


# User với vai trò là Nhà tuyển dụng
class NhaTuyenDung(models.Model):
    class Meta:
        db_table = 'nha_tuyen_dung'

    nguoi_dung = models.OneToOneField(
        NguoiDung,
        on_delete=models.CASCADE,
        primary_key=True,
    )
    ten_cong_ty = models.CharField(max_length=100)
    dia_chi = models.CharField(max_length=150)
    quy_mo = models.IntegerField(default=0)
    diem_danh_gia_tb = models.FloatField(default=0.0)
    doi_xet_duyet = models.BooleanField(default=True)
    gioi_thieu = models.TextField(blank=True, default="")


# User với vai trò là Ứng viên
class UngVien(models.Model):
    class Meta:
        db_table = 'ung_vien'

    nguoi_dung = models.OneToOneField(
        NguoiDung,
        on_delete=models.CASCADE,
        primary_key=True,
    )
    ngay_sinh = models.DateField(null=True)
    dia_chi = models.CharField(max_length=150, null=True)
    cv = models.FileField(upload_to='static/cv/%Y/%m', null=True)
    gioi_thieu = models.TextField(blank=True, default="")

    bang_cap = models.ManyToManyField('BangCap')
    ky_nang = models.ManyToManyField('KyNang')
    nganh_nghe = models.ManyToManyField('NganhNghe')
    kinh_nghiem = models.ManyToManyField('KinhNghiem')


# User với vai trò là Quản lý
class QuanLy(models.Model):
    class Meta:
        db_table = 'quan_ly'

    nguoi_dung = models.OneToOneField(
        NguoiDung,
        on_delete=models.CASCADE,
        primary_key=True,
    )
    log = models.TextField(blank=True, default="")


# Thông tinh đánh giá của Ứng viên đến Nhà tuyển dụng
class DanhGiaNhaTuyenDung(models.Model):
    class Meta:
        db_table = 'danh_gia_nha_tuyen_dung'

    ung_vien = models.ForeignKey(
        UngVien,
        on_delete=models.SET_NULL,
        null=True
    )
    nha_tuyen_dung = models.ForeignKey(NhaTuyenDung, on_delete=models.CASCADE)
    viec_lam = models.ForeignKey(
        'ViecLam',
        on_delete=models.SET_NULL,
        null=True
    )
    noi_dung = models.TextField()
    diem_danh_gia = models.FloatField()
    ngay_tao = models.DateField(auto_now_add=True)


# Thông tin việc làm được tạo bởi Nhà tuyển dụng
class ViecLam(models.Model):
    class Meta:
        db_table = 'viec_lam'

    # Biến static lưu trạng thái việc làm
    VI_PHAM = 'VI PHAM'
    DA_DONG = 'DA DONG'
    DANG_MO = 'DANG MO'

    TRANG_THAI = [
        (VI_PHAM, 'Viec lam vi pham quy dinh'),
        (DA_DONG, 'Viec lam khong nhan ho so dang ky nua'),
        (DANG_MO, 'Viec lam con nhan ho so'),
    ]

    nha_tuyen_dung = models.ForeignKey(
        NhaTuyenDung,
        on_delete=models.CASCADE,
    )
    ngay_tao = models.DateField(auto_now_add=True)
    ngay_het_han = models.DateField()
    noi_dung = models.TextField()
    tieu_de = models.CharField(max_length=80)
    luong = models.IntegerField(default=0)
    trang_thai_viec_lam = models.CharField(
        choices=TRANG_THAI,
        max_length=10,
        default=DANG_MO
    )
    # Các trường n-n chỉ lưu khóa không lưu thông tin gì thêm
    bang_cap = models.ManyToManyField('BangCap')
    ky_nang = models.ManyToManyField('KyNang')
    nganh_nghe = models.ManyToManyField('NganhNghe')
    kinh_nghiem = models.ManyToManyField('KinhNghiem')
    phuc_loi = models.ManyToManyField('PhucLoi')


# Lưu thông tin Ứng viên ứng tuyển vào một Việc làm (dùng báo cáo thống kê được)
class UngTuyen(models.Model):
    class Meta:
        db_table = 'ung_tuyen'

    # Biến static lưu trạng thái hồ sơ
    DUOC_CHAP_NHAN = 'CHAP NHAN'
    BI_TU_CHOI = 'TU CHOI'
    CHO_XU_LY = 'CHO XU LY'

    TRANG_THAI = [
        (DUOC_CHAP_NHAN, 'Ho so duoc NTD chap nhan'),
        (BI_TU_CHOI, 'NTD tu choi ho so'),
        (CHO_XU_LY, 'Ho so van dang xu ly'),
    ]

    # Trường cho biết là ứng viên nộp đơn ứng tuyển hay NTD gửi lời mời làm
    NHA_TUYEN_DUNG = 'NTD'
    UNG_VIEN = 'UV'

    viec_lam = models.ForeignKey(ViecLam, on_delete=models.SET_NULL, null=True)
    ung_vien = models.ForeignKey(UngVien, on_delete=models.SET_NULL, null=True)
    ngay_ung_tuyen = models.DateField(auto_now_add=True)
    trang_thai_ho_so = models.CharField(
        choices=TRANG_THAI,
        max_length=10,
        default=CHO_XU_LY
    )
    ung_vien_nop_don = models.BooleanField(default=True)


# Thông tin các ngành nghề vd: xây dựng, làm đẹp,...
class NganhNghe(models.Model):
    class Meta:
        db_table = 'nganh_nghe'

    ten = models.CharField(max_length=50)


# Thông tin các nhóm kỹ năng (để lọc thông tin hiệu quả)
class KyNang(models.Model):
    class Meta:
        db_table = 'ky_nang'

    ten = models.CharField(max_length=50)


# Thông tin các chế độ phúc lợi, bảo hiểm (có thể thêm bớt, thay đổi)
class PhucLoi(models.Model):
    class Meta:
        db_table = 'phuc_loi'

    ten = models.CharField(max_length=50)


# Thông tin các mức độ kinh nghiệm (thực tập sinh, quản lý cao cấp,...)
class KinhNghiem(models.Model):
    class Meta:
        db_table = 'kinh_nghiem'

    ten = models.CharField(max_length=80)


# Thông tin các chức danh của Ứng viên (job title)
class ChucDanh(models.Model):
    class Meta:
        db_table = 'chuc_danh'

    ten = models.CharField(max_length=50)


# Thông tin các văn bằng
class BangCap(models.Model):
    class Meta:
        db_table = 'bang_cap'

    ten = models.CharField(max_length=50)
