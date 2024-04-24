<div class="container mt-4">
    <div class="row">
        <div class="col-lg-6">
            <?php Flasher::flash(); ?>
        </div>
    </div>
    <div class="row mb-3">
        <div class="col-lg-6">
            <!-- Button trigger modal -->
            <button type="button" class="btn btn-primary TombolTambah" data-toggle="modal" data-target="#formModal">
                Tambah data jurusan
            </button>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-6">
            <form action="<?=BASEURL;?>/jurusan/cari" method="post">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Cari jurusan..." name="keyword" id="keyword"
                        autocomplete="off">
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="submit" id="cari">Cari</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="row">
        <div class="col-6">
            <h3>Daftar jurusan</h3>
            <ul class="list-group">
                <?php foreach($data['jurusan'] as $sw):?>
                <li class="list-group-item">
                    <?=$sw['nama_jurusan'];?>
                    <a href="<?=BASEURL;?>/jurusan/hapus/<?=$sw['id_jurusan'];?>"
                        class="btn btn-danger btn-sm float-right ml-1"
                        onclick="return confirm('Anda Yakin ingin menghapus?')">hapus</a>
                    <a href="<?=BASEURL;?>/jurusan/ubah/<?=$sw['id_jurusan'];?>"
                        class="btn btn-success btn-sm float-right ml-1 tampilModalUbah" data-toggle="modal"
                        data-target="#formModal1" data-id="<?=$sw['id_jurusan']?>">ubah</a>

                </li>
                <?php endforeach; ?>
            </ul>

        </div>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="formModal" tabindex="-1" role="dialog" aria-labelledby="judulModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="judulModalLabel1">Tambah data jurusan</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form action="<?php echo(BASEURL); ?>/jurusan/tambah" method="POST">
                    <input type="hidden" name="id_jurusan" id="id_jurusan">
                    <div class="form-group">
                        <label for="nama" class="form-label">Nama Jurusan</label>
                        <input type="text" class="form-control" id="nama_jurusan" name="nama_jurusan"
                            placeholder="isikan nama jurusan" autocomplete="off">
                    </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary">Tambah data</button>
            </div>
        </div>
    </div>
</div>