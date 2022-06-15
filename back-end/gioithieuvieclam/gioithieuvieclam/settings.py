from pathlib import Path

# Admin: admin matkhau123

# Tên rút gọn để dẫn vào thư mục project
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY: giữ key này bí mật trong môi trường production
SECRET_KEY = 'django-insecure-93_^h#)$6*umjpgx-(3(_3lni*^=jom4!l@nso62c=0adderx5'

# Tắt khi đang deploy lên production
DEBUG = True

# Cấu hình địa chỉ các host mà server chỉ cung cấp dịch vụ cho
ALLOWED_HOSTS = []

# OAuth2 thông tin app, gửi kèm rq để xin token
OAUTH2_INFO = {
    'client_id': 'ym2NZ2Xe2iwdoFlEnY0ZFzjS41WOJN1WlqHSXFgy',
    'client_secret': 'QtGDSjT44IsaxZ44znLb3xA5vW2jzaOzJN9rrv0V7njamjtT8AoaQ4JwRpUomVURN6fxwhz9EYkqODDyVQyoFnD4t3KZFf1w7LGku60XMB49aeREi4gY1Fmjk2ooH1hh'
}

# Khai báo, định nghĩa các app được sử dụng trong project

# Khai báo các app tự mình tạo hoặc sử dụng thư viện
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # App tự tạo
    'gioithieuvieclam_app.apps.GioithieuvieclamAppConfig',
    # Trình soạn thảo richtext
    'ckeditor',
    'ckeditor_uploader',
    # Làm rest api
    'rest_framework',
    # Chứng thực với oauth2
    'oauth2_provider',
    # Công cụ hỗ trợ debug, tạo docs api với swagger
    'drf_yasg',
    # Tool để debug, kiểm tra hiệu năng sản phẩm
    'debug_toolbar',
    # Cấu hình chia sẻ tài nguyên giữa các máy chủ
    'corsheaders'
]

REST_FRAMEWORK = {
    # Dùng rest framework để phân trang
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    # Mỗi respond trả về 2 trang
    'PAGE_SIZE': '6',
    # Cấu hình lớp sử dụng để chứng thực
    'DEFAULT_AUTHENTICATION_CLASSES': ('oauth2_provider.contrib.rest_framework.OAuth2Authentication', ),
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # Công cụ debug để do hiệu năng, chỉ sử dụng khi development
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    # Cấu hình để truy cập API từ client (chia sẻ tài nguyên)
    'corsheaders.middleware.CorsMiddleware'
]

# Thêm cái này để khi tương tác với ReactJS có thể parse dữ liệu
OAUTH2_PROVIDER = {
    'OAUTH2_BACKEND_CLASS': 'oauth2_provider.oauth2_backends.JSONOAuthLibCore'
}

# Cho phép những domain nào truy cập vào hệ thống
CORS_ALLOW_ALL_ORIGINS = True
# Cấu hình này giới hạn chỉ (vài) domain được truy cập
# CORS_ALLOWED_ORIGINS = ['http://localhost:3000/']

ROOT_URLCONF = 'gioithieuvieclam.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'gioithieuvieclam.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'gioithieuvieclam',
        'USER': 'root',
        'PASSWORD': '123456',
        'HOST': ''
    }
}

# Khai báo lớp user được sử dụng để chứng thực
AUTH_USER_MODEL = 'gioithieuvieclam_app.NguoiDung'

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)

STATIC_URL = '/static/'
MEDIA_ROOT = '%s/gioithieuvieclam_app/' % BASE_DIR
CKEDITOR_UPLOAD_PATH = 'ckeditor/'

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
