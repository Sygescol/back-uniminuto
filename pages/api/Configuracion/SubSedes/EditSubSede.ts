import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";

type Data = {};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "PUT") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const { IdSubSede, NombreSubSede, IdSede } = req.body;

    const [EditSubSede]: any = await connectionPool.query(`
    UPDATE subSedes SET nombre = '${NombreSubSede}',idSede='${IdSede}'  WHERE id = '${IdSubSede}'`);

    if (EditSubSede?.affectedRows === 0) {
      res.status(404).json({ body: "SubSede no encontrada" } as ErrorData);
      return;
    }

    res.status(200).json({ body: "COA editado con éxito" } as Data);
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
