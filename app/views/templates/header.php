<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="<?= BASEURL; ?>/css/bootstrap.css" rel="stylesheet">

    <title>Halaman <?=$data['judul']?></title>
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
            <a class="navbar-brand" href="<?=BASEURL;?>">PHP MVC</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                    <a class="nav-item nav-link active" href="<?=BASEURL;?>">Home</a>
                    <a class="nav-item nav-link" href="<?=BASEURL;?>/siswa">Siswa</a>
                    <a class="nav-item nav-link" href="<?=BASEURL;?>/about">About</a>
                    <a class="nav-item nav-link" href="<?=BASEURL;?>/jurusan">Jurusan</a>
                </div>
            </div>
        </div>
    </nav>