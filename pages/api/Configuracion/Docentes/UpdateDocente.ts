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
    const {
      Nombre,
      Apellidos,
      Documento,
      Correo,
      TipoDocumento,
      IdDocente,
      Genero,
    } = req.body;

    let nombre1 = Nombre?.split(" ")[0]?.toUpperCase() || "";
    let nombre2 = Nombre?.split(" ")[1]?.toUpperCase() || "";
    let apellido1 = Apellidos?.split(" ")[0]?.toUpperCase() || "";
    let apellido2 = Apellidos?.split(" ")[1]?.toUpperCase() || "";

    const [UpdateDocente]: any = await connectionPool.query(
      `update dcne set dcne_ape1='${apellido1}',dcne_ape2='${
        apellido2 || ""
      }',dcne_nom1='${nombre1}', dcne_nom2='${nombre2}',dcne_email_perso='${Correo}',tipo_docu_id='${TipoDocumento}',dcne_num_docu='${Documento}',dcne_genero='${Genero}'  where i=${IdDocente}`
    );

    if (UpdateDocente?.affectedRows === 0) {
      res.status(404).json({ body: "Profesor no encontrado" });
      return;
    }

    res.status(200).json({ body: "Profesor actualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
