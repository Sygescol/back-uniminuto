// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
  const {
    Apellidos,
    Nombre,
    Documento,
    TipoDocumento,
    Cargo,
    Correo,
    Genero,
    Id,
    Usuario,
    Password,
    TipoUsuario,
  } = req.body;

  try {
    const [UpdateAdministrativo]: any =
      await connectionPool.query(`UPDATE admco 
    SET  nombre = '${Nombre || ""} ${Apellidos || ""}',
    admco_ape1 = '${Apellidos?.split(" ")[0]?.toUpperCase() || ""}', 
    admco_ape2 = '${Apellidos?.split(" ")[1]?.toUpperCase() || ""}', 
    admco_nom1 = '${Nombre?.split(" ")[0]?.toUpperCase() || ""}', 
    admco_nom2 = '${Nombre?.split(" ")[1]?.toUpperCase() || ""}', 
    documento = '${Documento}', 
    tipo_documento = '${TipoDocumento}', 
    cargo = '${Cargo}',
    mail = '${Correo}',
    genero = '${Genero}'
    WHERE id = '${Id}'`);

    const [UpdateUsuario]: any = await connectionPool.query(
      `UPDATE usuario SET rol = '${TipoUsuario || ""}' WHERE idUsuario=${Id}`
    );

    if (
      UpdateAdministrativo?.affectedRows === 0 ||
      UpdateUsuario?.affectedRows === 0
    ) {
      res.status(404).json({
        body: "Es posible que no se hayan actualizado todos los Datos.",
      });
      return;
    }

    res.status(200).json({
      body: "Colaborador actualizado correctamente",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Internal Server Error" });
  }
}
