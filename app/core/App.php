<?php 

class App
{
	protected $controller = 'Home'; //controller default
	protected $method = 'index'; // method default
	protected $params = []; // pramater default bisa lebih dari satu

	function __construct()
	{
		$url = $this->parseURL();
		if ($url==NULL) {
			$url=[$this->controller];
		}
		//controller
		if(file_exists('../app/controllers/'.$url[0].'.php')){
			$this->controller = $url[0];
			unset($url[0]);
		}
		require_once '../app/controllers/'.$this->controller.'.php';
		$this->controller = new $this->controller;
		//method
		if(isset($url[1])){
			if(method_exists($this->controller, $url[1])){
				$this->method = $url[1];
				unset($url[1]);
			}
		}
		//parameter
		if(!empty($url)){
			$this->params = array_values($url);
			//var_dump($url);
		}
		//jalankan controller dan method serta kirimkan parameter jika ada
		call_user_func_array([$this->controller,$this->method], $this->params);
	}

	public function parseURL()
	{
		if(isset($_GET['url'])){
			$url = rtrim($_GET['url'],'/'); // untuk menghilangkan tanda / di akhir url
			$url = filter_var($url,FILTER_SANITIZE_URL); // untuk membersihkan karakter-karakter simbol yang mengganggu keamanan url
			$url = explode('/', $url); // untuk memisahkan antara / pada url menjadi elemen array
			return $url;
		}
	}
}