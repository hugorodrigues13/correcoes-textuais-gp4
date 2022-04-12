package br.com.furukawa.dtos.importer

import br.com.furukawa.service.MensagemService
import org.apache.poi.hssf.usermodel.HSSFDateUtil
import org.apache.poi.hssf.usermodel.HSSFWorkbook
import org.apache.poi.ss.usermodel.Cell
import org.apache.poi.ss.usermodel.CellStyle
import org.apache.poi.ss.usermodel.CellType
import org.apache.poi.ss.usermodel.DataFormatter
import org.apache.poi.ss.usermodel.Font
import org.apache.poi.ss.usermodel.IndexedColors
import org.apache.poi.ss.usermodel.Row
import org.apache.poi.ss.usermodel.Sheet
import org.apache.poi.ss.usermodel.Workbook

import java.text.SimpleDateFormat

abstract class Importer {

    private final static DataFormatter FORMATTER = new DataFormatter()

    int inicio
    List<String> colunas
    File file
    MensagemService mensagemService
    String prefixoMensagem
    Locale locale
    final static int COLUNA_DATA_FINALIZACAO = 2

    protected Workbook workbook
    protected Sheet sheet

    Importer(int inicio,  List<String> colunas, File file, MensagemService mensagemService, String prefixoMensagem, Locale locale) {
        this.inicio = inicio
        this.colunas = colunas
        this.file = file
        this.mensagemService = mensagemService
        this.prefixoMensagem = prefixoMensagem
        this.locale = locale
    }

    abstract void validar(Object object)
    abstract void prevalidar(Object[] objects)

    ImportResponse get(){
        Object[] importados = importar()
        prevalidar(importados)
        importados.each({ validar(it) })
        Object[] validos = importados.findAll({it.erros.isEmpty()})
        Object[] invalidos = importados.findAll({!it.erros.isEmpty()})
        invalidar(validos, invalidos)

        return new ImportResponse(validos: validos, invalidos: invalidos)
    }

    // transforma cada coluna em objetos com suas respectivas propriedades
    private Object[] importar(){
        this.workbook =  new HSSFWorkbook(new FileInputStream(file))
        this.sheet = workbook.getSheetAt(0)
        createStyles()
        Row row = sheet.getRow(inicio)
        def objects = []
        while (row != null){
            objects.add(importarRow(row))
            inicio++
            row = sheet.getRow(inicio)
        }
        // remove objetos com todos campos nulos
        objects.removeIf({object -> colunas.every({col -> !object."${col}"})})
        return objects
    }

    private void invalidar(Object[] validos, Object[] invalidos){
        // adiciona as informações de porque cada coluna é inválida
        invalidos.each {object ->
            Row row = sheet.getRow(object.index)
            for (int i in 0..<object.erros.size()) {
                def cell = row.createCell(i + colunas.size())
                cell.setCellValue(getMessage(object.erros.get(i)))
                cell.setCellStyle(erroStyle)
                sheet.autoSizeColumn(cell.getColumnIndex())
            }
        }
        // remove as colunas validas
        validos.each {object ->
            Row row = sheet.getRow(object.index)
            def cell = row.createCell(colunas.size())
            cell.setCellValue(getMessage("valido"))
            cell.setCellStyle(validoStyle)
        }
        // salva arquivo com as correções
        FileOutputStream out = new FileOutputStream(file)
        workbook.write(out)
        out.close()
    }

    protected String getMessage(String code){
        return mensagemService.getMensagem(prefixoMensagem + code, null, null, locale)
    }

    private Object importarRow(Row row) {
        def object = [:]
        def validCell = row.getCell(colunas.size())
        // não importar uma coluna já validada (caso o usuário o importe o arquivo de linhas invalidas gerado acima)
        if (validCell && validCell.getStringCellValue() == getMessage("valido")){
            return object
        }
        for (int i in 0..<colunas.size()){
            def cell = row.getCell(i)
            if(cell && cell.getCellType() != CellType.BLANK) {
                if(cell.columnIndex == COLUNA_DATA_FINALIZACAO) {
                    try {
                        object."${colunas.get(i)}" = new SimpleDateFormat("dd/MM/yyyy").format(cell.getDateCellValue())
                    } catch (ignored) {
                        object."${colunas.get(i)}" = FORMATTER.formatCellValue(cell)
                    }
                } else {
                    object."${colunas.get(i)}" = FORMATTER.formatCellValue(cell)
                }
            } else {
                object."${colunas.get(i)}" = null
            }
        }
        object.index = row.getRowNum()
        object.erros = []
        return object
    }

    protected CellStyle erroStyle, validoStyle;
    private void createStyles(){
        erroStyle = workbook.createCellStyle()
        Font errorFont = workbook.createFont()
        errorFont.setColor(IndexedColors.RED.getIndex())
        erroStyle.setFont(errorFont)

        validoStyle = workbook.createCellStyle()
        Font validoFont = workbook.createFont()
        validoFont.setColor(IndexedColors.GREEN.getIndex())
        validoStyle.setFont(validoFont)
    }

}
