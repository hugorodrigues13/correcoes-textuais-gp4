package br.com.furukawa.utils

import org.hibernate.dialect.Oracle10gDialect
import org.hibernate.tool.schema.extract.spi.SequenceInformationExtractor

public class AppOracleDialect extends Oracle10gDialect
{
    @Override
    public SequenceInformationExtractor getSequenceInformationExtractor() {
        return AppSequenceInformationExtractor.INSTANCE
    }

    @Override
    public String getQuerySequencesString() {
        return "select * from user_sequences";
    }
}