from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import *

# Register model để dễ chỉnh sửa trong django admin
admin.site.register(NguoiDung)
admin.site.register(UngVien)
admin.site.register(NhaTuyenDung)
admin.site.register(ViecLam)
admin.site.register(UngTuyen)
admin.site.register(NganhNghe)
admin.site.register(KyNang)
admin.site.register(BangCap)
admin.site.register(KinhNghiem)
admin.site.register(PhucLoi)
admin.site.register(DanhGiaNhaTuyenDung)
admin.site.register(QuanLy)
