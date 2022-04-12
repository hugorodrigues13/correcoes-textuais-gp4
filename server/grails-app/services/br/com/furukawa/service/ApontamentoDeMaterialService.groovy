package br.com.furukawa.service

import br.com.furukawa.dtos.importer.ApontamentoDeMaterialImporter
import br.com.furukawa.dtos.importer.ImportResponse
import br.com.furukawa.dtos.importer.Importer
import br.com.furukawa.dtos.importer.OrdemDeProducaoImporter
import br.com.furukawa.enums.TipoApontamentoMaterial
import br.com.furukawa.model.ApontamentoDeMaterial
import br.com.furukawa.model.ComponenteOPWIP
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.Organizacao
import grails.gorm.transactions.Transactional
import org.apache.commons.io.FileUtils
import org.apache.commons.io.IOUtils
import org.springframework.web.multipart.MultipartFile

@Transactional
class ApontamentoDeMaterialService {
    UserService userService
    OracleService oracleService
    MensagemService mensagemService

    ImportResponse importar(MultipartFile multipartFile, Locale locale) {
        File file = File.createTempFile("temp", ".xls")
        FileUtils.writeByteArrayToFile(file, IOUtils.toByteArray(multipartFile.getInputStream()))

        Importer importer = new ApontamentoDeMaterialImporter(file, oracleService, mensagemService, locale)
        ImportResponse resultado = importer.get()
        return new ImportResponse(
                validos: resultado.validos,
                invalidos: resultado.invalidos,
                fileCorrigida: file
        )
    }

    ApontamentoDeMaterial salvarApontamentoDeMaterial(String codigoProduto, String ordemDeProducao, String codigoLote, TipoApontamentoMaterial tipo, BigDecimal quantidade, Fornecedor fornecedor) {
        ApontamentoDeMaterial apontamentoDeMaterial = new ApontamentoDeMaterial(
                ordemDeProducao: ordemDeProducao,
                codigoProduto: codigoProduto,
                codigoLote: codigoLote,
                tipo: tipo,
                quantidade: quantidade,
                fornecedor: fornecedor
        )

        return apontamentoDeMaterial.save(flush: true, failOnError: true)
    }
}
