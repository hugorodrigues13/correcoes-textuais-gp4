package br.com.furukawa.auth

import br.com.furukawa.exceptions.LoginException
import br.com.furukawa.model.Acesso
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.Organizacao
import grails.plugin.springsecurity.userdetails.GrailsUser
import org.springframework.security.core.GrantedAuthority

class MyUserDetails extends GrailsUser {
    private final List<Long> _acessos
    String _organizacaoSelecionada
    String _fornecedorSelecionado
    List<String> permissoes
    Locale locale

    MyUserDetails(String username, String password, boolean enabled,
                  boolean accountNonExpired, boolean credentialsNonExpired,
                  boolean accountNonLocked,
                  Collection<GrantedAuthority> authorities,
                  long id, List<Long> acessos, String organizacaoSelecionada, String fornecedorSelecionado ) {
        super(username, password, enabled, accountNonExpired,
                credentialsNonExpired, accountNonLocked, authorities, id)
        this._acessos = acessos

        if(organizacaoSelecionada) {
            this._organizacaoSelecionada = organizacaoSelecionada
            this._fornecedorSelecionado = fornecedorSelecionado
        } else if(!_organizacaoSelecionada) {
            List<Acesso> acessosList = Acesso.getAll(acessos)
            List<Organizacao> organizacoes = acessosList*.organizacoes.flatten()
            Organizacao primeiraOrganizacao = organizacoes.sort{it.descricao}.first()
            List<Fornecedor> fornecedores = acessosList*.fornecedores.flatten().findAll {it.organizationId.toString() == primeiraOrganizacao.organizationID}
            Fornecedor primeiroFornecedor
            if(fornecedores && !fornecedores.isEmpty()) {
                primeiroFornecedor = fornecedores.sort {it.nome}.first()
            } else {
                throw new LoginException("Nenhum fornecedor cadastrado para a organização ${primeiraOrganizacao.descricao}")
            }

            this._organizacaoSelecionada = primeiraOrganizacao.id as String
            this._fornecedorSelecionado = primeiroFornecedor.id as String
        }
    }

    Object getDomainClass() {
        return null;
    }

    List<Acesso> get_acessos() {
        return _acessos
    }

    String get_organizacaoSelecionada() {
        return _organizacaoSelecionada
    }

    void changeCampos(String organizacao, String fornecedor) {
        this._organizacaoSelecionada = organizacao
        this._fornecedorSelecionado = fornecedor
    }

    void set_organizacaoSelecionada(String _organizacaoSelecionada) {
        List<Acesso> acessosList = Acesso.getAll(_acessos)
        List<Fornecedor> fornecedores = acessosList*.fornecedores.flatten().findAll {it.organizationId.toString() == Organizacao.get(_organizacaoSelecionada).organizationID}
        Fornecedor primeiroFornecedor
        if(fornecedores && !fornecedores.isEmpty()) {
            primeiroFornecedor = fornecedores.sort {it.nome}.first()
        } else {
            throw new LoginException("Nenhum fornecedor cadastrado para a organização ${Organizacao.get(_organizacaoSelecionada).descricao}")
        }

        this._organizacaoSelecionada = _organizacaoSelecionada
        this._fornecedorSelecionado = primeiroFornecedor.id as String
    }

    String get_fornecedorSelecionado() {
        return _fornecedorSelecionado
    }

    void set_fornecedorSelecionado(String _fornecedorSelecionado) {
        this._fornecedorSelecionado = _fornecedorSelecionado
    }

    Organizacao getOrganizacao(){
        return Organizacao.get(_organizacaoSelecionada)
    }

    Fornecedor getFornecedor() {
        return Fornecedor.get(_fornecedorSelecionado)
    }

    void setPermissoes(List<String> permissoes) {
        this.permissoes = permissoes
    }

    List<Organizacao> getOrganizacoes() {
        List<Acesso> acessosList = Acesso.getAll(_acessos)
        return acessosList*.organizacoes.flatten().sort {it.descricao} as ArrayList<Organizacao>
    }

    List<Fornecedor> getFornecedores() {
        List<Acesso> acessosList = Acesso.getAll(_acessos)
        return acessosList*.fornecedores.flatten().findAll {it.organizationId.toString() == getOrganizacao().organizationID}.sort{it.nome} as ArrayList<Fornecedor>
    }

    List<String> getPermissoes() {
        return permissoes
    }
}
