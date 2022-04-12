insert into gpa._configuracao_geral(id, version, data_criacao, descricao, data_atualizacao, tipo_de_dado, valor, usuario_criacao, usuario_alteracao,
                                   organizacao_id)
values(gpa.configuracao_geral_seq.nextval, 0, sysdate, 'Caminho EBS', sysdate, 'STRING', 'http://10.41.112.86:7023/EBS_MANUFATURA/', 'admin', 'admin', 1);