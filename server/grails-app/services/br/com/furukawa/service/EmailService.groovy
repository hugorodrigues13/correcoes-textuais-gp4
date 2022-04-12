package br.com.furukawa.service

import grails.gorm.transactions.Transactional
import grails.util.Environment

import javax.mail.internet.InternetAddress

@Transactional
class EmailService {
    def grailsApplication
    def mailService

    void enviaEmailDeErro( Exception exception )
    {
        try
        {
            def emails = InternetAddress.parse( grailsApplication.config.getProperty( "grails.mailOnException.email.to" ) )//.mailOnException.email.to
            def fromEmail = grailsApplication.config.getProperty( "grails.mailOnException.email.from" )
            def g = grailsApplication.mainContext.getBean( 'org.grails.plugins.web.taglib.RenderTagLib' )
            g.metaClass.prettyPrintStatus = { return '' }
            StringWriter sw = new StringWriter()
            exception.printStackTrace(new PrintWriter(sw))
            String exceptionAsString = sw.toString()
            print exceptionAsString

            mailService.sendMail {
                multipart true
                to emails
                from fromEmail
                subject "GP4.0 - Unhandled exception in the ${Environment.current} environment"
                html   view: "/email/email", model: [exception: exceptionAsString]
            }
        }
        catch( Exception e )
        {
            e.printStackTrace()

            if( log.errorEnabled )
            {
                log.error( "could not send email after exception", e )
            }
        }
    }
}
