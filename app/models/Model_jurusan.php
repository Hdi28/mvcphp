<?php

class Model_jurusan{
   private $table = 'jurusan';
   private $db;

   public function __construct()
   {
    $this->db = new Database;
   }

    public function getAllJurusan(){
       $this->db->query('SELECT * FROM '.$this->table);
       return $this->db->resultSet();
    }

    public function getJurusanById($id)
    {
        $this->db->query('SELECT * FROM '.$this->table.' WHERE id_jurusan=:id_jurusan');
        $this->db->bind('id_jurusan',$id);
        return $this->db->single();

    }

    public function tambahDataJurusan($data)
    {
        $query = "INSERT INTO jurusan values ('',:nama_jurusan)";
		$this->db->query($query);
		$this->db->bind('nama_jurusan',$data['nama_jurusan']);

		$this->db->execute();

		return $this->db->rowCount();
    }

    public function hapusDataJurusan($id)
    {
        $this->db->query('DELETE FROM '.$this->table.' WHERE id_jurusan=:id_jurusan');
        $this->db->bind('id_jurusan',$id);
        $this->db->execute();
        return $this->db->rowCount();

    }
    
    public function ubahDataJurusan($data){
		$query = "UPDATE jurusan SET 
					nama_jurusan = :nama_jurusan,
					WHERE id_jurusan = :id_jurusan";
		$this->db->query($query);
		$this->db->bind('nama_jurusan',$data['nama_jurusan']);
		$this->db->bind('id_jurusan',$data['id_jurusan']);
        
		$this->db->execute();

		return $this->db->rowCount();
	}

    public function cariDataJurusan(){
        $keyword = $_POST['keyword'];
        $query = "SELECT * FROM jurusan WHERE nama_jurusan LIKE :keyword";
        $this->db->query($query);
        $this->db->bind('keyword', "%$keyword%");
        return $this->db->resultSet();
    }
}