<?php
session_start(); 
require_once "../cronometro.php"; 
require_once "configuracion.php";

$db = new Configuracion();

$errores = [];
$val = [
    "profesion" => "",
    "edad" => "",
    "genero" => "",
    "pericia" => "",
    "dispositivo" => ""
];

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $val["profesion"]   = trim($_POST["profesion"] ?? "");
    $val["edad"]        = trim($_POST["edad"] ?? "");
    $val["genero"]      = trim($_POST["genero"] ?? "");
    $val["pericia"]     = trim($_POST["pericia"] ?? "");
    $val["dispositivo"] = trim($_POST["dispositivo"] ?? "");

    // VALIDACIONES
    if ($val["profesion"] === "") {
        $errores[] = "La profesión es obligatoria.";
    }

    if ($val["edad"] === "" || !ctype_digit($val["edad"]) || intval($val["edad"]) < 5) {
        $errores[] = "La edad debe ser un número válido.";
    }

    $generos = ["Hombre", "Mujer", "Otro", "Prefiero no decirlo"];
    if (!in_array($val["genero"], $generos)) {
        $errores[] = "Selecciona un género válido.";
    }

    $pericias = ["Novato", "Intermedio", "Avanzado"];
    if (!in_array($val["pericia"], $pericias)) {
        $errores[] = "Selecciona tu nivel de pericia informática.";
    }

    $dispositivos = ["ordenador", "tablet", "teléfono"];
    if (!in_array($val["dispositivo"], $dispositivos)) {
        $errores[] = "Selecciona un dispositivo válido.";
    }

    // SI TODO VA BIEN → INSERTAR EN BD
    if (empty($errores)) {

        $stmt = $db->conexion->prepare(
            "INSERT INTO datos_usuario (profesion, edad, genero, pericia)
             VALUES (?, ?, ?, ?)"
        );

        $stmt->bind_param(
            "siss",
            $val["profesion"],
            $val["edad"],
            $val["genero"],
            $val["pericia"]
        );

        if ($stmt->execute()) {

            // Guardamos el ID del usuario en sesión
            $_SESSION["id_usuario"] = $stmt->insert_id;
            $_SESSION["dispositivo"] = $val["dispositivo"];

            // Redirigir al test
            header("Location: test_usabilidad.php");
            exit();

        } else {
            $errores[] = "Error al guardar en la base de datos: " . $stmt->error;
        }

        $stmt->close();
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Datos del usuario – Test de usabilidad</title>
    <link rel="stylesheet" href="../estilo/estilo.css">
</head>
<body>

<h1>Información del usuario</h1>

<?php if(!empty($errores)): ?>
    <section>
        <h2>Errores encontrados:</h2>
        <ul>
            <?php foreach($errores as $e): ?>
                <li><?= htmlspecialchars($e) ?></li>
            <?php endforeach; ?>
        </ul>
    </section>
<?php endif; ?>

<form action="test_usuario.php" method="post">

    <label>Profesión:</label><br>
    <input type="text" name="profesion"
           value="<?= htmlspecialchars($val["profesion"]) ?>" required><br><br>

    <label>Edad:</label><br>
    <input type="number" name="edad" min="5"
           value="<?= htmlspecialchars($val["edad"]) ?>" required><br><br>

    <label>Género:</label><br>
    <select name="genero" required>
        <option value="">-- Selecciona --</option>
        <?php foreach(["Hombre","Mujer","Otro","Prefiero no decirlo"] as $g): ?>
            <option value="<?= $g ?>" <?= $val["genero"] === $g ? "selected" : "" ?>>
                <?= $g ?>
            </option>
        <?php endforeach; ?>
    </select><br><br>

    <label>Pericia informática:</label><br>
    <select name="pericia" required>
        <option value="">-- Selecciona --</option>
        <?php foreach(["Novato","Intermedio","Avanzado"] as $p): ?>
            <option value="<?= $p ?>" <?= $val["pericia"] === $p ? "selected" : "" ?>>
                <?= $p ?>
            </option>
        <?php endforeach; ?>
    </select><br><br>

    <label>Dispositivo usado:</label><br>
    <select name="dispositivo" required>
        <option value="">-- Selecciona --</option>
        <option value="ordenador" <?= $val["dispositivo"] === "ordenador" ? "selected" : "" ?>>Ordenador</option>
        <option value="tablet" <?= $val["dispositivo"] === "tablet" ? "selected" : "" ?>>Tablet</option>
        <option value="teléfono" <?= $val["dispositivo"] === "teléfono" ? "selected" : "" ?>>Teléfono</option>
    </select><br><br>

    <button type="submit">Comenzar prueba</button>
</form>

</body>
</html>
