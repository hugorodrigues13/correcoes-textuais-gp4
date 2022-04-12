package br.com.furukawa.dtos.filtros

import br.com.furukawa.dtos.Ordenacao
import br.com.furukawa.dtos.Paginacao
import br.com.furukawa.dtos.Periodo

import java.text.SimpleDateFormat

abstract class Filtro {

    Filtro(Map params){
        List<String> ignorar = getIgnorado()
        this.getMetaClass().properties.each {prop ->
            if (ignorar.contains(prop.name)) return
            switch (prop.type){
                case Ordenacao:
                    this."$prop.name" = new Ordenacao(sort: params.sort ?: getSortPadrao(), order: params.order ?: "asc")
                    break
                case Paginacao:
                    this."$prop.name" = new Paginacao(offset: params.offset as Integer ?: 0, max: params.max as Integer ?: 10)
                    break
                case Periodo:
                    this."$prop.name" = params."${prop.name}Inicial" ? new Periodo(params."${prop.name}Inicial", params."${prop.name}Final", getPeriodoFormato(prop.name)) : null
                    break
                default:
                    this."$prop.name" = customizarProp(prop.name, params."${prop.name}")
                    break
            }
        }
    }

    String gerarWhere(){
        StringBuilder where = new StringBuilder("WHERE 1=1\n")
        List<MetaProperty> props = this.getMetaClass().properties
        List<String> ignorar = getIgnorado()
        props.each {prop ->
            if (ignorar.contains(prop.name)) return
            def valor = this."${prop.name}"
            if (!valor) return
            String customWhere = customizarWhere(prop.name, valor)
            if (customWhere != prop.name){
                where.append(customWhere)
            } else if (prop.type == String || Enum.isAssignableFrom(prop.type)){
                where.append(" AND UPPER(${traduzirPropParaColuna(prop.name)}) LIKE UPPER('%${valor}%')\n")
            } else if (Number.isAssignableFrom(prop.type)){
                where.append(" AND ${traduzirPropParaColuna(prop.name)} = '${valor}'\n")
            } else if (prop.type == Periodo){
                Periodo periodo = valor
                String padrao = periodo.padrao
                SimpleDateFormat sdf = new SimpleDateFormat(padrao)
                String df = padrao == 'dd/MM/yyyy' ? 'DD/MM/YY' : padrao == 'dd/MM/yyyy HH:mm' ? 'DD/MM/YY HH24:MI' : 'DD/MM/YY HH24:MI:SS'
                String d1 = sdf.format(periodo.dataInicial)
                String d2 = sdf.format(periodo.dataFinal)
                where.append(" AND ${traduzirPropParaColuna(prop.name)} BETWEEN TO_DATE('$d1', '$df') AND TO_DATE('$d2', '$df')\n")
            } else if (prop.type == List){
                String inValor = valor.collect({"'$it'"}).join(", ")
                where.append(" AND ${traduzirPropParaColuna(prop.name)} IN ($inValor)\n")
            }
        }
        return where.toString()
    }

    String gerarOrderBy(){
        Ordenacao ordenacao = this.ordenacao
        return "ORDER BY ${traduzirPropParaOrder((ordenacao.sort))} ${ordenacao.order}"
    }

    String customizarWhere(String prop, Object valor){
        return prop
    }

    String traduzirPropParaOrder(String prop){
        return prop
    }

    String traduzirPropParaColuna(String prop){
        return prop
    }

    protected String getSortPadrao(){
        return "id"
    }

    protected getPeriodoFormato(String prop){
        return Periodo.PADRAO_DATA_HORA
    }

    protected List<String> getIgnorado(){
        return ['class', 'sortPadrao', 'ignorado', 'periodoFormato']
    }

    protected Object customizarProp(String prop, Object valor){
        return valor
    }

}
