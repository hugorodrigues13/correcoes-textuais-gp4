package br.com.furukawa.controller

import br.com.furukawa.dtos.DadosEmailAlteracaoUsuarioDTO
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.model.User
import br.com.furukawa.service.CrudService
import br.com.furukawa.service.MensagemService
import grails.plugins.mail.MailService

class RecuperarSenhaController {

	MensagemService mensagemService

	MailService mailService

    CrudService crudService

	final ALLCHARS = ['A'..'Z', 'a'..'z', '0'..'9'].flatten() - ['O', '0', 'l', '1', 'I']

	def enviarEmailRecuperarSenha() {
		def lang = request.getHeader("lang")
		Locale locale = crudService.getLocale(lang)
		if (params.email != null && params.email != "") {
			User user = User.findByEmail(params.email)
			if (user != null) {
				def novaSenha = generatePassword(8)

				user.password = novaSenha

				def model = [:]

                DadosEmailAlteracaoUsuarioDTO dto = new DadosEmailAlteracaoUsuarioDTO()
				dto.mensagemService = mensagemService
				dto.nomeUsuario = user.fullname
				dto.isEdicao = true
				dto.login = user.username
				dto.senha = user.password

				String assunto = mensagemService.getMensagem( "user.email.assunto.recuperar.message", null, locale)
				model.put("assunto", assunto)

				if (user.save()) {
					String conteudo = dto.getConteudo(locale)
					model.put("conteudo", conteudo)
					try{
						mailService.sendMail {
							to user.email
							subject assunto
							text conteudo
						}
						respond crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'recuperarSenha.emailSucesso.message', locale)
					}catch(Exception e ){
						respond crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, 'recuperarSenha.erroEnvio.message', locale)
						return
					}
				} else {
					respond crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, 'recuperarSenha.erroSalvarNovaSenha.message', locale)
				}
			} else {
				respond crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, 'recuperarSenha.usuarioNaoEncontrado.message', locale)
			}
		} else {
			respond crudService.montaMensagemDeResposta(TipoMensagem.WARNING_TYPE, 'recuperarSenha.emailNaoEspecificado.message', locale)
		}
	}

	def generatePassword = {
		length ->
			(0..<length).collect {
				ALLCHARS[new Random().nextInt(ALLCHARS.size())]
			}.join()
	}
}
