# Tập tin này để xử lý request và trả về các response (tương tự controller trong
# MVC, là thành phần Views trong MVT)
import datetime
import math
import json
import traceback

from django.db.models import Count, Q, Avg
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist

from .serializers import *


# Đăng ký user (tích hợp OAuth2)
# Sử dụng ViewSet để tự cấu hình thay vì các lớp view được hiện thực sẵn
# Sử dụng generics.CreateAPIView để hiện thực các phương thức create của viewset
# Sử dụng generics.RetrieveAPIView để lấy thông tin 1 user thông qua id
# Để ràng buộc chỉ user đã đăng nhập mới lấy được thông tin ta ghi đè lại phương
# thức get_permission
class NguoiDungViewSet(viewsets.ViewSet, generics.CreateAPIView):
    # Chỉ định câu truy vấn
    queryset = NguoiDung.objects.filter(is_active=True)
    # Chỉ định lớp serializer
    serializer_class = NguoiDungSerializer
    parser_classes = [MultiPartParser]

    # Chỉ định quyền user đã đăng nhập
    def get_permissions(self):
        # Chỉ riêng đối với thao tác get data user hiện tại phải chứng thực
        if self.action == 'hien_tai':
            return [permissions.IsAuthenticated()]
        # Thao tác như đăng ký ko cần chứng thực
        return [permissions.AllowAny()]

    # Đăng ký người dùng, check một số điều kiện rồi gọi super của generics
    def create(self, request, *args, **kwargs):
        # Dùng lại code của generics create api. Parse req data thành dict
        nguoi_dung = self.get_serializer(data=request.data)
        # Dữ liệu được serialize ra hợp lệ
        nguoi_dung.is_valid(raise_exception=True)
        # Lưu xuống csdl
        self.perform_create(nguoi_dung)

        vai_tro = request.data.get('vai_tro')
        if vai_tro is not None:
            if vai_tro == NguoiDung.NHA_TUYEN_DUNG:
                NhaTuyenDung.objects.create(nguoi_dung_id=nguoi_dung.data.get('id'))
            if vai_tro == NguoiDung.UNG_VIEN:
                UngVien.objects.create(nguoi_dung_id=nguoi_dung.data.get('id'))

        headers = self.get_success_headers(nguoi_dung.data)
        return Response(nguoi_dung.data, status=status.HTTP_201_CREATED, headers=headers)

    # Tạo API get dữ liệu user sau khi đã chứng thực (đã đăng nhập)
    @action(methods=['get'], detail=False, url_path='hien-tai')
    def hien_tai(self, request):
        # Request gửi lên chỉ có header chứa token và đối tượng của NguoiDung
        vai_tro = request.user.vai_tro
        # Vai trò nào thì query trả ra thêm thông tin trong vai trò đó
        if vai_tro == NguoiDung.UNG_VIEN:
            query = UngVien.objects.get(pk=request.user.id)
            data = UngVienSerializer(query, context={'request': request}).data
        elif vai_tro == NguoiDung.NHA_TUYEN_DUNG:
            query = NhaTuyenDung.objects.get(pk=request.user.id)
            data = NhaTuyenDungSerializer(query, context={'request': request}).data
        elif vai_tro == NguoiDung.QUAN_LY:
            query = QuanLy.objects.get(pk=request.user.id)
            data = QuanLySerializer(query, context={'request': request}).data
        else:
            data = None

        if data is not None:
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response(self.serializer_class(request.user, context={'request': request}).data,
                            status.HTTP_200_OK)


class PhucLoiViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = PhucLoi.objects.all()
    serializer_class = PhucLoiSerializer
    pagination_class = None


class KinhNghiemViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = KinhNghiem.objects.all()
    serializer_class = KinhNghiemSerializer
    pagination_class = None


class NganhNgheViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = NganhNghe.objects.all()
    serializer_class = NganhNgheSerializer
    pagination_class = None


class KyNangViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = KyNang.objects.all()
    serializer_class = KyNangSerializer
    pagination_class = None


class BangCapViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = BangCap.objects.all()
    serializer_class = BangCapSerializer
    pagination_class = None


class ViecLamPagination(PageNumberPagination):
    page_size = 2


class ViecLamViewSet(viewsets.ViewSet, generics.ListAPIView, generics.UpdateAPIView):
    queryset = ViecLam.objects.filter(trang_thai_viec_lam=ViecLam.DANG_MO)
    serializer_class = ViecLamSerializer
    pagination_class = ViecLamPagination

    # Nếu có query param gửi lên để lọc thì lọc trả ra kết quả
    def get_queryset(self):
        viec_lam = ViecLam.objects.filter(trang_thai_viec_lam=ViecLam.DANG_MO).order_by("-ngay_tao")

        # Có param nào thì filter theo param đó, lưu ý giá trị gửi lên là id
        nganh_nghe = self.request.query_params.get('nganh-nghe')
        bang_cap = self.request.query_params.get('bang-cap')
        kinh_nghiem = self.request.query_params.get('kinh-nghiem')
        ky_nang = self.request.query_params.get('ky-nang')

        if nganh_nghe is not None:
            viec_lam = viec_lam.filter(nganh_nghe=nganh_nghe)

        if bang_cap is not None:
            viec_lam = viec_lam.filter(bang_cap=bang_cap)

        if kinh_nghiem is not None:
            viec_lam = viec_lam.filter(kinh_nghiem=kinh_nghiem)

        if ky_nang is not None:
            viec_lam = viec_lam.filter(ky_nang=ky_nang)

        return viec_lam

    # Override generic để lấy chi tiết nha_tuyen_dung
    def retrieve(self, request, pk=None):
        queryset = ViecLam.objects.filter(trang_thai_viec_lam=ViecLam.DANG_MO).select_related(
            'nha_tuyen_dung__nguoi_dung')
        vieclam = get_object_or_404(queryset, pk=pk)
        serializer = ViecLamSerializer(vieclam)
        return Response(serializer.data)

    # Nhà tuyển dụng tạo một việc làm mới
    def create(self, request):
        try:
            # Các trường n-n phải add riêng
            nganh_nghe_list = request.data.get('nganh_nghe')
            bang_cap_list = request.data.get('bang_cap')
            kinh_nghiem_list = request.data.get('kinh_nghiem')
            ky_nang_list = request.data.get('ky_nang')
            phuc_loi_list = request.data.get('phuc_loi')

            # Tạo trước đối tượng việc làm cơ bản
            viec_lam = ViecLam(nha_tuyen_dung_id=request.data.get('nha_tuyen_dung_id'),
                               tieu_de=request.data.get('tieu_de'),
                               noi_dung=request.data.get('noi_dung'),
                               luong=int(request.data.get('luong')),
                               ngay_het_han=request.data.get('ngay_het_han'))
            viec_lam.save()

            # Tạo các quan hệ n-n
            if nganh_nghe_list is not None:
                for nghe in nganh_nghe_list:
                    nganh_nghe = NganhNghe.objects.get(pk=nghe['value'])
                    viec_lam.nganh_nghe.add(nganh_nghe)

            if bang_cap_list is not None:
                for bang in bang_cap_list:
                    bang_cap = BangCap.objects.get(pk=bang['value'])
                    viec_lam.bang_cap.add(bang_cap)

            if kinh_nghiem_list is not None:
                for knghiem in kinh_nghiem_list:
                    kinh_nghiem = KinhNghiem.objects.get(pk=knghiem['value'])
                    viec_lam.kinh_nghiem.add(kinh_nghiem)

            if ky_nang_list is not None:
                for kynang in ky_nang_list:
                    ky_nang = KyNang.objects.get(pk=kynang['value'])
                    viec_lam.ky_nang.add(ky_nang)

            if phuc_loi_list is not None:
                for phucloi in phuc_loi_list:
                    phuc_loi = PhucLoi.objects.get(pk=phucloi['value'])
                    viec_lam.phuc_loi.add(phuc_loi)

            return Response(status.HTTP_201_CREATED)

        except Exception as ex:
            print(ex)
            return Response(status.HTTP_400_BAD_REQUEST)

    # Cập nhật thông tin bài viết (ghi đè generics update)
    def put(self, request, *args, **kwargs):
        try:
            vieclam = ViecLam.objects.get(pk=request.data['id'])

            # Vì dữ liệu gửi lên là đối tượng của FormData nên phải parse json mới ra được dict của python
            # nganh_nghe_list = json.loads(request.data.get('nganh_nghe'))
            # bang_cap_list = json.loads(request.data.get('bang_cap'))
            # kinh_nghiem_list = json.loads(request.data.get('kinh_nghiem'))
            # ky_nang_list = json.loads(request.data.get('ky_nang'))
            # phuc_loi_list = json.loads(request.data.get('phuc_loi'))

            nganh_nghe_list = request.data.get('nganh_nghe')
            bang_cap_list = request.data.get('bang_cap')
            kinh_nghiem_list = request.data.get('kinh_nghiem')
            ky_nang_list = request.data.get('ky_nang')
            phuc_loi_list = request.data.get('phuc_loi')

            # traceback.print_exc()

            # Phần nào có thì cập nhật
            if nganh_nghe_list is not None:
                # Phương thức clear sẽ tạm thời không link các trường m2m lại, không thực sự xóa dưới csdl
                vieclam.nganh_nghe.clear()
                for nghe in nganh_nghe_list:
                    nganh_nghe = NganhNghe.objects.get(pk=nghe['value'])
                    vieclam.nganh_nghe.add(nganh_nghe)

            if bang_cap_list is not None:
                vieclam.bang_cap.clear()
                for bang in bang_cap_list:
                    bang_cap = BangCap.objects.get(pk=bang['value'])
                    vieclam.bang_cap.add(bang_cap)

            if kinh_nghiem_list is not None:
                vieclam.kinh_nghiem.clear()
                for knghiem in kinh_nghiem_list:
                    kinh_nghiem = KinhNghiem.objects.get(pk=knghiem['value'])
                    vieclam.kinh_nghiem.add(kinh_nghiem)

            if ky_nang_list is not None:
                vieclam.ky_nang.clear()
                for kynang in ky_nang_list:
                    ky_nang = KyNang.objects.get(pk=kynang['value'])
                    vieclam.ky_nang.add(ky_nang)

            if phuc_loi_list is not None:
                vieclam.phuc_loi.clear()
                for phucloi in phuc_loi_list:
                    phuc_loi = PhucLoi.objects.get(pk=phucloi['value'])
                    vieclam.phuc_loi.add(phuc_loi)

            if request.data.get('luong') is not None:
                vieclam.luong = request.data.get('luong')
            if request.data.get('ngay_het_han') is not None:
                vieclam.ngay_het_han = request.data.get('ngay_het_han')
            if request.data.get('noi_dung') is not None:
                vieclam.noi_dung = request.data.get('noi_dung')
            if request.data.get('tieu_de') is not None:
                vieclam.tieu_de = request.data.get('tieu_de')

            vieclam.save()

            return Response(data=self.serializer_class(vieclam).data, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({"Bad request": "Du lieu gui len khong dung yeu cau"}, status.HTTP_400_BAD_REQUEST)

    # Lấy dữ liệu công việc gợi ý dựa trên ngành nghề của ứng viên (id gửi lên)
    @action(methods=['get'], detail=True, url_path='goi-y')
    def goi_y(self, request, pk):
        viec_lam = ViecLam.objects.filter(trang_thai_viec_lam=ViecLam.DANG_MO)
        ung_vien = UngVien.objects.get(pk=pk)
        nganh_nghe = ung_vien.nganh_nghe.first()
        if nganh_nghe is not None:
            viec_lam = viec_lam.filter(nganh_nghe__id=nganh_nghe.id)
        else:
            viec_lam = viec_lam.filter(trang_thai_viec_lam=ViecLam.DANG_MO)[:5]
        return Response(self.serializer_class(viec_lam, many=True).data, status=status.HTTP_200_OK)


class NhaTuyenPagination(PageNumberPagination):
    page_size = 2

class NhaTuyenDungViewSet(viewsets.ViewSet, generics.ListAPIView,
                          generics.RetrieveAPIView, generics.UpdateAPIView):
    serializer_class = NhaTuyenDungSerializer
    queryset = NhaTuyenDung.objects.filter(doi_xet_duyet=False)
    pagination_class = NhaTuyenPagination

    # Nếu có query param là search thì tiến hành query tìm kiếm ntd, không thì trả ra tất cả
    def get_queryset(self):
        ntd = NhaTuyenDung.objects.filter(doi_xet_duyet=False)

        tim_kiem = self.request.query_params.get('tim-kiem')
        if tim_kiem is not None:
            ntd = ntd.filter(ten_cong_ty__icontains=tim_kiem)

        return ntd

    # Cập nhật thông tin nhà tuyển dụng (ghi đè generics update)
    def put(self, request, *args, **kwargs):
        try:
            # Lấy dữ liệu từ 2 bảng để cập nhật thông tin
            ntd = NhaTuyenDung.objects.get(pk=request.data['id'])
            nguoidung = NguoiDung.objects.get(pk=request.data['id'])

            # Có trường nào thì cập nhật trường đó
            if request.data.get('email') is not None:
                nguoidung.email = request.data.get('email')
            if request.data.get('first_name') is not None:
                nguoidung.first_name = request.data.get('first_name')
            if request.data.get('last_name') is not None:
                nguoidung.last_name = request.data.get('last_name')
            if request.data.get('so_dien_thoai') is not None:
                nguoidung.so_dien_thoai = request.data.get('so_dien_thoai')
            if request.data.get('anh_dai_dien') is not None:
                nguoidung.anh_dai_dien = request.data.get('anh_dai_dien')

            if request.data.get('ten_cong_ty') is not None:
                ntd.ten_cong_ty = request.data.get('ten_cong_ty')
            if request.data.get('dia_chi') is not None:
                ntd.dia_chi = request.data.get('dia_chi')
            if request.data.get('quy_mo') is not None:
                ntd.quy_mo = request.data.get('quy_mo')
            if request.data.get('gioi_thieu') is not None:
                ntd.gioi_thieu = request.data.get('gioi_thieu')
            ntd.doi_xet_duyet = False

            nguoidung.save()
            ntd.save()

            return Response(data=self.serializer_class(ntd).data, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({"Bad request": "Du lieu gui len khong dung yeu cau"}, status.HTTP_400_BAD_REQUEST)

    # API trả ra tất cả bài viết (tin tuyển dụng việc làm) đang mở của một ntd cụ thể (id)
    @action(methods=['get'], detail=True, url_path='viec-lam')
    def bai_viet(self, request, pk):
        bai_viet = NhaTuyenDung.objects.get(pk=pk).vieclam_set.filter(trang_thai_viec_lam=ViecLam.DANG_MO)

        # Nhận vào req params (nếu có) để tìm tên việc làm đang mở
        tim_kiem = request.query_params.get('tim-kiem')
        if tim_kiem is not None:
            bai_viet = bai_viet.filter(tieu_de__icontains=tim_kiem)

        return Response(ViecLamSerializer(bai_viet, many=True).data,
                        status=status.HTTP_200_OK)

    # Lấy danh sách nhà tuyển dụng đang đợi xét duyệt cho admin xử lý
    @action(methods=['get'], detail=False, url_path='doi-xet-duyet')
    def doi_xet_duyet(self, request):
        query = NhaTuyenDung.objects.filter(doi_xet_duyet=True)
        data = NhaTuyenDungSerializer(query, many=True).data

        return Response(data, status.HTTP_200_OK)

    # Duyệt nhà tuyển dụng, tài khoản sẵn sàng hoạt động
    @action(methods=['patch'], detail=True, url_path='duyet-nha-tuyen-dung')
    def duyet_nha_tuyen_dung(self, request, pk):
        quan_ly_id = request.data.get('quanLyId')
        try:
            nha_tuyen_dung = NhaTuyenDung.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response({'request khong hop le': 'id nha tuyen dung khong ton tai'},
                            status.HTTP_400_BAD_REQUEST)
        else:
            nha_tuyen_dung.doi_xet_duyet = False
            nha_tuyen_dung.save()
            # Cập nhật log của quản lý
            quan_ly = QuanLy.objects.get(pk=quan_ly_id)
            quan_ly.log = quan_ly.log + "%s: Duyet tai khoan nha tuyen dung ID: %s\n" % (datetime.datetime.now(), pk)
            quan_ly.save()

            # Trả về response hoàn chỉnh
            return Response({"da cap nhat": "tai khoan nha tuyen dung da duoc xet duyet"}, status=status.HTTP_200_OK)

    # Lấy các bài đánh giá của một nhà tuyển dụng
    @action(methods=['get'], detail=True, url_path='danh-gia')
    def danh_gia(self, request, pk):
        danh_gia = DanhGiaNhaTuyenDung.objects.filter(nha_tuyen_dung_id=pk).order_by("-ngay_tao")

        return Response(DanhGiaNhaTuyenDungSerializer(danh_gia, many=True).data,
                        status=status.HTTP_200_OK)


class UngTuyenViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = UngTuyen.objects.all()
    serializer_class = UngTuyenSerializer

    # Gọi khi có uv nộp đơn, hoặc ntd gửi off, tạo bản ghi mới, rq data bao gồm: việc làm id, ứng viên id, người gửi (uv/ntd)
    def create(self, request):
        uv_id = request.data.get('ung_vien')
        vl_id = request.data.get('viec_lam')
        trang_thai_ho_so = request.data.get('trang_thai_ho_so')
        ung_vien_nop_don = request.data.get('ung_vien_nop_don')
        nguoi_yeu_cau = request.data.get('nguoi_yeu_cau')

        ung_tuyen = UngTuyen.objects.filter(ung_vien_id=uv_id, viec_lam_id=vl_id)

        # Cập nhật trạng thái (có bản ghi dưới csdl rồi)
        if len(ung_tuyen) > 0:
            print(ung_tuyen)
            ung_tuyen = ung_tuyen.first()
            # Nhà tuyển dụng chấp nhận/từ chối hồ sơ ứng viên gửi (ung_vien_nop_don == True)
            if nguoi_yeu_cau == NguoiDung.NHA_TUYEN_DUNG:
                if ung_tuyen.ung_vien_nop_don is True:
                    ung_tuyen.trang_thai_ho_so = trang_thai_ho_so
                    ung_tuyen.save()
                    return Response({"cap nhat thanh cong": "nha tuyen dung da chap nhan/tu choi ho so ung vien"},
                                    status.HTTP_200_OK)

            # Ứng viên chấp nhận hồ sơ nhà tuyển dụng gửi (ung_vien_nop_don == False)
            if nguoi_yeu_cau == NguoiDung.UNG_VIEN:
                if ung_tuyen.ung_vien_nop_don is False:
                    ung_tuyen.trang_thai_ho_so = UngTuyen.DUOC_CHAP_NHAN
                    ung_tuyen.save()
                    return Response({"cap nhat thanh cong": "ung vien da chap nhan de nghi viec lam thanh cong"})

            return Response(data={'loi': 'tai nguyen da ton tai, khong the ghi de'},
                            status=status.HTTP_409_CONFLICT)

        # Tạo mới bản ghi
        if len(ung_tuyen) == 0:
            # Nhà tuyển dụng gửi đề nghị việc làm cho ứng viên
            if nguoi_yeu_cau == NguoiDung.NHA_TUYEN_DUNG:
                res = UngTuyen.objects.create(ung_vien_id=uv_id,
                                              viec_lam_id=vl_id,
                                              ung_vien_nop_don=False,
                                              trang_thai_ho_so=trang_thai_ho_so)
                return Response(UngTuyenSerializer(res).data, status=status.HTTP_201_CREATED)

            # Ứng viên nộp đơn ứng tuyển cho nhà tuyển dụng
            if nguoi_yeu_cau == NguoiDung.UNG_VIEN:
                res = UngTuyen.objects.create(ung_vien_id=uv_id,
                                              viec_lam_id=vl_id,
                                              ung_vien_nop_don=True,
                                              trang_thai_ho_so=trang_thai_ho_so)
                return Response(UngTuyenSerializer(res).data, status=status.HTTP_201_CREATED)

        return Response(status.HTTP_400_BAD_REQUEST)

    # Lấy danh sách việc làm ứng viên nộp đơn cho nhà tuyển dụng và đợi duyệt
    @action(methods=['get'], detail=True, url_path='ung-vien-doi-duyet')
    def ung_vien_doi_duyet(self, request, pk):
        danh_sach = UngTuyen.objects.filter(trang_thai_ho_so=UngTuyen.CHO_XU_LY,
                                            ung_vien_nop_don=True,
                                            viec_lam__nha_tuyen_dung_id=pk)
        # print(danh_sach.values())
        data = self.serializer_class(danh_sach, many=True).data

        return Response(data=data, status=status.HTTP_200_OK)

    # Lấy danh sách các việc làm nhà tuyển dụng gửi cho ứng viên và đợi chấp nhận
    @action(methods=['get'], detail=True, url_path='de-xuat-viec-lam')
    def de_xuat_viec_lam(self, request, pk):
        danh_sach = UngTuyen.objects.filter(trang_thai_ho_so=UngTuyen.CHO_XU_LY,
                                            ung_vien_nop_don=False,
                                            ung_vien_id=pk)
        data = self.serializer_class(danh_sach, many=True).data

        return Response(data=data, status=status.HTTP_200_OK)

    # Lấy danh sách các công việc một ứng viên cụ thể đã ứng tuyển vào một nhà tuyển dụng cụ thể
    # và được chấp nhận để được phép thao tác đánh giá
    @action(methods=['get'], detail=False, url_path='duoc-chap-nhan')
    def duoc_chap_nhan(self, request):
        ung_vien_id = request.query_params.get('ung_vien_id')
        nha_tuyen_dung_id = request.query_params.get('nha_tuyen_dung_id')
        try:
            danh_sach = UngTuyen.objects.filter(trang_thai_ho_so=UngTuyen.DUOC_CHAP_NHAN,
                                                ung_vien_id=ung_vien_id,
                                                viec_lam__nha_tuyen_dung_id=nha_tuyen_dung_id)
            # print(danh_sach.values())
            return Response(self.serializer_class(danh_sach, many=True).data, status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status.HTTP_400_BAD_REQUEST)

    # Thống kê theo quý (nếu có truyền vào) ứng viên nộp đơn vào những ngành nghề nào
    @action(methods=['get'], detail=False, url_path='thong-ke')
    def thong_ke(self, request):
        # Lọc những ứng viên nộp đơn
        truy_van = UngTuyen.objects.filter(ung_vien_nop_don=True)
        # Lấy request params
        quy = int(request.query_params.get('quy'))
        nam = int(request.query_params.get('nam'))
        # Lọc ra danh sách ngành nghề
        data = {}
        nganh_nghe = NganhNghe.objects.all()
        # Quý 0 thì thống kê theo năm gửi vào
        if quy == 0:
            truy_van = UngTuyen.objects.filter(ung_vien_nop_don=True, ngay_ung_tuyen__year=nam)
            for nghe in nganh_nghe:
                data[nghe.ten] = truy_van.filter(viec_lam__nganh_nghe__id=nghe.id).count()
            return Response(data, status.HTTP_200_OK)
        if quy == 1:
            ngay_bat_dau = datetime.date(nam, 1, 1)
            ngay_ket_thuc = datetime.date(nam, 3, 31)
        elif quy == 2:
            ngay_bat_dau = datetime.date(nam, 4, 1)
            ngay_ket_thuc = datetime.date(nam, 6, 30)
        elif quy == 3:
            ngay_bat_dau = datetime.date(nam, 7, 1)
            ngay_ket_thuc = datetime.date(nam, 9, 30)
        elif quy == 4:
            ngay_bat_dau = datetime.date(nam, 10, 1)
            ngay_ket_thuc = datetime.date(nam, 12, 31)
        else:
            return Response({"thieu query param": "can query param 'quy' va 'nam' de truy van"},
                            status.HTTP_400_BAD_REQUEST)

        # Lọc các đơn ứng tuyển được nộp trong quý được truyền vào ở trên
        truy_van = truy_van.filter(ngay_ung_tuyen__range=(ngay_bat_dau, ngay_ket_thuc))

        # Lọc ra số đơn ứng tuyển ứng với ngành nghề, đếm số lượng
        for nghe in nganh_nghe:
            data[nghe.ten] = truy_van.filter(viec_lam__nganh_nghe__id=nghe.id).count()
        return Response(data, status.HTTP_200_OK)


class UngVienViewSet(viewsets.ViewSet, generics.RetrieveAPIView,
                     generics.ListAPIView, generics.UpdateAPIView):
    queryset = UngVien.objects.all()
    serializer_class = UngVienSerializer

    def get_queryset(self):
        ung_vien = UngVien.objects.filter(nguoi_dung__is_active=True)

        # Có param nào thì filter theo param đó, lưu ý giá trị gửi lên là id
        nganh_nghe = self.request.query_params.get('nganh-nghe')
        bang_cap = self.request.query_params.get('bang-cap')
        kinh_nghiem = self.request.query_params.get('kinh-nghiem')
        ky_nang = self.request.query_params.get('ky-nang')

        if nganh_nghe is not None:
            ung_vien = ung_vien.filter(nganh_nghe__id=nganh_nghe)

        if bang_cap is not None:
            ung_vien = ung_vien.filter(bang_cap__id=bang_cap)

        if kinh_nghiem is not None:
            ung_vien = ung_vien.filter(kinh_nghiem__id=kinh_nghiem)

        if ky_nang is not None:
            ung_vien = ung_vien.filter(ky_nang__id=ky_nang)

        return ung_vien

    # Ghi đè lại phương thức put của generics để cập nhật thông tin người dùng là ứng viên
    def put(self, request, *args, **kwargs):
        try:
            # Lấy dữ liệu từ 2 bảng để cập nhật thông tin
            ungvien = UngVien.objects.get(pk=request.data['id'])
            nguoidung = NguoiDung.objects.get(pk=request.data['id'])

            # Có trường nào thì cập nhật trường đó
            if request.data.get('email') is not None:
                nguoidung.email = request.data.get('email')
            if request.data.get('first_name') is not None:
                nguoidung.first_name = request.data.get('first_name')
            if request.data.get('last_name') is not None:
                nguoidung.last_name = request.data.get('last_name')
            if request.data.get('so_dien_thoai') is not None:
                nguoidung.so_dien_thoai = request.data.get('so_dien_thoai')
            if request.data.get('anh_dai_dien') is not None:
                nguoidung.anh_dai_dien = request.data.get('anh_dai_dien')

            if request.data.get('ngay_sinh') is not None:
                ungvien.ngay_sinh = request.data.get('ngay_sinh')
            if request.data.get('dia_chi') is not None:
                ungvien.dia_chi = request.data.get('dia_chi')
            if request.data.get('cv') is not None:
                ungvien.cv = request.data.get('cv')
            if request.data.get('gioi_thieu') is not None:
                ungvien.gioi_thieu = request.data.get('gioi_thieu')

            # Vì dữ liệu gửi lên là đối tượng của FormData nên phải parse json mới ra được dict của python
            nganh_nghe_list = json.loads(request.data.get('nganh_nghe'))
            bang_cap_list = json.loads(request.data.get('bang_cap'))
            kinh_nghiem_list = json.loads(request.data.get('kinh_nghiem'))
            ky_nang_list = json.loads(request.data.get('ky_nang'))

            # Phần nào có thì cập nhật
            if nganh_nghe_list is not None:
                # Phương thức clear sẽ tạm thời không link các trường m2m lại, không thực sự xóa dưới csdl
                ungvien.nganh_nghe.clear()
                for nghe in nganh_nghe_list:
                    nganh_nghe = NganhNghe.objects.get(pk=nghe['value'])
                    ungvien.nganh_nghe.add(nganh_nghe)

            if bang_cap_list is not None:
                ungvien.bang_cap.clear()
                for bang in bang_cap_list:
                    bang_cap = BangCap.objects.get(pk=bang['value'])
                    ungvien.bang_cap.add(bang_cap)

            if kinh_nghiem_list is not None:
                ungvien.kinh_nghiem.clear()
                for knghiem in kinh_nghiem_list:
                    kinh_nghiem = KinhNghiem.objects.get(pk=knghiem['value'])
                    ungvien.kinh_nghiem.add(kinh_nghiem)

            if ky_nang_list is not None:
                ungvien.ky_nang.clear()
                for kynang in ky_nang_list:
                    ky_nang = KyNang.objects.get(pk=kynang['value'])
                    ungvien.ky_nang.add(ky_nang)

            nguoidung.save()
            ungvien.save()

            return Response(data=self.serializer_class(ungvien).data, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({"Bad request": "Du lieu gui len khong dung yeu cau"}, status.HTTP_400_BAD_REQUEST)


class DanhGiaNhaTuyenDungViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = DanhGiaNhaTuyenDung.objects.all()
    serializer_class = DanhGiaNhaTuyenDungSerializer

    # Lấy các bài đánh giá của ứng viên cụ thể đến nhà tuyển dụng
    @action(methods=['get'], detail=False, url_path='ung-vien-danh-gia')
    def ung_vien_danh_gia(self, request):
        uv_id = request.query_params.get('ungvien-id')
        ntd_id = request.query_params.get('nhatuyendung-id')

        if uv_id is not None and ntd_id is not None:
            danh_gia = DanhGiaNhaTuyenDung.objects.filter(ung_vien_id=uv_id, nha_tuyen_dung_id=ntd_id) \
                .order_by("-ngay_tao")
            # print(danh_gia)
            if len(danh_gia) > 0:
                data = self.serializer_class(danh_gia, many=True).data
                return Response(data, status.HTTP_200_OK)
            else:
                return Response(status.HTTP_404_NOT_FOUND)
        else:
            return Response({"yeu cau khong hop le": "can query param la ungvien-id va vieclam-id"},
                            status.HTTP_400_BAD_REQUEST)

    # Lấy các bài đánh giá về nhà tuyển dụng            new_active
    @action(methods=['get'], detail=False, url_path='tuyen-dung-xem-danh-gia')
    def tuyen_dung_xem_danh_gia(self, request):
        ntd_id = request.query_params.get('nhatuyendung-id')

        if ntd_id is not None:
            danh_gia = DanhGiaNhaTuyenDung.objects.filter(nha_tuyen_dung_id=ntd_id).order_by("-ngay_tao")
            # print(danh_gia)
            if len(danh_gia) > 0:
                data = self.serializer_class(danh_gia, many=True).data
                return Response(data, status.HTTP_200_OK)
            else:
                return Response(status.HTTP_404_NOT_FOUND)
        else:
            return Response({"yeu cau khong hop le": "can query param la nha_tuyen_dung_id"},
                            status.HTTP_400_BAD_REQUEST)

    # Ghi đè generics create để tạo bài đánh giá
    def create(self, request, *args, **kwargs):
        ung_vien_id = request.data.get('ung_vien_id')
        viec_lam_id = request.data.get('viec_lam_id')
        nha_tuyen_dung_id = request.data.get('nha_tuyen_dung_id')
        noi_dung = request.data.get('noi_dung')
        diem_danh_gia = request.data.get('diem_danh_gia')

        try:
            defaults = {
                'ung_vien_id': ung_vien_id,
                'viec_lam_id': viec_lam_id,
                'nha_tuyen_dung_id': nha_tuyen_dung_id,
                'noi_dung': noi_dung,
                'diem_danh_gia': diem_danh_gia
            }
            # QuerySet.update_or_create sẽ fetch dữ liệu từ dưới csdl lên theo **kwargs
            # nếu có thì cập nhật, ko thì tạo mới theo giá trị của dict khai báo trong defaults
            # phương thức này trả về tuple (obj, created)
            danh_gia = DanhGiaNhaTuyenDung.objects.update_or_create(ung_vien_id=ung_vien_id,
                                                                    viec_lam_id=viec_lam_id,
                                                                    nha_tuyen_dung_id=nha_tuyen_dung_id,
                                                                    defaults=defaults)
            diem_tb = DanhGiaNhaTuyenDung.objects.filter(nha_tuyen_dung_id=nha_tuyen_dung_id).aggregate(
                Avg('diem_danh_gia'))
            ntd = NhaTuyenDung.objects.get(nguoi_dung_id=nha_tuyen_dung_id)
            ntd.diem_danh_gia_tb = math.floor(diem_tb['diem_danh_gia__avg'] * 10) / 10
            ntd.save()
            # print(diem_tb)
            if danh_gia[1] is True:
                return Response(self.serializer_class(danh_gia[0]).data, status.HTTP_201_CREATED)
            elif danh_gia[1] is False:
                return Response(self.serializer_class(danh_gia[0]).data, status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"Loi request": "thieu du lieu"}, status.HTTP_400_BAD_REQUEST)


# API để lấy thông tin client_id, client_secret xin token chứng thực (đăng nhập)
class AuthInfo(APIView):
    def get(self, request):
        return Response(settings.OAUTH2_INFO, status.HTTP_200_OK)
