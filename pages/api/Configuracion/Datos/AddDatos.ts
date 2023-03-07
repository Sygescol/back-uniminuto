import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { DepartamentoMunicipio, InfoEmpresa } from "../../../../typings";

type Data = {
  InputValues: InfoEmpresa;
};

type ErrorData = {
  body: string;
};

export default async function handlerAddDatos(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "POST") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }

  try {
    const { InputValues } = req.body;

    console.log("body", req.body);

    if (Object.keys(InputValues || {}).length === 0) {
      res.status(400).json({ body: "Datos vacios" });
      return;
    }

    const [VerificarExistencia]: any = await connectionPool.query(`
  SELECT id FROM datosUniversidad WHERE id = '${InputValues.id}'
  `);
    if (VerificarExistencia?.length > 0) {
      const [UpdateDatos]: any = await connectionPool.query(`
    UPDATE datosUniversidad SET nombreUniversidad='${InputValues?.nombreUniversidad}', direccion='${InputValues?.direccion}', idRectoria='${InputValues?.idRectoria}', idSede='${InputValues?.idSede}', municipioId='${InputValues?.municipioId}',telefono1='${InputValues?.telefono1}', telefono2= '${InputValues?.telefono2}', correo='${InputValues?.correo}', web='${InputValues.web}', icfes='${InputValues?.icfes}',
    resolucionSem='${InputValues?.resolucionSem}', nombreRector='${InputValues?.nombreRector}' , siglaUniversidad='${InputValues?.siglaUniversidad}',
    siglaRectoria='${InputValues?.siglaRectoria}',  nit='${InputValues?.nit}' where id = '${InputValues.id}'
    `);

      if (UpdateDatos.affectedRows > 0) {
        res.status(200).json({ body: "Datos Actualizados con éxito" });
        return;
      }
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Error al actualizar datos del COA" });
  }
}
