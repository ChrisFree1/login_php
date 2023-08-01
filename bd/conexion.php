<?php
 class Conexion{
     public static function Conectar(){
         define('servidor','127.0.0.1');
         define('nombre_bd','sistema');
         define('usuario','root');
         define('password','123456');         
         $opciones = array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8');
         
         try{
            $conexion = new PDO("mysql:host=".servidor.";dbname=".nombre_bd, usuario, password, $opciones);             
            return $conexion; 
         }catch (Exception $e){
             die("El error de Conexión es :".$e->getMessage());
         }         
     }
     
 }
?>