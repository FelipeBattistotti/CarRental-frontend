import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FiChevronLeft, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useToasts } from 'react-toast-notifications';

import api from '../../services/api';

import './styles.css';

import profileLogoImg from '../../assets/profile_logo.svg';

export default function Vehicles () {
    const [vehicles, setVehicles] = useState([]);
    const [plate, setPlate] = useState('');
    const userId = localStorage.getItem('userId');
    const history = useHistory();

    const { addToast } = useToasts();

    useEffect(() => {
        loadVehicles();
    }, [userId]);

    async function loadVehicles () {
        await api.get('vehicle', {
            headers: {
                Authorization: userId,
            }
        }).then(response => {
            setVehicles(response.data);
        });
    }

    function handleLogout () {
        localStorage.clear();

        history.push('/'); // back to the login page
    }

    async function handleAddVehicle (e) {
        e.preventDefault();

        try {
            await api.post('vehicle', 
                {plate},
                {
                    headers: {
                        Authorization: userId,
                }
            });

            setPlate('');

            loadVehicles();

            addToast('Veículo cadastrado com sucesso!', { appearance: 'success' });
            history.push('/vehicles');
            
        } catch (err) {
            if (plate.length > 7) { // greater than 7
                addToast('A placa do veículo deve possuir 7 caracteres, tente novamente.', { appearance: 'error' });
            } else if (plate.length < 7) { // less than 7
                addToast('A placa do veículo deve possuir 7 caracteres, tente novamente.', { appearance: 'error' });
            } else {
                addToast('Erro ao cadastrar veículo, tente novamente.', { appearance: 'error' });
            }
        }
    }

    async function handleDeleteVehicle (id) {
        if (window.confirm('O veículo será excluído. Confirma?')) {
            try {
                await api.delete(`vehicle/${id}`, {
                    headers: {
                        Authorization: userId,
                    }
                });

                addToast('Veículo excluído!', { appearance: 'info' });

                setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
            } catch (err) {
                addToast('Erro ao deletar veículo, tente novamente.', { appearance: 'error' });
            }
        }
    }

    return (
        <div className="profile-container">
            <header>
                <img src={profileLogoImg} alt="profileLogo" />
                <button onClick={handleLogout} type="button" title="Sair">
                    <FiChevronLeft size={35} />
                </button>
            </header>

            <h3 className="title1">Adicionar Veículo</h3>
            <section className="form">
                <form onSubmit={handleAddVehicle}>
                    <input 
                        placeholder="Informe a Placa"
                        value={plate}
                        onChange={e => setPlate(e.target.value)}
                    />
                    <button className="button" type="submit" title="Add Veículo">
                        <FiPlus size={35} />
                    </button>
                </form>
            </section>

            <hr/>

            <h3 className="title2">Veículos</h3>
            <ul>
                {vehicles.map(vehicle => (
                    <li key={vehicle.id}>
                        <p>{vehicle.plate}</p>

                        <button onClick={() => handleDeleteVehicle(vehicle.id)} type="button" title="Excluir Veículo">
                            <FiTrash2 size={27} />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
