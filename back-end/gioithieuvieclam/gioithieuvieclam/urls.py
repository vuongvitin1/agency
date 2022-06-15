"""
Tập tin này dùng để cấu hình url root, khi client gửi req thì ở đây sẽ được
gọi đầu tiên
"""
import debug_toolbar
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Bổ trợ sinh api document, thông tin này sẽ hiện lên ở swagger
schema_view = get_schema_view(
    openapi.Info(
        title="Website Giới thiệu việc làm API",
        default_version='v1',
        description="Bài tập lớn môn học Các công nghệ lập trình hiện đại, ĐH Mở TP.HCM 2021.",
        contact=openapi.Contact(email="1851050127tan@ou.edu.vn"),
        license=openapi.License(name="Trần Quốc Tấn, Lê Quốc Vin @2021"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# Khai báo các route/path dẫn đến các app được sử dụng
urlpatterns = [
    # Đầu tiên nhất dẫn vào trong app của mình
    path('', include('gioithieuvieclam_app.urls')),
    # Đường dẫn vào trang admin mặc định
    path('admin/', admin.site.urls),
    # Đường dẫn oauth2 để lấy token, app chứng thực, /o tên khác vẫn được
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    # Chỉ copy paste, swagger để sinh api document
    re_path(r'^swagger(?P<format>\.json|\.yaml)$',schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    # Debug toolbar, khi load trang sẽ hiển thị
    path('__debug__/', include(debug_toolbar.urls))
]
