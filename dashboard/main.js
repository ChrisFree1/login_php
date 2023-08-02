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
    

    var fila;
    var id;
    var opcion;

    $("#btnNuevo").click(function() {
        $("#formPersonas").trigger("reset");
        $(".modal-header").css("background-color", "#1cc88a");
        $(".modal-header").css("color", "white");
        $(".modal-title").text("Nueva Producto");
        $("#modalCRUD").modal("show");
        opcion = 1; // Cambiar 'alta' a '1'
    });

    $(document).on("click", ".btnEditar", function() {
        fila = $(this).closest("tr");
        id = parseInt(fila.find('td:eq(0)').text());
        nombre = fila.find('td:eq(1)').text();
        descripcion = fila.find('td:eq(2)').text();
        stock = parseInt(fila.find('td:eq(3)').text());
        precio = parseFloat(fila.find('td:eq(4)').text());
        fechaElaboracion = fila.find('td:eq(5)').text();
        fechaExpiracion = fila.find('td:eq(6)').text();

        $("#nombre").val(nombre);
        $("#descripcion").val(descripcion);
        $("#stock").val(stock);
        $("#precio").val(precio);
        $("#fechaElaboracion").val(fechaElaboracion);
        $("#fechaExpiracion").val(fechaExpiracion);

        opcion = 2; //editar

        $(".modal-header").css("background-color", "#4e73df");
        $(".modal-header").css("color", "white");
        $(".modal-title").text("Editar Producto");
        $("#modalCRUD").modal("show");
    });

    $(document).on("click", ".btnBorrar", function() {
        fila = $(this);
        id = parseInt($(this).closest("tr").find('td:eq(0)').text());
        opcion = 3 //borrar
        var respuesta = confirm("¿Está seguro de eliminar el registro: " + id + "?");
        if (respuesta) {
            $.ajax({
                url: "bd/crud.php",
                type: "POST",
                dataType: "json",
                data: { opcion: opcion, id: id },
                success: function(data) {
                    if ('mensaje' in data) {
                        alert(data.mensaje);
                        tablaPersonas.row(fila.parents('tr')).remove().draw();
                    } else if ('error' in data) {
                        alert(data.error);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);
                    alert("Error en la petición AJAX");
                }
            });
        }
    });

    $("#formPersonas").submit(function(e) {
    e.preventDefault();
    nombre = $.trim($("#nombre").val());
    descripcion = $.trim($("#descripcion").val());
    stock = parseInt($("#stock").val());
    precio = parseFloat($("#precio").val());
    fechaElaboracion = $.trim($("#fechaElaboracion").val());
    fechaExpiracion = $.trim($("#fechaExpiracion").val());


    if (nombre === '' || descripcion === '' || isNaN(stock) || isNaN(precio) || fechaElaboracion === '' || fechaExpiracion === '') {
        alert("Por favor, completa todos los campos.");
        return;
    }


    var dataToSend = {
        nombre: nombre,
        descripcion: descripcion,
        stock: stock,
        precio: precio,
        fechaElaboracion: fechaElaboracion,
        fechaExpiracion: fechaExpiracion,
        id:id,
        opcion: opcion // Corregido: mueve la variable opcion aquí
    };


 
    $.ajax({
        url: "bd/crud.php",
        type: "POST",
        dataType: "json",
        data: dataToSend,
        success: function(data) {
            console.log(data);
            id = data[0].idProducto;
            nombre = data[0].nombre;
            descripcion = data[0].descripcion;
            stock = data[0].stock;
            precio = data[0].precio;
            fechaElaboracion = data[0].fechaElaboracion;
            fechaExpiracion = data[0].fechaExpiracion;

            if (opcion === 2) { // Alta
                tablaPersonas.row(fila).data([id, nombre, descripcion, stock, precio, fechaElaboracion, fechaExpiracion]).draw();
            } else { // Modificación
                tablaPersonas.row.add([id,nombre, descripcion, stock, precio, fechaElaboracion, fechaExpiracion]).draw();

            }

            $("#modalCRUD").modal("hide");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            console.log("Error en la petición AJAX: " + jqXHR.responseText);
            alert("Error en la petición AJAX: " + textStatus + ", " + errorThrown);
        }
    });
});









});
