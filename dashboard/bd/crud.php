<?php
include_once '../bd/conexion.php';
$objeto = new Conexion();
$conexion = $objeto->Conectar();

// Recepción de los datos enviados mediante POST desde el JS   
$opcion = (isset($_POST['opcion'])) ? $_POST['opcion'] : '';
$id = (isset($_POST['idProducto'])) ? $_POST['idProducto'] : ''; // Corregido: Cambiado "id" por "idProducto"
$nombre = (isset($_POST['nombre'])) ? $_POST['nombre'] : '';
$descripcion = (isset($_POST['descripcion'])) ? $_POST['descripcion'] : '';
$stock = (isset($_POST['stock'])) ? $_POST['stock'] : '';
$precio = (isset($_POST['precio'])) ? $_POST['precio'] : '';
$fechaElaboracion = (isset($_POST['fechaElaboracion'])) ? $_POST['fechaElaboracion'] : '';
$fechaExpiracion = (isset($_POST['fechaExpiracion'])) ? $_POST['fechaExpiracion'] : '';


switch ($opcion) {
    case 1: //alta
        $consulta = "INSERT INTO Productos (nombre, descripcion, stock, precio, fechaElaboracion, fechaExpiracion) 
                     VALUES ('$nombre', '$descripcion', '$stock', '$precio', '$fechaElaboracion', '$fechaExpiracion')";
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();

        $consulta = "SELECT idProducto, nombre, descripcion, stock, precio, fechaElaboracion, fechaExpiracion 
                     FROM Productos ORDER BY idProducto DESC LIMIT 1";
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();
        $data = $resultado->fetchAll(PDO::FETCH_ASSOC);
        break;
    case 2: //modificación
        $consulta = "UPDATE Productos SET nombre='$nombre', descripcion='$descripcion', stock='$stock', 
                     precio='$precio', fechaElaboracion='$fechaElaboracion', fechaExpiracion='$fechaExpiracion' 
                     WHERE idProducto='$id'";
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();

        $consulta = "SELECT idProducto, nombre, descripcion, stock, precio, fechaElaboracion, fechaExpiracion 
                     FROM Productos WHERE idProducto='$id'";
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();
        $data = $resultado->fetchAll(PDO::FETCH_ASSOC);
        break;
    case 3: //baja
        $consulta = "DELETE FROM Productos WHERE idProducto='$id'";
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();
        break;
}

print json_encode($data, JSON_UNESCAPED_UNICODE); //enviar el array final en formato json a JS
$conexion = NULL;
