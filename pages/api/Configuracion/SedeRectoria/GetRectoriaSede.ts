import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { Rectoria } from "../../../../typings";

type Data = {
  RectoriasSedes: any;
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
    const [GetRectoriasRes]: any = await connectionPool.query(
      `
      SELECT rectorias.id as IdRectoria, sedes.id as IdSedes,rectorias.nombre as NombreRectoria, sedes.nombreSede as NombreSede, sedes.idRectoria as SedeIdRectoria FROM rectorias LEFT JOIN sedes ON (rectorias.id=sedes.idRectoria)
      `
    );

    const newData = GetRectoriasRes?.reduce((acc: any, item: any) => {
      const {
        IdRectoria,
        IdSedes,
        NombreRectoria,
        NombreSede,
        SedeIdRectoria,
      } = item;

      let key = ` ${IdRectoria}-${SedeIdRectoria}`;
      let value = { IdRectoria, NombreRectoria, Sedes: [] };

      if (!acc[key]) {
        acc[key] = value;
      }
      acc[key].Sedes.push({ IdSedes, NombreSede, SedeIdRectoria });
      return acc;
    }, {});

    res.status(200).json({ RectoriasSedes: newData } as Data);
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
