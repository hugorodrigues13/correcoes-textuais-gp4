import br.com.furukawa.DefaultAuditRequestResolver
import br.com.furukawa.auth.AuthenticationProvider
import br.com.furukawa.auth.CustomTokenEnhancer
import br.com.furukawa.auth.MyPasswordEncoder
import br.com.furukawa.auth.MyRestAuthenticationFailureHandler
import br.com.furukawa.auth.MyRestAuthenticationFilter
import br.com.furukawa.exceptions.ExceptionHandler
import br.com.furukawa.model.UserPasswordEncoderListener
import br.com.furukawa.service.MyUserDetailsService
import br.com.furukawa.auth.AuthenticationDetailsSource
import br.com.furukawa.auth.DefaultJsonPayloadCredentialsExtractor
import br.com.furukawa.auth.DefaultAccessTokenJsonRenderer

beans = {

    authenticationDetailsSource(AuthenticationDetailsSource)

    userDetailsService(MyUserDetailsService) {
        springSecurityService = ref('springSecurityService')
    }

    authenticationProvider(AuthenticationProvider){
        userDetailsService = ref('userDetailsService')
        passwordEncoder = ref('passwordEncoder')
        userCache = ref('userCache')
        preAuthenticationChecks = ref('preAuthenticationChecks')
        postAuthenticationChecks = ref('postAuthenticationChecks')
        authoritiesMapper = ref('authoritiesMapper')
        hideUserNotFoundExceptions = true
        userService = ref( 'userService')
    }
    accessTokenJsonRenderer(DefaultAccessTokenJsonRenderer)
    userPasswordEncoderListener(UserPasswordEncoderListener)

    passwordEncoder(MyPasswordEncoder){ bean ->
        bean.factoryMethod = "createDelegatingPasswordEncoder"
    }

    tokenGenerator(CustomTokenEnhancer)

    exceptionHandler(ExceptionHandler) {
        // this is required so that calls to super work
        exceptionMappings = ['java.lang.Exception': "/error500"]
        defaultErrorView = '/error'
        mailService = ref("mailService")
        grailsApplication = ref("grailsApplication")
    }

    credentialsExtractor(DefaultJsonPayloadCredentialsExtractor) {
        userService = ref( 'userService')
    }

    auditRequestResolver(DefaultAuditRequestResolver){
        userService = ref( 'userService')
    }

    restAuthenticationFailureHandler(MyRestAuthenticationFailureHandler)

    restAuthenticationFilter(MyRestAuthenticationFilter) {
        credentialsExtractor = ref('credentialsExtractor')
        authenticationManager = ref('authenticationManager')
        authenticationSuccessHandler = ref('restAuthenticationSuccessHandler')
        authenticationFailureHandler = ref('restAuthenticationFailureHandler')
        authenticationEventPublisher = ref('authenticationEventPublisher')
        authenticationDetailsSource = ref('authenticationDetailsSource')
        tokenGenerator = ref('tokenGenerator')
        tokenStorageService = ref('tokenStorageService')
        requestMatcher = ref('restAuthenticationFilterRequestMatcher')
    }
}
