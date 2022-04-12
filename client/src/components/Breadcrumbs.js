import React from 'react';
import Breadcrumb from "react-bootstrap/es/Breadcrumb";
import {Link} from "react-router-dom";
import {CLIENT_URL} from "../config";
import {injectIntl, intlShape} from "react-intl";

class Breadcrumbs extends React.Component{

    getMessage = (id) => {
        return this.props.intl.formatMessage({id: id})
    };

    routeNames = () => {
        return {
            '/': this.getMessage('routes.paginaPrincipal.label'),
            '/user/perfil': this.getMessage('routes.perfil.label'),
            '/user/form/:id': this.getMessage('routes.editar.label'),
            '/user/form': this.getMessage('routes.novo.label'),
            '/user': this.getMessage('routes.usuario.label'),
            '/sobre': this.getMessage('routes.sobre.label'),
        }
    };

    findRouteName = url => {
        var curr = parseInt(url.substr(url.lastIndexOf("/")).replace("/",""));
        url = url.replace(CLIENT_URL, "");
        if(isNaN(parseInt(curr)))
            return this.routeNames()[url];
        else {
            return this.routeNames()[url.replace(curr,"")+":id"]
        }
    };

    getPaths = (pathname) => {
        const paths = ['/'];
        var hasID = false;
        var isPerfil = false;
        var pathToRemove = "";
        pathname = pathname.replace(CLIENT_URL, "");
        if (pathname === '/') return paths;

        pathname.split('/').reduce((prev, curr, index) => {
            if(!isNaN(parseInt(curr))) {
                hasID = true;
                pathToRemove = prev;
            }

            if(curr==="perfil") {
                isPerfil = true;
                pathToRemove = prev;
            }

            const currPath = `${prev}/${curr}`;
            paths.push(currPath);
            return currPath;
        });

        if(hasID || isPerfil) {
            paths.splice(paths.indexOf(pathToRemove), 1)
        }

        return paths;
    };

    render() {
        let hrefs = document.location.href.split("#");
        let relativePath = hrefs.length === 2 ? hrefs[1] : hrefs[0];
        const paths = this.getPaths(relativePath);
        return (
            <Breadcrumb>
                {
                    paths.map((p, i) => {
                        if((i+1) === paths.length && paths.length > 1)
                            return <li key={i} className="active">{this.findRouteName(p)}</li>
                        else
                            return <li key={i}><Link to={CLIENT_URL + p}>{this.findRouteName(p)}</Link></li>
                    })
                }
            </Breadcrumb>
        );
    }
}

Breadcrumbs.propTypes = {
    intl: intlShape.isRequired
};

export default injectIntl(Breadcrumbs);

