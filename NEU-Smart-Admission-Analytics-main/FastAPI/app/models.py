from sqlalchemy import Column, String, Integer, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Nganh(Base):
    __tablename__ = "NGANH"
    MaNganh = Column(String(50), primary_key=True)
    TenNganh = Column(String(255))
    ChiTieu = Column(Integer)

    # Relationships
    ho_so_nhap_hoc = relationship("HoSoNhapHoc", back_populates="nganh")

class PhuongThuc(Base):
    __tablename__ = "PHUONG_THUC"
    MaPT = Column(String(50), primary_key=True)
    TenPhuongThuc = Column(String(255))

    # Relationships
    nhom_xet_tuyen = relationship("NhomXetTuyen", back_populates="phuong_thuc")

class KyThi(Base):
    __tablename__ = "KY_THI"
    MaKyThi = Column(String(50), primary_key=True)
    TenKyThi = Column(String(255))

    # Relationships
    diem_thi = relationship("DiemThi", back_populates="ky_thi")

class MonThi(Base):
    __tablename__ = "MON_THI"
    MaMon = Column(String(50), primary_key=True)
    TenMon = Column(String(255))
    NhomMon = Column(String(50))

    # Relationships
    diem_thi = relationship("DiemThi", back_populates="mon_thi")

class ChungChi(Base):
    __tablename__ = "CHUNG_CHI"
    MaCC = Column(String(50), primary_key=True)
    TenChungChi = Column(String(255))
    ThangDiem = Column(Integer)

    # Relationships
    thisinh_chungchi = relationship("ThiSinhChungChi", back_populates="chung_chi")



class NhomXetTuyen(Base):
    __tablename__ = "NHOM_XET_TUYEN"
    MaNhom = Column(String(50), primary_key=True)
    TenNhom = Column(String(255))
    MaPT = Column(String(50), ForeignKey("PHUONG_THUC.MaPT"))
    DanToc = Column(String(100))
    TonGiao = Column(String(100))
    MoTa = Column(String(255))

    # Relationships
    phuong_thuc = relationship("PhuongThuc", back_populates="nhom_xet_tuyen")
    ho_so_nhap_hoc = relationship("HoSoNhapHoc", back_populates="nhom_xet_tuyen")

class ThiSinh(Base):
    __tablename__ = "THISINH"
    CCCD = Column(String(12), primary_key=True)
    HoTen = Column(String(255))
    GioiTinh = Column(String(10))
    NgaySinh = Column(Date)
    NoiSinh = Column(String(255))
    QueQuan = Column(String(255))

    # Relationships
    lien_he = relationship("LienHe", back_populates="thi_sinh", uselist=False)
    diem_thi = relationship("DiemThi", back_populates="thi_sinh")
    chung_chi = relationship("ThiSinhChungChi", back_populates="thi_sinh")
    ho_so_nhap_hoc = relationship("HoSoNhapHoc", back_populates="thi_sinh")

class LienHe(Base):
    __tablename__ = "LIEN_HE"
    CCCD = Column(String(12), ForeignKey("THISINH.CCCD"), primary_key=True)
    SoDienThoai = Column(String(20))
    Email = Column(String(255))
    HoKhauThuongTru = Column(String(255))

    # Relationships
    thi_sinh = relationship("ThiSinh", back_populates="lien_he")



class DiemThi(Base):
    __tablename__ = "DIEM_THI"
    CCCD = Column(String(12), ForeignKey("THISINH.CCCD"), primary_key=True)
    MaKyThi = Column(String(50), ForeignKey("KY_THI.MaKyThi"), primary_key=True)
    MaMon = Column(String(50), ForeignKey("MON_THI.MaMon"), primary_key=True)
    Diem = Column(Float)

    # Relationships
    thi_sinh = relationship("ThiSinh", back_populates="diem_thi")
    ky_thi = relationship("KyThi", back_populates="diem_thi")
    mon_thi = relationship("MonThi", back_populates="diem_thi")

class ThiSinhChungChi(Base):
    __tablename__ = "THISINH_CHUNG_CHI"
    CCCD = Column(String(12), ForeignKey("THISINH.CCCD"), primary_key=True)
    MaCC = Column(String(50), ForeignKey("CHUNG_CHI.MaCC"), primary_key=True)
    DiemGoc = Column(Float)
    DiemQuyDoi = Column(Float)

    # Relationships
    thi_sinh = relationship("ThiSinh", back_populates="chung_chi")
    chung_chi = relationship("ChungChi", back_populates="thisinh_chungchi")

class HoSoNhapHoc(Base):
    __tablename__ = "HO_SO_NHAP_HOC"
    CCCD = Column(String(12), ForeignKey("THISINH.CCCD"), primary_key=True)
    MaNganh = Column(String(50), ForeignKey("NGANH.MaNganh"), primary_key=True)
    MaNhom = Column(String(50), ForeignKey("NHOM_XET_TUYEN.MaNhom"))
    NamTuyenSinh = Column(Integer)
    NgayXacNhan = Column(Date)

    # Relationships
    thi_sinh = relationship("ThiSinh", back_populates="ho_so_nhap_hoc")
    nganh = relationship("Nganh", back_populates="ho_so_nhap_hoc")
    nhom_xet_tuyen = relationship("NhomXetTuyen", back_populates="ho_so_nhap_hoc")

class ViewPhanTichTuyenSinh(Base):
    __tablename__ = "VW_PHAN_TICH_TUYENSINH"

    # Thông tin cơ bản
    CCCD = Column(String(12), primary_key=True)
    HoTen = Column(String(255))
    GioiTinh = Column(String(10))
    NgaySinh = Column(Date)

    # Ngành và Khối
    TenNganh = Column(String(255))
    KhoiXetTuyen = Column(String(50))

    # Điểm gốc
    TongDiemTHPT = Column(Float)
    HSA = Column(Float)
    TSA = Column(Float)
    IELTS = Column(Float)
    SAT = Column(Float)

    # Điểm theo từng phương thức
    DXT_THPT = Column(Float)
    DXT_HSA = Column(Float)
    DXT_TSA = Column(Float)
    DXT_SAT = Column(Float)
    DXT_IELTS_DGNL = Column(Float)
    DXT_IELTS_THPT = Column(Float)

    # Điểm cuối cùng cao nhất
    DiemXetTuyen = Column(Float)