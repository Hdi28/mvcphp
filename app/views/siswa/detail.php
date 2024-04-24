<div class="container mt-5">
	
	<div class="card" style="width: 18rem;">
	  <div class="card-body">
	    <h5 class="card-title"><?php echo $data['siswa']['nama']; ?></h5>
	    <h6 class="card-subtitle mb-2 text-muted"><?php echo $data['siswa']['nis']; ?></h6>
	    <p class="card-text"><?php echo $data['siswa']['email']; ?></p>
	    <p class="card-text"><?php echo $data['siswa']['jurusan']; ?></p>
	    <a href="<?php echo(BASEURL); ?>/siswa" class="card-link">Kembali</a>
	    
	  </div>
	</div>
</div>