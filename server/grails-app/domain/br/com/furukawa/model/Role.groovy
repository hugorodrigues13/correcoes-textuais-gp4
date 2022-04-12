package br.com.furukawa.model

import br.com.furukawa.utils.Audit
import grails.plugin.springsecurity.SpringSecurityUtils
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import grails.compiler.GrailsCompileStatic

@GrailsCompileStatic
@EqualsAndHashCode(includes='authority')
@ToString(includes='authority', includeNames=true, includePackage=false)
class Role extends Audit implements Serializable {
	private static final long serialVersionUID = 1

	String authority
	String descricao
	String nome
	Boolean isEditavel = true
	Boolean isRemovivel = true

	static constraints = {
		authority nullable: false, blank: false, unique: true
	}

	static mapping = {
		cache true
		id generator: 'sequence', params: [sequence: 'role_seq']
	}

	List<Requestmap> acessoPermitido( List<Requestmap> areas )
	{
		List<Requestmap> areasPermitidas = new ArrayList<Requestmap>()

		if( authority != null && authority.length() > 0 )
		{
			areas.each()
					{
						String str = SpringSecurityUtils.parseAuthoritiesString( it.configAttribute )
						List<String> strList = Arrays.asList(str.trim().split("(?!-)(\\W|\\s|\\xA0)+"))
						boolean containsRole = false
						String authorityString = authority
						strList.each {roleString ->
							if (roleString.equals(authorityString)) {
								containsRole = true
							}
						}
						if( containsRole )
						{
							areasPermitidas.add( it )
						}
					}
		}

		return areasPermitidas
	}

	List<Requestmap> getAcessosPermitidosSemFilhos( List<Requestmap> areas )
	{
		return acessoPermitido( areas ).findAll{
			it.getFilhos().isEmpty()
		}
	}
}
