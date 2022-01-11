<!doctype html>
<html lang="es">
<head>
    <link rel="shortcout icon" href="#"/>
    <meta chatset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="plugins/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="estilos/estilos.css">
    <link rel="stylesheet" href="plugins/sweet_alert2/sweetalert2.min.css">
</head>
    <body class="header">
        <br>
        <br>
        <br>
        <br>
        <div id="login">
            <h3 class="text-center text-white">Gestor de Tareas</h3>
            <div class="container">
                <div id="login-row" class="row justify-content-center align-items-center">
                    <div id="login-column" class="col-md-6">
                        <div id="login-box" class="col-md-12 bg-light text-dark">
                            <form id="formLogin" class="form" action="" method="post">
                                <h3 class="text-center text-dark">Iniciar Sesión</h3>
                                <div class="form-group">
                                    <label for="usuario" class="text-dark">Usuario</label><br>
                                    <input type="text" name="usuario" id="usuario" class="form-controlL">
                                </div>
                                <div class="form-group">
                                    <label for="password" class="text-dark">Password</label><br>
                                    <input type="password" name="password" id="password" class="form-control">
                                </div>
                                <div class="form-group text-center">  
                                    <input type="submit" name="submit" class="btn btn-dark btn-lg btn-block" value="Conectar">
                                </div>
                            </form>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
        <script src="plugins/jquery/jquery-3.3.1.min.js"></script>
        <script src="plugins/bootstrap/js/bootstrap.min.js"></script>
        <script src="plugins/sweet_alert2/sweetalert2.all.min.js"></script>
        <script src="js/codigo.js"></script>
    </body>
</html>