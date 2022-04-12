package br.com.furukawa.dtos.relatorios.excel

import br.com.furukawa.dtos.relatorios.RelatorioDTO
import br.com.furukawa.service.MensagemService
import org.apache.poi.ss.usermodel.Cell
import org.apache.poi.ss.usermodel.DataFormat
import org.apache.poi.xssf.usermodel.XSSFSheet
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.apache.poi.ss.usermodel.BorderStyle
import org.apache.poi.ss.usermodel.CellStyle
import org.apache.poi.ss.usermodel.ClientAnchor
import org.apache.poi.ss.usermodel.CreationHelper
import org.apache.poi.ss.usermodel.Drawing
import org.apache.poi.ss.usermodel.Font
import org.apache.poi.ss.usermodel.IndexedColors
import org.apache.poi.ss.usermodel.Picture
import org.apache.poi.ss.usermodel.Row
import org.apache.poi.ss.usermodel.Workbook
import org.apache.poi.ss.util.CellRangeAddress
import org.apache.poi.util.IOUtils

import java.text.SimpleDateFormat
import java.util.concurrent.atomic.AtomicInteger

abstract class RelatorioExcel {

    private final static SimpleDateFormat SDF = new SimpleDateFormat("dd/MM/YYYY HH:mm")

    Map<String, String> filtros
    String organizacao, fornecedor
    String horaDoRelatorio = SDF.format(new Date())

    Locale locale
    MensagemService mensagemService

    protected XSSFWorkbook workbook
    protected XSSFSheet sheet
    protected AtomicInteger lastRow

    protected CellStyle defaultFontStyle, defaultStyleTabela
    protected CellStyle styleDouble, styleInteger, styleDiaHora, styleDia, styleMonetario
    protected Font defaultFont

    protected abstract String formataFiltro(String filtro)
    protected abstract String formataFiltroValor(String filtro, String value)
    protected abstract String formataColunaValor(String coluna, String value)
    protected abstract Map<String, String> getColunas()
    protected abstract List<RelatorioDTO> getItens()
    protected abstract String getIntlPrefix();
    protected abstract CellStyle getColunaTipo(String coluna);

    File gerar(){
        this.workbook = new XSSFWorkbook()
        this.sheet = workbook.createSheet()

        gerarDefaults()
        cabecalhoPadrao()
        gerarTabela()

        File file = File.createTempFile("temp",".xlsx")
        FileOutputStream out = new FileOutputStream(file)
        workbook.write(out)
        out.close()

        return file
    }

    protected void cabecalhoPadrao(){
        createLogo()
        createTabelaFiltros()
        createFornecedorOrganizacaoEHorario()
        createColunas()
    }

    protected void createFornecedorOrganizacaoEHorario() {
        Row r0 = getOrCreate(0)
        Row r1 = getOrCreate(1)
        Row r3 = getOrCreate(2)
        def c5_0 = r0.createCell(5)
        def c6_0 = r0.createCell(6)
        c5_0.setCellValue(getMessage("organizacao"))
        c6_0.setCellValue(organizacao)
        c5_0.setCellStyle(defaultFontStyle)
        c6_0.setCellStyle(defaultFontStyle)
        sheet.autoSizeColumn(c5_0.getColumnIndex())
        sheet.autoSizeColumn(c6_0.getColumnIndex())

        def c5_1 = r1.createCell(5)
        def c6_1 = r1.createCell(6)
        c5_1.setCellValue(getMessage("fornecedor"))
        c6_1.setCellValue(fornecedor)
        sheet.autoSizeColumn(c5_1.getColumnIndex())
        sheet.autoSizeColumn(c6_1.getColumnIndex())
        c5_1.setCellStyle(defaultFontStyle)
        c6_1.setCellStyle(defaultFontStyle)

        def c5_3 = r3.createCell(5)
        def c6_3 = r3.createCell(6)
        c5_3.setCellValue(getMessage("horaRelatorio"))
        c6_3.setCellValue(horaDoRelatorio)
        sheet.autoSizeColumn(c5_3.getColumnIndex())
        sheet.autoSizeColumn(c6_3.getColumnIndex())
        c5_3.setCellStyle(defaultFontStyle)
        c6_3.setCellStyle(defaultFontStyle)
    }

    protected void createLogo(){
        InputStream logo = RelatorioExcel.class.getResourceAsStream("/images/logo_furukawai.jpg")
        sheet.addMergedRegion(CellRangeAddress.valueOf("\$A\$1:\$B\$2"))
        CreationHelper helper = workbook.getCreationHelper()
        Drawing drawing = sheet.createDrawingPatriarch()
        ClientAnchor anchor = helper.createClientAnchor()
        anchor.setAnchorType( ClientAnchor.AnchorType.MOVE_AND_RESIZE )
        int pictureIndex = workbook.addPicture(IOUtils.toByteArray(logo), Workbook.PICTURE_TYPE_PNG)
        anchor.setCol1( 0 )
        anchor.setRow1( 0 )
        anchor.setRow2( 1 )
        anchor.setCol2( 1 )
        Picture pict = drawing.createPicture( anchor, pictureIndex )
        pict.resize(2)
    }

    protected void createTabelaFiltros() {
        Row r0 = getOrCreate(0)
        def c1 = r0.createCell(2)
        def c2 = r0.createCell(3)
        c1.setCellValue(getMessage("filtros"))
        sheet.setColumnWidth(c1.getColumnIndex(), 30*256)
        c1.setCellStyle(defaultStyleTabela)
        c2.setCellStyle(defaultStyleTabela)
        AtomicInteger i = new AtomicInteger(1)
        if (filtros.isEmpty()){
            filtros = ["Nenhum": ""]
        }
        filtros.each {entry ->
            Row row = getOrCreate(i.getAndIncrement())
            def cell1 = row.createCell(2)
            def cell2 = row.createCell(3)
            sheet.setColumnWidth(cell1.getColumnIndex(), 30*256)
            cell1.setCellStyle(defaultStyleTabela)
            cell2.setCellStyle(defaultStyleTabela)
            cell1.setCellValue(formataFiltro(entry.getKey()))
            cell2.setCellValue(formataFiltroValor(entry.getKey(), entry.getValue()?.toString()))
        }
        lastRow = new AtomicInteger(Math.max(i.get() + 1, 5))
    }

    protected void createColunas(){
        Row colunaRow = getOrCreate(lastRow.getAndIncrement())
        AtomicInteger i = new AtomicInteger()
        colunaRow.setHeightInPoints(20)
        getColunas().each { entry ->
            def cell = colunaRow.createCell(i.getAndIncrement())
            cell.setCellValue(entry.getValue())
            cell.setCellStyle(defaultStyleTabela)
            sheet.autoSizeColumn(cell.getColumnIndex())
        }
        sheet.setAutoFilter(new CellRangeAddress(colunaRow.getRowNum(), colunaRow.getRowNum() + getItens().size(), 0, i.get() -1))
    }

    protected void gerarTabela(){
        Map<String, String> colunas = getColunas()
        Map<Integer, Integer> highests = [:]
        Map<Integer, Integer> highestsRows = [:]
        SimpleDateFormat dia = new SimpleDateFormat("dd/MM/yyyy")
        SimpleDateFormat diaHora = new SimpleDateFormat("dd/MM/yyyy HH:mm")

        getItens().each {item ->
            Row itemRow = getOrCreate(lastRow.getAndIncrement())
            AtomicInteger i = new AtomicInteger()
            colunas.each {entry ->
                Cell cell = itemRow.createCell(i.getAndIncrement())
                CellStyle colunaTipo = getColunaTipo(entry.key)
                String value = formataColunaValor(entry.getKey(), item."${entry.getKey()}" as String)
                if (colunaTipo == styleDouble || colunaTipo == styleInteger || colunaTipo == styleMonetario){
                    cell.setCellValue(value?.toDouble())
                } else if (colunaTipo == styleDia){
                    cell.setCellValue(value ? dia.parse(value) : null)
                } else if (colunaTipo == styleDiaHora){
                    cell.setCellValue(value ? diaHora.parse(value) : null)
                } else {
                    cell.setCellValue(value)
                }
                cell.setCellStyle(colunaTipo)

                resizeColuna(value, entry.value, cell, highests, highestsRows, i)
            }
        }
        // chamar o autoSizeColumn em cada coluna destroi a performance, aumentando o tempo de resposta de 200ms para 70000ms
        // então chamamos o autoSizeColumn somente nas maiores colunas
        highestsRows.each {entry ->
            sheet.autoSizeColumn(entry.getValue())
        }
    }

    private void resizeColuna(String value, String entryValue, Cell cell, Map highests, Map highestsRows, AtomicInteger i){
        int lenght = value ? value.length() : 0
        if (cell.rowIndex == 6) {
            if(sheet.getColumnWidth(cell.columnIndex) < 5000) {
                sheet.setColumnWidth(cell.columnIndex, 5000)
            } else {
                highestsRows.put(i.get(), cell.getColumnIndex())
            }
        }
        if (highests.getOrDefault(i.get(), 0) < lenght){
            if(cell.columnIndex && cell.columnIndex > 1 && entryValue.size() < lenght) {
                highests.put(i.get(), lenght)
                highestsRows.put(i.get(), cell.getColumnIndex())
            }
        }
    }

    private void gerarDefaults(){
        DataFormat format = workbook.createDataFormat();
        defaultFont = workbook.createFont()
        defaultFont.setFontHeightInPoints(11 as short)
        defaultFont.setFontName("Calibri")
        defaultFontStyle = createStyle({
            it.setFont(defaultFont)
        })
        defaultStyleTabela = createStyle {
            it.setFont(defaultFont)
            it.setWrapText(true)
            it.setBorderRight(BorderStyle.THIN)
            it.setRightBorderColor(IndexedColors.BLACK.getIndex())
            it.setBorderLeft(BorderStyle.THIN)
            it.setLeftBorderColor(IndexedColors.BLACK.getIndex())
            it.setBorderTop(BorderStyle.THIN)
            it.setTopBorderColor(IndexedColors.BLACK.getIndex())
            it.setBorderBottom(BorderStyle.THIN)
            it.setBottomBorderColor(IndexedColors.BLACK.getIndex())
            it.setDataFormat(format.getFormat("@")) // célula tipo texto
        }
        styleDouble = cloneStyle(defaultStyleTabela, {
            it.setDataFormat(format.getFormat("0.0"));
        })
        styleInteger = cloneStyle(defaultStyleTabela, {
            it.setDataFormat(format.getFormat("0"))
        })
        styleDia = cloneStyle(defaultStyleTabela, {
            it.setDataFormat(format.getFormat("dd/MM/yyyy"))
        })
        styleDiaHora = cloneStyle(defaultStyleTabela, {
            it.setDataFormat(format.getFormat("dd/MM/yyyy HH:mm"))
        })
        styleMonetario = cloneStyle(defaultStyleTabela, {
            //it.setDataFormat(format.getFormat(format.getFormat(8 as short)))
            it.setDataFormat(format.getFormat("0.00"));
        })
    }

    protected Row getOrCreate(int index){
        return sheet.getRow(index) ?: sheet.createRow(index)
    }

    // sempre cachear o resultado
    protected CellStyle createStyle(Closure<CellStyle> closure){
        def cellStyle = workbook.createCellStyle()
        closure.call(cellStyle)
        return cellStyle
    }

    protected CellStyle cloneStyle(CellStyle source, Closure<CellStyle> closure){
        def cellStyle = workbook.createCellStyle()
        cellStyle.cloneStyleFrom(source)
        closure.call(cellStyle)
        return cellStyle
    }

    protected String getMessage(String code, Object[] args = null){
        return mensagemService.getMensagem(getIntlPrefix() + code, null , args, locale) ?: code
    }
}
