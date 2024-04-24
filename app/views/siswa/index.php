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
                Tambah data Siswa
            </button>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-6">
            <form action="<?=BASEURL;?>/siswa/cari" method="post">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Cari Siswa..." name="keyword" id="keyword"
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
            <h3>Daftar Siswa</h3>
            <ul class="list-group">
                <?php foreach($data['siswa'] as $sw):?>
                <li class="list-group-item">
                    <?=$sw['nama'];?>
                    <a href="<?=BASEURL;?>/siswa/hapus/<?=$sw['id'];?>" class="btn btn-danger btn-sm float-right ml-1"
                        onclick="return confirm('Anda Yakin ingin menghapus?')">hapus</a>
                    <a href="<?=BASEURL;?>/siswa/ubah/<?=$sw['id'];?>"
                        class="btn btn-success btn-sm float-right ml-1 tampilModalUbah" data-toggle="modal"
                        data-target="#formModal" data-id="<?=$sw['id']?>">ubah</a>
                    <a href="<?=BASEURL;?>/siswa/detail/<?=$sw['id'];?>"
                        class="btn btn-primary btn-sm float-right ml-1">detail</a>

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
                <h5 class="modal-title" id="judulModalLabel">Tambah data Siswa</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form action="<?php echo(BASEURL); ?>/siswa/tambah" method="POST">
                    <input type="hidden" name="id" id="id">
                    <div class="form-group">
                        <label for="nama" class="form-label">Nama</label>
                        <input type="text" class="form-control" id="nama" name="nama" placeholder="isikan nama"
                            autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label for="nis" class="form-label">NIS</label>
                        <input type="number" class="form-control" id="nis" name="nis" placeholder="isikan nis">
                    </div>
                    <div class="form-group">
                        <label for="email" class="form-label">E-Mail</label>
                        <input type="email" class="form-control" id="email" name="email" placeholder="isikan email"
                            autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label for="jurusan" class="form-label">Jurusan</label>
                        <select class="form-control" id="jurusan" name="jurusan" aria-label="Default select example">
                            <option selected>Silahkan pilih jurusan</option>
                            <option value="Akuntansi">Akuntansi (AK)</option>
                            <option value="Perkantoran">MPLB</option>
                            <option value="Pemasaran">Pemasaran (PM)</option>
                            <option value="Desain Komunikasi Visual">Desain Komunikasi Visual (DKV)</option>
                            <option value="Rekayasa Perangkat Lunak">Pengembangan Perangkat Lunak dan Gim (PPLG)
                            </option>
                        </select>
                    </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary">Tambah data</button>
            </div>
        </div>
    </div>
</div>