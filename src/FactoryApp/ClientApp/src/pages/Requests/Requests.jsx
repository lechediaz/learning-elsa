import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Table } from 'reactstrap';
import { filter } from 'rxjs';
import { ROLES, ROUTES } from '../../constants';
import { RequestService, SessionService } from '../../services';
import { getStatusName } from '../../utils';

export const Requests = () => {
  const history = useHistory();
  const [requests, setRequests] = useState([]);
  const [userSession, setUserSession] = useState(null);

  useEffect(() => {
    const subscription = SessionService.userSession
      .pipe(filter((_userSession) => _userSession !== null))
      .subscribe((_userSession) => {
        setUserSession(_userSession);

        let httpRequest;

        if ([ROLES.PRODUCTION, ROLES.ADMIN].includes(_userSession.role)) {
          httpRequest = RequestService.getUserRequests(String(_userSession.id));
        } else if (_userSession.role === ROLES.LOGISTICS) {
          httpRequest = RequestService.getREquestToComplete();
        }

        if (httpRequest !== undefined) {
          httpRequest
            .then((response) => {
              const _request = response.data.map((r) => {
                const statusName = getStatusName(r.status);
                const newRequest = { ...r, statusName };

                return newRequest;
              });

              setRequests(_request);
            })
            .catch(() => console.log('error'));
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const onNewRequestClick = () => {
    history.push(ROUTES.NEW_REQUEST);
  };

  const onViewRequestClick = (requstId) => {
    const url = ROUTES.VIEW_REQUEST.replace(':id', String(requstId));
    history.push(url);
  };

  return (
    <div>
      <h2>Solicitudes</h2>

      <p>
        A continuación podrá observar el estado de las diferentes solicitudes en
        las que usted se encuentre relacionado.
        {userSession && userSession.role !== ROLES.LOGISTICS && (
          <span>
            {' '}
            Para crear una nueva solicitud, haga click en el botón '
            <strong>Nueva solicitud</strong>'.
          </span>
        )}
      </p>

      {userSession && userSession.role !== ROLES.LOGISTICS && (
        <button className="btn btn-info mb-3" onClick={onNewRequestClick}>
          Nueva solicitud
        </button>
      )}

      <Table striped>
        <thead>
          <tr>
            <th>Id</th>
            <th>Creada por</th>
            <th>Aprovador</th>
            <th>Fecha de Creación</th>
            <th>Estado</th>
            <th>Total de Elementos</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {requests &&
            requests.map((request) => (
              <tr key={`request-${request.id}`}>
                <td>{request.id}</td>
                <td>{request.author}</td>
                <td>{request.approver}</td>
                <td>{request.createdAt}</td>
                <td>{request.statusName}</td>
                <td>{request.totalItems}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => onViewRequestClick(request.id)}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          {requests.length === 0 && (
            <tr>
              <td colSpan="7">Sin registros</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Requests;
