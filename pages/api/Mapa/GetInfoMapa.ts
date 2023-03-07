// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../config/db";

type Data = {
  infoSedes: any[];
};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "GET") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const { MunicipioClicked } = req.query;

    const [RespuestasSedes]: any = await connectionPool.query(
      `SELECT subSedes.nombre as NombreCoa ,subSedes.id as IdCoa , sedes.nombreSede as NombreSede, sedes.id as IdSede from municipio INNER JOIN datosUniversidad ON datosUniversidad.municipioId = municipio.municipio_id INNER JOIN subSedes ON subSedes.id = datosUniversidad.idCoa INNER JOIN dpto ON dpto.id = municipio.departamento_id INNER JOIN sedes ON sedes.id = subSedes.idSede WHERE dpto.nombre LIKE '${MunicipioClicked}'`
    );

    // console.log("RespuestasSedes======", RespuestasSedes);

    if (RespuestasSedes?.length > 0) {
      const newData = RespuestasSedes?.reduce((acc: any, item: any) => {
        const { NombreSede } = item;

        let key = `${NombreSede}`;
        let value = { NombreSede: "", COA: [] };

        if (!acc[key]) {
          acc[key] = value;
        }

        acc[key].COA.push({
          ...item,
        });

        acc[key].NombreSede = `${NombreSede}`;

        return acc;
      }, {});

      res.status(200).json({ infoSedes: Object.values(newData) });
    } else {
      res.status(200).json({
        body: "No se han ingresado Sedes en esta Rectoría",
      });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      body: "internal server error",
    });
  }
}
