package br.com.furukawa.dtos

import br.com.furukawa.service.MensagemService

class DadosEmailAlteracaoUsuarioDTO {
    String nomeUsuario
    String login
    String senha
    boolean isEdicao


    MensagemService mensagemService

    String getConteudo(Locale locale) {
        return isEdicao ? getConteudoEdicao(locale) : getConteudoCriacao(locale)
    }

    private String getConteudoEdicao(Locale locale) {
        return  (mensagemService.getMensagem('user.email.conteudo.edicao.message', null, nomeUsuario, locale)) + " "+
                (login ? mensagemService.getMensagem('user.email.edicao.login.message', null, login, locale) : "") + " "+
                (senha ? mensagemService.getMensagem('user.email.edicao.senha.message', null, senha, locale) : "")
    }

    private String getConteudoCriacao(Locale locale) {
        return  (mensagemService.getMensagem('user.email.conteudo.criacao.message', null, nomeUsuario, locale)) + " "+
                (login ? mensagemService.getMensagem('user.email.criacao.login.message', null, login, locale) : "") + " "+
                (senha ? mensagemService.getMensagem('user.email.criacao.senha.message', null, senha) : "")
    }

    String getAssunto(Locale locale) {
        return isEdicao ? mensagemService.getMensagem('user.email.assunto.edicao.message', null, locale) :
                mensagemService.getMensagem('user.email.assunto.criacao.message', null, locale)
    }
}
