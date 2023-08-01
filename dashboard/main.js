$(document).ready(function(){
    tablaPersonas = $("#tablaPersonas").DataTable({
        "columnDefs":[{
            "targets": -1,
            "data":null,
            "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-primary btnEditar'>Editar</button><button class='btn btn-danger btnBorrar'>Borrar</button></div></div>"  
        }],
        
        "language": {

            "lengthMenu": "Mostrar _MENU_ registros",
            "zeroRecords": "No se encontraron resultados",
            "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "infoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sSearch": "Buscar:",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast":"Último",
                "sNext":"Siguiente",
                "sPrevious": "Anterior"
             },
             "sProcessing":"Procesando...",
        }
    });
    
    $("#btnNuevo").click(function () {
        $("#formPersonas").trigger("reset");
        $(".modal-header").css("background-color", "#1cc88a");
        $(".modal-header").css("color", "white");
        $(".modal-title").text("Nueva Productos");
        $("#modalCRUD").modal("show");
        id = null;
        opcion = 1; //alta
    });

    var fila; //capturar la fila para editar o borrar el registro

    $(document).on("click", ".btnEditar", function(){
        fila = $(this).closest("tr");
        id = parseInt(fila.find('td:eq(0)').text());
        nombre = fila.find('td:eq(1)').text();
        descripcion = fila.find('td:eq(2)').text();
        stock = parseInt(fila.find('td:eq(3)').text());
        precio = parseFloat(fila.find('td:eq(4)').text());
        fechaElaboracion = fila.find('td:eq(5)').text();
        fechaExpiracion = fila.find('td:eq(6)').text();
        
        // Nuevos campos

        // ... Puedes agregar más variables para los demás campos que necesitas ...

        $("#nombre").val(nombre);
        $("#descripcion").val(descripcion);
        $("#stock").val(stock);
        $("#precio").val(precio);
        $("#fechaElaboracion").val(fechaElaboracion);
        $("#fechaExpiracion").val(fechaExpiracion);
        // Nuevos campos
        // ... Asegúrate de agregar más líneas como estas para los demás campos que necesitas ...

        opcion = 2; //editar

        $(".modal-header").css("background-color", "#4e73df");
        $(".modal-header").css("color", "white");
        $(".modal-title").text("Editar Producto");            
        $("#modalCRUD").modal("show");
    });

    $(document).on("click", ".btnBorrar", function(){    
        fila = $(this);
        id = parseInt($(this).closest("tr").find('td:eq(0)').text());
        opcion = 3 //borrar
        var respuesta = confirm("¿Está seguro de eliminar el registro: "+id+"?");
        if(respuesta){
            $.ajax({
                url: "bd/crud.php",
                type: "POST",
                dataType: "json",
                data: {opcion:opcion, id:id},
                success: function(){
                    tablaPersonas.row(fila.parents('tr')).remove().draw();
                }
            });
        }   
    });

    $("#formPersonas").submit(function(e){
        e.preventDefault();
        nombre = $.trim($("#nombre").val());
        descripcion = $.trim($("#descripcion").val());
        stock = parseInt($("#stock").val());
        precio = parseFloat($("#precio").val());
        fechaElaboracion = $.trim($("#fechaElaboracion").val());
        fechaExpiracion = $.trim($("#fechaExpiracion").val());
        // Nuevos campos

        // ... Puedes agregar más variables para los demás campos que necesitas ...

        $.ajax({
            url: "bd/crud.php",
            type: "POST",
            dataType: "json",
            data: {
                nombre: nombre,
                descripcion: descripcion,
                stock: stock,
                precio: precio,
                fechaElaboracion: fechaElaboracion,
                fechaExpiracion: fechaExpiracion,
                idProducto: idProducto, // Corregido: Cambiado "id" por "idProducto"
                opcion: opcion
            },
            success: function (data) {
                
           
                    if (opcion == 1) { // Alta
                        tablaPersonas.row.add([data[0].idProducto, data[0].nombre, data[0].descripcion, data[0].stock, data[0].precio, data[0].fechaElaboracion, data[0].fechaExpiracion]).draw();
                    } else if (opcion == 2) { // Modificación
                        tablaPersonas.row(fila).data([data[0].idProducto, data[0].nombre, data[0].descripcion, data[0].stock, data[0].precio, data[0].fechaElaboracion, data[0].fechaExpiracion]).draw();
                    } else if (opcion == 3) { // Baja
                        tablaPersonas.row(fila).remove().draw();
                    }

            }     
        });
        $("#modalCRUD").modal("hide");    
    });
});
