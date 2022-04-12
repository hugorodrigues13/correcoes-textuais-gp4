package br.com.furukawa.dtos.relatorios.pdf

import br.com.furukawa.dtos.relatorios.RelatorioDTO
import br.com.furukawa.service.MensagemService
import net.sf.jasperreports.engine.JREmptyDataSource
import net.sf.jasperreports.engine.JasperCompileManager
import net.sf.jasperreports.engine.JasperExportManager
import net.sf.jasperreports.engine.JasperFillManager
import net.sf.jasperreports.engine.JasperPrint
import net.sf.jasperreports.engine.JasperReport
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource
import net.sf.jasperreports.engine.util.JRProperties

import java.text.SimpleDateFormat

abstract class RelatorioPDF {

    protected final static SimpleDateFormat SDF = new SimpleDateFormat("dd/MM/YYYY HH:mm:ss")

    protected String jrxml
    protected  String intlPrefixo
    protected MensagemService mensagemService
    protected Locale locale

    RelatorioPDF(String jrxml, String intlPrefixo, MensagemService mensagemService, Locale locale) {
        this.jrxml = jrxml
        this.intlPrefixo = intlPrefixo
        this.mensagemService = mensagemService
        this.locale = locale
    }

    protected abstract Map<String, Object> getParametros()
    protected abstract List<RelatorioDTO> getObjects()

    protected Map<String, Object> tratarParametros(){
        Map<String, Object> parametros = getParametros()
        parametros.put("VAR_DATA", SDF.format(new Date())) // adicionado automaticamente
        return parametros.collectEntries { entry ->
            if (entry.getKey().startsWith("MSG_")){
                return [entry.getKey(), getMessage(entry.getValue() as String)]
            }
            return [entry.getKey(), entry.getValue()]
        }
    }

    File gerar(){
        File file = File.createTempFile("temp", ".pdf")
        InputStream jasperTemplate = RelatorioPDF.class.getResourceAsStream(jrxml)

        JasperReport jasperReport = JasperCompileManager.compileReport(jasperTemplate);
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, tratarParametros(), new JRBeanCollectionDataSource(getObjects()));

        FileOutputStream out = new FileOutputStream(file)
        JasperExportManager.exportReportToPdfStream(jasperPrint, out)
        out.flush()
        out.close()

        return file
    }

    protected String getMessage(String code, Object[] args = null){
        return mensagemService.getMensagem(intlPrefixo + code, null , args, locale)
    }

}
