package br.com.furukawa.service

import br.com.furukawa.constantes.ItensCatalogoFixos
import br.com.furukawa.dtos.ApontamentoPendenteDTO
import br.com.furukawa.dtos.ApontamentoResponseDTO
import br.com.furukawa.dtos.TipoRegraExibicaoMP
import br.com.furukawa.dtos.GrupoRecursoParadaDTO
import br.com.furukawa.dtos.RecursoDTO
import br.com.furukawa.dtos.TransacaoAjusteMaterialDTO
import br.com.furukawa.dtos.TurnoDTO
import br.com.furukawa.dtos.ebs.ComponenteWIP
import br.com.furukawa.dtos.filtros.FiltroApontamentosPendentes
import br.com.furukawa.enums.Idioma
import br.com.furukawa.enums.StatusLote
import br.com.furukawa.enums.StatusOrdemFabricacao
import br.com.furukawa.enums.StatusSerialFabricacao
import br.com.furukawa.exceptions.ApontamentoException
import br.com.furukawa.exceptions.LoteException
import br.com.furukawa.model.Apontamento
import br.com.furukawa.model.ApontamentoOrdemDeFabricacao
import br.com.furukawa.model.DadoRastreavelApontamento
import br.com.furukawa.model.ConfiguracaoGeral
import br.com.furukawa.model.DadoRastreavelApontamentoOF
import br.com.furukawa.model.Defeito
import br.com.furukawa.model.DefeitoApontamentoOF
import br.com.furukawa.model.GrupoLinhaDeProducao
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.GrupoRecurso
import br.com.furukawa.model.HistoricoApontamento
import br.com.furukawa.model.ImpressaoApontamentoCaixa
import br.com.furukawa.model.ImpressaoApontamentoLote
import br.com.furukawa.model.Impressora
import br.com.furukawa.model.ItemCatalogo
import br.com.furukawa.model.LinhaDeProducao
import br.com.furukawa.model.Lote
import br.com.furukawa.model.MotivoDeParada
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.Organizacao
import br.com.furukawa.model.Parada
import br.com.furukawa.model.ProcessoLinhaDeProducao
import br.com.furukawa.model.ProdutoEtiqueta
import br.com.furukawa.model.ProdutoGrupoLinhaDeProducao
import br.com.furukawa.model.Recurso
import br.com.furukawa.model.RegraExibicaoMP
import br.com.furukawa.model.SerialFabricacao
import br.com.furukawa.model.TempoApontamentoProduto
import br.com.furukawa.model.User
import br.com.furukawa.utils.DateUtils
import grails.gorm.transactions.Transactional
import groovy.time.TimeCategory
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery
import org.hibernate.transform.Transformers
import org.hibernate.type.LongType
import org.hibernate.type.TimestampType
import org.hibernate.type.StringType

import java.text.SimpleDateFormat

@Transactional
class ApontamentoService {

    CrudService crudService
    ImpressoraService impressoraService
    UserService userService
    OrdemDeProducaoService ordemDeProducaoService
    LoteService loteService
    OracleService oracleService
    SequenciamentoService sequenciamentoService
    EtiquetaService etiquetaService
    SessionFactory sessionFactory
    MensagemService mensagemService

    void validacao(String serialFabricacao, Long recursoId, Long impressoraId, Fornecedor fornecedor) {
        if (existemEtiquetasParaORecurso(recursoId)){
            List<Impressora> impressoras = Impressora.findAllByFornecedor(fornecedor)
            if (impressoras && !impressoraId){
                throw new ApontamentoException('apontamento.recurso.semImpressora.message')
            }
        }

        if (serialFabricacao.indexOf('-') == -1) {
            throw new ApontamentoException('apontamento.serialInvalido.message')
        }

        SerialFabricacao serialValidado = getSerialFabricacao(serialFabricacao)
        Recurso recurso = Recurso.get(recursoId)

        if (serialValidado == null || serialValidado.ordemDeFabricacao.fornecedor != fornecedor) {
            throw new ApontamentoException('apontamento.serialInvalido.message')
        } else if (serialValidado.ordemDeFabricacao.status == StatusOrdemFabricacao.CANCELADA){
            throw new ApontamentoException('apontamento.ordemFabricacao.cancelada.message')
        } else if (serialValidado.ordemDeProducaoInvalidaNoWip()){
            throw new ApontamentoException('apontamento.ordemProducao.cancelada.message')
        } else if (recurso?.isParado()){
            throw new ApontamentoException('apontamento.recurso.parado.message')
        } else if (!recurso?.isAtivo){
            throw new ApontamentoException('apontamento.recurso.inativo.message')
        } else if (!ProdutoEtiqueta.findByCodigoProdutoAndFornecedor(serialValidado.ordemDeFabricacao.codigoProduto, fornecedor)){
            throw new ApontamentoException('apontamento.ordemFabricacao.semEtiqueta.message')
        } else if (!recurso.conectores.isEmpty()){
            List<String> tiposDeConectores = ConfiguracaoGeral.getTiposDeConectores()
            List<ItemCatalogo> catalogos = ItemCatalogo.findAllByCodigoProdutoAndOrganizationIdAndNomeInList(serialValidado.codigoProduto, fornecedor.organizationId, tiposDeConectores)
            List<String> conectores = catalogos*.valor
            if (!recurso.conectores.any({conectores.contains(it.descricao)})){
                throw new ApontamentoException('apontamento.serial.semConectores.message')
            }

            validaApontamento(serialValidado, recursoId, recurso)
        } else {
            validaApontamento(serialValidado, recursoId, recurso)
        }
    }

    void validacaoOF(String ordemDeFabricacao, Long recursoId, Long impressoraId, Fornecedor fornecedor) {
        //if (existemEtiquetasParaORecurso(recursoId)){
        //    List<Impressora> impressoras = Impressora.findAllByFornecedor(fornecedor)
        //    if (impressoras && !impressoraId){
        //        throw new ApontamentoException('apontamento.recurso.semImpressora.message')
        //    }
        //}

        if (ordemDeFabricacao.indexOf('-') == -1) {
            throw new ApontamentoException('apontamento.opInvalida.message')
        }

        OrdemDeFabricacao ofValidada = OrdemDeFabricacao.getByCodigo(ordemDeFabricacao, fornecedor)
        Recurso recurso = Recurso.get(recursoId)

        if (ofValidada == null || ofValidada.fornecedor != fornecedor) {
            throw new ApontamentoException('apontamento.opInvalida.message')
        } else if (ofValidada.isCancelada()){
            throw new ApontamentoException('apontamento.ordemFabricacao.cancelada.message')
        } else if (ofValidada.getQuantidadeIniciada() > 0){
            throw new ApontamentoException('apontamento.ordemProducao.producaoIniciada.message')
        } else if (recurso?.isParado()){
            throw new ApontamentoException('apontamento.recurso.parado.message')
        } else if (!recurso?.isAtivo){
            throw new ApontamentoException('apontamento.recurso.inativo.message')
        } else if (!recurso.conectores.isEmpty()){
            List<String> tiposDeConectores = ConfiguracaoGeral.getTiposDeConectores()
            List<ItemCatalogo> catalogos = ItemCatalogo.findAllByCodigoProdutoAndOrganizationIdAndNomeInList(ofValidada.codigoProduto, fornecedor.organizationId, tiposDeConectores)
            List<String> conectores = catalogos*.valor
            if (!recurso.conectores.any({conectores.contains(it.descricao)})){
                throw new ApontamentoException('apontamento.serial.semConectores.message')
            }

            validaApontamentoOF(ofValidada, recurso)
        } else {
            validaApontamentoOF(ofValidada, recurso)
        }
    }

    private void validaApontamento(SerialFabricacao serialValidado, long recursoId, Recurso recurso) {
        Apontamento apontamento = Apontamento.findBySerial(serialValidado)

        if (apontamento) {
            validaApontamentoExistente(serialValidado, apontamento, recursoId)
        } else {
            validaPrimeiroProcessoApontamento(serialValidado, recurso)
        }
    }

    private void validaApontamentoOF(OrdemDeFabricacao ordemDeFabricacao, Recurso recurso) {
        ApontamentoOrdemDeFabricacao apontamentoOrdemDeFabricacao = ApontamentoOrdemDeFabricacao.findByOrdemDeFabricacao(ordemDeFabricacao)

        if (apontamentoOrdemDeFabricacao) {
            throw new ApontamentoException("apontamento.ordemDeProducao.apontamentoExistente.message")
        } else {
            validaPrimeiroProcessoApontamentoOF(ordemDeFabricacao, recurso)
        }
    }

    private void validaPrimeiroProcessoApontamento(SerialFabricacao serialValidado, Recurso recurso) {
        OrdemDeFabricacao ordemDeFabricacao = serialValidado.ordemDeFabricacao
        if (ordemDeFabricacao.status == StatusOrdemFabricacao.EM_SEPARACAO) {
            throw new ApontamentoException("apontamento.ordemEmSeparacao.message")
        }

        LinhaDeProducao linha = ordemDeFabricacao.linhaDeProducao
        boolean hasLinha = linha != null

        List<LinhaDeProducao> linhasDoRecurso = getLinhasDeProducaoDoRecurso(recurso, ordemDeFabricacao.grupoLinhaProducao)
        List<String> gruposPrimeirosProcessos = linhasDoRecurso.collect { it.primeiroProcesso?.grupoRecurso?.nome }

        if (gruposPrimeirosProcessos.isEmpty()) {
            throw new ApontamentoException('apontamento.grupoNaoEhPrimeiroProcesso.message', null, ApontamentoException.NAO_APONTADO_PRIMEIRO)
        } else if (gruposPrimeirosProcessos.size() > 1) {
            throw new ApontamentoException('apontamento.recursoEmMaisDeUmPrimeiroProcesso.message', gruposPrimeirosProcessos.join(", "))
        }

        Integer totalRegistros = linhasDoRecurso.size()

        boolean recursoPertenceALinha = linhasDoRecurso.contains(linha)

        if (totalRegistros == 0 || (hasLinha && !recursoPertenceALinha)) {
            throw new ApontamentoException("apontamento.grupoInvalido${hasLinha ? 'Linha' : 'Grupo'}.message", hasLinha ? linha.nome : ordemDeFabricacao.grupoLinhaProducao.nome)
        }

        if((linha && !linha.ativo) || !(recurso.getLinhaDeProducao(ordemDeFabricacao.grupoLinhaProducao)?.ativo)) {
            throw new ApontamentoException('apontamento.linhaInativa.message')
        }
    }

    private void validaPrimeiroProcessoApontamentoOF(OrdemDeFabricacao ordemDeFabricacao, Recurso recurso) {
        LinhaDeProducao linha = ordemDeFabricacao.linhaDeProducao
        boolean hasLinha = linha != null

        List<LinhaDeProducao> linhasDoRecurso = getLinhasDeProducaoDoRecurso(recurso, ordemDeFabricacao.grupoLinhaProducao)
        List<String> gruposPrimeirosProcessos = linhasDoRecurso.collect { it.primeiroProcesso?.grupoRecurso?.nome }

        if (gruposPrimeirosProcessos.isEmpty()) {
            throw new ApontamentoException('apontamento.grupoNaoEhPrimeiroProcesso.message', null, ApontamentoException.NAO_APONTADO_PRIMEIRO)
        } else if (gruposPrimeirosProcessos.size() > 1) {
            throw new ApontamentoException('apontamento.recursoEmMaisDeUmPrimeiroProcesso.message', gruposPrimeirosProcessos.join(", "))
        }

        Integer totalRegistros = linhasDoRecurso.size()

        boolean recursoPertenceALinha = linhasDoRecurso.contains(linha)

        if (totalRegistros == 0 || (hasLinha && !recursoPertenceALinha)) {
            throw new ApontamentoException("apontamento.grupoInvalido${hasLinha ? 'Linha' : 'Grupo'}.message", hasLinha ? linha.nome : ordemDeFabricacao.grupoLinhaProducao.nome)
        }

        if((linha && !linha.ativo) || !(recurso.getLinhaDeProducao(ordemDeFabricacao.grupoLinhaProducao)?.ativo)) {
            throw new ApontamentoException('apontamento.linhaInativa.message')
        }
    }

    private void validaApontamentoExistente(SerialFabricacao serialValidado, Apontamento apontamento, Long recursoId) {
        if (serialValidado.isPendenteApoio()) {
            throw new ApontamentoException("apontamento.serialPendenteApoio.message")
        } else if (serialValidado.isSucateado()) {
            throw new ApontamentoException("apontamento.serialSucateado.message")
        } else if (serialValidado.isApontamentoFinalizado()) {
            throw new ApontamentoException("apontamento.serialFinalizado.message", null, ApontamentoException.JA_APONTADO_ULTIMO)
        }

        ProcessoLinhaDeProducao processoApontamentoAtual = apontamento.processoAtual

        if(!processoApontamentoAtual) {
            println "Processo Invalido ${serialValidado?.codigo} ${apontamento?.id}"
            throw new ApontamentoException("apontamento.processoApontamentoInvalido.message")
        }

        Integer totalRegistros = ProcessoLinhaDeProducao.createCriteria().get {
            projections {
                count('id')
            }

            eq('id', processoApontamentoAtual.id)

            grupoRecurso {
                recursos { eq('id', recursoId) }
            }
        }

        if (totalRegistros == 0) {
            throw new ApontamentoException("apontamento.processoInvalido.message", processoApontamentoAtual.grupoRecurso.nome)
        }
    }

    ApontamentoOrdemDeFabricacao salvarApontamentoOF(OrdemDeFabricacao ordemDeFabricacao,
                                                     Recurso recurso,
                                                     List dadosRastreaveis,
                                                     List defeitos) {
        if(!ordemDeFabricacao) {
            throw new ApontamentoException("apontamento.opInvalida.message")
        }

        if(ApontamentoOrdemDeFabricacao.findByOrdemDeFabricacao(ordemDeFabricacao)) {
            throw new ApontamentoException("apontamento.ordemDeProducao.apontamentoExistente.message")
        }

        ApontamentoOrdemDeFabricacao apontamentoOF = new ApontamentoOrdemDeFabricacao(ordemDeFabricacao: ordemDeFabricacao, recurso: recurso)

        if(dadosRastreaveis.any { !it.valor }) {
            throw new ApontamentoException("apontamento.camposRastreaveisFaltando.message")
        }

        dadosRastreaveis.each {
            apontamentoOF.addToDadosRastreaveis(new DadoRastreavelApontamentoOF(nome: it.nome, valor: it.valor))
        }

        defeitos.each {
            apontamentoOF.addToDefeitos(new DefeitoApontamentoOF(quantidade: it.quantidade, defeito: Defeito.get(it.defeito)))
        }

        apontamentoOF.save(flush: true)

        List<SerialFabricacao> seriais = ordemDeFabricacao.seriais.flatten().toList()
        criarLotesOF(ordemDeFabricacao, seriais)

        finalizarSeriais(seriais)
        finalizarOrdemFabricacao(ordemDeFabricacao)

        return apontamentoOF
    }

    void criarLotesOF(OrdemDeFabricacao ordemDeFabricacao, List<SerialFabricacao> seriais) {
        GrupoLinhaDeProducao grupoLinha = ordemDeFabricacao.grupoLinhaProducao
        ProdutoGrupoLinhaDeProducao produto =  grupoLinha.produtos.find {
            it.roteiro == ordemDeFabricacao.roteiro && it.codigo == ordemDeFabricacao.codigoProduto
        }

        if (!produto && !ordemDeFabricacao.roteiro) {
            produto = grupoLinha.produtos.find {
                it.roteiro == "00" && it.codigo == ordemDeFabricacao.codigoProduto
            }
        } else if (!produto && ordemDeFabricacao.roteiro == "00") {
            produto = grupoLinha.produtos.find {
                it.roteiro == null && it.codigo == ordemDeFabricacao.codigoProduto
            }
        }

        if (!produto) {
            throw new LoteException("lote.protudoGrupoLinhaInvalido.message", ordemDeFabricacao.codigoProduto, ordemDeFabricacao.roteiro ?: "00", grupoLinha.nome)
        }

        if(produto.quantidadePorPallet) {
            Integer quantidadeTotal = seriais.size()
            Integer quantidadePorLote = produto.quantidadePorPallet
            int quantidadeLotes = Math.ceil(quantidadeTotal/quantidadePorLote)

            quantidadeLotes.times {idxLote ->
                int inicioLinha = quantidadePorLote * idxLote
                int fimLinha = Math.min(inicioLinha + quantidadePorLote, seriais.size())
                List<SerialFabricacao> seriaisLote = seriais.subList(inicioLinha, fimLinha)
                Lote lote = criaLoteOF(ordemDeFabricacao, seriaisLote, produto, grupoLinha)
                adicionaSerial(lote, seriaisLote)
            }
        } else {
            Lote lote = criaLoteOF(ordemDeFabricacao, seriais, produto, grupoLinha)
            adicionaSerial(lote, seriais)
        }
    }

    void finalizarSeriais(List<SerialFabricacao> seriais) {
        String sql = """update gp40.serial_fabricacao set status_serial='${StatusSerialFabricacao.APONTAMENTO_FINALIZADO}' where id in(${seriais*.id.join(', ')})"""

        sessionFactory.currentSession.createSQLQuery(sql).executeUpdate()
    }

    void finalizarOFs(List<OrdemDeFabricacao> ordens) {
        String sql = """update gp40.ordem_de_fabricacao set ordem=-1, status='${StatusOrdemFabricacao.FINALIZADA}' where id in(${ordens*.id.join(', ')})"""

        sessionFactory.currentSession.createSQLQuery(sql).executeUpdate()
    }

    void adicionaSerial(Lote lote, List<SerialFabricacao> seriais ) {
        String sql = """insert into gp40.lote_serial(lote_id, serial_id) (select ${lote.id}, id from gp40.serial_fabricacao
                where id in(${seriais*.id.join(', ')}))"""

        sessionFactory.currentSession.createSQLQuery(sql).executeUpdate()
    }

    Lote criaLoteOF(OrdemDeFabricacao ordemDeFabricacao,
                    List<SerialFabricacao> seriais,
                    ProdutoGrupoLinhaDeProducao produto,
                    GrupoLinhaDeProducao grupoLinha) {
        String descricaoProduto = oracleService.getDescricaoDoProduto(produto.codigo, ordemDeFabricacao.getOrganizacaoDoFornecedor())
        Date data = new Date()
        String ano  = new SimpleDateFormat("YY").format(data)
        String semana = new SimpleDateFormat("ww").format(data)
        Lote lote = new Lote()
        lote.numeroLote = loteService.gerarNumeroLote(semana, ano.toInteger())
        lote.codigoProduto = ordemDeFabricacao.codigoProduto
        lote.apontamentoOF = ordemDeFabricacao
        lote.quantidade = seriais.size()
        lote.grupoLinhaDeProducao = grupoLinha
        lote.ano = ano.toInteger()
        lote.semana = semana
        lote.quantidadeMaxima = produto.quantidadePorPallet
        lote.descricaoProduto = descricaoProduto

        lote.statusLote = StatusLote.FECHADO

        crudService.salvar(lote)

        return lote
    }

    Apontamento salvarApontamento(SerialFabricacao serialFabricacao,
                                  Recurso recurso,
                                  Defeito defeito,
                                  Organizacao organizacao,
                                  boolean isSucateamento,
                                  Boolean enviarApoio,
                                  User usuario,
                                  List dadosRastreaveis) {
        if (!serialFabricacao) {
            throw new ApontamentoException('apontamento.serialInvalido.message')
        }

        OrdemDeFabricacao ordemDeFabricacao = serialFabricacao.ordemDeFabricacao
        boolean isNovoApontamento
//        ordemDeFabricacao.lock()
//        ordemDeFabricacao.grupoLinhaProducao.lock()
        LinhaDeProducao linhaDeProducao
        Apontamento apontamento = Apontamento.findBySerial(serialFabricacao)
        if (!apontamento) {
            isNovoApontamento = true
            linhaDeProducao = ordemDeFabricacao.linhaDeProducao

            if (!linhaDeProducao) { //Linha não foi escolhida no sequenciamento
                linhaDeProducao = recurso.getLinhaDeProducao(ordemDeFabricacao.grupoLinhaProducao)
            }

            apontamento = new Apontamento()
            apontamento.serial = serialFabricacao
            apontamento.linhaDeProducao = linhaDeProducao
            apontamento.processoAtual = linhaDeProducao.getPrimeiroProcesso()

            serialFabricacao.statusSerial = StatusSerialFabricacao.APONTAMENTO_INICIADO
            serialFabricacao.dataInicioApontamento = new Date()
        } else {
            linhaDeProducao = apontamento.linhaDeProducao
            validaApontamentoExistente(serialFabricacao, apontamento, recurso.id)
        }

        ProcessoLinhaDeProducao processoAtual = apontamento.processoAtual

        Integer ordemProcessoAtual = processoAtual.ordem
        Integer ordemProcessoFinal = linhaDeProducao.processos.size() - 1

        HistoricoApontamento historicoApontamento = new HistoricoApontamento()
        historicoApontamento.data = new Date()
        historicoApontamento.recurso = recurso
        historicoApontamento.operador = userService.getUsuarioLogado() ?: usuario
        historicoApontamento.grupoRecurso = processoAtual.getGrupoRecurso()

        if(dadosRastreaveis.any { !it.valor }) {
            throw new ApontamentoException("apontamento.camposRastreaveisFaltando.message")
        }

        dadosRastreaveis.each {
            historicoApontamento.addToDadosRastreaveis(new DadoRastreavelApontamento(nome: it.nome, valor: it.valor))
        }

        if (enviarApoio){
            processoAtual = null
            serialFabricacao.statusSerial = StatusSerialFabricacao.PENDENTE_APOIO
            serialFabricacao.dataEnvioApoio = new Date()
        } else if (defeito) {
            if (!defeito.isAtivo){
                throw new ApontamentoException("apontamento.defeitoInativo.message")
            }
            historicoApontamento.defeito = defeito

            Integer quantidadeReprocessos = apontamento.id ? HistoricoApontamento.countByApontamentoAndRecurso(apontamento, recurso) : 0
            Integer quantidadeMaximaDeReprocessos = apontamento.processoAtual.numeroMaximoDeApontamentos

            if (quantidadeMaximaDeReprocessos == null || quantidadeReprocessos < quantidadeMaximaDeReprocessos) {
                processoAtual = processoAtual.getProcessoRetorno(defeito)
                if(processoAtual == null) {
                    throw new ApontamentoException("apontamento.semCaminhoReprocesso.message")
                }
            } else {
                processoAtual = null
                serialFabricacao.statusSerial = StatusSerialFabricacao.PENDENTE_APOIO
                serialFabricacao.dataEnvioApoio = new Date()
            }
        } else {
            if(ordemProcessoAtual < ordemProcessoFinal){
                processoAtual = processoAtual.getProximoProcesso()
            } else {
                processoAtual = null

//                crudService.salvar(ordemDeFabricacao)
                loteService.adicionaSerialAoLote(ordemDeFabricacao.grupoLinhaProducao, ordemDeFabricacao, serialFabricacao, apontamento.linhaDeProducao, historicoApontamento.getGrupoRecurso(), recurso, organizacao)
                serialFabricacao.statusSerial = StatusSerialFabricacao.APONTAMENTO_FINALIZADO
                serialFabricacao.dataUltimoApontamento = new Date()
            }
        }

        serialFabricacao.dataApontamentoMaisRecente = new Date()

        apontamento.processoAtual = processoAtual
        apontamento.addToHistorico(historicoApontamento)

        crudService.salvar(apontamento)
        crudService.salvar(serialFabricacao)

        if(!isSucateamento && historicoApontamento && historicoApontamento.grupoRecurso.operacao) {
            historicoApontamento.pendenteTransacao = true
            historicoApontamento.save(flush: true)
        }
        criaTempoApontamentoProduto(ordemDeFabricacao.codigoProduto, historicoApontamento.grupoRecurso)

        if(isNovoApontamento) {
            String sql = "UPDATE ORDEM_DE_FABRICACAO SET STATUS='${StatusOrdemFabricacao.EM_ANDAMENTO.name()}' where id=${ordemDeFabricacao.id}"
            sessionFactory.currentSession.createSQLQuery(sql).executeUpdate()
        }

        return apontamento
    }

    List<ApontamentoPendenteDTO> buscarApontamentosPendentes(Fornecedor fornecedor, FiltroApontamentosPendentes filtro){
        def SQL = """SELECT
                                HA.ID AS historicoApontamentoId,
                                TO_CHAR(HA.DATA, 'DD/MM/YYYY HH24:MI') AS data,
                                SF.CODIGO||'-'||SF.ANO AS serial,
                                LDP.NOME AS linhaDeProducao,
                                R.NOME AS recurso,
                                GR.NOME AS grupoRecurso,
                                U.FULLNAME AS operador,
                                HA.ERRO_TRANSACAO AS erroTransacao
                            FROM APONTAMENTO
                            INNER JOIN SERIAL_FABRICACAO SF on SF.ID = APONTAMENTO.SERIAL_ID
                            INNER JOIN HISTORICO_APONTAMENTO HA on APONTAMENTO.ID = HA.APONTAMENTO_ID
                            INNER JOIN SERIAL_FABRICACAO SF ON SF.ID = APONTAMENTO.SERIAL_ID
                            INNER JOIN LINHA_DE_PRODUCAO LDP on APONTAMENTO.LINHA_DE_PRODUCAO_ID = LDP.ID
                            INNER JOIN RECURSO R on HA.RECURSO_ID = R.ID
                            INNER JOIN GRUPO_RECURSO GR on HA.GRUPO_RECURSO_ID = GR.ID
                            INNER JOIN USERS U on HA.OPERADOR_ID = U.ID 
                            ${filtro.gerarWhere()}
                            AND LDP.FORNECEDOR_ID = ${fornecedor.id}
                            AND ( HA.ID IS NULL OR HA.PENDENTE_TRANSACAO = 1)
                            ${filtro.gerarOrderBy()}
                            """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(SQL)

        query.addScalar("historicoApontamentoId", new LongType())
        query.addScalar("data", new StringType())
        query.addScalar("serial", new StringType())
        query.addScalar("linhaDeProducao", new StringType())
        query.addScalar("recurso", new StringType())
        query.addScalar("grupoRecurso", new StringType())
        query.addScalar("operador", new StringType())
        query.addScalar("erroTransacao", new StringType())
        query.setResultTransformer(Transformers.aliasToBean(ApontamentoPendenteDTO.class))

        List<ApontamentoPendenteDTO> apontamentosPendentes = query.list()

        return  apontamentosPendentes
    }

    void criaTempoApontamentoProduto(String codigoProduto, GrupoRecurso grupoRecurso){
        TempoApontamentoProduto tempo = TempoApontamentoProduto.findByCodigoProdutoAndGrupoRecurso(codigoProduto, grupoRecurso)
        if (!tempo){
            tempo = new TempoApontamentoProduto()
            tempo.codigoProduto = codigoProduto
            tempo.grupoRecurso = grupoRecurso
            tempo.tempoApontamento = grupoRecurso.tempoPadrao
            tempo.vigenciaDe = new Date()
            crudService.salvar(tempo)
        }
    }

    List<ImpressaoApontamentoLote> getImpressoes(SerialFabricacao serialFabricacao, Long recursoId) {
        OrdemDeFabricacao ordemDeFabricacao = serialFabricacao.ordemDeFabricacao
        String codigoProduto = ordemDeFabricacao.codigoProduto
        Lote lote = serialFabricacao.getLote()

        Set<ProdutoEtiqueta> etiquetas = etiquetaService.getEtiquetasPorProdutoAndRecursos(codigoProduto, [recursoId])
        List<ImpressaoApontamentoLote> retornoImpressoes = []
        etiquetas.each { produtoEtiqueta ->
            ImpressaoApontamentoLote impressoes = ImpressaoApontamentoLote.findByLoteAndProdutoEtiqueta(lote, produtoEtiqueta)
            if (impressoes) retornoImpressoes.add(impressoes)
        }

        return retornoImpressoes
    }

    List getEtiquetas(SerialFabricacao serialFabricacao, Impressora impressora, List<ImpressaoApontamentoLote> impressoes) {
        List retornoEtiquetas = []

        boolean isLoteFechado = serialFabricacao.isLoteFechado()

        if(isLoteFechado) {
            impressoes = ImpressaoApontamentoLote.findAllByLote(serialFabricacao.getLote())
        }

        impressoes.each { impressao ->
            ImpressaoApontamentoCaixa caixa = serialFabricacao.getCaixaImpressao()
            boolean necessarioImprimirEtiqueta = caixa.isFechado() || isLoteFechado
            if (necessarioImprimirEtiqueta) {
                retornoEtiquetas.addAll(impressoraService.getEtiquetaSerialAposApontamento(impressora, caixa, null))
            }
        }

        return retornoEtiquetas
    }

    List getEtiquetas(Impressora impressora, List<ImpressaoApontamentoCaixa> caixas, Integer copias) {
        List retornoEtiquetas = []

        caixas.each { caixa ->
            retornoEtiquetas.addAll(impressoraService.getEtiquetaSerialAposApontamento(impressora, caixa, copias))
        }

        return retornoEtiquetas
    }

    boolean existemEtiquetasParaORecurso(Long recursoId) {
        return ProdutoEtiqueta.createCriteria().get {
            projections {
                count "grupos"
            }
            grupos { recursos { eq('id', recursoId) } }
        }
    }

    SerialFabricacao getSerialFabricacao(String serial) {
        if (!serial.contains("-")) return null
        String codigoSerial = serial.split('-')[0]
        String ano = serial.split('-')[1]

        SerialFabricacao serialFabricacao = SerialFabricacao.createCriteria().get {
            eq 'codigo', codigoSerial?.toUpperCase()
            eq 'ano', ano
        }

        return serialFabricacao
    }


    List<RecursoDTO> getRecursosUtilizadosEmAlgumProcessoLP(Fornecedor fornecedor) {
        List recursosList = ProcessoLinhaDeProducao.createCriteria().list {
            linhaDeProducao {
                eq('fornecedor', fornecedor)
            }

            grupoRecurso {
                eq('fornecedor', fornecedor)
                recursos {
                    eq('isAtivo', true)
                    projections {
                        distinct(['id', 'nome'])
                        order("nome", "asc")
                    }
                }
            }
        }


        return recursosList.collect { new RecursoDTO(id: it[0], nome: it[1], permiteApontamentoOF: Recurso.get(it[0])?.permiteApontamentoOF()) } as ArrayList<RecursoDTO>
    }

    void criaTransacaoDeAjusteDeComponenteNaOP(String codigoOP,
                                               Organizacao organizacao,
                                               String codigoOperacao,
                                               HistoricoApontamento ultimoHistorico) {
        TransacaoAjusteMaterialDTO transacao = new TransacaoAjusteMaterialDTO()
        transacao.sourceLineId = ultimoHistorico.id
        transacao.sourceHeaderId = ultimoHistorico.id
        transacao.codigoOrdemDeProducao = codigoOP
        transacao.organizationId = organizacao.organizationID.toLong()
        transacao.codigoOperacao = codigoOperacao
        transacao.language = organizacao.getIdioma()

        oracleService.criaTransacaoDeAjusteDeComponenteNaOP(transacao)
    }

    GrupoRecursoParadaDTO getGrupoRecursoParadas(Long idRecurso) {
        String sql = """SELECT grupo_recurso_id AS idGrupoRecurso,
                               data             AS data
                        FROM  (SELECT *
                               FROM   (SELECT grupo_recurso_id,
                                              Max(data) data
                                       FROM   gp40.historico_apontamento
                                       WHERE  recurso_id = ${idRecurso}
                                       GROUP  BY grupo_recurso_id)
                               ORDER  BY data DESC)
                        WHERE  rownum = 1 """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("idGrupoRecurso", new LongType())
        query.addScalar("data", new TimestampType())
        query.setResultTransformer(Transformers.aliasToBean(GrupoRecursoParadaDTO.class))

        return query.uniqueResult() as GrupoRecursoParadaDTO
    }

    Parada getUltimaParadaDoRecurso(Long recursoId) {
        String sql = """SELECT id
                        FROM   gp40.paradas
                        WHERE  recurso_id = ${recursoId}
                               AND fim = (SELECT Max(fim)
                                          FROM   gp40.paradas
                                          WHERE  recurso_id = ${recursoId})
                               AND rownum = 1 """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)

        return Parada.get(query.uniqueResult() as Long)
    }

    GrupoRecurso getGrupoRecursoDoSerial(SerialFabricacao serial, Recurso recurso){
        OrdemDeFabricacao ordemDeFabricacao = serial.ordemDeFabricacao
        Apontamento apontamento = Apontamento.findBySerial(serial)
        if (!apontamento){
            LinhaDeProducao linhaDeProducao = ordemDeFabricacao.linhaDeProducao

            if (!linhaDeProducao) { //Linha não foi escolhida no sequenciamento
                linhaDeProducao = recurso.getLinhaDeProducao(ordemDeFabricacao.grupoLinhaProducao)
            }
            return linhaDeProducao?.primeiroProcesso?.grupoRecurso
        }
        ProcessoLinhaDeProducao processoAtual = apontamento?.processoAtual
        return processoAtual?.grupoRecurso
    }

    GrupoRecurso getGrupoRecursoDaOF(OrdemDeFabricacao ordemDeFabricacao, Recurso recurso){
        LinhaDeProducao linhaDeProducao = ordemDeFabricacao?.linhaDeProducao

        if (!linhaDeProducao && ordemDeFabricacao) { //Linha não foi escolhida no sequenciamento
            linhaDeProducao = recurso.getLinhaDeProducao(ordemDeFabricacao.grupoLinhaProducao)
        }
        return linhaDeProducao?.primeiroProcesso?.grupoRecurso
    }

    ApontamentoResponseDTO inserirDadosSerialNaResponse(String codigoSerial,
                                                        Recurso recurso,
                                                        Organizacao organizacao,
                                                        boolean incluirDadosBasicos,
                                                        boolean incluirDadosModal){

        ApontamentoResponseDTO apontamentoResponseDTO = getApontamentoResponse(codigoSerial, organizacao)
        SerialFabricacao serial = getSerialFabricacao(codigoSerial)
        GrupoRecurso grupoRecurso = apontamentoResponseDTO && incluirDadosModal ? getGrupoRecursoDoSerial(serial, recurso) : null

        inserirDadosApontamentoNaResponse(apontamentoResponseDTO, recurso, incluirDadosBasicos, incluirDadosModal, grupoRecurso, organizacao)

        return apontamentoResponseDTO ?: new ApontamentoResponseDTO()
    }

    private void inserirDadosApontamentoNaResponse(ApontamentoResponseDTO apontamentoResponseDTO, Recurso recurso, boolean incluirDadosBasicos, boolean incluirDadosModal, GrupoRecurso grupoRecurso, Organizacao organizacao) {
        if (apontamentoResponseDTO) {
            apontamentoResponseDTO.ultimoApontamento = recurso.getUltimoApontamento().getTime()
            if (!(incluirDadosBasicos || incluirDadosModal)) {
                apontamentoResponseDTO.modelo = null
                apontamentoResponseDTO.comprimento = null
            }

            if (!incluirDadosBasicos) {
                apontamentoResponseDTO.ordemFabricacao = null
                apontamentoResponseDTO.lote = null
                apontamentoResponseDTO.codigoProduto = null
                apontamentoResponseDTO.caixa = null
            }

            if (incluirDadosModal) {
                List<RegraExibicaoMP> regras = grupoRecurso?.regras as List
                if (regras) {
                    Idioma linguagem = Idioma.getIdiomaByOrganizacao(organizacao)
                    List<ComponenteWIP> materiasPrimas = oracleService.getComponentesRoteiroWIP(apontamentoResponseDTO.ordemProducao,
                            organizacao.organizationID as Long,
                            linguagem.descricao as String,
                            false)

                    apontamentoResponseDTO.materiasPrimas = aplicarRegras(materiasPrimas, regras)
                }
                List<String> camposRastreaveis = grupoRecurso?.camposRastreaveis as List<String>
                apontamentoResponseDTO.camposRastreaveis = camposRastreaveis ? camposRastreaveis : null;
            } else {
                apontamentoResponseDTO.dataPrevisaoFinalizacao = null
            }
        }
    }

    ApontamentoResponseDTO inserirDadosOFNaResponse(String codigoOF,
                                                    Recurso recurso,
                                                    Organizacao organizacao,
                                                    boolean incluirDadosBasicos,
                                                    boolean incluirDadosModal){
        OrdemDeFabricacao ordemDeFabricacao = OrdemDeFabricacao.getByCodigo(codigoOF, recurso.fornecedor)
        ApontamentoResponseDTO apontamentoResponseDTO = getApontamentoResponse(ordemDeFabricacao)
        GrupoRecurso grupoRecurso = apontamentoResponseDTO && incluirDadosModal ? getGrupoRecursoDaOF(ordemDeFabricacao, recurso) : null

        inserirDadosApontamentoNaResponse(apontamentoResponseDTO, recurso, incluirDadosBasicos, incluirDadosModal, grupoRecurso, organizacao)

        return apontamentoResponseDTO ?: new ApontamentoResponseDTO()
    }

    List<ComponenteWIP> aplicarRegras(List<ComponenteWIP> materiasPrimas, List<RegraExibicaoMP> regras){
        List<RegraExibicaoMP> incluir = regras.findAll{it.tipo == TipoRegraExibicaoMP.INCLUIR}
        List<RegraExibicaoMP> naoIncluir = regras.findAll{it.tipo == TipoRegraExibicaoMP.NAO_INCLUIR}

        return materiasPrimas.findAll {mp ->
            incluir.any {regra -> regra.verificar(mp.descricaoProduto)} &&
            naoIncluir.every {regra -> regra.verificar(mp.descricaoProduto)}
        }
    }


    void atualizarQuantidadesOrdensFabricacao(){
        String sql = """
                SELECT odf.id
                FROM ORDEM_DE_FABRICACAO odf
                WHERE (SELECT COUNT(*) FROM SERIAL_FABRICACAO s WHERE s.ORDEM_DE_FABRICACAO_ID = odf.id AND s.STATUS_SERIAL = '${StatusSerialFabricacao.APONTAMENTO_FINALIZADO.name()}') >= odf.QUANTIDADE_TOTAL
                    AND odf.STATUS = 'EM_ANDAMENTO'
        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        List<Long> ids = query.list()
        List<OrdemDeFabricacao> ofs = OrdemDeFabricacao.getAll(ids)
        ofs.each {
            finalizarOrdemFabricacao(it)
        }
    }


    void finalizarOrdemFabricacao(OrdemDeFabricacao ordemDeFabricacao){
        List<OrdemDeFabricacao> ordensAfetadas = sequenciamentoService.getOrdensAfetadasAoAlterarParaPosicaoFinal(ordemDeFabricacao)
        ordensAfetadas.each {
            it.ordem = it.ordem - 1
            it.save(flush: true, failOnError: true)
        }

        ordemDeFabricacao.status = StatusOrdemFabricacao.FINALIZADA
        ordemDeFabricacao.ordem = -1

        ordemDeFabricacao.save(flush: true, failOnError: true)
    }

    ApontamentoResponseDTO getApontamentoResponse(String codigoSerial, Organizacao organizacao){
        String sql = """
            SELECT odf.numero || '-' || odf.ano as ordemFabricacao,
                   f.prefixo_producao || '-' || odp.numero as ordemProducao,
                   (SELECT case when lo.id is not null then lo.numero_lote || lo.semana || lo.ano else '' end
                                    FROM lote lo                                    
                                 LEFT JOIN lote_serial ls
                                      ON ls.lote_id = lo.id 
                                    WHERE ls.serial_id = s.id AND rownum=1 ) as lote,
                   odf.CODIGO_PRODUTO as codigoProduto,
                   (SELECT     cx.numero_caixa
                      FROM       impr_apont_cx cx
                      INNER JOIN imp_cx_serial cs
                      ON         cs.serial_id=s.id
                      AND        cs.caixa_id=cx.id
                      AND        rownum=1) as caixa,
                   to_char(odp.data_previsao_finalizacao, 'DD/MM/YYYY') as dataPrevisaoFinalizacao,
                   client.valor as modelo,
                   comp.valor as comprimento
            FROM SERIAL_FABRICACAO s
                JOIN ORDEM_DE_FABRICACAO odf
                    ON s.ORDEM_DE_FABRICACAO_ID = odf.ID
                join ordem_de_producao odp
                    on odp.id = odf.ordem_de_producao_id
                join fornecedor f 
                    on f.id = odp.fornecedor_id
                LEFT JOIN ITEM_CATALOGO comp
                    ON comp.CODIGO_PRODUTO = odf.codigo_produto AND comp.NOME = '${ItensCatalogoFixos.COMPRIMENTO}' 
                           AND comp.organization_id = ${organizacao.organizationID}
                LEFT JOIN ITEM_CATALOGO client
                    ON client.CODIGO_PRODUTO = odf.codigo_produto AND client.NOME = '${ItensCatalogoFixos.MODELO}' 
                           AND client.organization_id = ${organizacao.organizationID}
            WHERE s.CODIGO||'-'||s.ano = '${codigoSerial?.toUpperCase()}'
        """
        def query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("ordemFabricacao", new StringType())
        query.addScalar("ordemProducao", new StringType())
        query.addScalar("lote", new StringType())
        query.addScalar("codigoProduto", new StringType())
        query.addScalar("caixa", new StringType())
        query.addScalar("dataPrevisaoFinalizacao", new StringType())
        query.addScalar("modelo", new StringType())
        query.addScalar("comprimento", new StringType())

        query.setResultTransformer(Transformers.aliasToBean(ApontamentoResponseDTO.class))
        return query.uniqueResult()
    }

    ApontamentoResponseDTO getApontamentoResponse(OrdemDeFabricacao ordemDeFabricacao){
        ApontamentoResponseDTO apontamentoResponseDTO = new ApontamentoResponseDTO()
        apontamentoResponseDTO.codigoProduto = ordemDeFabricacao?.codigoProduto
        apontamentoResponseDTO.ordemFabricacao = ordemDeFabricacao?.getCodigoOrdemDeFabricacao()
        apontamentoResponseDTO.modelo = ordemDeFabricacao?.getModelo()
        apontamentoResponseDTO.comprimento = ordemDeFabricacao?.getComprimento()
        apontamentoResponseDTO.dataPrevisaoFinalizacao = ordemDeFabricacao?.ordemDeProducao?.getDataPrevisaoFinalizacaoFormatada()

        return apontamentoResponseDTO
    }

    List<LinhaDeProducao> getLinhasDeProducaoDoRecurso(Recurso recurso, GrupoLinhaDeProducao grupoLinhaDeProducao) {
        String sql = """SELECT lp.id
                        FROM   gp40.linha_de_producao lp
                               INNER JOIN gp40.linha_grupo lg
                                       ON lg.linha_id = lp.id
                               INNER JOIN gp40.grupo_linha_producao glp
                                       ON glp.id = lg.grupo_id
                               INNER JOIN gp40.processo_lp plp
                                       ON plp.linha_de_producao_id = lp.id
                               INNER JOIN gp40.grupo_recurso gr
                                       ON gr.id = plp.grupo_recurso_id
                               INNER JOIN gp40.recurso_grupo rg
                                       ON rg.grupo_id = gr.id
                               INNER JOIN gp40.recurso r
                                       ON r.id = rg.recurso_id
                        WHERE  plp.ordem = 0
                               AND glp.id = ${grupoLinhaDeProducao.id}
                               AND r.id = ${recurso?.id}"""

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)

        return LinhaDeProducao.getAll(query.list() as ArrayList<Long>)
    }

    LinhaDeProducao getLinhaDeProducaoDoRecurso(Recurso recurso, GrupoLinhaDeProducao grupoLinhaDeProducao) {
        if(!recurso || !grupoLinhaDeProducao) return null

        List<LinhaDeProducao> linhasDeProducao = getLinhasDeProducaoDoRecurso(recurso, grupoLinhaDeProducao)
        return !linhasDeProducao.isEmpty() ? linhasDeProducao.first() : null
    }

    boolean isRecursoParado(Recurso recurso) {
        String sql = """
            SEL
"""
    }

    List<TurnoDTO> pegarTurnosPorData(Fornecedor fornecedor, Date data){
        String horas = new SimpleDateFormat("HH:mm").format(data)
        String dia = new SimpleDateFormat("dd/MM/yyyy").format(data)
        String proximoDia
        use(TimeCategory) {
            proximoDia = new SimpleDateFormat("dd/MM/yyyy").format(data + 1.day)
        }

        String sqlHorarioInicial = """
                    lpad(EXTRACT( hour from TO_DATE(TO_CHAR(td.HORARIO_FINAL, 'HH24:MI:SS'), 'HH24:MI:SS') - td.DURACAO), 2, '0')||':'||
                    lpad(EXTRACT( minute from TO_DATE(TO_CHAR(td.HORARIO_FINAL, 'HH24:MI:SS'), 'HH24:MI:SS') - td.DURACAO), 2, '0')||':'||
                    lpad(EXTRACT( second from TO_DATE(TO_CHAR(td.HORARIO_FINAL, 'HH24:MI:SS'), 'HH24:MI:SS') - td.DURACAO), 2, '0')
                """

        String sqlHorarioInicialFull = """
                    to_char(TO_DATE(case when extract(hour from td.horario_final-td.duracao) < 0 and to_date('${horas}', 'HH24:MI') > (to_date(${sqlHorarioInicial}, 'HH24:MI:SS')) then '${proximoDia}' else '${dia}' end || ' ' || TO_CHAR(td.HORARIO_FINAL, 'HH24:MI:SS'), 'DD/MM/YYYY HH24:MI:SS') - extract(hour FROM td.duracao)/24 - extract(minute FROM td.duracao)/24/60, 'DD/MM/YYYY HH24:MI:SS')
                """

        String SQL = """
            SELECT DISTINCT
                t.nome,
                ${sqlHorarioInicial} as horarioInicial,
                TO_CHAR(td.HORARIO_FINAL, 'HH24:MI:SS') as horarioFinal,
                case when extract(hour from td.horario_final-td.duracao) < 0 and to_date('${horas}', 'HH24:MI') > (to_date(${sqlHorarioInicial}, 'HH24:MI:SS')) then '${proximoDia}' else '${dia}' end || ' ' || TO_CHAR(td.HORARIO_FINAL, 'HH24:MI:SS') as horarioFinalFull,
                ${sqlHorarioInicialFull} as horarioInicialFull,
                TO_CHAR(td.DURACAO, 'HH24:MI:SS') as duracao
            FROM
                (SELECT td.* FROM gp40.TURNO_DURACAO td
                     INNER JOIN gp40.turno_duracao_dias tdd ON tdd.turno_duracao_id=td.id
                 WHERE tdd.dia_da_semana=(
                     CASE to_char(TO_DATE(case when extract(hour from td.horario_final-td.duracao) < 0 and to_date('${horas}', 'HH24:MI') > (to_date(${sqlHorarioInicial}, 'HH24:MI:SS')) then '${proximoDia}' else '${dia}' end, 'DD/MM/YYYY'), 'D')
                         WHEN '1' THEN 'DOMINGO'
                         WHEN '2' THEN 'SEGUNDA'
                         WHEN '3' THEN 'TERCA'
                         WHEN '4' THEN 'QUARTA'
                         WHEN '5' THEN 'QUINTA'
                         WHEN '6' THEN 'SEXTA'
                         WHEN '7' THEN 'SABADO' END)
                ) td
                    INNER JOIN gp40.turno_duracao_dias tdd ON tdd.turno_duracao_id=td.id
                    INNER JOIN gp40.TURNO t ON td.TURNO_ID = t.id
            WHERE t.fornecedor_id = '${fornecedor.id}'
            ORDER BY horarioFinal
             """
        println "SQL MODELO ${SQL}"
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(SQL)
        query.addScalar("nome", new StringType())
        query.addScalar("horarioFinal", new StringType())
        query.addScalar("horarioInicial", new StringType())
        query.addScalar("horarioFinalFull", new StringType())
        query.addScalar("horarioInicialFull", new StringType())
        query.addScalar("duracao", new StringType())
        query.setResultTransformer(Transformers.aliasToBean(TurnoDTO.class))
        return query.list()
    }

    void criarNovaParada(MotivoDeParada motivo, Recurso recurso, Date inicio, Date fim ){
        Parada paradaApontamento = new Parada()
        paradaApontamento.setRecurso(recurso)
        paradaApontamento.setInicio(inicio)
        paradaApontamento.setFim(fim)
        paradaApontamento.setMotivo(motivo)

        crudService.salvar(paradaApontamento)
    }

    Boolean turnoEstaNoIntervalo(String turnoHorarioInicial, String turnoHorarioFinal, String turnoDuracao, Date apontamentoDate){
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss")

        Date horaApondamento = sdf.parse(sdf.format(apontamentoDate))
        Date horarioInicial = sdf.parse(turnoHorarioInicial)
        Date horarioFinal = sdf.parse(turnoHorarioFinal)

        use(TimeCategory) {
            horarioInicial = horarioInicial - 59.seconds
        }

        Boolean mesmoDia = horarioFinal > horarioInicial
        boolean validaInicioFimMesmoDia = mesmoDia && horaApondamento > horarioInicial && horaApondamento < horarioFinal //horario esta entre o inicio e fim do turno
        boolean validaInicioFimDiasDiferentes = !mesmoDia && (
                //horario esta entre o inicio do dia e o fim do turno ou entre o inicio do turno e o fim do dia
                (horaApondamento > DateUtils.inicioDoDia(horarioInicial) && horaApondamento < horarioFinal) || (horaApondamento < DateUtils.fimDoDia(horarioInicial) && horaApondamento > horarioInicial)
        )

        validaInicioFimMesmoDia || validaInicioFimDiasDiferentes
    }

    List<TurnoDTO> turnosDiferentesDoApontamento(List<TurnoDTO> turnos, Date apontamentoDate, Boolean pegarAntes, Date limiteAte = null){
        SimpleDateFormat sdfHours = new SimpleDateFormat("HH:mm")
        SimpleDateFormat sdfFull = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss")
        List<TurnoDTO> turnosApos = []

        turnos?.each {
            Date turnoHorarioInicial = sdfHours.parse(it.horarioInicial)
            Date turnoHorarioFinal = sdfHours.parse(it.horarioFinal)
            Date horarioInicialFull = sdfFull.parse(it.horarioInicialFull)
            Date horarioFinalFull = sdfFull.parse(it.horarioFinalFull)
            use(TimeCategory) {
                horarioInicialFull = horarioInicialFull - 59.second
                turnoHorarioInicial = turnoHorarioInicial - 59.second
            }

            Boolean mesmoDia = turnoHorarioInicial < turnoHorarioFinal
            Date horarioApontamento = sdfHours.parse(sdfHours.format(apontamentoDate))
            Boolean validaTurnosAntes = (mesmoDia && turnoHorarioFinal < horarioApontamento && horarioInicialFull > limiteAte) || (!mesmoDia && limiteAte < horarioInicialFull && turnoHorarioFinal < horarioApontamento)
            Boolean validaTurnosDepois = mesmoDia && turnoHorarioInicial > horarioApontamento && horarioFinalFull < limiteAte
            Boolean validacao = pegarAntes ? validaTurnosAntes : validaTurnosDepois
            if (validacao) {
                turnosApos.add(it)
            }
        }

        return turnosApos
    }

    List<TurnoDTO> turnosAntesDoApontamento(List<TurnoDTO> turnos, Date apontamentoDate, Date limite){
        return turnosDiferentesDoApontamento(turnos, apontamentoDate, true, limite)
    }

    List<TurnoDTO> turnosDepoisDoApontamento(List<TurnoDTO> turnos, Date apontamentoDate, Date limite){
        return turnosDiferentesDoApontamento(turnos, apontamentoDate, false, limite)
    }

    void quebrarParadasPorTurnos(Parada parada, Recurso recurso, MotivoDeParada motivo, Date ultimoApontamento, Date apontamentoAtual, Fornecedor fornecedor) {
        SimpleDateFormat sdfFull = new SimpleDateFormat("yyyy-MM-dd HH:mm")
        SimpleDateFormat sdfFullSec = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss")
        SimpleDateFormat sdfHours = new SimpleDateFormat("HH:mm")
        SimpleDateFormat sdfDay = new SimpleDateFormat("yyyy-MM-dd")

        List<TurnoDTO> todosTurnosApontamentoAtual = pegarTurnosPorData(fornecedor, apontamentoAtual)
        List<TurnoDTO> todosTurnosDoUltimoApontamento = pegarTurnosPorData(fornecedor, ultimoApontamento)

        TurnoDTO turnoApontamentoAtual = todosTurnosApontamentoAtual?.find { turnoEstaNoIntervalo(it.horarioInicial, it.horarioFinal, it.duracao, apontamentoAtual) }
        TurnoDTO turnoDoUltimoApontamento = todosTurnosDoUltimoApontamento?.find { turnoEstaNoIntervalo(it.horarioInicial, it.horarioFinal, it.duracao, ultimoApontamento) }

        List<TurnoDTO> turnosAntesDoApontamentoAtual = turnosAntesDoApontamento(todosTurnosApontamentoAtual, apontamentoAtual, ultimoApontamento)
        List<TurnoDTO> turnosDepoisDoUltimoApontamento = turnosDepoisDoApontamento(todosTurnosDoUltimoApontamento, ultimoApontamento, apontamentoAtual)

        if( turnoApontamentoAtual?.nome != turnoDoUltimoApontamento?.nome || sdfFullSec.parse(turnoApontamentoAtual.horarioInicialFull).day != sdfFullSec.parse(turnoDoUltimoApontamento.horarioInicialFull).day) {
            Date fimUltimoApontamento

            if(turnoDoUltimoApontamento) {
                Boolean fimUltimoApontamentoMesmoDia = sdfHours.parse(turnoDoUltimoApontamento.horarioInicial) <  sdfHours.parse(turnoDoUltimoApontamento.horarioFinal) || sdfHours.parse(turnoDoUltimoApontamento.horarioFinal) > sdfHours.parse(sdfHours.format(ultimoApontamento))
                Date diaFimParadaUltimoApontamento = fimUltimoApontamentoMesmoDia ? ultimoApontamento : DateUtils.adicionaDiasAData(ultimoApontamento, 1)
                fimUltimoApontamento = sdfFull.parse("${sdfDay.format(diaFimParadaUltimoApontamento)} ${turnoDoUltimoApontamento.horarioFinal}")
            } else {
                //finalizando a parada no inicio do proximo turno, para paradas fora de turno
                String horarioInicialProximoTurno = turnosDepoisDoUltimoApontamento[0]?.horarioInicial

                if(!horarioInicialProximoTurno) {
                    //caso nao tenha proximo turno no mesmo dia, a parada será criada ate o fim do dia
                    horarioInicialProximoTurno = "23:59"
                }

                fimUltimoApontamento = sdfFull.parse("${sdfDay.format(ultimoApontamento)} ${horarioInicialProximoTurno}")
                use(TimeCategory) {
                    fimUltimoApontamento = fimUltimoApontamento - 1.second
                }
            }

            parada.setMotivo(motivo)
            parada.setFim(fimUltimoApontamento)
            crudService.salvar(parada)

            turnosDepoisDoUltimoApontamento?.each {
                Boolean mesmoDia = sdfHours.parse(it.horarioInicial) < sdfHours.parse(it.horarioFinal)
                Date diaApontamentoFimParada = ultimoApontamento
                Date inicioParada = sdfFull.parse("${sdfDay.format( mesmoDia ?  diaApontamentoFimParada : DateUtils.adicionaDiasAData(diaApontamentoFimParada, -1) )} ${it.horarioInicial}")
                Date fimParada = sdfFull.parse("${sdfDay.format(ultimoApontamento)} ${it.horarioFinal}")
                criarNovaParada(motivo, recurso, inicioParada, fimParada)
            }

            List <Date> days = DateUtils.diasEntreDatas(ultimoApontamento, apontamentoAtual)

            days?.each { day ->
                List<TurnoDTO> turnosCurrentData = pegarTurnosPorData(fornecedor, day)
                turnosCurrentData?.each {value ->
                    Boolean mesmoDia = sdfHours.parse(value.horarioInicial) < sdfHours.parse(value.horarioFinal)
                    if(DateUtils.adicionaDiasAData(day, 1) < apontamentoAtual && (mesmoDia || ultimoApontamento < sdfFullSec.parse(value.horarioInicialFull))) {
                        Date inicioParada = sdfFull.parse("${sdfDay.format(mesmoDia ? day : DateUtils.adicionaDiasAData(day, -1) )} ${value.horarioInicial}")
                        Date fimParada = sdfFull.parse("${sdfDay.format(day)} ${value.horarioFinal}")
                        criarNovaParada(motivo, recurso, inicioParada, fimParada)
                    }
                }
            }

            turnosAntesDoApontamentoAtual?.each {
                Boolean mesmoDia = sdfHours.parse(it.horarioInicial) < sdfHours.parse(it.horarioFinal)
                Date inicioParada = sdfFull.parse("${sdfDay.format(mesmoDia ?  apontamentoAtual : DateUtils.adicionaDiasAData(apontamentoAtual, -1) )} ${it.horarioInicial}")
                Date fimParada = sdfFull.parse("${sdfDay.format(apontamentoAtual)} ${it.horarioFinal}")
                criarNovaParada(motivo, recurso, inicioParada, fimParada)
            }

            Date inicioApontamentoAtual = sdfFull.parse("${sdfDay.format(apontamentoAtual)} ${turnoApontamentoAtual.horarioInicial}")
            Date FimApontamentoAtual = apontamentoAtual

            if(inicioApontamentoAtual > FimApontamentoAtual) {
                use(TimeCategory) {
                    inicioApontamentoAtual = FimApontamentoAtual - 1.second
                }
            }

            criarNovaParada(motivo, recurso, inicioApontamentoAtual, FimApontamentoAtual)

        } else {
            parada.setMotivo(motivo)
            parada.setFim(apontamentoAtual)
            crudService.salvar(parada)
        }
    }



}
