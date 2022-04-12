package br.com.furukawa.dtos

import org.json.JSONObject

import javax.xml.bind.annotation.XmlElement
import java.text.SimpleDateFormat

class OrganizacaoEBSDTO {
    Integer id
    Integer unidadeOperacional
    String codigo
    String nome
    String endereco
    String pais
    String cidade

    OrganizacaoEBSDTO() {

    }


    OrganizacaoEBSDTO(JSONObject object) {
        this.id = object.id
        this.unidadeOperacional = object.unidadeOperacional
        this.codigo = object.codigo
        this.nome = object.nome
        this.endereco = object.endereco
        this.pais = object.pais
        this.cidade = object.cidade
    }
}
