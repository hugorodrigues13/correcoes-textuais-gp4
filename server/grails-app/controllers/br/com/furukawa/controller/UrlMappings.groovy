package br.com.furukawa.controller

class UrlMappings {

    static mappings = {
        get "/api/$controller(.$format)?"(action:"index")
        get "/api/$controller/$id(.$format)?"(action:"show")
        post "/api/$controller(.$format)?"(action:"save")
        put "/api/$controller/$id(.$format)?"(action:"update")
        patch "/api/$controller/$id(.$format)?"(action:"patch")
        delete "/api/$controller/$id(.$format)?"(action:"delete")

        get "/api/$controller/$action?"()
        post "/api/$controller/$action?/$id?"()
        patch "/api/$controller/$action?"()

//        get "/api/$controller/prepareNew"(action:"prepareNew")
//        get "/api/$controller/prepareEdit" (action:"prepareEdit")
//        get "/api/$controller/perfil"(action: "perfil")
//        get "/api/$controller/getUsernameUsuario"(action: "getUsernameUsuario")
        '/api/user/salvarDadosDoUsuario' (controller:'user', action: "salvarDadosDoUsuario")

        '/recuperar/enviarEmailRecuperarSenha'(controller: 'recuperarSenha', action: 'enviarEmailRecuperarSenha')
        '/organizacao/getOrganizacoes'(controller: 'organizacao', action: 'getOrganizacoes')

        '/'(uri: '/index.html')

        "500"(view: '/error')
        "404"(view: '/404')
    }
}