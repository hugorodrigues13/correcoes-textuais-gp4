package br.com.furukawa.service

import br.com.furukawa.auth.MyUserDetails
import br.com.furukawa.enums.TipoPaginaColunas
import br.com.furukawa.model.Organizacao
import br.com.furukawa.model.Requestmap
import br.com.furukawa.model.Role
import br.com.furukawa.model.Acesso
import br.com.furukawa.model.User
import br.com.furukawa.model.UserRole
import br.com.furukawa.model.UsuarioColunas
import grails.gorm.transactions.Transactional

@Transactional
class UserService extends CrudService{

    def springSecurityService

    User getUsuarioLogado() {
        springSecurityService.currentUser
    }

    @Override
    boolean excluir(def user) {
        try {
            def roles = UserRole.findAllByUser(user)
            UserRole.deleteAll(roles)
            user.delete(flush: true, failOnError: true);
            return true;
        }catch (e){
            return false;
        }
    }

    @Override
    boolean ativarOuDesativar(def user, boolean status){
        if(user) {
            user.enabled = status
            return user.save(failOnError: true)
        }
        return user
    }

    boolean isUsuarioOrganizacao( String username, String organizacaoId ){
        def user = User.createCriteria()
        def results = user.get{
            eq("username", username)
            acessos {
                organizacoes {
                    eq("id", organizacaoId as Long)
                }
            }
        }
        return results
    }

    Organizacao getOrganizacao( String organizacaoId ){
        return Organizacao.get(organizacaoId)
    }

    List<String> permissoesByUser(MyUserDetails userDetails ){
        User user = User.get(userDetails?.id)
        List<Long> rolesIds = user.role*.id
        List acessosPermitidos = new ArrayList<Requestmap>()
        List<Requestmap> acessosDisponiveis = Requestmap.findAllByConfigAttributeNotEqual( 'permitAll' )
        acessosDisponiveis.removeAll( Requestmap.acessoComum() )

        if(  rolesIds != null ){
            List<Role> perfis = Role.getAll( rolesIds )
            perfis.each {perfil ->
                acessosPermitidos.addAll(perfil?.acessoPermitido(acessosDisponiveis))
            }
        }

        return acessosPermitidos*.descricao as List<String>
    }

    User getUserByToken(String token) {
        return User.findByTokenIlike(token)
    }

    List<Role> perfilPermitidoByUser () {
        List<Role> permissoes = []
        User user = getUsuarioLogado()
        List<Role> rolesUser = user.getRole()
        Set<Requestmap> acessosUser = new HashSet<>()
        List<Requestmap> acessosDisponiveis = Requestmap.findAllByConfigAttributeNotEqual( 'permitAll' )
        acessosDisponiveis.removeAll(Requestmap.acessoComum())

        rolesUser.each {roleUser ->
            acessosUser.addAll(roleUser.acessoPermitido(acessosDisponiveis))
        }

        Role.getAll().each {roleAll ->
            List<Requestmap> acessosRoleAll = roleAll.acessoPermitido(acessosDisponiveis)

            if( !acessosRoleAll.isEmpty() && acessosRoleAll.every {acessosUser*.id.contains(it.id)} ){
                permissoes.add(roleAll)
            }
        }

        return permissoes
    }

    List<Acesso> acessoPermitidoByUser () {
        User user = getUsuarioLogado()
        List<Acesso> todosOsAcessos = Acesso.findAll()
        if (user.isAdmin()) return todosOsAcessos

        List<Acesso> acessosPermitidos = new ArrayList<>()
        Set<Acesso> acessosDoUsuario = user.acessos
        List<Long> fornecedoresDoUsuario = acessosDoUsuario*.fornecedores*.id.flatten()
        List<Long> organizacoesDoUsuario = acessosDoUsuario*.organizacoes*.id.flatten()

        todosOsAcessos.each {acesso ->
            Set<Long> fornecedoresDoAcesso = acesso.fornecedores*.id
            Set<Long> organizacoesDoAcesso = acesso.organizacoes*.id
            boolean usuarioPossuiAcessoATodosOsFornecedores = fornecedoresDoAcesso.every {fornecedoresDoUsuario.contains(it)}
            boolean usuarioPossuiAcessoATodasAsOrganizacoes = organizacoesDoAcesso.every {organizacoesDoUsuario.contains(it)}

            if(usuarioPossuiAcessoATodosOsFornecedores && usuarioPossuiAcessoATodasAsOrganizacoes) {
                acessosPermitidos.add(acesso)
            }
        }

        return acessosPermitidos
    }

    boolean usuarioPossuiPermissaoParaEditarOutroUsuario(User usuarioEdicao, List<Role> perfis, List<Acesso> acessos) {
        boolean usuarioPossuiPermissaoByRole = usuarioEdicao.role.every {perfis*.id.contains(it.id)}
        boolean usuarioPossuiPermissaoByAcesso = usuarioEdicao.acessos.every {acessos*.id.contains(it.id)}

        return usuarioPossuiPermissaoByRole && usuarioPossuiPermissaoByAcesso
    }

    def editarColunas(TipoPaginaColunas tipo, List<String> colunas) {
        User user = getUsuarioLogado()
        UsuarioColunas usuarioColunas = UsuarioColunas.findByUsuarioAndTipo(user, tipo)
        if (!usuarioColunas){
            usuarioColunas = new UsuarioColunas(usuario: user, tipo: tipo)
            user.addToColunas(usuarioColunas)
        }
        usuarioColunas.setColunas(colunas)
        usuarioColunas.save(flush: true, failOnError: true)
    }
}
