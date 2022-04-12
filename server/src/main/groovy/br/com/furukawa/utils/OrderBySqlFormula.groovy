package br.com.furukawa.utils;

import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.criterion.CriteriaQuery;
import org.hibernate.criterion.Order;

class OrderBySqlFormula extends Order {
    private String sqlFormula;

    protected OrderBySqlFormula(String sqlFormula) {
        super(sqlFormula, true);
        this.sqlFormula = sqlFormula;
    }

    String toString() {
        return sqlFormula;
    }

    String toSqlString(Criteria criteria, CriteriaQuery criteriaQuery) throws HibernateException {
        return sqlFormula;
    }

    static Order from(String sqlFormula) {
        return new OrderBySqlFormula(sqlFormula);
    }


}