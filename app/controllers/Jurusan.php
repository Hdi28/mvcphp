<?php

class Jurusan extends Controller{
    public function index(){
        $data['judul']="Daftar Jurusan";
        $data['jurusan'] = $this->model('Model_jurusan')->getAllJurusan();
        $this->view('templates/header',$data);
        $this->view('jurusan/index',$data);
        $this->view('templates/footer');
    }

    public function tambah()
    {
        if( $this->model('Model_jurusan')->tambahDataJurusan($_POST)>0){
            Flasher::setflash('berhasil','ditambahkan!','success');
            header('Location: '.BASEURL.'/jurusan');
            exit;
        }else{
            Flasher::setflash('Gagal','ditambahkan!','danger');
            header('Location: '.BASEURL.'/jurusan');
            exit;
        }
    }
    public function hapus($id)
    {
        if( $this->model('Model_jurusan')->hapusDataJurusan($id)>0){
            Flasher::setflash('berhasil','dihapus!','success');
            header('Location: '.BASEURL.'/jurusan');
            exit;
        }else{
            Flasher::setflash('Gagal','dihapus!','danger');
            header('Location: '.BASEURL.'/jurusan');
            exit;
        }
    }
    public function getdata()
    {
        echo json_encode($this->model('Model_jurusan')->getsiswaById($_POST['id_jurusan']));
    }
    public function ubah()
    {
        
        if( $this->model('Model_jurusan')->ubahDataJurusan($_POST)>0){
            Flasher::setflash('berhasil','diubah!','success');
            header('Location: '.BASEURL.'/jurusan');
            exit;
        }else{
            Flasher::setflash('Gagal','diubah!','danger');
            header('Location: '.BASEURL.'/jurusan');
            exit;
        }
    }
    public function cari(){
        $data['judul']="Daftar jurusan";
        $data['jurusan'] = $this->model('Model_jurusan')->cariDataJurusan();
        $this->view('templates/header',$data);
        $this->view('jurusan/index',$data);
        $this->view('templates/footer');
    }
}