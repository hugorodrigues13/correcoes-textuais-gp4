<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <title><g:message code="default.page.500.title"/></title>
    <asset:stylesheet src="fibericons/fibericons.css"/>
    <asset:stylesheet src="bootstrap-3.3.5/bootstrap.css"/>
    <asset:stylesheet src="estilo/estilo.css"/>
</head>

<body>
<div class="section">
    <div class="container logcontainer">
        <div class="middle-box text-center animated fadeInDown">
            <h1 style="color: rgb(153, 153, 153); font-weight: 300; font-family: roboto; font-size: 10em;">
                <i class="iconfiber iconf-e500"></i>
            </h1>

            <h3 style="color: rgb(129, 0, 0);" class="font-bold">
                <g:message code="default.page.500.title"/>
            </h3>

            <div class="error-desc">
                <g:message code="default.page.500.mensagem"/>
                <g:renderException exception="${exception}"/>
                <br><br>
            </div>
        </div>
        <!-- /Erro -->
    </div>
</div>
</body>
</html>