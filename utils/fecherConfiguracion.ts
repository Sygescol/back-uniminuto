import { InfoEmpresa } from "../typings";

const fetcherDatos = async () => {
  const res = await fetch("/api/Configuracion/Datos/GetDatos");
  const data = await res.json();

  const InfoBase: InfoEmpresa = data?.infoEmpresa[0];
  const Municipios: [] = data?.Municipios;
  const infoEmpresa = {
    InfoBase,
    Municipios,
  };

  return infoEmpresa;
};

export { fetcherDatos };
