import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useGetRequest } from '../../hooks/useGetRequest'; // Asegúrate de la ruta correcta a tu hook

const BuscadorCedulaDinamico = ({onClienteSeleccionado}) => {
    const [inputValue, setInputValue] = useState('');
    const [opcionesCedulas, setOpcionesCedulas] = useState([]);
    const [cedulaSeleccionada, setCedulaSeleccionada] = useState(null);
    const { callApiGet, loading, error } = useGetRequest();

    useEffect(() => {
        const cargarClientes = async () => {
            try {
                const data = await callApiGet('/cliente');
                // Formatear la respuesta de la API para react-select
                const opcionesFormateadas = data.map(cliente => ({
                    value: cliente.cedula,
                    label: `${cliente.nombre} (${cliente.cedula})`
                }));
                setOpcionesCedulas(opcionesFormateadas);
              
            } catch (error) {
                console.error("Error al cargar clientes:", error);
            }
        };

        cargarClientes();
    }, [cedulaSeleccionada]); // Dependencia en callApiGet para que se ejecute si la función cambia (aunque en este caso no debería)

    const handleInputChange = (newValue) => {
        setInputValue(newValue);
        return newValue;
    };

    const handleSelectChange = (selectedOption) => {
        if (onClienteSeleccionado) {
            onClienteSeleccionado(selectedOption);
            setCedulaSeleccionada(selectedOption);
        }

        console.log('Cliente seleccionado:', selectedOption);
    };

    const filtrarOpciones = () => {
        return opcionesCedulas.filter(opcion =>
            opcion.value.toLowerCase().includes(inputValue.toLowerCase()) ||
            opcion.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    if (loading) {
        return <div>Cargando clientes...</div>;
    }

    if (error) {
        return <div>Error al cargar clientes: {error}</div>;
    }

    return (
        <div>
            <Select
                value={cedulaSeleccionada}
                onInputChange={handleInputChange}
                onChange={handleSelectChange}
                options={filtrarOpciones()}
                isSearchable={true}
                placeholder="Ingrese la cédula..."
            />
        </div>
    );
};

export default BuscadorCedulaDinamico;