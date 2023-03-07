import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { DepartamentoMunicipio, InfoEmpresa } from "../../../../typings";

type Data = {
  InfoBase: {};
  Municipios: [];
};

type ErrorData = {
  body: string;
};

export default async function handlerGetDatos(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "GET") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }

  try {
    const { SubSede } = req.query;

    const [InfoBaseRes]: any = await connectionPool.query(
      `SELECT datosUniversidad.*, subSedes.nombre as NombreSubSede FROM datosUniversidad INNER JOIN subSedes ON subSedes.id= datosUniversidad.idCoa where datosUniversidad.idCoa ='${SubSede}' `
    );

    const [Municipios]: any = await connectionPool.query(`
  SELECT * FROM municipio ORDER BY municipio_nombre ASC
  `);

    res
      .status(200)
      .json({ InfoBase: InfoBaseRes[0], Municipios: Municipios } as
        | Data
        | ErrorData);
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
