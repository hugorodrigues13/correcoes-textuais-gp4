package br.com.furukawa.enums

enum TipoMensagem
{
    SUCCESS_TYPE( "success" ),
    WARNING_TYPE( "warning" ),
    INFO_TYPE( "info" ),
    ERROR_TYPE( "error" )

    final String descricao

    TipoMensagem(String descricao)
    {
        this.descricao = descricao
    }
}