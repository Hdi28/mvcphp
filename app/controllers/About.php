<?php 

class About {
    public function index($nama = 'Hadi', $pekerjaan = 'Siswa')
    {
        echo "Halo, nama saya $nama, saya seorang $pekerjaan";
    }
    public function page()
    {
        echo 'About/page';
    }
}