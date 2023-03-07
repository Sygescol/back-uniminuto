import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorData>
) {
  if (req.method !== "PUT") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const { Nombre, Sigla, Id, Periodicidad } = req.body;

    console.log(req.body);

    console.log(
      `update pfc_programa set pro_nom='${Nombre?.toUpperCase()
        ?.replace(/\s+/g, " ")
        .trim()}',pro_sigla='${
        Sigla?.toUpperCase() || ""
      }',Periodicidad='${Periodicidad}'  where pro_id=${Id}`
    );

    const [UpdatePrograma]: any = await connectionPool.query(
      `update pfc_programa set pro_nom='${Nombre?.toUpperCase()
        ?.replace(/\s+/g, " ")
        .trim()}',pro_sigla='${
        Sigla?.toUpperCase() || ""
      }',Periodicidad='${Periodicidad}'  where pro_id=${Id}`
    );

    if (UpdatePrograma?.affectedRows === 0) {
      res.status(404).json({
        body: "No se puedo actualizar el programa",
      });
      return;
    }

    res.status(200).json({ body: "Programa actualizado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
