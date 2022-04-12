package br.com.furukawa.utils

class Utils {

    static String preencher(String toPreencher, int min, String preenchimento){
        if (toPreencher.length() >= min) return toPreencher
        int left = min - toPreencher.length()
        return (preenchimento * left) + toPreencher
    }

}
