<?php 

class About extends Controller{
	public function index($name='kasnan',$job='petani php',$age=23)
	{
		$data['nama']=$name;
		$data['pekerjaan']=$job;
		$data['umur']=$age;
		$data['judul'] = "About";
		$this->view('templates/header',$data);
		$this->view('about/index',$data);
		$this->view('templates/footer');
	}
	public function page()
	{
		$data['judul'] = "Pages";
		$this->view('templates/header',$data);
		$this->view('about/page');
		$this->view('templates/footer');
	}
}