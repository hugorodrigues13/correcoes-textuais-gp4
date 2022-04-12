------------------------------------------ Atualização 20/07 ------------------------------------------

---------- novas tabelas ----------
create table GP40.usuario_colunas (id number(19,0) not null, version number(19,0) not null, tipo varchar2(255 char) not null, usuario_id number(19,0) not null);
create table GP40.usuario_colunas_valores (coluna_id number(19,0) not null, valor varchar2(255 char), colunas_idx number(10,0));
create table GP40.grupo_recurso_paradas (grupo_id number(19,0) not null, motivo_parada_id number(19,0));
create table GP40.motivo_parada (id number(19,0) not null, version number(19,0) not null, motivo varchar2(255 char) not null, tipo varchar2(255 char) not null, fornecedor_id number(19,0) not null, primary key (id));
create table GP40.PARADAS(ID NUMBER(19) not null primary key,VERSION NUMBER(19) not null,FIM TIMESTAMP(6) null, MOTIVO_ID NUMBER(19) null, INICIO TIMESTAMP(6) not null, RECURSO_ID NUMBER(19) not null);
create table GP40.NUMERO_CAIXA(ID NUMBER(19) not null primary key, VERSION NUMBER(19) not null, QUANTIDADE NUMBER(10) not null, IDENTIFICADOR VARCHAR2(255 char) not null, ANO VARCHAR2(255 char) not null, FORNECEDOR_ID NUMBER(19) not null);
create table GP40.tempo_apontamento_produto (id number(19,0) not null, version number(19,0) not null, vigencia_de timestamp not null, vigencia_ate timestamp, tempo_apontamento number(10,0) not null, grupo_recurso_id number(19,0) not null, codigo_produto varchar2(255 char) not null, primary key (id));

---------- constraints ----------
alter table GP40.usuario_colunas add constraint FK8epdngpq8x61qohxug0guh1e0 foreign key (usuario_id) references GP40.users;
alter table GP40.grupo_recurso_paradas add constraint FKn6ooqfk7b7y8wodjls6g4l4lk foreign key (motivo_parada_id) references GP40.motivo_parada;
alter table GP40.grupo_recurso_paradas add constraint FKljbcl07rcws94594dar21bra8 foreign key (grupo_id) references GP40.grupo_recurso;
alter table GP40.motivo_parada add constraint FK7wjlfgedhijo3nkbyagv5ahjr foreign key (fornecedor_id) references GP40.fornecedor;
alter table GP40.PARADAS add constraint FK7N0MAPJCUJXK3RV6YBUNMIG2K foreign key (motivo_id) references GP40.MOTIVO_PARADA;
alter table GP40.PARADAS add constraint FKGXCA3YAH72J235ULBM1BFCGXQ foreign key (RECURSO_ID) references GP40.RECURSO;
alter table GP40.NUMERO_CAIXA add constraint FKP2XN4HW6CN4E2GL99G3HNYP6J foreign key (FORNECEDOR_ID) references GP40.FORNECEDOR;
alter table GP40.NUMERO_CAIXA add constraint UKEE46E3A4F292D59F8D91B23CAAE5 unique (FORNECEDOR_ID, ANO, IDENTIFICADOR);
alter table GP40.produto_etiqueta_impressao add numero_caixa_id number(19,0);
alter table GP40.produto_etiqueta_impressao add constraint FK2cdl9s3hnwpfk9p1to7lll0fc foreign key (numero_caixa_id) references GP40.numero_caixa;
ALTER TABLE GP40.PRODUTO_ETIQUETA DROP CONSTRAINT UKF37EEF060BE8099C8DE0D9CA7B4A;
alter table GP40.tempo_apontamento_produto add constraint FK3wfvwy2kdph9m4t355wiry6v4 foreign key (grupo_recurso_id) references GP40.grupo_recurso;

---------- sequences ----------
create sequence GP40.motivo_parada_seq start with 1 increment by  1;
create sequence GP40.paradas_seq start with 1 increment by 1;
create sequence GP40.tempo_apont_prod_seq start with 1 increment by  1;

---------- alteracoes tabelas ----------

-- novos campos grupo_recurso
alter table GP40.grupo_recurso add tempo_maximo_sem_apontamento number(10,0) default 0 not null;
alter table GP40.grupo_recurso add tempo_padrao number(10,0) default 0 not null;
-- justificativa op
alter table GP40.ordem_de_producao add justificativa varchar2(255 char);
alter table GP40.produto_etiqueta add ordem_fabricacao number(1,0) default 0;

---------- inserts requestmaps ----------
-- deixar o buscar acessos do usuario como permitall
INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (155,0,'GET','permitAll','Buscar Acessos do Usuário','/api/user/getAcessosDoUsuario',17);
-- permitir salvar por usuario o filtro de determinadas telas.
INSERT INTO GP40.REQUESTMAP(ID, VERSION, HTTP_METHOD, CONFIG_ATTRIBUTE, DESCRICAO, URL, PARENT_ID) VALUES (156,1,'PATCH','ROLE_ADMINISTRADOR','Editar Colunas','/api/user/editarColunas',17);
-- motivos de parada
INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (157,1,null,'ROLE_ADMINISTRADOR','Motivos de Parada','/api/motivoDeParada',130);
INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (158,1,'POST','ROLE_ADMINISTRADOR','Salvar','/api/motivoDeParada/**',157);
INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (159,1,'GET','ROLE_ADMINISTRADOR','Buscar','/api/motivoDeParada/**',157);
INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (161,1,'DELETE','ROLE_ADMINISTRADOR','Excluir','/api/motivoDeParada/**',157);
INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (162,1,'PUT','ROLE_ADMINISTRADOR','Editar','/api/motivoDeParada/**',157);
-- tempo apontamento produto
INSERT INTO GP40.REQUESTMAP(ID, VERSION, HTTP_METHOD, CONFIG_ATTRIBUTE, DESCRICAO, URL, PARENT_ID) VALUES (163, 1, null, 'ROLE_ADMINISTRADOR', 'Tempo de Apontamento de Produto', '/api/tempoApontamentoProduto', null);
INSERT INTO GP40.REQUESTMAP(ID, VERSION, HTTP_METHOD, CONFIG_ATTRIBUTE, DESCRICAO, URL, PARENT_ID) VALUES (164, 1, 'GET', 'ROLE_ADMINISTRADOR', 'Buscar', '/api/tempoApontamentoProduto/**', 163);
INSERT INTO GP40.REQUESTMAP(ID, VERSION, HTTP_METHOD, CONFIG_ATTRIBUTE, DESCRICAO, URL, PARENT_ID) VALUES (165, 1, 'PATCH', 'ROLE_ADMINISTRADOR', 'Editar', '/api/tempoApontamentoProduto/**', 163);
-- imprimir serial
INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (160,1,'PATCH','ROLE_ADMINISTRADOR','Imprimir','/api/serial/imprimir',120);

---------- updates ----------
-- paradas apontamento
update requestmap set url='/api/apontamento/**' where id=102;

---------- sinonimos ----------
create or replace synonym GP40_USR.usuario_colunas for GP40.usuario_colunas;
create or replace synonym GP40_USR.usuario_colunas_valores for GP40.usuario_colunas_valores;
create or replace synonym GP40_USR.grupo_recurso_paradas for GP40.grupo_recurso_paradas;
create or replace synonym GP40_USR.motivo_parada for GP40.motivo_parada;
create or replace synonym GP40_USR.PARADAS for GP40.PARADAS;
create or replace synonym GP40_USR.NUMERO_CAIXA for GP40.NUMERO_CAIXA;
create or replace synonym GP40_USR.tempo_apontamento_produto for GP40.tempo_apontamento_produto;
create or replace synonym GP40_USR.motivo_parada_seq for GP40.motivo_parada_seq;
create or replace synonym GP40_USR.tempo_apont_prod_seq for GP40.tempo_apont_prod_seq;
create or replace synonym GP40_USR.paradas_seq for GP40.paradas_seq;

---------- grants ----------
grant select, insert, update, delete on GP40.usuario_colunas TO GP40_USR;
grant select, insert, update, delete on GP40.usuario_colunas_valores TO GP40_USR;
grant select, insert, update, delete on GP40.grupo_recurso_paradas TO GP40_USR;
grant select, insert, update, delete on GP40.motivo_parada TO GP40_USR;
grant select, insert, update, delete on GP40.PARADAS TO GP40_USR;
grant select, insert, update, delete on GP40.NUMERO_CAIXA TO GP40_USR;
grant select, insert, update, delete on GP40.tempo_apontamento_produto TO GP40_USR;
grant select, alter on GP40.motivo_parada_seq TO GP40_USR;
grant select, alter on GP40.paradas_seq TO GP40_USR;
grant select, alter on GP40.tempo_apont_prod_seq TO GP40_USR;

grant select on GP40.usuario_colunas TO XFKW_GP40_READ;
grant select on GP40.usuario_colunas_valores TO XFKW_GP40_READ;
grant select on GP40.grupo_recurso_paradas TO XFKW_GP40_READ;
grant select on GP40.motivo_parada TO XFKW_GP40_READ;
grant select on GP40.PARADAS TO XFKW_GP40_READ;
grant select on GP40.NUMERO_CAIXA TO XFKW_GP40_READ;
grant select on GP40.tempo_apontamento_produto TO XFKW_GP40_READ;
grant select, alter on GP40.motivo_parada_seq TO XFKW_GP40_READ;
grant select, alter on GP40.paradas_seq TO XFKW_GP40_READ;
grant select, alter on GP40.tempo_apont_prod_seq TO XFKW_GP40_READ;

------------------------------------------ Atualização 30/07 ------------------------------------------
---------- novas tabelas ----------
create table GP40.imp_cx_serial (caixa_id number(19,0) not null, serial_id number(19,0));
create table GP40.impr_apont_cx (id number(19,0) not null, version number(19,0) not null, numero_caixa number(10,0) not null, impressao_lote_id number(19,0) not null, primary key (id));
create table GP40.impr_apont_lote (id number(19,0) not null, version number(19,0) not null, produto_etiqueta_id number(19,0) not null, lote_id number(19,0) not null, primary key (id));

---------- constraints ----------
alter table GP40.impr_apont_cx add constraint UK9e5806bfbd35abca7367ba7de5d4 unique (impressao_lote_id, numero_caixa);
alter table GP40.imp_cx_serial add constraint FKktc6ewbc9m2frhsaeq8op1a6h foreign key (serial_id) references GP40.serial_fabricacao;
alter table GP40.imp_cx_serial add constraint FKomkmb0r3e674gcb5h1y4cp7ld foreign key (caixa_id) references GP40.impr_apont_cx;
alter table GP40.impr_apont_cx add constraint FKhgchaunnsvgw28tlwlx2wrpxu foreign key (impressao_lote_id) references GP40.impr_apont_lote;
alter table GP40.impr_apont_lote add constraint FKopomhs3dn5764dmvc4gj418np foreign key (produto_etiqueta_id) references GP40.produto_etiqueta;
alter table GP40.impr_apont_lote add constraint FK8nc6v8oiswgdspwuiwv6efn5b foreign key (lote_id) references GP40.lote;
alter table GP40.motivo_parada add constraint UK6de5b5f7e478f230abd4065d8c2a unique (fornecedor_id, motivo);

---------- sequences ----------
create sequence GP40.impr_apont_cx_seq start with 1 increment by  1;
create sequence GP40.impr_apont_lote_seq start with 1 increment by 1;

---------- alterações ----------
alter table GP40.linha_de_producao add ativo number(1,0) default 1;

---------- deletes ----------
delete from GP40.ETIQUETA_IMPRESSOES where produto_etiqueta_impressoes_id in(
    select id from GP40.produto_etiqueta_impressao where lote_id is null
);
delete from GP40.produto_etiqueta_impressao where lote_id is null;

---------- inserts ----------
INSERT INTO GP40.REQUESTMAP(ID, VERSION, HTTP_METHOD, CONFIG_ATTRIBUTE, DESCRICAO, URL, PARENT_ID) VALUES (166,1,'PUT','permitAll','Salvar Dados do Usuário','/api/user/salvarDadosDoUsuario',17);

INSERT INTO GP40.impr_apont_lote
(id,
 version,
 produto_etiqueta_id,
 lote_id)
    (SELECT GP40.impr_apont_lote_seq.nextval,
            1,
            pei.produto_etiqueta_id,
            pei.lote_id
     FROM   GP40.produto_etiqueta_impressao pei
     WHERE  id = (SELECT Max(id)
                  FROM   GP40.produto_etiqueta_impressao
                  WHERE  lote_id = pei.lote_id));

INSERT INTO GP40.impr_apont_cx
(id,
 version,
 numero_caixa,
 impressao_lote_id)
    (SELECT GP40.impr_apont_cx_seq.nextval,
            1,
            ordem,
            id
     FROM   (SELECT id,
                    Row_number()
                            OVER(
                                partition BY lote_id
                                ORDER BY numero_caixa_id) ordem
             FROM  (SELECT DISTINCT il.id  id,
                                    il.lote_id,
                                    pei.numero_caixa_id,
                                    pei.id pid
                    FROM   GP40.produto_etiqueta_impressao pei
                               INNER JOIN GP40.impr_apont_lote il
                                          ON il.lote_id = pei.lote_id)));

INSERT INTO GP40.imp_cx_serial
(caixa_id,
 serial_id)
    (SELECT cx.id,
            ei.serial_fabricacao_id
     FROM   (SELECT id,
                    lote_id,
                    Row_number()
                            OVER(
                                partition BY lote_id
                                ORDER BY id) caixa
             FROM   (SELECT DISTINCT PEI.id id,
                                     pei.lote_id
                     FROM   GP40.etiqueta_impressoes ei
                                INNER JOIN GP40.produto_etiqueta_impressao pei
                                           ON pei.id = ei.produto_etiqueta_impressoes_id))
                c
                INNER JOIN GP40.etiqueta_impressoes ei
                           ON ei.produto_etiqueta_impressoes_id = c.id
                INNER JOIN GP40.impr_apont_lote il
                           ON il.lote_id = c.lote_id
                INNER JOIN GP40.impr_apont_cx cx
                           ON cx.impressao_lote_id = il.id
                               AND cx.numero_caixa = c.caixa);

---------- updates ----------
UPDATE GP40.ORDEM_DE_FABRICACAO SET ORDEM=-1 WHERE STATUS IN ('CANCELADA', 'FINALIZADA');
update GP40.requestmap set http_method='GET', config_attribute='permitAll' where url='/api/user/perfil';

UPDATE GP40.ORDEM_DE_PRODUCAO op
SET op.QTD_DISP_FABRICACAO = COALESCE(op.QUANTIDADE - (
    SELECT SUM(odf.QUANTIDADE_TOTAL) FROM GP40.ORDEM_DE_FABRICACAO odf
    WHERE odf.ORDEM_DE_PRODUCAO_ID = op.ID
      AND odf.STATUS != 'CANCELADA'
), op.QUANTIDADE);

---------- sinonimos ----------
create or replace synonym GP40_USR.imp_cx_serial for GP40.imp_cx_serial;
create or replace synonym GP40_USR.impr_apont_cx for GP40.impr_apont_cx;
create or replace synonym GP40_USR.impr_apont_lote for GP40.impr_apont_lote;
create or replace synonym GP40_USR.impr_apont_cx_seq for GP40.impr_apont_cx_seq;
create or replace synonym GP40_USR.impr_apont_lote_seq for GP40.impr_apont_lote_seq;

---------- grants ----------
grant select, insert, update, delete on GP40.imp_cx_serial TO GP40_USR;
grant select, insert, update, delete on GP40.impr_apont_cx TO GP40_USR;
grant select, insert, update, delete on GP40.impr_apont_lote TO GP40_USR;
grant select, alter on GP40.impr_apont_cx_seq TO GP40_USR;
grant select, alter on GP40.impr_apont_lote_seq TO GP40_USR;

grant select on GP40.imp_cx_serial TO XFKW_GP40_READ;
grant select on GP40.impr_apont_cx TO XFKW_GP40_READ;
grant select on GP40.impr_apont_lote TO XFKW_GP40_READ;
grant select, alter on GP40.impr_apont_cx_seq TO XFKW_GP40_READ;
grant select, alter on GP40.impr_apont_lote_seq TO XFKW_GP40_READ;

------------------------------------------ Atualização 10/08 ------------------------------------------

---------- novas tabelas ----------
create table GP40.ITEM_CATALOGO
(
    ID NUMBER(19) not null
        primary key,
    VERSION NUMBER(19) not null,
    VALOR VARCHAR2(255 char) null,
    NOME VARCHAR2(255 char) not null,
    ORGANIZATION_ID NUMBER(19) not null,
    CODIGO_PRODUTO VARCHAR2(255 char) not null,
    constraint UKE30FE189281FAA987E895AECAF82
        unique (NOME, ORGANIZATION_ID, CODIGO_PRODUTO)
);

---------- constraints ----------
create sequence GP40.ITEM_CATALOGO_SEQ start with 1 increment by 1;

---------- inserts requestmaps ----------
INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id)
VALUES (167,1,'PATCH','ROLE_ADMINISTRADOR','Estornar','/api/serial/estornarApontamento',120);

INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id)
VALUES (168,1,null,'ROLE_ADMINISTRADOR','Reimpressão de Etiquetas','/api/reimpressaoEtiquetas',135);

INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id)
values (169,1,'PATCH','ROLE_ADMINISTRADOR','Reimprimir','/api/reimpressaoEtiquetas/reimprimir',168);

INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id)
VALUES (170,1,'GET','ROLE_ADMINISTRADOR','Buscar','/api/reimpressaoEtiquetas/**',168);

---------- alterações ----------
alter table gp40.produto_etiqueta add serial number(1,0) default 0 not null;
alter table GP40.lote add quantidade_por_caixa number(10,0);

---------- updates ----------
UPDATE gp40.PRODUTO_ETIQUETA SET serial = ORDEM_FABRICACAO;
UPDATE gp40.lote l
SET    l.quantidade_por_caixa = (SELECT pe.quantidade_de_etiquetas
                                 FROM   gp40.impr_apont_lote imprl
                                            INNER JOIN gp40.produto_etiqueta pe
                                                       ON pe.id = imprl.produto_etiqueta_id
                                                           AND imprl.lote_id = l.id)
WHERE  EXISTS(SELECT pe.quantidade_de_etiquetas
              FROM   gp40.impr_apont_lote imprl
                         INNER JOIN gp40.produto_etiqueta pe
                                    ON pe.id = imprl.produto_etiqueta_id
                                        AND imprl.lote_id = l.id);

---------- sinonimos ----------
create or replace synonym GP40_USR.ITEM_CATALOGO for GP40.ITEM_CATALOGO;
create or replace synonym GP40_USR.ITEM_CATALOGO_SEQ for GP40.ITEM_CATALOGO_SEQ;

---------- grants ----------
grant select, insert, update, delete on GP40.ITEM_CATALOGO TO GP40_USR;
grant select, alter on GP40.ITEM_CATALOGO_SEQ TO GP40_USR;

grant select on GP40.ITEM_CATALOGO TO XFKW_GP40_READ;
grant select, alter on GP40.ITEM_CATALOGO_SEQ TO XFKW_GP40_READ;

------------------------------------------ Atualização 11/08 ------------------------------------------
DROP INDEX "GP40"."UKF37EEF060BE8099C8DE0D9CA7B4A";


------------------------------------------ Atualização 26/08 ------------------------------------------
--requestmaps
INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (171,1,'PATCH','ROLE_ADMINISTRADOR','Exportar','/api/serial/exportar',120);
INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (172,1,'PATCH','ROLE_ADMINISTRADOR','Recebimento','/api/serial/recebimento',135);
INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (173,1,'PATCH','ROLE_ADMINISTRADOR','Recebimento','/api/serial/recebimento/**',172);
INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (174,1,null,'ROLE_ADMINISTRADOR','Turnos','/api/turno/',130);
INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (175,1,'GET','ROLE_ADMINISTRADOR','Buscar','/api/turno/**',174);
INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES(176,1,'PUT','ROLE_ADMINISTRADOR','Editar','/api/turno/**',174);
INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES(177,1,'DELETE','ROLE_ADMINISTRADOR','Excluir','/api/turno/**',174);
INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (178,1,'POST','ROLE_ADMINISTRADOR','Salvar','/api/turno/**',174);
update gp40.requestmap set url='/api/dashboardProducao/**' where url='/api/home/dashboardProducao/';

---------- novas tabelas ----------
create table GP40.REGRA_EXIBICAO_MP
(
    ID NUMBER(19) not null
        primary key,
    VERSION NUMBER(19) not null,
    TIPO VARCHAR2(255 char) not null,
    GRUPO_ID NUMBER(19) not null
        constraint FKIT8MWBLYA263IHVAO7JH148VG
            references GP40.GRUPO_RECURSO,
    DESCRICAO VARCHAR2(255 char) not null
);

create table GP40.TESTES
(
    ID NUMBER(19) not null
        primary key,
    VERSION NUMBER(19) not null,
    TIPO VARCHAR2(255 char) not null,
    AMOSTRAGEM NUMBER(10) not null,
    RECURSO_ID NUMBER(19) not null
        constraint FK7SXO0UG103E0YGW6L7LL4G4MP
            references GP40.RECURSO
);

create table gp40.recebimento_nf (id number(19,0) not null, version number(19,0) not null, sequencia_operacao number(10,0) not null, data_criacao timestamp, quantidade number(19,2) not null, ordem_de_producao varchar2(255 char) not null, nota_fiscal varchar2(255 char) not null, data_ultima_atualizacao timestamp, erro_exportacao varchar2(1000 char), interface_transaction_id number(19,0) not null, status varchar2(255 char) not null, primary key (id));

create table gp40.TURNO
(
    ID NUMBER(19) not null
        primary key,
    VERSION NUMBER(19) not null,
    NOME VARCHAR2(255 char) not null,
    FORNECEDOR_ID NUMBER(19) not null
        constraint FKCCIHIMJ3W66HNA5NKS4RIARFD
            references gp40.FORNECEDOR,
    constraint UK685823737E025486B859C819F3DF
        unique (FORNECEDOR_ID, NOME)
);

create table gp40.TURNO_DURACAO
(
    ID NUMBER(19) not null
        primary key,
    VERSION NUMBER(19) not null,
    DURACAO NUMBER(10) not null,
    TURNO_ID NUMBER(19) not null
        constraint FK4UPTN3BM8N3IP8SS7RE92N2W2
            references gp40.TURNO,
    HORARIO_FINAL TIMESTAMP(6) not null
);

create table gp40.TURNO_DURACAO_DIAS
(
    TURNO_DURACAO_ID NUMBER(19) not null
        constraint FKDSHLXVW3D7GNL9O7YLN6IA2B
            references gp40.TURNO_DURACAO,
    DIA_DA_SEMANA VARCHAR2(255 char) not null,
    primary key (TURNO_DURACAO_ID, DIA_DA_SEMANA)
);

---------- sequences ----------
create sequence GP40.regra_exibicao_mp_seq start with 1 increment by 1;
create sequence GP40.teste_seq start with 1 increment by 1;
create sequence GP40.turno_seq start with 1 increment by 1;
create sequence GP40.turno_duracao_seq start with 1 increment by 1;

---------- constraints ----------
alter table gp40.regra_exibicao_mp add constraint UK19e62caa24d9ab8ae480cdfb39bb unique (grupo_id, descricao);
alter table gp40.testes add constraint UKba5d2bab1936a03b0e6c6c89d8d0 unique (recurso_id, tipo);
alter table gp40.recebimento_nf add constraint UK_7oug2csuqhwb8k584s1juu443 unique (interface_transaction_id);


---------- updates ---------------
update gp40.grupo_recurso set primeiro_da_linha=null where id=61;

---------- sinonimos ----------
create or replace synonym GP40_USR.TESTES for GP40.TESTES;
create or replace synonym GP40_USR.recebimento_nf for GP40.recebimento_nf;
create or replace synonym GP40_USR.REGRA_EXIBICAO_MP for GP40.REGRA_EXIBICAO_MP;
create or replace synonym GP40_USR.TURNO for GP40.TURNO;
create or replace synonym GP40_USR.TURNO_DURACAO for GP40.TURNO_DURACAO;
create or replace synonym GP40_USR.TURNO_DURACAO_DIAS for GP40.TURNO_DURACAO_DIAS;
create or replace synonym GP40_USR.regra_exibicao_mp_seq for GP40.regra_exibicao_mp_seq;
create or replace synonym GP40_USR.teste_seq for GP40.teste_seq;
create or replace synonym GP40_USR.turno_seq for GP40.turno_seq;
create or replace synonym GP40_USR.turno_duracao_seq for GP40.turno_duracao_seq;

---------- grants ----------
grant select, insert, update, delete on GP40.REGRA_EXIBICAO_MP TO GP40_USR;
grant select, insert, update, delete on GP40.testes TO GP40_USR;
grant select, insert, update, delete on GP40.recebimento_nf TO GP40_USR;
grant select, insert, update, delete on GP40.TURNO TO GP40_USR;
grant select, insert, update, delete on GP40.TURNO_DURACAO TO GP40_USR;
grant select, insert, update, delete on GP40.TURNO_DURACAO_DIAS TO GP40_USR;
grant select, alter on GP40.regra_exibicao_mp_seq TO GP40_USR;
grant select, alter on GP40.teste_seq TO GP40_USR;
grant select, alter on GP40.turno_seq TO GP40_USR;
grant select, alter on GP40.turno_duracao_seq TO GP40_USR;

grant select on GP40.testes TO XFKW_GP40_READ;
grant select on GP40.REGRA_EXIBICAO_MP TO XFKW_GP40_READ;
grant select on GP40.recebimento_nf TO XFKW_GP40_READ;
grant select on GP40.TURNO TO XFKW_GP40_READ;
grant select on GP40.TURNO_DURACAO TO XFKW_GP40_READ;
grant select on GP40.TURNO_DURACAO_DIAS TO XFKW_GP40_READ;
grant select, alter on GP40.regra_exibicao_mp_seq TO XFKW_GP40_READ;
grant select, alter on GP40.teste_seq TO XFKW_GP40_READ;
grant select, alter on GP40.turno_seq TO XFKW_GP40_READ;
grant select, alter on GP40.turno_duracao_seq TO XFKW_GP40_READ;

------------------------------------------ Atualização 15/09 ------------------------------------------
--requestmaps
UPDATE GP40.REQUESTMAP SET http_method=null where id=172;
UPDATE GP40.REQUESTMAP SET http_method='GET', descricao='Buscar' where id=173;
Insert into GP40.REQUESTMAP (ID,VERSION,HTTP_METHOD,CONFIG_ATTRIBUTE,DESCRICAO,URL,PARENT_ID) values (179,0, 'PATCH','ROLE_ADMINISTRADOR','Ativar ou Desativar','/api/defeito/ativarOuDesativar','70');
Insert into GP40.REQUESTMAP (ID,VERSION,HTTP_METHOD,CONFIG_ATTRIBUTE,DESCRICAO,URL,PARENT_ID) values (180,0, 'PATCH','ROLE_ADMINISTRADOR','Ativar ou Desativar','/api/grupoRecurso/ativarOuDesativar','40');
Insert into GP40.REQUESTMAP (ID,VERSION,HTTP_METHOD,CONFIG_ATTRIBUTE,DESCRICAO,URL,PARENT_ID) values (181,0, 'PATCH','ROLE_ADMINISTRADOR','Ativar ou Desativar','/api/motivoDeParada/ativarOuDesativar','157');
Insert into GP40.REQUESTMAP (ID,VERSION,HTTP_METHOD,CONFIG_ATTRIBUTE,DESCRICAO,URL,PARENT_ID) values (182,0, 'PATCH','ROLE_ADMINISTRADOR','Ativar ou Desativar','/api/recurso/ativarOuDesativar','50');
Insert into GP40.REQUESTMAP (ID,VERSION,HTTP_METHOD,CONFIG_ATTRIBUTE,DESCRICAO,URL,PARENT_ID) values (183,0, 'PATCH','ROLE_ADMINISTRADOR','Ativar ou Desativar','/api/grupoLinhaProducao/ativarOuDesativar','65');
INSERT INTO GP40.REQUESTMAP (id,version,http_method,config_attribute,descricao,url,parent_id) VALUES (184, 1, null, 'ROLE_ADMINISTRADOR', 'Planejamento Diário', '/api/planejamentoDiario/', 134);
INSERT INTO GP40.REQUESTMAP (id,version,http_method,config_attribute,descricao,url,parent_id) VALUES (185, 1, 'GET', 'ROLE_ADMINISTRADOR', 'Buscar', '/api/planejamentoDiario/**', 184);
INSERT INTO GP40.REQUESTMAP (id,version,http_method,config_attribute,descricao,url,parent_id) VALUES (186, 1, 'PUT', 'ROLE_ADMINISTRADOR', 'Editar', '/api/planejamentoDiario/**', 184);
INSERT INTO GP40.REQUESTMAP (id,version,http_method,config_attribute,descricao,url,parent_id) VALUES (187, 1, 'POST', 'ROLE_ADMINISTRADOR', 'Salvar', '/api/planejamentoDiario/**', 184);
INSERT INTO GP40.REQUESTMAP (id,version,http_method,config_attribute,descricao,url,parent_id) VALUES (188, 1, 'DELETE', 'ROLE_ADMINISTRADOR', 'Excluir', '/api/planejamentoDiario/**', 184);
INSERT INTO GP40.REQUESTMAP (id,version,http_method,config_attribute,descricao,url,parent_id) VALUES (189,1,'PATCH','ROLE_ADMINISTRADOR','Exportar','/api/grupoLinhaProducao/exportar',65);

Insert into gp40.requestmap (ID,VERSION,HTTP_METHOD,CONFIG_ATTRIBUTE,DESCRICAO,URL,PARENT_ID) values (190,'0',null,'ROLE_ADMINISTRADOR','Paradas','/api/paradas', 135);
Insert into gp40.requestmap (ID,VERSION,HTTP_METHOD,CONFIG_ATTRIBUTE,DESCRICAO,URL,PARENT_ID) values (191,'0','GET','ROLE_ADMINISTRADOR','Buscar','/api/paradas/**', 190);
Insert into gp40.requestmap (ID,VERSION,HTTP_METHOD,CONFIG_ATTRIBUTE,DESCRICAO,URL,PARENT_ID) values (192,'0','PATCH','ROLE_ADMINISTRADOR','Editar Motivo Pela Parada','/api/paradas/updateMotivoRequest', 190);

---------- novas tabelas ----------
create table GP40.PLANEJAMENTO_DIARIO
(
    ID NUMBER(19) not null
        primary key,
    VERSION NUMBER(19) not null,
    QUANTIDADE_PLANEJADA_PESSOAS NUMBER(19) not null,
    TURNO_ID NUMBER(19) not null
        constraint FK3IV6VSELSVGN478NL8X1BB0Y0
            references GP40.TURNO,
    QUANTIDADE_PLANEJADA_PECAS NUMBER(19) not null,
    DATA TIMESTAMP(6) not null,
    usuario_criacao varchar2(255 char),
    usuario_alteracao varchar2(255 char),
    data_criacao timestamp,
    data_atualizacao timestamp,
    LINHA_DE_PRODUCAO_ID NUMBER(19) not null
        constraint FKO6QC610JAV0SPTO38Q8TJJVVU
            references GP40.LINHA_DE_PRODUCAO,
    constraint UKF1218F98AAE3F7404AD3F73BB69E
        unique (TURNO_ID, LINHA_DE_PRODUCAO_ID, DATA)
);


create table gp40.componente_op_wip (id number(19,0) not null, version number(19,0) not null, quantidade_por_montagem number(19,2) not null, codigo_subinventario varchar2(255 char) not null, locator_id number(19,0) not null, codigo_produto varchar2(255 char) not null, component_yield_factor number(19,2) not null, quantidade_requerida number(19,2) not null, wip_supply_type number(10,0) not null, inventory_item_id number(19,0) not null, descricao_produto varchar2(255 char) not null, organization_id number(19,0) not null, quantidade_emitida number(19,2) not null, unidade varchar2(255 char) not null, operacao_id number(19,0) not null, primary key (id));
create table gp40.operacao_op_wip (id number(19,0) not null, version number(19,0) not null, operation_description varchar2(255 char) not null, roteiro_id number(19,0) not null, operation_sequence number(19,0) not null, operation_code varchar2(255 char) not null, primary key (id));
create table gp40.recurso_op_wip (id number(19,0) not null, version number(19,0) not null, resource_code varchar2(255 char) not null, resource_description varchar2(255 char) not null, operacao_id number(19,0) not null, primary key (id));
create table gp40.roteiro_op_wip (id number(19,0) not null, version number(19,0) not null, status_produto varchar2(255 char) not null, codigo_subinventario varchar2(255 char) not null, start_quantity number(19,2) not null, scheduled_start_date timestamp not null, completion_locator_id number(19,0) not null, codigo_produto varchar2(255 char) not null, data_entregue timestamp not null, ordem_de_producao_id number(19,0) not null, data_fechamento timestamp not null, inventory_item_id number(19,0) not null, descricao_produto varchar2(255 char) not null, scheduled_completion_date timestamp not null, unidade varchar2(255 char) not null, primary key (id));
alter table gp40.roteiro_op_wip add constraint UK_1nkv3o3dmjqci72f7cka2j59i unique (ordem_de_producao_id);

---------- novas colunas ----------
alter table gp40.defeito add is_ativo number(1,0) default 1 not null;
alter table gp40.grupo_linha_producao add is_ativo number(1,0) default 1 not null;
alter table gp40.grupo_recurso add is_ativo number(1,0) default 1 not null;
alter table gp40.motivo_parada add is_ativo number(1,0) default 1 not null;
alter table gp40.recurso add is_ativo number(1,0) default 1 not null;

alter table GP40.motivo_parada add data_criacao timestamp;
alter table GP40.motivo_parada add data_atualizacao timestamp;
alter table GP40.motivo_parada add usuario_criacao varchar2(255 char);
alter table GP40.motivo_parada add usuario_alteracao varchar2(255 char);

alter table gp40.turno add data_criacao timestamp;
alter table gp40.turno add data_atualizacao timestamp;
alter table gp40.turno add usuario_criacao varchar2(255 char);
alter table gp40.turno add usuario_alteracao varchar2(255 char);

alter table GP40.planejamento_diario add data_criacao timestamp;
alter table GP40.planejamento_diario add data_atualizacao timestamp;
alter table GP40.planejamento_diario add usuario_criacao varchar2(255 char);
alter table GP40.planejamento_diario add usuario_alteracao varchar2(255 char);

alter table GP40.APONTAMENTO drop column DATA_CRIACAO;
alter table GP40.APONTAMENTO drop column DATA_ATUALIZACAO;
alter table GP40.APONTAMENTO drop column USUARIO_CRIACAO;
alter table GP40.APONTAMENTO drop column USUARIO_ALTERACAO;
DELETE FROM GP40.AUDIT_LOG WHERE CLASS_NAME = 'br.com.furukawa.model.Apontamento';

alter table GP40.TURNO_DURACAO rename column DURACAO to DURACAO_TEMP;
alter table GP40.TURNO_DURACAO add DURACAO TIMESTAMP(6) default SYSDATE not null;
UPDATE GP40.TURNO_DURACAO t SET t.DURACAO = to_date('01/01/1970 ' || t.DURACAO_TEMP, 'DD/MM/YYYY HH24');
alter table GP40.TURNO_DURACAO drop column DURACAO_TEMP;

---------- sequences ----------
create sequence GP40.planejamento_diario_seq start with 1 increment by  1;
create sequence GP40.componente_op_wip_seq start with 1 increment by  1;
create sequence GP40.operacao_op_wip_seq start with 1 increment by  1;
create sequence GP40.recurso_op_wip_seq start with 1 increment by  1;
create sequence GP40.roteiro_op_wip_seq start with 1 increment by  1;

---------- sinonimos ----------
create or replace synonym GP40_USR.PLANEJAMENTO_DIARIO for GP40.PLANEJAMENTO_DIARIO;
create or replace synonym GP40_USR.planejamento_diario_seq for GP40.planejamento_diario_seq;
create or replace synonym GP40_USR.componente_op_wip for GP40.componente_op_wip;
create or replace synonym GP40_USR.operacao_op_wip for GP40.operacao_op_wip;
create or replace synonym GP40_USR.recurso_op_wip for GP40.recurso_op_wip;
create or replace synonym GP40_USR.roteiro_op_wip for GP40.roteiro_op_wip;

create or replace synonym GP40_USR.roteiro_op_wip_seq for GP40.roteiro_op_wip_seq;
create or replace synonym GP40_USR.componente_op_wip_seq for GP40.componente_op_wip_seq;
create or replace synonym GP40_USR.operacao_op_wip_seq for GP40.operacao_op_wip_seq;
create or replace synonym GP40_USR.recurso_op_wip_seq for GP40.recurso_op_wip_seq;

---------- grants ----------

grant select, insert, update, delete on GP40.PLANEJAMENTO_DIARIO TO GP40_USR;
grant select, alter on GP40.planejamento_diario_seq TO GP40_USR;
grant select on GP40.PLANEJAMENTO_DIARIO TO XFKW_GP40_READ;
grant select, alter on GP40.planejamento_diario_seq TO XFKW_GP40_READ;
grant select, insert, update, delete on GP40.componente_op_wip TO GP40_USR;
grant select, insert, update, delete on GP40.operacao_op_wip TO GP40_USR;
grant select, insert, update, delete on GP40.recurso_op_wip TO GP40_USR;
grant select, insert, update, delete on GP40.roteiro_op_wip TO GP40_USR;
grant select on GP40.componente_op_wip TO XFKW_GP40_READ;
grant select on GP40.operacao_op_wip TO XFKW_GP40_READ;
grant select on GP40.recurso_op_wip TO XFKW_GP40_READ;
grant select on GP40.roteiro_op_wip TO XFKW_GP40_READ;
grant select, alter on GP40.roteiro_op_wip_seq TO GP40_USR;
grant select, alter on GP40.componente_op_wip_seq TO GP40_USR;
grant select, alter on GP40.operacao_op_wip_seq TO GP40_USR;
grant select, alter on GP40.recurso_op_wip_seq TO GP40_USR;

grant select, alter on GP40.roteiro_op_wip_seq TO XFKW_GP40_READ;
grant select, alter on GP40.componente_op_wip_seq TO XFKW_GP40_READ;
grant select, alter on GP40.operacao_op_wip_seq TO XFKW_GP40_READ;
grant select, alter on GP40.recurso_op_wip_seq TO XFKW_GP40_READ;


---------------------------------------
ALTER TABLE GP40.ROTEIRO_OP_WIP ADD CONSTRAINT "UK_1NKV3O3DMJQCI72F7CKA2J59I" UNIQUE ("ORDEM_DE_PRODUCAO_ID");
ALTER TABLE GP40.ORDEM_DE_FABRICACAO DROP COLUMN QUANTIDADE_FINALIZADA;
update gp40.requestmap set url='/api/serial/recebimento' where id=172;
update gp40.requestmap set url='/api/serial/recebimento/**' where id=173;
update gp40.recebimento_nf set status='CONCLUIDA' where status='MOVIMENTADA' AND DATA_CRIACAO <= TO_DATE('14/09/2021 14:00:00', 'DD/MM/YYYY HH24:MI:SS');

------------------------------------------ Atualização 05/10 ------------------------------------------
INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (193,1,null,'ROLE_ADMINISTRADOR','Apontamentos Pendentes','/api/apontamentosPendentes/',135);
INSERT INTO GP40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (194,1,'GET','ROLE_ADMINISTRADOR','Buscar','/api/apontamentosPendentes/**',193);
INSERT INTO gp40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (195,8,'PATCH','ROLE_ADMINISTRADOR','Enviar para Separação','/api/ordemDeFabricacao/enviarSeparacao',149);
INSERT INTO gp40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (196,8,'PATCH','ROLE_ADMINISTRADOR','Alterar Quantidade','/api/ordemDeFabricacao/alterarQuantidade',149);
INSERT INTO gp40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (197,1,null,'ROLE_ADMINISTRADOR','Transformação de Lote','/api/transformacaoLote',135);
INSERT INTO gp40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (198,1,'GET','ROLE_ADMINISTRADOR','Buscar','/api/transformacaoLote/**',197);
INSERT INTO gp40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (199,1,'PATCH','ROLE_ADMINISTRADOR','Transformar','/api/transformacaoLote/**',197);

delete from gp40.componente_op_wip;
alter table gp40.componente_op_wip drop column operacao_id;
alter table gp40.historico_apontamento add erro_transacao varchar2(1000 char);
alter table gp40.componente_op_wip add operation_sequence number(19,0);
alter table gp40.componente_op_wip add operation_code varchar2(255 char);
alter table gp40.componente_op_wip add ordem_de_producao_id number(19,0);
ALTER TABLE GP40.COMPONENTE_OP_WIP ADD CONSTRAINT "FKEC4DKROE74U2AH3ON7CHG17W8" FOREIGN KEY ("ORDEM_DE_PRODUCAO_ID") REFERENCES "GP40"."ORDEM_DE_PRODUCAO" ("ID") ENABLE;

alter table gp40.planejamento_diario add quantidade_pessoas_presentes number(19,0) default 0 not null;
alter table gp40.planejamento_diario add grupo_linha_de_producao_id number(19,0);
alter table gp40.planejamento_diario add constraint UK1c9a8e33141f1fc1c74aefe1abc9 unique (grupo_linha_de_producao_id, turno_id, linha_de_producao_id, data);
alter table gp40.planejamento_diario add constraint FKdqgsvci9yqmue4uf4915xwslo foreign key (grupo_linha_de_producao_id) references gp40.grupo_linha_producao;
alter table GP40.servico_romaneio add lote_id number(19,0);
alter table GP40.servico_romaneio add constraint FK132w29870nqeindtpqkyyw9f3 foreign key (lote_id) references gp40.lote;
alter table gp40.grupo_linha_producao add usuario_id number(19,0);
alter table gp40.grupo_linha_producao add constraint FK45wf3gk74uld1cjqdpxfsv4o7 foreign key (usuario_id) references gp40.users;

------------------------------------------ Atualização 19/10 ------------------------------------------
alter table gp40.PLANEJAMENTO_DIARIO add pessoas_treinamento number(19, 0) default 0 not null;
alter table gp40.PLANEJAMENTO_DIARIO add pessoas_habilitadas number(19, 0) default 0 not null;
INSERT INTO gp40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (200,0,'GET','ROLE_ADMINISTRADOR','Asaichi','/api/asaichi/**',null);
Insert into GP40.REQUESTMAP (ID,VERSION,HTTP_METHOD,CONFIG_ATTRIBUTE,DESCRICAO,URL,PARENT_ID) values ('201','1','PATCH','ROLE_ADMINISTRADOR','Recarregar','/api/recebimento/recarregar','172');
update gp40.requestmap set parent_id=134 where id=172;

alter table gp40.ORDEM_DE_FABRICACAO add SEGREGAR_LOTES NUMBER(1) default 0 not null;
alter table gp40.lote add ordem_de_fabricacao_id number(19,0);
alter table gp40.LOTE add constraint FKP56TGRQ5U8PL0YIR1J4PTJD1Q foreign key (ORDEM_DE_FABRICACAO_ID) references gp40.ORDEM_DE_FABRICACAO;
UPDATE gp40.LOTE l SET l.GRUPO_LINHA_DE_PRODUCAO_ID = (SELECT lg.GRUPO_ID FROM gp40.LINHA_GRUPO lg WHERE lg.LINHA_ID = l.LINHA_DE_PRODUCAO_ID) WHERE l.GRUPO_LINHA_DE_PRODUCAO_ID IS NULL;
ALTER TABLE gp40.LOTE DROP COLUMN LINHA_DE_PRODUCAO_ID;

create table gp40.DIA_DA_SEMANA
(
    ID NUMBER(19) not null
        primary key,
    NOME VARCHAR2(255 CHAR),
    NUMERO NUMBER(19, 0),
);


------------------------------------------ Atualização 11/11 ------------------------------------------
alter table gp40.recurso modify codigo_oracle null;
Insert into gp40.requestmap (ID,VERSION,HTTP_METHOD,CONFIG_ATTRIBUTE,DESCRICAO,URL,PARENT_ID)
values ('202','0','PATCH','ROLE_ADMINISTRADOR','Sucatear Serial','/api/serial/sucatear','120');
INSERT INTO gp40.ROLE(ID, VERSION, DATA_CRIACAO, DESCRICAO, DATA_ATUALIZACAO, NOME, IS_REMOVIVEL, USUARIO_CRIACAO, AUTHORITY, IS_EDITAVEL, USUARIO_ALTERACAO)
VALUES (gp40.role_seq.nextval,0,SYSDATE,'Editar notas fiscais',SYSDATE,'Editor de Notas Fiscais',1,'admin','ROLE_EDITOR_DE_NOTAS_FISCAIS',1,'admin');



------------------------------------------ Atualização 23/11 ------------------------------------------
alter table gp40.ordem_de_producao add id_site number(19, 1);
ALTER TABLE gp40.testes ADD considerar_perdas NUMBER(1) default 0 not null;
INSERT INTO gp40.REQUESTMAP(id, version, http_method, config_attribute, descricao, url, parent_id) VALUES (203,8,'PATCH','ROLE_ADMINISTRADOR','Cancelar','/api/ordemDeFabricacao/cancelar',149);
INSERT into gp40.REQUESTMAP
(ID, VERSION, HTTP_METHOD, CONFIG_ATTRIBUTE, DESCRICAO, URL, PARENT_ID)
values(204,1,null,'ROLE_ADMINISTRADOR','Metas','/api/meta',134);

    INSERT into gp40.REQUESTMAP
(ID, VERSION, HTTP_METHOD, CONFIG_ATTRIBUTE, DESCRICAO, URL, PARENT_ID)
values(205,1,'POST','ROLE_ADMINISTRADOR','Salvar','/api/meta',204);

INSERT into gp40.REQUESTMAP
(ID, VERSION, HTTP_METHOD, CONFIG_ATTRIBUTE, DESCRICAO, URL, PARENT_ID)
values(206,1,'PUT','ROLE_ADMINISTRADOR','Editar','/api/meta/**',204);

INSERT into gp40.REQUESTMAP
(ID, VERSION, HTTP_METHOD, CONFIG_ATTRIBUTE, DESCRICAO, URL, PARENT_ID)
values(207,1,'DELETE','ROLE_ADMINISTRADOR','Excluir','/api/meta/**',204);

INSERT into gp40.REQUESTMAP
(ID, VERSION, HTTP_METHOD, CONFIG_ATTRIBUTE, DESCRICAO, URL, PARENT_ID)
values(208,1,'GET','ROLE_ADMINISTRADOR','Buscar','/api/meta/**',204);

CREATE TABLE GP40.META
(	ID NUMBER(19,0) NOT NULL ENABLE,
     VERSION NUMBER(19,0) NOT NULL ENABLE,
     INICIO_VIGENCIA TIMESTAMP (6) NOT NULL ENABLE,
     META_REPROCESSOS NUMBER(19,2) NOT NULL ENABLE,
     FIM_VIGENCIA TIMESTAMP (6) NOT NULL ENABLE,
     LINHA_DE_PRODUCAO_ID NUMBER(19,0) NOT NULL ENABLE,
     METAHK NUMBER(19,2) NOT NULL ENABLE,
     PRIMARY KEY ("ID")
);


ALTER TABLE GP40.META ADD CONSTRAINT "FKP9OKQG2P52R7K3XUI0QR5IE38" FOREIGN KEY ("LINHA_DE_PRODUCAO_ID")
        REFERENCES "GP40"."LINHA_DE_PRODUCAO" ("ID") ENABLE;

create sequence GP40.meta_sequence start with 1 increment by  1;


create or replace synonym GP40_USR.META for GP40.META;
create or replace synonym GP40_USR.meta_sequence for GP40.meta_sequence;

grant select, insert, update, delete on GP40.META TO GP40_USR;
grant select on GP40.META TO XFKW_GP40_READ;
grant select, alter on GP40.meta_sequence TO GP40_USR;
grant select, alter on GP40.meta_sequence TO XFKW_GP40_READ;


------------------------------------------ Atualização 02/12 ------------------------------------------
--incluir colunas
alter table gp40.PLANEJAMENTO_DIARIO add observacao varchar2(255 char);
alter table gp40.recebimento_nf add is_concluir_manualmente number(1) default 0;

--requestmaps novas funcionalidades
Insert into gp40.requestmap (ID,VERSION,HTTP_METHOD,CONFIG_ATTRIBUTE,DESCRICAO,URL,PARENT_ID) values (209,'0','PATCH','ROLE_ADMINISTRADOR','Ativar ou Desativar','/api/linhaDeProducao/ativarOuDesativar', 60);
INSERT INTO gp40.requestmap(ID, VERSION, HTTP_METHOD, CONFIG_ATTRIBUTE, DESCRICAO, URL, PARENT_ID) VALUES (210, 1, 'PATCH', 'ROLE_ADMINISTRADOR', 'Concluir Manualmente', '/api/recebimento/concluirManualmente', 172);
insert into gp40.requestmap (id, version, http_method, config_attribute, descricao, url, parent_id) values(211, 1, 'PATCH', 'ROLE_ADMINISTRADOR', 'Folha de Impressão', '/api/ordemDeFabricacao/folhaImpressao', 149);

--criacao de tabelas/sequencias
create table gp40.dado_rastreavel_apontamento (id number(19,0) not null, version number(19,0) not null, historico_id number(19,0) not null, valor varchar2(255 char) not null, nome varchar2(255 char) not null, primary key (id));
create table gp40.grupo_recurso_campo_rastreavel (grupo_id number(19,0) not null, campo_rastreavel varchar2(255 char));
create sequence GP40.dado_rastr_apont_seq start with 1 increment by  1;
alter table gp40.dado_rastreavel_apontamento add constraint FKa5f6doqgcvntjx2ufk68unqfm foreign key (historico_id) references historico_apontamento;

create table gp40.apont_mensal_linha_produto(id number(19,0) not null, ultima_atualizacao timestamp, mes varchar2(5 char) not null, codigo_produto varchar2(255 char) not null, linha_de_producao varchar2(255 char) not null, fornecedor_id number(19, 1) not null, dados long, primary key (id));
create sequence GP40.apont_mensal_linha_prod_seq start with 1 increment by  1;

--configuracao geral
Insert into "GP40"."CONFIGURACAO_GERAL" (ID,VERSION,DATA_CRIACAO,DESCRICAO,DATA_ATUALIZACAO,TIPO_DE_DADO,VALOR,USUARIO_CRIACAO,USUARIO_ALTERACAO,ORGANIZACAO_ID)
values ('10','0',to_timestamp('08/06/21 13:49:07,000000000','DD/MM/RR HH24:MI:SSXFF'),'Tipos de Conectores',
    to_timestamp('08/06/21 13:49:12,000000000','DD/MM/RR HH24:MI:SSXFF'),'STRING',
    'TIPO CONECTOR LADO A, TIPO CONECTOR LADO B, TIPO DE CONECTOR, TIPO CONECTOR IN, TIPO CONECTOR OUT','admin','admin','1');

--grants
grant select, insert, update, delete on GP40.dado_rastreavel_apontamento TO GP40_USR;
grant select, insert, update, delete on GP40.grupo_recurso_campo_rastreavel TO GP40_USR;
grant select, insert, update, delete on GP40.apont_mensal_linha_produto TO GP40_USR;
grant select, alter on GP40.dado_rastr_apont_seq TO GP40_USR;
grant select, alter on GP40.apont_mensal_linha_prod_seq TO GP40_USR;

grant select on GP40.grupo_recurso_campo_rastreavel TO XFKW_GP40_READ;
grant select on GP40.dado_rastreavel_apontamento TO XFKW_GP40_READ;
grant select on GP40.apont_mensal_linha_produto TO XFKW_GP40_READ;
grant select, alter on GP40.dado_rastr_apont_seq TO XFKW_GP40_READ;
grant select, alter on GP40.apont_mensal_linha_prod_seq TO XFKW_GP40_READ;

--sinonimos
create or replace synonym GP40_USR.dado_rastreavel_apontamento for GP40.dado_rastreavel_apontamento;
create or replace synonym GP40_USR.grupo_recurso_campo_rastreavel for GP40.grupo_recurso_campo_rastreavel;
create or replace synonym GP40_USR.apont_mensal_linha_produto for GP40.apont_mensal_linha_produto;
create or replace synonym GP40_USR.dado_rastr_apont_seq for GP40.dado_rastr_apont_seq;
create or replace synonym GP40_USR.apont_mensal_linha_prod_seq for GP40.apont_mensal_linha_prod_seq;



------------------------------------------ Atualização __/12 ------------------------------------------
--criacao/alteracao tabelas
CREATE TABLE "GP40"."LOTE_QUANTIDADE_RECEBIMENTO"
(	"ID" NUMBER(19,0) NOT NULL ENABLE,
     "VERSION" NUMBER(19,0) NOT NULL ENABLE,
     "QUANTIDADE" NUMBER(19,0) NOT NULL ENABLE,
     "CODIGO_LOTE" VARCHAR2(255 CHAR) NOT NULL ENABLE,
     "RECEBIMENTO_ID" NUMBER(19,0) NOT NULL ENABLE,
     PRIMARY KEY ("ID"),
     CONSTRAINT "FKI0TFVE7J68Q7F7J0DY6BXBYAW" FOREIGN KEY ("RECEBIMENTO_ID")
         REFERENCES "GP40"."RECEBIMENTO_NF" ("ID") ENABLE
);

CREATE TABLE "GP40"."APONTAMENTO_DE_MATERIAL"
(	"ID" NUMBER(19,0) NOT NULL ENABLE,
     "VERSION" NUMBER(19,0) NOT NULL ENABLE,
     "DATA_CRIACAO" TIMESTAMP (6),
     "QUANTIDADE" NUMBER(19,2) NOT NULL ENABLE,
     "DATA_ATUALIZACAO" TIMESTAMP (6),
     "CODIGO_PRODUTO" VARCHAR2(255 CHAR) NOT NULL ENABLE,
     "CODIGO_LOTE" VARCHAR2(255 CHAR) NOT NULL ENABLE,
     "ORDEM_DE_PRODUCAO" VARCHAR2(255 CHAR) NOT NULL ENABLE,
     "TIPO" VARCHAR2(255 CHAR) NOT NULL ENABLE,
     "USUARIO_CRIACAO" VARCHAR2(255 CHAR),
     "USUARIO_ALTERACAO" VARCHAR2(255 CHAR),
     "FORNECEDOR_ID" NUMBER(19,0) NOT NULL ENABLE,
     "ERRO_EXPORTACAO" VARCHAR2(1000 CHAR),
     PRIMARY KEY ("ID"),
     CONSTRAINT "FK5FHO0FQFH6KV368C8EVW0C35X" FOREIGN KEY ("FORNECEDOR_ID")
         REFERENCES "GP40"."FORNECEDOR" ("ID") ENABLE
);

create table gp40.codigo_dun (id number(19,0) not null, version number(19,0) not null, produto_id number(19,0) not null, codigo varchar2(255 char) not null, conversion_rate number(19,2), primary key (id));
create table gp40.produto (id number(19,0) not null, version number(19,0) not null, tipo varchar2(255 char) not null, descricao varchar2(255 char) not null, peso_embalagem number(19,2), codigo varchar2(255 char) not null, status_code varchar2(255 char) not null, inventory_item_id number(19,0) not null, organization_id number(19,0) not null, planner_code varchar2(255 char) not null, codigo_ean_13 varchar2(255 char), peso number(19,2), primary key (id));
alter table gp40.codigo_dun add constraint FKkdmfn8x0mn48j0nlw61ny660o foreign key (produto_id) references gp40.produto;

alter table gp40.recebimento_nf modify nota_fiscal null;
alter table gp40.recebimento_nf modify interface_transaction_id null;

alter table gp40.recebimento_nf drop constraint UK_7OUG2CSUQHWB8K584S1JUU443;
ALTER TABLE users ADD linguagem VARCHAR(255);

create sequence gp40.apontamento_de_material_seq start with 1 increment by  1;
create sequence gp40.produto_seq start with 1 increment by  1;


--grants
grant select, insert, update, delete on GP40.lote_quantidade_recebimento TO GP40_USR;
grant select, insert, update, delete on GP40.apontamento_de_material TO GP40_USR;
grant select, insert, update, delete on GP40.codigo_dun TO GP40_USR;
grant select, insert, update, delete on GP40.produto TO GP40_USR;
grant select, alter on GP40.apontamento_de_material_seq TO GP40_USR;
grant select, alter on GP40.produto_seq TO GP40_USR;

grant select on GP40.lote_quantidade_recebimento TO XFKW_GP40_READ;
grant select on GP40.apontamento_de_material TO XFKW_GP40_READ;
grant select on GP40.codigo_dun TO XFKW_GP40_READ;
grant select on GP40.produto TO XFKW_GP40_READ;
grant select, alter on GP40.apontamento_de_material_seq TO XFKW_GP40_READ;
grant select, alter on GP40.produto_seq TO XFKW_GP40_READ;

--sinonimos
create or replace synonym GP40_USR.lote_quantidade_recebimento for GP40.lote_quantidade_recebimento;
create or replace synonym GP40_USR.apontamento_de_material for GP40.apontamento_de_material;
create or replace synonym GP40_USR.apontamento_de_material_seq for GP40.apontamento_de_material_seq;
create or replace synonym GP40_USR.codigo_dun for GP40.codigo_dun;
create or replace synonym GP40_USR.produto for GP40.produto;
create or replace synonym GP40_USR.produto_seq for GP40.produto_seq;

--requestmaps
INSERT INTO gp40.requestmap
(id, version, http_method, config_attribute, descricao, url, parent_id)
values(212, 1, 'PATCH', 'ROLE_ADMINISTRADOR', 'Alterar OPs em massa', '/api/acompanhamentoOrdemProducao/alterarEmMassa', 85);

INSERT INTO GP40.REQUESTMAP
(ID, VERSION, HTTP_METHOD, CONFIG_ATTRIBUTE, DESCRICAO, URL, PARENT_ID)
VALUES(213, 1, 'GET', 'ROLE_ADMINISTRADOR', 'Exportar XLSX', '/api/romaneio/exportarXlsx', 143);

INSERT into gp40.REQUESTMAP
(ID, VERSION, HTTP_METHOD, CONFIG_ATTRIBUTE, DESCRICAO, URL, PARENT_ID)
values(214,1,null,'ROLE_ADMINISTRADOR','Apontamento de Material','/api/apontamentoMaterial',135);

INSERT into gp40.REQUESTMAP
(ID, VERSION, HTTP_METHOD, CONFIG_ATTRIBUTE, DESCRICAO, URL, PARENT_ID)
values(215,1,'GET','ROLE_ADMINISTRADOR','Buscar Dados','/api/apontamentoMaterial/**',214);

INSERT into gp40.REQUESTMAP
(ID, VERSION, HTTP_METHOD, CONFIG_ATTRIBUTE, DESCRICAO, URL, PARENT_ID)
values(216,1,'POST','ROLE_ADMINISTRADOR','Apontar','/api/apontamentoMaterial/**',214);

INSERT into gp40.REQUESTMAP
(ID, VERSION, HTTP_METHOD, CONFIG_ATTRIBUTE, DESCRICAO, URL, PARENT_ID)
values(217,1,'PATCH','ROLE_ADMINISTRADOR','Apontar em Massa','/api/apontamentoMaterial/importar',214);


------------------------------------------ Atualização 23/12 ------------------------------------------
update gp40.requestmap set descricao='Atualizar OPs' where id=148;


------------------------------------------ Atualização __/01 ------------------------------------------
--Atualizacao de Lotes
alter table gp40.lote add semana_v varchar2(255 char);
update gp40.lote set semana_v=to_char(semana, '00');
alter table gp40.lote drop constraint UK5BC8EBB7CD35D56116CA4AD8CD13;
alter table gp40.lote drop column semana;
alter table gp40.lote rename column semana_v to semana;
alter table gp40.lote add CONSTRAINT "UK5BC8EBB7CD35D56116CA4AD8CD13" UNIQUE ("ANO", "SEMANA", "NUMERO_LOTE");

--index fornecedor-op
create unique index GP40.OP_NUMERO_FORNECEDOR on GP40.ORDEM_DE_PRODUCAO(NUMERO, FORNECEDOR_ID);

--modificacao componentes
alter table gp40.componente_op_wip modify quantidade_por_montagem number;
alter table gp40.componente_op_wip modify component_yield_factor number;
alter table gp40.componente_op_wip modify quantidade_requerida number;

--configuracoes gerais
insert into gp40.configuracao_geral(id, version, data_criacao, descricao, data_atualizacao, tipo_de_dado, valor, ORGANIZACAO_ID)
values(12, 1, sysdate, 'Data Liberação Autenticação Servicos STF', sysdate, 'STRING', '20/03/2021', 2);
alter table GP40.CODIGO_DUN ADD UNIDADE VARCHAR2(255 CHAR);
insert into gp40.configuracao_geral(id, version, data_criacao, descricao, data_atualizacao, tipo_de_dado, valor, ORGANIZACAO_ID)
values(11, 1, sysdate, 'URL RTDA', sysdate, 'STRING', 'http://10.41.112.114:5000/gp40', 2);



------------------------------------------ Atualização 30/03 ------------------------------------------
INSERT INTO gp40.requestmap (ID, VERSION, HTTP_METHOD, CONFIG_ATTRIBUTE, DESCRICAO, URL, PARENT_ID) VALUES (219, 1, 'POST', 'ROLE_ADMINISTRADOR', 'Dividir paradas', '/api/paradas/dividirParadas', 190);
INSERT INTO gp40.requestmap (ID, VERSION, HTTP_METHOD, CONFIG_ATTRIBUTE, DESCRICAO, URL, PARENT_ID) VALUES (220, 1, 'GET', 'ROLE_ADMINISTRADOR', 'Relatório de produção', '/api/relatorioProducao/**', 136);

create table gp40.apontamento_of (id number(19,0) not null, version number(19,0) not null, data_criacao timestamp, ordem_de_fabricacao_id number(19,0) not null, data_atualizacao timestamp, usuario_criacao varchar2(255 char), usuario_alteracao varchar2(255 char), recurso_id number(19,0) not null, primary key (id));
create table gp40.defeito_apontamento_of (id number(19,0) not null, version number(19,0) not null, quantidade number(10,0) not null, apontamentoof_id number(19,0) not null, defeito_id number(19,0) not null, primary key (id));
create table gp40.dado_rastreavel_apontamento_of (id number(19,0) not null, version number(19,0) not null, apontamento_of_id number(19,0) not null, valor varchar2(255 char) not null, nome varchar2(255 char) not null, primary key (id));
create table gp40.job_gp ( id number(19,0) not null, version number(19,0) not null, fim timestamp, id_organizacao number(19,0), nome varchar2(255 char) not null, status varchar2(255 char) not null, inicio timestamp not null, ultima_execucao timestamp, primary key (id));

create sequence gp40.apontamento_of_seq start with 1 increment by  1;
create sequence gp40.defeito_apont_of_seq start with 1 increment by  1;
create sequence gp40.dado_rastr_apont_of_seq start with 1 increment by  1;
create sequence gp40.job_gp_seq start with 1 increment by  1;

alter table gp40.grupo_recurso add permite_apontamento_of number(1, 0) default 0 not null;
alter table gp40.lote add apontamentoof_id number(19,0);
ALTER TABLE gp40.serial_fabricacao ADD data_apontamento_mais_recente TIMESTAMP;
ALTER TABLE gp40.serial_fabricacao ADD etiqueta_apontamento_impressa number(1,0) default 0;

alter table gp40.apontamento_of add constraint FKfr1ags3jyea3isk4spo443lg0 foreign key (ordem_de_fabricacao_id) references gp40.ordem_de_fabricacao;
alter table gp40.apontamento_of add constraint FKeua1x9lqsbfi2sudkrydr8xrv foreign key (recurso_id) references gp40.recurso;
alter table gp40.defeito_apontamento_of add constraint FK1swlvlfm8anwm0u8b9ekdbl2j foreign key (apontamentoof_id) references gp40.apontamento_of;
alter table gp40.defeito_apontamento_of add constraint FKehgvwbo5kx7tvron007eash78 foreign key (defeito_id) references gp40.defeito;
alter table gp40.dado_rastreavel_apontamento_of add constraint FKsjek2c0p9o4g87c3n8nd63ndp foreign key (apontamento_of_id) references gp40.apontamento_of
alter table gp40.lote add CONSTRAINT "FK1P4K9WMQII72FYYM16T9EA14B" FOREIGN KEY ("APONTAMENTOOF_ID") REFERENCES "GP40"."ORDEM_DE_FABRICACAO" ("ID");

grant select, insert, update, delete on GP40.apontamento_of TO GP40_USR;
grant select, insert, update, delete on GP40.defeito_apontamento_of TO GP40_USR;
grant select, insert, update, delete on GP40.dado_rastreavel_apontamento_of TO GP40_USR;
grant select, insert, update, delete on GP40.job_gp TO GP40_USR;
grant select, alter on GP40.apontamento_of_seq TO GP40_USR;
grant select, alter on GP40.defeito_apont_of_seq TO GP40_USR;
grant select, alter on GP40.dado_rastr_apont_of_seq TO GP40_USR;
grant select, alter on GP40.job_gp_seq TO GP40_USR;

create or replace synonym GP40_USR.apontamento_of for GP40.apontamento_of;
create or replace synonym GP40_USR.defeito_apontamento_of for GP40.defeito_apontamento_of;
create or replace synonym GP40_USR.dado_rastreavel_apontamento_of for GP40.dado_rastreavel_apontamento_of;
create or replace synonym GP40_USR.job_gp for GP40.job_gp;
create or replace synonym GP40_USR.apontamento_op_seq for GP40.apontamento_of_seq;
create or replace synonym GP40_USR.defeito_apont_of_seq for GP40.defeito_apont_of_seq;
create or replace synonym GP40_USR.dado_rastr_apont_of_seq for GP40.dado_rastr_apont_of_seq;
create or replace synonym GP40_USR.job_gp_seq for GP40.job_gp_seq;

grant select on GP40.apontamento_of TO XFKW_GP40_READ;
grant select on GP40.defeito_apontamento_of TO XFKW_GP40_READ;
grant select on GP40.dado_rastreavel_apontamento_of TO XFKW_GP40_READ;
grant select on GP40.job_gp TO XFKW_GP40_READ;
grant select, alter on GP40.apontamento_op_seq TO XFKW_GP40_READ;
grant select, alter on GP40.defeito_apont_of_seq TO XFKW_GP40_READ;
grant select, alter on GP40.dado_rastr_apont_of_seq TO XFKW_GP40_READ;
grant select, alter on GP40.job_gp_seq TO XFKW_GP40_READ;
