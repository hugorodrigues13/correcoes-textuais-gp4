package br.com.furukawa.model

import grails.plugin.springsecurity.SpringSecurityUtils
import org.springframework.http.HttpMethod

class Requestmap {

    String url
    String configAttribute
    String descricao
    Requestmap parent
    HttpMethod httpMethod

    static constraints = {
        url nullable: true, unique: 'httpMethod'
        configAttribute nullable: true
        parent nullable: true
        httpMethod nullable: true
    }

    static mapping = {
        id generator: 'sequence', params: [sequence: 'requestmap_seq']
    }

    String toString() {
        return descricao
    }

    static listarAcessos() {
        def areasPossiveis = findAllByConfigAttributeNotEqual('permitAll')
        areasPossiveis.removeAll(acessoComum())
        areasPossiveis
    }

    static acessoComum() {
        def comum = new ArrayList<Requestmap>()
        comum.add(Requestmap.findByUrl('/logout/*'))
        comum.add(Requestmap.findByUrl('/'))
        comum.add(Requestmap.findByUrl('/index.gsp'))
        comum.add(Requestmap.findByUrl('/home/'))
        comum.add(Requestmap.findByUrl('/user/perfil'))
        comum.add(Requestmap.findByUrl('/user/salvarDadosDoUsuario'))
        comum.add(Requestmap.findByUrl('/user/getAcessosDoUsuario'))
        comum.add(Requestmap.findByUrl('/**'))
        comum
    }

    static boolean hasAcesso(String url) {
        List rolesVerificarAcesso = SpringSecurityUtils.parseAuthoritiesString(Requestmap.findByUrl(url)?.configAttribute)
        List<String> rolesDoUsuario = SpringSecurityUtils.getPrincipalAuthorities()

        for (int i = 0; i < rolesDoUsuario.size(); i++) {
            for (int j = 0; j < rolesVerificarAcesso.size(); j++) {
                if (rolesDoUsuario[i].equals(rolesVerificarAcesso[j])) {
                    return true
                }
            }
        }

        return false
    }

    List<Requestmap> getFilhos() {
        return Requestmap.findAllByParent(this)
    }
}
