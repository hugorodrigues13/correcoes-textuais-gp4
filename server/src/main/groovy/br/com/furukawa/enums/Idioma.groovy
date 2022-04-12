package br.com.furukawa.enums

import br.com.furukawa.model.Organizacao

enum Idioma {
    PORTUGUES("pt", "BR", "PTB", "pt-BR"),
    INGLES("en", "US", "US", "en-US"),
    ESPANHOL("es", "ES", "ESA", "es-ES")

    private String lingua
    private String pais
    private String descricao
    private String locale

    private Idioma(String lingua, String pais, String descricao, String locale){
        this.lingua = lingua
        this.pais = pais
        this.descricao = descricao
        this.locale = locale
    }

    boolean isEspanhol() {
        return equals(ESPANHOL)
    }

    boolean isIngles() {
        return equals(INGLES)
    }

    boolean isPortugues() {
        return equals(PORTUGUES)
    }

    static Locale getLocale( String locale ){
        if( values()*.locale.contains( locale ) ){
            return Locale.forLanguageTag( locale )
        }
        else{
            return Locale.forLanguageTag( PORTUGUES.locale )
        }
    }

    static Idioma getIdiomaPeloLocale( String lingua ){
        Locale locale = getLocale( lingua )

        if( Locale.US.equals( locale ) ){
            return Idioma.INGLES
        }
        else if( Locale.forLanguageTag( ESPANHOL.locale ).equals( locale ) ){
            return Idioma.ESPANHOL
        }
        else{
            return Idioma.PORTUGUES
        }
    }

    static Idioma getByDescricao(String descricao) {
        return values().find{it.descricao == descricao} ?: PORTUGUES
    }

    static Locale getLocaleByOrganizacao(Organizacao organizacao) {
        return getLocale(getByDescricao(organizacao.idioma).locale)
    }

    static Idioma getIdiomaByOrganizacao(Organizacao organizacao) {
        return getByDescricao(organizacao.idioma)
    }

    String getDescricao(){
        return descricao
    }
}