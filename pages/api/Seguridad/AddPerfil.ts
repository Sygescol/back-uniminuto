import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../config/db";

type Data = {};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "POST") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const {
      Values: { Nombre, Rol },
      ListaModulosSelected,
    } = req.body;

    // verificar si el rol existe
    const [RolExist]: any = await connectionPool.query(`
    SELECT rol_nombre FROM rol WHERE rol_nombre LIKE '${Nombre.toUpperCase()}'
    `);

    if (RolExist.length > 0) {
      res.status(400).json({ body: "El rol ya existe" });
      return;
    }

    const [GetRol]: any = await connectionPool.query(
      `insert into rol (rol_nombre, roltip_id) values ('${Nombre?.toUpperCase()}', ${Rol})`
    );
    if (GetRol?.affectedRows == 0) {
      res
        .status(400)
        .json({ body: "Error al ejecutar la consulta" } as ErrorData);
      return;
    }

    let sqlBaseAcceso =
      "insert into ModulosPerfilAcceso (perfil_id,mod_id) values ";

    for (const ListModulos in ListaModulosSelected) {
      sqlBaseAcceso += `  (${GetRol?.insertId}, ${ListModulos}),`;

      if (ListaModulosSelected[ListModulos].length > 0) {
        for (const ListSubModulos of ListaModulosSelected[ListModulos]) {
          sqlBaseAcceso += ` (${GetRol?.insertId}, ${ListSubModulos?.value}),`;
        }
      }
    }

    sqlBaseAcceso = sqlBaseAcceso.slice(0, -1);

    const [AddAccesos]: any = await connectionPool.query(sqlBaseAcceso);

    res.status(200).json({
      body: "Rol agregado correctamente",
    } as Data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
