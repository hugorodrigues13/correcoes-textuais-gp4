import {Empty, Pagination, Row, Spin} from "antd";
import React from "react";
import AlmofarixadoItem from "./AlmofarixadoItem";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {changePaginationAlmoxarifadoRequest} from "../../store/modules/Almoxarifado/action";
import {injectIntl} from "react-intl";
import {renderEmpty} from "./commons";
class List extends React.Component {

  render(){
    return (
      <>
        <div style={{borderRadius: '2px', border: '1px solid #d9d9d9', padding: '30px'}}>
          <Row gutter={[24, 48]}>
            {
              this.props.almoxarifado.data.entities && this.props.almoxarifado.data.entities.length !== 0
                ? this.renderItems()
                : renderEmpty()
            }
          </Row>
        </div>
        <Pagination
          showSizeChanger
          total={this.props.almoxarifado.data.total}
          current={this.props.almoxarifado.page}
          pageSize={this.props.almoxarifado.pageSize}
          pageSizeOptions={[12,24,36,48]}
          onChange={this.handlePagination}
          style={{float: 'right', marginTop: '10px'}}
        />
      </>

    )
  }

  handlePagination = (page, pageSize) => {
    this.props.changePaginationAlmoxarifadoRequest(page, pageSize)
  };

  renderItems() {
    return (
        this.props.almoxarifado.data.entities.map(item => <AlmofarixadoItem intl={this.props.intl} key={item.id} item={item}/>)
    );
  }


}
const mapStateToProps = store => ({
  almoxarifado: store.almoxarifado,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({changePaginationAlmoxarifadoRequest}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List))
