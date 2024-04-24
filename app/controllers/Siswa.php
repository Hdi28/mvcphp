<?php

class Siswa extends Controller{
    public function index(){
        $data['judul']="Daftar Siswa";
        $data['siswa'] = $this->model('Model_siswa')->getAllSiswa();
        $this->view('templates/header',$data);
        $this->view('siswa/index',$data);
        $this->view('templates/footer');
    }

    public function detail($id){
        $data['judul']="Detail Siswa";
        $data['siswa'] = $this->model('Model_siswa')->getSiswaById($id);
        $this->view('templates/header',$data);
        $this->view('siswa/detail',$data);
        $this->view('templates/footer');
    }

    public function tambah()
    {
        if( $this->model('Model_siswa')->tambahDataSiswa($_POST)>0){
            Flasher::setflash('berhasil','ditambahkan!','success');
            header('Location: '.BASEURL.'/siswa');
            exit;
        }else{
            Flasher::setflash('Gagal','ditambahkan!','danger');
            header('Location: '.BASEURL.'/siswa');
            exit;
        }
    }
    public function hapus($id)
    {
        if( $this->model('Model_siswa')->hapusDataSiswa($id)>0){
            Flasher::setflash('berhasil','dihapus!','success');
            header('Location: '.BASEURL.'/siswa');
            exit;
        }else{
            Flasher::setflash('Gagal','dihapus!','danger');
            header('Location: '.BASEURL.'/siswa');
            exit;
        }
    }
    public function getdata()
    {
        echo json_encode($this->model('Model_siswa')->getSiswaById($_POST['id']));
    }
    public function ubah()
    {
        
        if( $this->model('Model_siswa')->ubahDataSiswa($_POST)>0){
            Flasher::setflash('berhasil','diubah!','success');
            header('Location: '.BASEURL.'/siswa');
            exit;
        }else{
            Flasher::setflash('Gagal','diubah!','danger');
            header('Location: '.BASEURL.'/siswa');
            exit;
        }
    }
    public function cari(){
        $data['judul']="Daftar Siswa";
        $data['siswa'] = $this->model('Model_siswa')->cariDataSiswa();
        $this->view('templates/header',$data);
        $this->view('siswa/index',$data);
        $this->view('templates/footer');
    }
}