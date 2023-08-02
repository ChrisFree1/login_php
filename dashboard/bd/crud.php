<?php
include_once '../bd/conexion.php';
$objeto = new Conexion();
$conexion = $objeto->Conectar();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Recepción de los datos enviados mediante POST desde el JS   
$opcion = (isset($_POST['opcion'])) ? $_POST['opcion'] : '';
$id = (isset($_POST['id'])) ? $_POST['id'] : ''; // Corregido: Cambiado "id" por "idProducto"
$nombre = (isset($_POST['nombre'])) ? $_POST['nombre'] : '';
$descripcion = (isset($_POST['descripcion'])) ? $_POST['descripcion'] : '';
$stock = (isset($_POST['stock'])) ? $_POST['stock'] : '';
$precio = (isset($_POST['precio'])) ? $_POST['precio'] : '';
$fechaElaboracion = (isset($_POST['fechaElaboracion'])) ? $_POST['fechaElaboracion'] : '';
$fechaExpiracion = (isset($_POST['fechaExpiracion'])) ? $_POST['fechaExpiracion'] : '';

$data = array(); // Inicializar el arreglo $data para devolver la respuesta

switch ($opcion) {
    case 1: // alta
        $consulta = "INSERT INTO Productos (nombre, descripcion, stock, precio, fechaElaboracion, fechaExpiracion) 
                     VALUES ('$nombre', '$descripcion', '$stock', '$precio', '$fechaElaboracion', '$fechaExpiracion')";
        $resultado = $conexion->prepare($consulta);
        if ($resultado->execute()) {
            // No necesitamos obtener el ID del producto insertado porque es autoincremental
            // En lugar de eso, podemos simplemente devolver los datos insertados
            $consulta = "SELECT idProducto, nombre, descripcion, stock, precio, fechaElaboracion, fechaExpiracion 
                         FROM Productos ORDER BY idProducto DESC LIMIT 1";
            $resultado = $conexion->prepare($consulta);
            $resultado->execute();
            $data = $resultado->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $data['error'] = 'Error al insertar el registro';
        }
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

        // Asegúrate de devolver los datos actualizados
        break;
    case 3: //baja
        $consulta = "DELETE FROM Productos WHERE idProducto='$id'";
        $resultado = $conexion->prepare($consulta);
        if ($resultado->execute()) {
            // Si la operación de eliminación fue exitosa
            $data['mensaje'] = 'Registro eliminado correctamente';
        } else {
            // Si ocurrió un error en la operación de eliminación
            $data['error'] = 'Error al eliminar el registro';
        }
        break;
}

print json_encode($data, JSON_UNESCAPED_UNICODE); //enviar el array final en formato json a JS
$conexion = NULL;
