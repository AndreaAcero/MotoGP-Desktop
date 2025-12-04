<?php
require_once "clasificaciones.php";
?>

<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>MotoGP-Clasificaciones</title>
    <meta name ="author" content ="Andrea Acero Suárez" />
    <meta name ="description" content ="Información de clasificaciones del proyecto MotoGP-Desktop" />
    <meta name="keywords" content="MotoGP, clasificaciones, pilotos, equipos, temporada, puntuaciones" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" /> 
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
   <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="icon" href="multimedia/favicon.ico" type="image/x-icon" />
</head>

<body>
    <header>
    <!-- Datos con el contenidos que aparece en el navegador -->
     <h1><a href="index.html">MotoGP Desktop</a></h1>
    <nav>
        <a href="piloto.html" title="Información del piloto">Piloto</a>  
        <a href="circuito.html" title="Información del circuito">Circuito</a>  
        <a href="meteorologia.html" title="Información de Meteorología">Meteorología</a>  
        <a href="clasificaciones_inter.php" title="Información de clasificaciones" class="active">Clasificaciones</a>  
        <a href="juegos.html" title="Información de juegos">Juegos</a>  
        <a href="ayuda.html" title="Información de ayuda">Ayuda</a>  
    </nav>
    </header>
    <p>Estás en: <a href="index.html">Inicio</a> &gt;&gt; <strong>Clasificaciones</strong></p>
    <main>
    <h2>Clasificaciones de MotoGP-Desktop</h2>
     <section>
        <h3>Ganador de la carrera</h3>
        <?php if ($ganador): ?>
                <p><strong>Nombre:</strong> <?= htmlspecialchars($ganador['nombre']) ?></p>
                <p><strong>Tiempo:</strong> <?= htmlspecialchars($ganador['tiempo']) ?></p>
        <?php else: ?>
            <p>No se pudo obtener el ganador.</p>
        <?php endif; ?>
    </section>
    <section>
        <h3>Clasificaciones completas</h3>
        <?php if ($mundial && count($mundial) > 0): ?>
            <table>
                <thead>
                    <tr>
                        <th>Posición</th>
                        <th>Piloto</th>
                        <th>Puntos</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($mundial as $piloto): ?>
                        <tr>
                            <td><?= htmlspecialchars($piloto['posicion']) ?></td>
                            <td><?= htmlspecialchars($piloto['nombre']) ?></td>
                            <td><?= htmlspecialchars($piloto['puntos']) ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php else: ?>
            <p>No hay datos de la clasificación mundial.</p>
        <?php endif; ?>
        </section>
    </main>
</body>
</html>