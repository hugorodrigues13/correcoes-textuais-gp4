package br.com.furukawa.enums

enum DiaDaSemana {

    SEGUNDA(1),
    TERCA(2),
    QUARTA(3),
    QUINTA(4),
    SEXTA(5),
    SABADO(6),
    DOMINGO(0),

    static String montaCaseQuery(String dataProp, String diaProp){
        return "AND to_char($dataProp, 'D') = (CASE $diaProp WHEN 'DOMINGO' THEN 1 WHEN 'SEGUNDA' THEN 2 WHEN 'TERCA' THEN 3 WHEN 'QUARTA' THEN 4 WHEN 'QUINTA' THEN 5 WHEN 'SEXTA' THEN 6 WHEN 'SABADO' THEN 7 END) -- dia da semana"
    }

    int day

    DiaDaSemana(int day) {
        this.day = day
    }
}
