import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { SessionService } from '../../services';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  onLogoutClick = () => {
    SessionService.logOut();
  }

  render () {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
          <Container>
            <NavbarBrand tag={Link} to="/">FactoryApp</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to={ROUTES.HOME}>Inicio</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to={ROUTES.RAW_MATERIALS}>Materias primas</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to={ROUTES.REQUESTS}>Solicitudes</NavLink>
                </NavItem>
                <NavItem>
                  <button className='btn btn-outline-danger' onClick={this.onLogoutClick}>Cerrar sesión</button>
                </NavItem>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
