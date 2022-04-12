package br.com.furukawa.exceptions

import grails.util.Environment
import org.grails.web.errors.GrailsExceptionResolver
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.servlet.ModelAndView
import javax.mail.internet.InternetAddress

import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class ExceptionHandler extends GrailsExceptionResolver
{
    private static final Logger log = LoggerFactory.getLogger(ExceptionHandler)

    def mailService
    def grailsApplication

    ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception exception )
    {
        if(grailsApplication.config.getProperty( "grails.mailOnException.enabled", boolean ) )
        {
            if( log.debugEnabled )
            {
                log.debug( "resolveException(request=${request}, response=${response}, handler=${handler}, exception=${exception})" )
            }

            def emails = InternetAddress.parse( grailsApplication.config.getProperty( "grails.mailOnException.email.to" ) )//.mailOnException.email.to
            def fromEmail = grailsApplication.config.getProperty( "grails.mailOnException.email.from" )
            def g = grailsApplication.mainContext.getBean( 'org.grails.plugins.web.taglib.RenderTagLib' )
            g.metaClass.prettyPrintStatus = { return '' }

            //TODO isto foi colocado forçadamente, pensar em outra forma de resolver
            request.setAttribute('javax.servlet.error.status_code', "500")

            try
            {
                mailService.sendMail {
                    multipart true
                    to emails
                    from fromEmail
                    subject "GP4.0 - Unhandled exception in the ${Environment.current} environment"
                    html g.renderException( exception: exception )
                }
            }
            catch( Exception e )
            {
                if( log.errorEnabled )
                {
                    log.error( "could not send email after exception", e )
                }
            }
        }

        return super.resolveException(request, response, handler, exception)
    }
}