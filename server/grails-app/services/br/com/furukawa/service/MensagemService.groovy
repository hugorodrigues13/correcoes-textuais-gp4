package br.com.furukawa.service

import grails.gorm.transactions.Transactional
import org.springframework.context.i18n.LocaleContextHolder

@Transactional
class MensagemService {
    def messageSource

    String getMensagem(String code, String msgDefault = null, Object[] args = null, Locale locale = LocaleContextHolder.getLocale()) {
        return messageSource.getMessage(code, args, msgDefault, locale)
    }
}
