import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";

type Data = {
  SedesSubSedes: [];
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
    const [SedesSubSedesRes]: any = await connectionPool.query(`
    SELECT subSedes.id as IdSubSede, subSedes.nombre NombreSubSede, sedes.id as IdSede,sedes.nombreSede as NombreSede, subSedes.idSede as idSubSedeSede,rectorias.nombre as NombreRectoria FROM subSedes INNER JOIN sedes on (sedes.id=subSedes.idSede) INNER JOIN rectorias on rectorias.id=sedes.idRectoria ORDER BY idSubSedeSede ASC`);

    let newData = SedesSubSedesRes?.reduce((acc: any, item: any) => {
      let key = `${item.NombreRectoria}-${item.IdSede}-${item.idSubSedeSede}`;
      if (!acc[key]) {
        acc[key] = {
          NombreRectoria: item.NombreRectoria,
          IdSede: item.IdSede,
          NombreSede: item.NombreSede,
          SubSedes: [],
        };
      }
      acc[key].SubSedes.push({
        IdSubSede: item.IdSubSede,
        NombreSubSede: item.NombreSubSede,
      });
      return acc;
    }, []);

    res.status(200).json({ SedesSubSedes: Object.values(newData) } as Data);
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
