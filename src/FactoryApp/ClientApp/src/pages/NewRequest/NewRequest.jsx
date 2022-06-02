import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Alert, Table } from 'reactstrap';
import { ROUTES } from '../../constants';
import {
  RawMaterialsListService,
  RequestService,
  UserSessionService,
} from '../../services';

export const NewRequest = () => {
  const history = useHistory();
  const [details, setDetails] = useState({});
  const [rawMaterialIdSelected, setRawMaterialIdSelected] = useState('');
  const [quantity, setQuantity] = useState('0');
  const [rawMaterialsList, setRawMaterialsList] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [userSession, setUserSession] = useState(null);

  const detailsArray = Object.values(details);

  useEffect(() => {
    RawMaterialsListService.getRawMaterialsList()
      .then((_rawMaterialsList) => {
        setRawMaterialsList(_rawMaterialsList);
        setRawMaterials(_rawMaterialsList);
      })
      .catch(() => console.log('error'));

    const subscription = UserSessionService.userSession.subscribe(
      (_userSession) => setUserSession(_userSession)
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const onRawMaterialSelected = (event) => {
    const selectedId = event.target.value;
    setRawMaterialIdSelected(selectedId);
  };

  const onQuantityChanged = (event) => {
    const quantityString = event.target.value;
    setQuantity(quantityString);
  };

  const onAddClick = () => {
    const rawMaterialSelected = rawMaterials.find(
      (m) => m.id == rawMaterialIdSelected
    );

    const newDetails = {
      ...details,
      [rawMaterialIdSelected]: {
        RawMaterialId: rawMaterialIdSelected,
        Name: rawMaterialSelected.name,
        Quantity: parseFloat(quantity),
      },
    };

    const newRawMaterials = rawMaterials.filter(
      (m) => m.id != rawMaterialIdSelected
    );

    setDetails(newDetails);
    setRawMaterials(newRawMaterials);
    setRawMaterialIdSelected('');
    setQuantity(0);
  };

  const onDiscardClick = (rawMaterialIdDiscarted) => {
    const rawMaterialDiscarted = rawMaterialsList.find(
      (m) => m.id == rawMaterialIdDiscarted
    );

    const newDetails = { ...details };

    delete newDetails[rawMaterialIdDiscarted];

    const newRawMaterials = [...rawMaterials, rawMaterialDiscarted];

    setDetails(newDetails);
    setRawMaterials(newRawMaterials);
  };

  const onSaveRequestClick = () => {
    const request = {
      CreatedById: userSession.id,
      ReceiverId: userSession.SupervisorId || userSession.id,
      Details: detailsArray.map((d) => {
        const newDetail = { ...d };

        delete newDetail['Name'];

        return newDetail;
      }),
    };

    RequestService.createRequest(request)
      .then(() => {
        history.push(ROUTES.REQUESTS);
      })
      .catch(() => console.log('error'));
  };

  return (
    <div>
      <h2>Crear nueva solicitud</h2>
      <p>
        Seleccione la materia prima que desea solicitar junto con la cantidad
        necesaria y haga click en el botón '<em>Agregar</em>' para agregarlo a
        los detalles. Una vez finalizado, guarde la solicitud haciendo click en
        el botón '<strong>Guardar solicitud</strong>' para dejarla en estado de{' '}
        <em>borrador</em>.
      </p>
      {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
      <div className="d-flex flex-column align-items-center mt-2 mb-3">
        <div className="input-group w-75">
          <div className="input-group-prepend">
            <span className="input-group-text">Materia prima</span>
          </div>

          <select
            className="form-control"
            onChange={onRawMaterialSelected}
            value={rawMaterialIdSelected}
          >
            <option value="">Seleccione la materia prima</option>
            {rawMaterials &&
              rawMaterials.map((material) => (
                <option key={`material-${material.id}`} value={material.id}>
                  {material.name}
                </option>
              ))}
          </select>

          <div className="input-group-prepend">
            <span className="input-group-text">Cantidad</span>
          </div>

          <input
            min="0"
            type="number"
            value={quantity}
            onChange={onQuantityChanged}
          />

          <div className="input-group-append">
            <button
              disabled={rawMaterialIdSelected.length === 0 || quantity <= 0}
              className="btn btn-success"
              onClick={onAddClick}
            >
              Agregar
            </button>
          </div>
        </div>
      </div>

      <Table striped>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cantidad a solicitar</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {detailsArray &&
            detailsArray.map((material) => (
              <tr key={`material-${material.RawMaterialId}`}>
                <td>{material.Name}</td>
                <td>{material.Quantity}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => onDiscardClick(material.RawMaterialId)}
                  >
                    Descartar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      <button
        disabled={detailsArray.length === 0}
        className="btn btn-primary"
        onClick={onSaveRequestClick}
      >
        Guardar solicitud
      </button>
    </div>
  );
};

export default NewRequest;
