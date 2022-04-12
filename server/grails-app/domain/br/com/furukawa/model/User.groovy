package br.com.furukawa.model

import br.com.furukawa.enums.TipoPaginaColunas
import br.com.furukawa.service.UserService
import br.com.furukawa.utils.Audit
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import grails.compiler.GrailsCompileStatic

@GrailsCompileStatic
@EqualsAndHashCode(includes='username')
@ToString(includes='username', includeNames=true, includePackage=false)
class User extends Audit implements Serializable {

    private static final long serialVersionUID = 1

    final static String USUARIO_NAO_LOGADO_OU_SISTEMA = "SYS"

    String fullname
    String email
    String username
    String password
    boolean enabled = true
    boolean isRemovivel = true
    boolean accountExpired
    boolean accountLocked = false
    boolean passwordExpired
    String token
    String matricula
    String linguagem
    UserService userService

    static transients = ['userService']

    static hasMany = [planejadores: String, acessos: Acesso, colunas: UsuarioColunas]

    static constraints = {
        password nullable: false, blank: false, password: true
        username nullable: false, blank: false, unique: true
        email unique: true, nullable: true
        token nullable: true
        matricula nullable: true
        linguagem nullable: true
    }

    static mapping = {
	    password column: '`password`'
        table 'users'
        id generator: 'sequence', params: [sequence: 'user_seq']
        username updateable: false
        planejadores joinTable: [name: 'usuario_planejador', key: 'user_id', column: 'planner_code']
        acessos lazy: false, joinTable: [name: 'usuario_acesso', key: 'user_id', column: 'acesso_id']
    }

    Set<Role> getAuthorities() {
        (UserRole.findAllByUser(this) as List<UserRole>)*.role as Set<Role>
    }

    Boolean isAdmin(){
        Set<Role> roles = getAuthorities()
        return roles.any{ it.authority == "ROLE_ADMINISTRADOR"}
    }

    Boolean isSupervisor(){
        Set<Role> roles = getAuthorities()
        return roles.any{ it.authority == "ROLE_SUPERVISOR"}
    }

    Boolean isEditorNF(){
        Set<Role> roles = getAuthorities()
        return roles.any{ it.authority == "ROLE_EDITOR_DE_NOTAS_FISCAIS"}
    }

    List<Role> getRole(){
        List<UserRole> userRole = null
        if(this?.id != null){
            userRole = UserRole.findAllByUser(this)
            userRole*.role
        }
        userRole*.role
    }

    def isAtivo(){
        return enabled
    }

    boolean usuarioPodeSerEditadoPeloUsuarioLogado(List<Role> perfis, List<Acesso> acessos) {
        return userService.usuarioPossuiPermissaoParaEditarOutroUsuario(this, perfis, acessos)
    }

    List<String> getUsuarioColunas(TipoPaginaColunas tipo){
        return UsuarioColunas.findByUsuarioAndTipo(this, tipo)?.colunas ?: tipo.getPadrao()
    }

}
