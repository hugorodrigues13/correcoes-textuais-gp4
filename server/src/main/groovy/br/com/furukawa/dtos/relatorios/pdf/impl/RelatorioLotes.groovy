package br.com.furukawa.dtos.relatorios.pdf.impl

import br.com.furukawa.dtos.relatorios.RelatorioDTO
import br.com.furukawa.dtos.relatorios.pdf.RelatorioPDF
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.User
import br.com.furukawa.service.MensagemService

class RelatorioLotes extends RelatorioPDF{

    private Fornecedor fornecedor
    private User user
    private List<RelatorioLoteItem> itens

    RelatorioLotes(List<RelatorioLoteItem> itens, Fornecedor fornecedor, User user, MensagemService mensagemService, Locale locale) {
        super("/images/lotes.jrxml", "relatorios.lotes.", mensagemService, locale)
        this.fornecedor = fornecedor
        this.user = user
        this.itens = itens
    }

    @Override
    Map getParametros() {
        return [
                MSG_TITULO: "titulo", // caso começe com MSG automaticamente irá pegar do arquivo de mensagens
                MSG_FORNECEDOR: "fornecedor",
                MSG_USUARIO: "usuario",
                MSG_DATA: "data",
                MSG_LOTE: "lote",
                MSG_DESCRICAO: "descricao",
                MSG_CODIGO: "codigo",
                MSG_QUANTIDADE: "quantidade",
                VAR_FORNECEDOR: fornecedor.getNome(),
                VAR_USUARIO: user.getFullname(),
                VAR_LOGO: RelatorioLotes.class.getResource("/images/logo_furukawai.jpg")
        ]
    }

    @Override
    protected List<RelatorioLoteItem> getObjects() {
        return itens
    }
}
